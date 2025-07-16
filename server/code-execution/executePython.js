const { spawn } = require("child_process");

const executePython = (filepath, input = "") => {
  return new Promise((resolve, reject) => {
    const process = spawn("python", [filepath]);

    let output = "";
    let error = "";

    process.stdin.write(input);
    process.stdin.end();

    process.stdout.on("data", (data) => {
      output += data.toString();
    });

    process.stderr.on("data", (data) => {
      error += data.toString();
    });

    process.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(error || "Execution failed"));
      } else {
        resolve(output);
      }
    });
  });
};

module.exports = { executePython };
