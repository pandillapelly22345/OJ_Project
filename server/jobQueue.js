const Queue = require("bull");
const moment = require("moment");
const Job = require("./models/Job");
const Problem = require("./models/problem");
const { executeCpp } = require("./code-execution/executeCpp");
const { executePython } = require("./code-execution/executePython");


const redisURL = process.env.REDIS_URL
const jobQueue = new Queue("run-code", redisURL);

jobQueue.process(async ({ data }) => {
  console.log("🛠️ Running jobQueue:", data);
  const job = await Job.findById(data.id);
  if (!job) throw new Error("Job not found");

  try {
    job.startedAt = new Date();

    let output = "";
    if (job.language === "cpp" || job.language === "c") {
      output = await executeCpp(job.filepath, job.userInput);
    } else {
      output = await executePython(job.filepath, job.userInput);
    }

    job.completedAt = new Date();
    job.status = "success";
    job.output = output;

    await job.save();
  } catch (err) {
    console.error("❌ Execution failed:", err);
    job.completedAt = new Date();
    job.status = "error";
    job.output = err.stderr || err.message || "Unknown error";
    await job.save();
  }
});

const submitQueue = new Queue("submit-code",  redisURL);

submitQueue.on("error", (err) => {
  console.error("❌ submitQueue Redis connection error:", err);
});

submitQueue.on("waiting", (jobId) => {
  console.log("📥 submitQueue: job waiting:", jobId);
});

submitQueue.on("active", (job, jobPromise) => {
  console.log("⚙️ submitQueue: job is now active:", job.id);
});

submitQueue.process(async ({ data }) => {
  try{
    console.log("📦 Processing submitQueue:", data);
    const { id, userId, problemId } = data;
    const job = await Job.findById(id);
    const problem = await Problem.findById(problemId);
    const testcases = problem.testcase;

    job.startedAt = new Date();
    job.status = "started";
    job.userId = userId;
    job.problemId = problemId;
    job.outputs = [];

    let passed = true;

    for (const item of testcases) {
      const start = moment(new Date());
      try {
        let output;

        if (job.language === "cpp" || job.language === "c") {
          output = await executeCpp(job.filepath, item.input);
        } else {
          output = await executePython(job.filepath, item.input);
        }

        const outputUser = String(output).trim();
        const outputTestcase = String(item.output).trim();
        job.outputs.push({
          input: item.input,
          expected: item.output,
          actual: outputUser
        });

        const end = moment(new Date());
        const executionTime = end.diff(start, "seconds", true);

        if (executionTime > problem.timelimit) {
          job.verdict = "tle";
          job.output = `TLE on input: ${item.input}`;
          passed = false;
          break;
        }

        if (outputUser !== outputTestcase) {
          console.log("❌ Wrong answer at testcase:");
          console.log("Input:", item.input);
          console.log("Expected:", outputTestcase);
          console.log("Got     :", outputUser);
          
          job.verdict = "wa";
          job.output = `WA on input: ${item.input}`;
          passed = false;
          break;
        }
      } catch (err) {
        job.verdict = "error";
        job.output = err.stderr || err.message || String(err);
        passed = false;
        break;
      }
    }

    // ✅ Save who solved if all test cases passed
    if (passed) {
      job.verdict = "ac";
      job.output = "All test cases passed";
      const distinct_user = new Set(problem.whoSolved);
      distinct_user.add(userId);
      problem.whoSolved = [...distinct_user];
      await problem.save();
    }

    
    job.completedAt = new Date();
    job.status = "success";
    console.log("🔁 Final job before saving:", {
      id: job._id,
      verdict: job.verdict,
      status: job.status,
    });
    await job.save();

    console.log("✅ Job saved successfully:", job._id);

    console.log("✅ Verdict:", job.verdict);
  }catch(err){
    console.error("❌ Fatal error in submitQueue processor:", err);
  }
});

const addJobToQueue = (jobId) => jobQueue.add({ id: jobId });
const addSubmitToQueue = (jobId, problemId, userId) =>
  submitQueue.add({ id: jobId, problemId, userId });

module.exports = { addJobToQueue, addSubmitToQueue };
