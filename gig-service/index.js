const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config();
const verifyToken = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// --- ROUTES ---

// 1. GET ALL GIGS (Public)
app.get("/", async (req, res) => {
  try {
    const allGigs = await pool.query("SELECT * FROM gigs");
    res.json(allGigs.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// 2. CREATE A GIG (Protected)
app.post("/", verifyToken, async (req, res) => {
  try {
    // We get the data from the body
    const { title, description, price } = req.body;
    
    // We get the User ID from the token (thanks to verifyToken middleware)
    const freelancerId = req.user.id; 

    const newGig = await pool.query(
      "INSERT INTO gigs (title, description, price, freelancer_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, description, price, freelancerId]
    );

    res.status(201).json({
      message: "Gig posted successfully!",
      gig: newGig.rows[0]
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Gig Service running on port ${PORT}`);
});