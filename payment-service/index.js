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

    // A. Check if the Gig exists and get its price
    const gigResult = await pool.query("SELECT * FROM gigs WHERE id = $1", [gigId]);
    
    if (gigResult.rows.length === 0) {
      return res.status(404).json({ error: "Gig not found" });
    }
    
    const gig = gigResult.rows[0];
    const amount = gig.price; // e.g., 500

    // B. Create Razorpay Order
    // Razorpay expects amount in "paise" (500 rupees = 50000 paise)
    const options = {
      amount: Math.round(amount * 100), 
      currency: "INR",
      receipt: `receipt_gig_${gigId}`,
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
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // A. Create the signature locally using our Secret Key
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    // B. Compare signatures
    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // C. Update Database to "PAID"
      await pool.query(
        "UPDATE orders SET status = 'paid' WHERE razorpay_order_id = $1",
        [razorpay_order_id]
      );

      res.json({ success: true, message: "Payment Verified Successfully" });
    } else {
      res.status(400).json({ success: false, error: "Invalid Signature" });
    }

  } catch (err) {
    console.error("Payment Verification Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Payment Service running on port ${PORT}`);
});