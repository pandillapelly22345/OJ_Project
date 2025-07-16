const express = require("express");
const router = express.Router();
const { generateFile } = require("../code-execution/generateFile");
const Job = require("../models/Job");
const { addJobToQueue, addSubmitToQueue } = require("../jobQueue");
const { requireAuth } = require("@clerk/express");
const generateAiResponse = require("../code-execution/generateAiResponse");

router.post("/", async (req, res) => {
  const { language, code, input = "" } = req.body;
  if (!code) return res.status(400).json({ error: "Empty code" });

  try {
    const filepath = await generateFile(language, code);
    const job = await new Job({ language, filepath, userInput: input }).save();
    await addJobToQueue(job._id);
    res.status(201).json({ jobId: job._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Code execution failed" });
  }
});

// 👇 Verdict system here
router.post("/submit", requireAuth(), async (req, res) => {
  const { language, code, problemId } = req.body;
  if (!code || !problemId) return res.status(400).json({ error: "Missing code or problemId" });

  try {
    const filepath = await generateFile(language, code);
    const job = await new Job({ language, filepath, code }).save();
    await addSubmitToQueue(job._id, problemId, req.auth.userId);
    res.status(201).json({ jobId: job._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Submit failed" });
  }
});

router.get("/status/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.status(200).json({ success: true, job });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/submission/:id", requireAuth(), async (req, res) => {
  const userId = req.auth.userId; // Clerk user ID
  const problemId = req.params.id;

  if (!userId || !problemId) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const submissions = await Job.find({
      userId,
      problemId,
      verdict: { $exists: true },
    }).sort({ submittedAt: -1 });

    return res.status(200).json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.post("/ai-review", async (req, res) => {
  const {code} = req.body;
  if(code === undefined || code.trim() === ''){
    return res.status(400).json({
      success: false,
      error: "Empty code! Please provide some code to review."
    });
  }

  try{
    const aiResponse = await generateAiResponse(code);
    res.json({
      success: true,
      aiResponse
    });
  } catch(error){
    console.error('Error executing code:', error.message);
  }
});


module.exports = router;
