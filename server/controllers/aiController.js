const {
  textModel,
  multimodalModel,
  safetySettings,
  generationConfig,
} = require("../config/gemini");
const { db } = require("../config/firebase");

// --- Chatbot & Wellness Tools ---
const chat = async (req, res) => {
  const { message, userId } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const systemPrompt = `You are Doctor Plus, a helpful AI health assistant. Provide informative and empathetic responses based on the user's query. 
  If the user asks about symptoms, analyze them and give general advice. 
  If the user asks about first-aid (e.g., snake bite, burns), provide immediate steps.
  If the user is using the 'Mood Journal', analyze their mood and suggest mindfulness exercises.
  If the user is using the 'Recipe Generator', create a healthy recipe based on their ingredients.
  **Crucially, always include a disclaimer that you are not a medical professional and the user should consult a doctor for any health concerns.**`;

  try {
    console.log(`[AI] Chat request received: "${message.substring(0, 30)}..."`);
    const chatSession = textModel.startChat({
      generationConfig,
      safetySettings,
      history: [],
      systemInstruction: { parts: [{ text: systemPrompt }] },
    });

    const result = await chatSession.sendMessage(message);
    const reply = result.response.text();
    res.json({ reply });
  } catch (error) {
    console.error("[AI] Chat Error:", error.message);
    res.status(500).json({ error: "Failed to get response from AI model" });
  }
};

// --- Image Analysis (Food/Skin) ---
const analyzeImage = async (req, res) => {
  const { prompt, imageData, mimeType } = req.body;

  if (!prompt || !imageData || !mimeType) {
    return res
      .status(400)
      .json({ error: "Prompt, imageData, and mimeType are required" });
  }

  try {
    console.log(
      `[AI] Image analysis request. Prompt: "${prompt.substring(0, 30)}..."`
    );
    const imagePart = {
      inlineData: {
        data: imageData,
        mimeType: mimeType,
      },
    };

    const result = await multimodalModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }, imagePart] }],
      generationConfig,
      safetySettings,
    });

    const analysis = result.response.text();
    res.json({ analysis });
  } catch (error) {
    console.error("[AI] Image Analysis Error:", error.message);
    res.status(500).json({ error: "Failed to analyze image" });
  }
};

// --- Health Insights (From Logs) ---
const getHealthInsights = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    console.log(`[AI] Generating insights for user: ${userId}`);
    // 1. Fetch recent logs from Firestore
    const logsRef = db.collection("users").doc(userId).collection("healthLogs");
    const snapshot = await logsRef.orderBy("timestamp", "desc").limit(50).get();

    if (snapshot.empty) {
      return res.json({
        insights:
          "Not enough data to generate insights. Keep logging your food and activities!",
      });
    }

    const logs = snapshot.docs.map((doc) => ({
      type: doc.data().type,
      value: doc.data().value,
      timestamp: doc.data().timestamp.toDate().toISOString(),
    }));

    // 2. Prepare Prompt
    const logsString = logs
      .map((log) => `${log.timestamp} - ${log.type}: ${log.value}`)
      .join("\n");
    const insightPrompt = `Analyze these recent health logs. Identify patterns in diet/activity. Suggest improvements. Be encouraging. No medical advice. Logs:\n${logsString}`;

    // 3. Call Gemini (Single Turn)
    const result = await textModel.generateContent(insightPrompt);
    const insights = result.response.text();

    res.json({ insights });
  } catch (error) {
    console.error("[AI] Insights Error:", error);
    res.status(500).json({ error: "Failed to generate health insights" });
  }
};

module.exports = { chat, analyzeImage, getHealthInsights };
