const router = require("express").Router();
const Problem = require("../models/Problem");
const { requireAuth } = require("@clerk/express");

const slugify = (str) =>
  str.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");


// Add problem
router.post("/add", requireAuth(), async (req, res) => {
  try {
    const { detail, testcase } = req.body;

    if (!detail?.title || !detail?.statement) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const slug = slugify(detail.title);

    const newProblem = new Problem({
      slug,
      ...detail,
      testcase,
      createdBy: req.auth.userId, // ✅ Clerk provides this
    });

    const saved = await newProblem.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// Get problems (no auth)
router.get("/", async (req, res) => {
  try {
    const data = await Problem.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ✅ Get only problems created by logged-in user
router.get("/my-problems", requireAuth(), async (req, res) => {
  try {
    const problems = await Problem.find({ createdBy: req.auth.userId });
    res.status(200).json(problems);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch problems" });
  }
});

// Get a single problem by ID
router.get("/:id", async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }
    res.status(200).json(problem);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch problem" });
  }
});

// ✅ Delete a problem
router.delete("/:id", requireAuth(), async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) return res.status(404).json({ error: "Problem not found" });

    if (problem.createdBy !== req.auth.userId)
      return res.status(403).json({ error: "Unauthorized" });

    await Problem.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting problem" });
  }
});

// ✅ Update a problem
router.put("/:id", requireAuth(), async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ error: "Problem not found" });

    if (problem.createdBy !== req.auth.userId)
      return res.status(403).json({ error: "Unauthorized" });

    const updated = await Problem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Error updating problem" });
  }
});

router.get("/user/solved", requireAuth(), async (req, res) => {
  try {
    const userId = req.auth.userId;
    const problems = await Problem.find({ whoSolved: userId });

    const easy = problems.filter((p) => p.difficulty === "Easy").length;
    const medium = problems.filter((p) => p.difficulty === "Medium").length;
    const hard = problems.filter((p) => p.difficulty === "Hard").length;

    res.json({
      totalSolved: problems.length,
      easy,
      medium,
      hard,
      problems,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
