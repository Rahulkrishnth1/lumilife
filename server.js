require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini
// NOTE: Make sure to set GEMINI_API_KEY in your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/ai/chat', async (req, res) => {
  try {
    const { statusText } = req.body;
    
    if (!statusText) {
      return res.status(400).json({ error: "Missing statusText" });
    }

    const prompt = `
      You are an AI Energy Planner for Lumilife.
      The user says: "${statusText}"
      
      Generate a daily energy plan based on their status.
      Return ONLY a raw JSON object with this exact structure, no markdown, no backticks:
      {
        "energyLevel": 75,
        "advice": "Short encouraging advice based on status",
        "plan": [
          {"time": "09:00 AM", "task": "Task name", "type": "peak"},
          {"time": "12:00 PM", "task": "Lunch", "type": "rest"}
        ]
      }
      Task types must be one of: peak, low, move, rest.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Clean response just in case the AI wraps it in markdown
    const cleanedText = text.replace(/```json|```/g, "").trim();
    const jsonResponse = JSON.parse(cleanedText);

    res.json(jsonResponse);
  } catch (error) {
    console.error("AI Generation Error:", error.message);
    // Fallback response if API fails or quota exceeded
    res.json({ 
      energyLevel: 50, 
      advice: "AI is resting (API error). Here is a standard backup plan.",
      plan: [
        { time: "10:00 AM", task: "Deep Work", type: "peak" },
        { time: "01:00 PM", task: "Recharge", type: "rest" }
      ]
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
