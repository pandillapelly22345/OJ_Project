// routes/comment.js
const express = require("express");
const router = express.Router();
const Comment = require("../models/comment");
const { requireAuth } = require("@clerk/express");

// Fetch all comments for a problem
router.get("/:problemId", async (req, res) => {
  try {
    const comments = await Comment.find({ problemId: req.params.problemId }).sort({ postedAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// Post a new comment
router.post("/:problemId", requireAuth(), async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: "Empty comment" });

  try {
    const comment = await new Comment({
      problemId: req.params.problemId,
      content,
      userId: req.auth.userId,
    }).save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: "Failed to post comment" });
  }
});

module.exports = router;
