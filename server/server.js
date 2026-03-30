require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { getAuth } = require("firebase-admin/auth");

// Import Routes
const aiRoutes = require("./routes/aiRoutes");
const healthRoutes = require("./routes/healthRoutes");
const locationRoutes = require("./routes/locationRoutes");

// --- Configuration ---
const PORT = process.env.PORT || 5000;

// --- Authentication Middleware ---
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Missing or invalid token" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

// --- Express App Setup ---
const app = express();
// server/server.js
app.use(
  cors({
    origin: [
      "https://doctor-plus-two.vercel.app", // Allow your Vercel frontend
      "http://localhost:5173", // Allow local Vite dev
      "http://localhost:5174", // Allow local Vite dev (alternative port)
      "http://localhost:3000", // Allow local React dev
    ],
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    credentials: true, // Allow cookies/headers if needed
  })
);
app.use(express.json({ limit: "10mb" })); // Limit for image uploads

// --- Mount Routes ---
// All routes will be prefixed with /api
app.use("/api/ai", authenticate, aiRoutes);
app.use("/api/health", authenticate, healthRoutes);
app.use("/api/location", locationRoutes);

// Root Check
app.get("/", (req, res) => {
  res.send(`Doctor Plus  Backend is Running on port ${PORT} !`);
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
