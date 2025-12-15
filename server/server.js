require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Import Routes
const aiRoutes = require("./routes/aiRoutes");
const healthRoutes = require("./routes/healthRoutes");
const locationRoutes = require("./routes/locationRoutes");

// --- Configuration ---
const PORT = process.env.PORT || 5000;

// --- Express App Setup ---
const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" })); // Limit for image uploads

// --- Mount Routes ---
// All routes will be prefixed with /api
app.use("/api", aiRoutes);
app.use("/api", healthRoutes);
app.use("/api", locationRoutes);

// Root Check
app.get("/", (req, res) => {
  res.send(`Doctor Plus  Backend is Running on port ${PORT} !`);
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
