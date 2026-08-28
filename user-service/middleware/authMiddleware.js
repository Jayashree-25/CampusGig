const jwt = require("jsonwebtoken");

// Get the secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]; // 1. Look for the token in the header
  
  // Tokens usually come as "Bearer eyJ..." We split the string to get just the token part
  const token = authHeader && authHeader.split(" ")[1];

  // 2. Check if token exists
  if (!token) {
    return res.status(403).json({ error: "Access Denied: No Token Provided" });
  }

  try {
    // 3. Verify the token using our Secret Key
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 4. If valid, attach the user info to the request
    req.user = decoded;
    
    // 5. Allow them to proceed to the next step
    next();
    
  } catch (err) {
    res.status(401).json({ error: "Invalid Token" });
  }
};

module.exports = verifyToken;