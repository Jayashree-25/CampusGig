const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5004;

// Middleware
app.use(cors());
app.use(express.json());

// 1. DATABASE CONNECTION
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 2. SETUP SOCKET.IO SERVER
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow connections from Frontend (e.g., localhost:5173)
    methods: ["GET", "POST"],
  },
});

// 3. REAL-TIME SOCKET LOGIC
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Event: User Joins a Chat Room
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User with ID: ${socket.id} joined room: ${room}`);
  });

  // Event: User Sends a Message
  socket.on("send_message", async (data) => {
    // data = { room, author, message, time }
    const { room, author, message } = data;

    try {
      // A. SAVE TO DATABASE (Persistence)
      // We assume 'author' is the User ID (integer)
      await pool.query(
        "INSERT INTO messages (chat_room_id, sender_id, text) VALUES ($1, $2, $3)",
        [room, author, message]
      );

      // B. SEND TO EVERYONE IN ROOM (Real-time)
      // We send back the same data so the frontend can display it immediately
      io.to(room).emit("receive_message", data);
      
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// 4. API ROUTES (For fetching history)

// GET /history/:roomId - Load previous messages
app.get("/history/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;
    const result = await pool.query(
      "SELECT * FROM messages WHERE chat_room_id = $1 ORDER BY created_at ASC",
      [roomId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not fetch history" });
  }
});

// START SERVER
server.listen(PORT, () => {
  console.log(`Chat Service (Socket.io) running on port ${PORT}`);
});