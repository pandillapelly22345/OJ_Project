const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  language: { type: String, required: true, enum: ["cpp", "py", "c"] },
  filepath: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
  userInput: { type: String },
  startedAt: Date,
  completedAt: Date,
  status: { type: String, enum: ["in queue", "success", "error"], default: "in queue" },
  code: { type: String },
  output: String,
  outputs: [{ input: String, expected: String, actual: String }],
  verdict: String,
  userId: String,
  problemId: String,
});

module.exports = mongoose.model("Job", JobSchema);
