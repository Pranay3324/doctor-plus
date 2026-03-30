const express = require("express");
const router = express.Router();
const { addLog, getLogs } = require("../controllers/healthController");

router.post("/health-log", addLog);
router.get("/health-log", getLogs);

module.exports = router;
