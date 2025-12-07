//This service is responsible for handling Registration and Login

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json()); // Allows us to read JSON data from the frontend

// --- Routes ---

// 1. Health Check
app.get("/", (req, res) => {
  res.send("User Service is Running");
});

// 2. Register Endpoint (Placeholder for now)
app.post("/register", (req, res) => {
  // We will add the database logic here in the next step
  const { username, email, password } = req.body;
  console.log("Register Request Received:", { username, email });
  res.json({ message: "Registration endpoint hit successfully!" });
});

// 3. Login Endpoint (Placeholder for now)
app.post("/login", (req, res) => {
  // We will add the database logic here in the next step
  const { username, password } = req.body;
  console.log("Login Request Received:", { username });
  res.json({ message: "Login endpoint hit successfully!" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});