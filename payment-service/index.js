const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("crypto"); // Built-in node module for security
require("dotenv").config();
const verifyToken = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 5003;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Initialize Razorpay with your keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// --- ROUTES ---

// 1. CREATE ORDER (Protected: Only logged-in users can buy)
app.post("/create-order", verifyToken, async (req, res) => {
  try {
    const { gigId } = req.body;
    const clientId = req.user.id; // From the Token

    if (!gigId) return res.status(400).json({ error: "Gig ID is required" });

    // A. Check if the Gig exists and get its price
    const gigResult = await pool.query("SELECT * FROM gigs WHERE id = $1", [gigId]);

    if (gigResult.rows.length === 0) {
      return res.status(404).json({ error: "Gig not found" });
    }

    const gig = gigResult.rows[0];
    const amount = gig.price; // Price in Rupees

    // B. Create Razorpay Order
    // Razorpay expects amount in "paise" (500 rupees = 50000 paise)
    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_gig_${gigId}_${Date.now()}`,
      notes: { gigId, clientId }
    };

    const order = await razorpay.orders.create(options);

    // C. Save "Pending" Order to Database
    await pool.query(
      "INSERT INTO orders (gig_id, client_id, amount, razorpay_order_id, status) VALUES ($1, $2, $3, $4, 'pending')",
      [gigId, clientId, amount, order.id]
    );

    // D. Send Order ID to Frontend
    res.json({
      success: true,
      order_id: order.id,
      amount: amount,
      key_id: process.env.RAZORPAY_KEY_ID
    });

  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// 2. VERIFY PAYMENT (Protected)
app.post("/verify-payment", verifyToken, async (req, res) => {
  const client = await pool.connect();
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment details" });
    }

    // A. Create the signature locally using our Secret Key
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
    const signatureBuffer = Buffer.from(razorpay_signature, 'utf8');
    if (expectedBuffer.length !== signatureBuffer.length) {
      return res.status(400).json({ success: false, error: "Invalid Signature" });
    }

    // B. Start Transaction (Safety First!)
    await client.query('BEGIN');

    // 1. Update Order Status
    const orderResult = await client.query(
      "UPDATE orders SET status = 'paid', razorpay_payment_id = $2 WHERE razorpay_order_id = $1 RETURNING gig_id, amount",
      [razorpay_order_id, razorpay_payment_id]
    );

    if (orderResult.rows.length === 0) {
      throw new Error("Order not found during verification");
    }

    const { gig_id, amount } = orderResult.rows[0];

    // 2. Find the Seller (Gig Owner)
    const gigResult = await client.query("SELECT freelancer_id FROM gigs WHERE id = $1", [gig_id]);
    const sellerId = gigResult.rows[0]?.freelancer_id;

    if (sellerId) {
      // 3. Add Money to Seller's Wallet (Upsert: Create if not exists, else update)
      await client.query(
        `INSERT INTO wallets (user_id, balance) 
         VALUES ($1, $2) 
         ON CONFLICT (user_id) 
         DO UPDATE SET balance = wallets.balance + $2`,
        [sellerId, amount]
      );
    }
    await client.query('COMMIT'); // Save everything
    res.json({ success: true, message: "Payment Verified & Wallet Credited" });
  } catch (err) {
    await client.query('ROLLBACK'); // Undo changes if anything fails
    console.error("Payment Verification Error:", err);
    res.status(500).json({ error: "Transaction Failed" });
  } finally {
    client.release();
  }
});

// 3. GET WALLET BALANCE
app.get("/wallet", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query("SELECT balance FROM wallets WHERE user_id = $1", [userId]);
    const balance = result.rows[0]?.balance || 0;
    res.json({ balance });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch wallet" });
  }
});

// 4. REQUEST WITHDRAWAL
app.post("/withdraw", verifyToken, async (req, res) => {
  const client = await pool.connect();
  try {
    const userId = req.user.id;
    const { amount } = req.body;

    if (!amount || amount <= 0) return res.status(400).json({ error: "Invalid amount" });

    await client.query('BEGIN');

    // Check Balance
    const walletRes = await client.query("SELECT balance FROM wallets WHERE user_id = $1", [userId]);
    const currentBalance = parseFloat(walletRes.rows[0]?.balance || 0);

    if (currentBalance < amount) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Deduct Balance
    await client.query("UPDATE wallets SET balance = balance - $1 WHERE user_id = $2", [amount, userId]);

    // Create Withdrawal Request
    await client.query(
      "INSERT INTO withdrawal_requests (user_id, amount, status) VALUES ($1, $2, 'pending')",
      [userId, amount]
    );

    await client.query('COMMIT');
    res.json({ success: true, message: "Withdrawal request submitted" });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error("Withdraw Error:", err);
    res.status(500).json({ error: "Withdrawal failed" });
  } finally {
    client.release();
  }
});

// 5. CREATE APPLICATION-LEVEL ORDER (No Razorpay)
app.post("/", verifyToken, async (req, res) => {
  try {
    const { gig_id } = req.body;
    const clientId = req.user.id;

    if (!gig_id) return res.status(400).json({ error: "Gig ID is required" });

    // Fetch gig from DB
    const gigResult = await pool.query("SELECT * FROM gigs WHERE id = $1", [gig_id]);
    if (gigResult.rows.length === 0) {
      return res.status(404).json({ error: "Gig not found" });
    }

    const gig = gigResult.rows[0];

    // Self-buy prevention
    if (gig.freelancer_id === clientId) {
      return res.status(403).json({ error: "Cannot order your own gig" });
    }

    // Derive amount from gig price (never trust frontend)
    const amount = gig.price;

    const result = await pool.query(
      "INSERT INTO orders (gig_id, client_id, amount, status) VALUES ($1, $2, $3, 'pending') RETURNING *",
      [gig_id, clientId, amount]
    );

    res.status(201).json({ message: "Order created!", order: result.rows[0] });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// 6. GET BUYER'S ORDERS
app.get("/", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT orders.*, gigs.title AS gig_title, gigs.freelancer_id
       FROM orders
       JOIN gigs ON orders.gig_id = gigs.id
       WHERE orders.client_id = $1
       ORDER BY orders.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// 7. GET SELLER'S INCOMING ORDERS (must be before /:id)
app.get("/seller", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT orders.*, gigs.title AS gig_title, users.username AS buyer_username
       FROM orders
       JOIN gigs ON orders.gig_id = gigs.id
       JOIN users ON orders.client_id = users.id
       WHERE gigs.freelancer_id = $1
       ORDER BY orders.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching seller orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// 8. GET ORDER DETAIL
app.get("/:id", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT orders.*, gigs.title AS gig_title, gigs.freelancer_id,
              buyers.username AS buyer_username
       FROM orders
       JOIN gigs ON orders.gig_id = gigs.id
       JOIN users AS buyers ON orders.client_id = buyers.id
       WHERE orders.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = result.rows[0];

    // Authorization: must be buyer or seller
    if (order.client_id !== req.user.id && order.freelancer_id !== req.user.id) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// 9. SELLER UPDATES ORDER STATUS
app.put("/:id/status", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["in_progress", "completed", "cancelled"];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status. Allowed: in_progress, completed, cancelled" });
    }

    // Fetch order + gig
    const orderResult = await pool.query(
      `SELECT orders.*, gigs.freelancer_id
       FROM orders JOIN gigs ON orders.gig_id = gigs.id
       WHERE orders.id = $1`,
      [req.params.id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = orderResult.rows[0];

    // Seller ownership check
    if (order.freelancer_id !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to update this order" });
    }

    // Validate status transitions
    const allowedTransitions = {
      pending: ["in_progress", "cancelled"],
      in_progress: ["completed", "cancelled"],
    };

    const allowed = allowedTransitions[order.status];
    if (!allowed || !allowed.includes(status)) {
      return res.status(400).json({ error: `Cannot transition from '${order.status}' to '${status}'` });
    }

    const updated = await pool.query(
      "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
      [status, req.params.id]
    );

    res.json({ message: "Status updated!", order: updated.rows[0] });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ error: "Failed to update status" });
  }
});

app.listen(PORT, () => {
  console.log(`Payment Service running on port ${PORT}`);
});