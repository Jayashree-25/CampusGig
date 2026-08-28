const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const multer = require("multer"); 
const path = require("path");    
const fs = require("fs");
require("dotenv").config();
const verifyToken = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 5002;

const uploadDir = path.join(__dirname, "uploads");

// Create 'uploads' folder if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files here
  },
  filename: (req, file, cb) => {
    // Name file: gig_TIMESTAMP.jpg
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, "gig_" + uniqueSuffix); 
  },
});

const upload = multer({ storage: storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 
// IMPORTANT: Serve the uploads folder publicly so Frontend can see images

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

// 2. CREATE A GIG (Protected + Image Upload)
// We add 'upload.single("coverImage")' middleware here
app.post("/", verifyToken, upload.single("coverImage"), async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const freelancerId = req.user.id;
    
    // Get the image path if a file was uploaded
    // We store the relative path: "/uploads/filename.jpg"
    const coverImage = req.file ? `/uploads/${req.file.filename}` : null;

    // Validation
    if (!title || !price) {
        return res.status(400).json({ error: "Title and Price are required" });
    }

    const newGig = await pool.query(
      "INSERT INTO gigs (title, description, price, freelancer_id, cover_image) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, description, price, freelancerId, coverImage]
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