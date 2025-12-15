const express = require("express");
const router = express.Router();
const {
  chat,
  analyzeImage,
  getHealthInsights,
} = require("../controllers/aiController");

router.post("/chat", chat);
router.post("/analyze-image", analyzeImage);
router.post("/health-insights", getHealthInsights);

module.exports = router;
