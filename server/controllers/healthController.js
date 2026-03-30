const { db } = require("../config/firebase");
const { Timestamp } = require("firebase-admin/firestore");

// Add a log
const addLog = async (req, res) => {
  const { type, value } = req.body;
  const userId = req.user.uid;

  if (!type || !value) {
    return res.status(400).json({ error: "type and value are required" });
  }

  try {
    const logEntry = {
      type,
      value,
      timestamp: Timestamp.now(),
    };
    const docRef = await db
      .collection("users")
      .doc(userId)
      .collection("healthLogs")
      .add(logEntry);
    res.status(201).json({ id: docRef.id, ...logEntry });
  } catch (error) {
    console.error("[Health] Add Log Error:", error);
    res.status(500).json({ error: "Failed to save health log" });
  }
};

// Get logs
const getLogs = async (req, res) => {
  const userId = req.user.uid;
  const limitParam = req.query.limit ? parseInt(req.query.limit, 10) : 20;

  try {
    const logsRef = db.collection("users").doc(userId).collection("healthLogs");
    const snapshot = await logsRef
      .orderBy("timestamp", "desc")
      .limit(limitParam)
      .get();

    if (snapshot.empty) {
      return res.json({ logs: [] });
    }

    const logs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json({ logs });
  } catch (error) {
    console.error("[Health] Get Logs Error:", error);
    res.status(500).json({ error: "Failed to retrieve health logs" });
  }
};

module.exports = { addLog, getLogs };
