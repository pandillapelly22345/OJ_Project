import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/clike/clike";
import "codemirror/mode/python/python";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/fold/brace-fold";
import { submitCode, getJobStatus } from "../api/code";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

const CodeEditor = ({ testcases = [], problemId }) => {
  const editorRef = useRef(null);
  const [code, setCode] = useState("// Write your code here");
  const [language, setLanguage] = useState("cpp");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [inputMode, setInputMode] = useState("sample");
  const [customInput, setCustomInput] = useState("");
  const [activeTab, setActiveTab] = useState("input");

  const [verdict, setVerdict] = useState(null);
  const [loading, setLoading] = useState(false);

  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [showAiPopup, setShowAiPopup] = useState(false);

  const [showReviewTab, setShowReviewTab] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewText, setReviewText] = useState("");


  const { getToken } = useAuth();

  const sampleInput = testcases.find((tc) => tc.sample)?.input || "";

  useEffect(() => {
    const cm = CodeMirror.fromTextArea(editorRef.current, {
      lineNumbers: true,
      autoCloseBrackets: true,
      matchBrackets: true,
      indentWithTabs: false,
      indentUnit: 4,
      smartIndent: true,
      theme: "material",
      mode:
        language === "c"
          ? "text/x-csrc"
          : language === "cpp"
          ? "text/x-c++src"
          : "python",
    });

    // 🔽 Set boilerplate code based on language
    let boilerplate = "// Write your code here";

    if (language === "cpp") {
      boilerplate = `#include <iostream>
  using namespace std;

  int main() {
      // your code goes here
      return 0;
  }`;
    } else if (language === "c") {
      boilerplate = `#include <stdio.h>

  int main() {
      // your code goes here
      return 0;
  }`;
    } else if (language === "py") {
      boilerplate = `# your code goes here
  print("Hello, world!")`;
    }

    cm.setValue(boilerplate);
    setCode(boilerplate);

    cm.setSize("100%", "400px");

    cm.on("change", (editor) => {
      setCode(editor.getValue());
    });

    return () => cm.toTextArea();
  }, [language]);

  const handleAnalyzeComplexity = async () => {
    setAiLoading(true);
    setAiResponse(null);
    setShowAiPopup(true);

    try {
      const { data } = await axios.post("http://51.20.53.208:5000/api/run/ai-review", {
        code,
      });

      if (data.success) {
        setAiResponse(data.aiResponse);
      } else {
        setAiResponse("Failed to analyze code.");
      }
    } catch (error) {
      console.error("AI review error:", error);
      setAiResponse("Error contacting AI review service.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleCodeReview = async () => {
    setShowReviewTab(true);
    setReviewLoading(true);
    setReviewText("");

    try {
      const { data } = await axios.post("http://51.20.53.208:5000/api/ai/code-review", {
        code,
      });

      if (data.success) setReviewText(data.aiText);
      else setReviewText("⚠️ Failed to generate code review.");
    } catch (err) {
      console.error("AI review error:", err);
      setReviewText("❌ Error: " + err.message);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setActiveTab("output")
    const input = inputMode === "sample" ? sampleInput : customInput;

    try {
      const { data } = await axios.post("http://51.20.53.208:5000/api/run", {
        code,
        language,
        input,
      });
      const jobId = data.jobId;
      if (!jobId) {
        toast.error("Login to run problem");
        return;
      }

      const poll = setInterval(async () => {
        const { data: statusData } = await axios.get(
          `http://51.20.53.208:5000/api/run/status/${jobId}`
        );
        const job = statusData.job;

        if (job.status === "success" || job.status === "error") {
          clearInterval(poll);
          setOutput(job.output);
          setIsRunning(false);
        }
      }, 2000);
    } catch (err) {
      console.error(err);
      setOutput("Error running code");
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setActiveTab("verdict")
    setLoading(true);
    setVerdict(null);

    const userInput = inputMode === "sample" ? sampleInput : customInput;

    try {
      const token = await getToken();
      const jobId = await submitCode({
        code,
        language,
        problemId,
        userInput,
        token,
      });

      if (!jobId) {
        toast.error("Login to submit problem");
        setLoading(false);
        return;
      }

      const poll = setInterval(async () => {
        const jobStatus = await getJobStatus(jobId);

        if (jobStatus.status === "success" || jobStatus.status === "error") {
          clearInterval(poll);
          setLoading(false);
          setVerdict(jobStatus);
        }
      }, 2000);
    } catch (error) {
      console.error("Submission failed", error);
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#111] p-4 rounded shadow text-white text-sm">
      {/* Language Selector */}
      <div className="flex justify-between items-center mb-4">
        <label className="text-sm font-semibold">Language:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-gray-800 border border-gray-600 text-white px-3 py-1 rounded"
        >
          <option value="c">C</option>
          <option value="cpp">C++</option>
          <option value="py">Python</option>
        </select>
      </div>

      {/* Code Editor */}
      <textarea ref={editorRef} className="bg-black" />

      {/* Tabs */}
      <div className="flex space-x-4 mt-6 border-b border-gray-700">
        {["input", "output", "verdict"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 capitalize font-semibold ${
              activeTab === tab
                ? "text-white border-b-2 border-white"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "input" && (
        <div className="flex space-x-4 mt-4">
          <button
            className={`px-4 py-1 rounded ${
              inputMode === "sample"
                ? "bg-blue-700 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => setInputMode("sample")}
          >
            Sample Input
          </button>
          <button
            className={`px-4 py-1 rounded ${
              inputMode === "custom"
                ? "bg-blue-700 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => setInputMode("custom")}
          >
            Custom Input
          </button>
        </div>
      )}

      {/* Tab Content */}
      <div className="mt-4 bg-[#1c1c1c] rounded p-4 min-h-[160px]">
        {activeTab === "input" && (
          <textarea
            readOnly={inputMode === "sample"}
            className="w-full h-32 text-white p-2 rounded resize-none"
            value={inputMode === "sample" ? sampleInput : customInput}
            onChange={(e) => setCustomInput(e.target.value)}
          />
        )}

        {activeTab === "output" && (
          <pre className="whitespace-pre-wrap text-gray-300">
            {isRunning ? "⏳ Running..." : output}
          </pre>
        )}

        {activeTab === "verdict" && (
          <>
            {loading ? (
              <p className="text-blue-400">Checking test cases...</p>
            ) : verdict ? (
              <>
                <p
                  className={`text-lg font-semibold ${
                    verdict.verdict === "ac"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {verdict.verdict === "ac" ? " Accepted" : " Not Accepted"}
                </p>

                <p className="text-sm text-gray-400">
                  Submitted At: {new Date(verdict.submittedAt).toLocaleString()}
                </p>
                <pre className="mt-2">{verdict.output}</pre>

                {verdict.verdict === "ac" && (
                  <div className="mt-4">
                    <button
                      onClick={handleCodeReview}
                      className="px-3 py-1 text-sm font-medium bg-yellow-500 hover:bg-yellow-600 text-black rounded-full shadow-sm transition-all duration-150"
                    >
                      Code Review
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500">No submission yet.</p>
            )}
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 mt-6">
        <button
          onClick={handleRun}
          className="bg-[#222] border border-gray-600 px-4 py-2 rounded hover:bg-gray-700 transition"
        >
          ▶️ Run
        </button>
        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white font-semibold"
        >
          💬 Submit
        </button>
        <button
          onClick={handleAnalyzeComplexity}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded text-white font-semibold"
        >
          Analyze Time & Space
        </button>
      </div>
      {showAiPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] text-white p-6 rounded-xl max-w-lg w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              onClick={() => setShowAiPopup(false)}
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4">AI Analysis</h2>
            {aiLoading ? (
              <p className="text-blue-400">⏳ Analyzing code...</p>
            ) : (
              <pre className="whitespace-pre-wrap text-sm">{aiResponse}</pre>
            )}
          </div>
        </div>
      )}

      {showReviewTab && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] text-white p-6 rounded-t-2xl z-50 transition-all shadow-xl max-h-[50vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">AI Code Review</h2>
            <button
              className="text-gray-400 hover:text-white"
              onClick={() => setShowReviewTab(false)}
            >
              ✖
            </button>
          </div>
          {reviewLoading ? (
            <p className="text-blue-400">⏳ Reviewing your code...</p>
          ) : (
            <pre className="whitespace-pre-wrap text-sm">{reviewText}</pre>
          )}
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
