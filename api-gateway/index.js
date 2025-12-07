//With a Gateway: The user just walks to the Front Desk (Port 8000). They say, "I need to Login," and the receptionist forwards them to the right room automatically.

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;

// Enable CORS so the Frontend can talk to us
app.use(cors());
app.use(express.json());

//To test if the Gateway is running
app.get("/", (req, res) => {
  res.send("API Gateway is Running");
});

// --- ROUTING RULES (The Traffic Controller) ---

// 1. Auth & Users -> Forward to User Service (Port 5001)
// Any request starting with /api/auth or /api/users goes to the User Service
app.use(
  ["/api/auth", "/api/users"],
  createProxyMiddleware({
    target: "http://user-service:5001",
    changeOrigin: true,
    pathRewrite: {
      // (Optional) If you want to strip the prefix, but for now we keep it
    },
  })
);

// 2. Gigs -> Forward to Gig Service (Port 5002)
app.use(
  "/api/gigs",
  createProxyMiddleware({
    target: "http://gig-service:5002",
    changeOrigin: true,
  })
);

// 3. Orders -> Forward to Payment Service (Port 5003)
app.use(
  "/api/orders",
  createProxyMiddleware({
    target: "http://payment-service:5003",
    changeOrigin: true,
  })
);

// 4. Chats -> Forward to Chat Service (Port 5004)
app.use(
  ["/api/chats", "/api/messages"],
  createProxyMiddleware({
    target: "http://chat-service:5004",
    changeOrigin: true,
  })
);

// Start the Gateway
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});