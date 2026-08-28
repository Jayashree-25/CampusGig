//With a Gateway: The user just walks to the Front Desk (Port 8000). They say, "I need to Login," and the receptionist forwards them to the right room automatically.

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors'); 

const app = express();

// --- 1. PROPER CORS SETUP (Replaces the Nuclear Fix) ---
app.use(cors({
  origin: true, // allows any url
  credentials: true // Allow cookies/headers
}));

// 2. Health Check
app.get('/', (req, res) => res.send('API Gateway is Running 🚀'));

// --- 3. PROXY RULES (CRITICAL FIX HERE) ---
// We changed 'user-service' to 'localhost' because you are running it locally.

app.use('/api/auth', createProxyMiddleware({ 
  target: 'http://user-service:5001', 
  changeOrigin: true,
  pathRewrite: { '^/api/auth': '' } 
}));

app.use('/api/gigs', createProxyMiddleware({ 
  target: 'http://gig-service:5002', 
  changeOrigin: true,
  pathRewrite: { '^/api/gigs': '' }
}));

app.use('/api/orders', createProxyMiddleware({ 
  target: 'http://payment-service:5003', 
  changeOrigin: true,
  pathRewrite: { '^/api/orders': '' }
}));

app.use('/api/chats', createProxyMiddleware({ 
  target: 'http://chat-service:5004', 
  changeOrigin: true,
  pathRewrite: { '^/api/chats': '' }
}));

app.listen(8000, () => {
  console.log('API Gateway running on port 8000');
});