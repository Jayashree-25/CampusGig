const express = require("express");
const { Pool } = require("pg"); // Client to talk to the DB
const bcrypt = require("bcryptjs"); // For password hashing
const jwt = require("jsonwebtoken"); // For auth tokens
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// --- Database Connection ---
// We use the environment variable defined in docker-compose.yml
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test DB Connection on Startup
pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL Database"))
  .catch((err) => console.error("❌ Database Connection Error:", err));

// --- ROUTES ---

// 1. Health Check
app.get("/", (req, res) => {
  res.send("User Service is Running and DB is Connected");
});

// 2. REGISTER USER
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // A. Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // B. Check if user already exists
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // C. Hash the Password (Security)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // D. Insert into Database
    const newUser = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at",
      [username, email, hashedPassword]
    );

    // E. Success Response
    res.status(201).json({
      message: "User registered successfully!",
      user: newUser.rows[0],
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// 3. LOGIN USER (Placeholder for next step)
app.post("/login", async (req, res) => {
  res.json({ message: "Login logic coming soon" });
});

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});