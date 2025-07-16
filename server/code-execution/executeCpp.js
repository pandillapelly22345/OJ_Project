const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath, input = "") => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.exe`);

  return new Promise((resolve, reject) => {
    const compileCommand = `g++ "${filepath}" -o "${outPath}"`;

    exec(compileCommand, (compileErr, stdout, stderr) => {
      if (compileErr) {
        return reject({ 
          type: "compilation",
          stderr: stderr,
          error: stderr || compileErr.message || "Compilation error",
        });
      }

      const runProcess = exec(`"${outPath}"`, (runErr, runStdout, runStderr) => {
        if (runErr) {
          return reject({ 
            type: "runtime",
            stderr: runStderr,
            error: runStderr || runErr.message || "Runtime error",
          });
        }
        return resolve(runStdout);
      });

      // ✅ Send input through stdin
      if (runProcess.stdin) {
        runProcess.stdin.write(input);
        runProcess.stdin.end();
      }
    });
  });
};

module.exports = { executeCpp };
