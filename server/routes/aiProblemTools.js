const express = require("express");
const router = express.Router();
const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

const generateContent = async (prompt) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  return response.text;
};

router.post("/ai/refine", async (req, res) => {
  const { statement } = req.body;
  if (!statement) return res.status(400).json({ success: false, error: "No statement provided" });

  try {
    const aiText = await generateContent(`Refine this problem statement and make it clearer and grammatically correct:\n\n${statement}`);
    res.json({ success: true, aiText });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/ai/test-cases", async (req, res) => {
  const { statement } = req.body;
  if (!statement) return res.status(400).json({ success: false, error: "No statement provided" });

  try {
    const aiText = await generateContent(`Based on the following problem statement, generate 5 sample test cases in Input/Output format in this format Input: Output: Explaination:. Dont generate in any bash or txt format:\n\n${statement}`);
    res.json({ success: true, aiText });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/ai/constraints", async (req, res) => {
  const { statement } = req.body;
  if (!statement) return res.status(400).json({ success: false, error: "No statement provided" });

  try {
    const aiText = await generateContent(`From the below problem description, suggest valid input constraints (e.g., 1 ≤ N ≤ 10^5, etc). Note dont generate in any bash or txt format.:\n\n${statement}`);
    res.json({ success: true, aiText });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/ai/code-review", async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ success: false, error: "No code provided" });

  try {
    const aiText = await generateContent(
      `Review the following code and give constructive feedback like a senior software engineer. Highlight improvements, bad practices, and clean coding tips. Only show feedback, not time complexity:\n\n${code}`
    );
    res.json({ success: true, aiText });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
