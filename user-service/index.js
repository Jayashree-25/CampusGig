const express = require("express");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key"; // Fallback secret if not in .env (for safety)

// Middleware
app.use(cors());
app.use(express.json());

// --- Database Connection ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL Database"))
  .catch((err) => console.error("❌ Database Connection Error:", err));

// --- ROUTES ---

// 1. Health Check
app.get("/", (req, res) => {
  res.send("User Service is Running");
});

// 2. REGISTER USER
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user exists
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert into DB
    const newUser = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at",
      [username, email, hashedPassword]
    );

    res.status(201).json({
      message: "User registered successfully!",
      user: newUser.rows[0],
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// 3. LOGIN USER (The New Code)
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // A. Validate Input
    if (!email || !password) {
      return res.status(400).json({ error: "Please provide email and password" });
    }

    // B. Find User by Email
    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: "Invalid Credentials" }); // User not found
    }

    const user = userResult.rows[0];

    // C. Compare Passwords (bcrypt)
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid Credentials" }); // Wrong password
    }

    // D. Generate JWT Token (The "ID Card")
    const token = jwt.sign(
      { id: user.id, username: user.username }, // Payload (what's inside the token)
      JWT_SECRET,                               // The Secret Key
      { expiresIn: "1h" }                       // Expiration time
    );

    // E. Send Response
    res.json({
      message: "Login successful",
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});