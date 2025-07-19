import React, { useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Sparkles, Target, BadgeCheck, X } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Info, CornerDownLeft, CheckCircle} from "lucide-react";

const AddProblem = () => {
  const { getToken } = useAuth();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [statement, setStatement] = useState("");
  const [constraints, setConstraints] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [testcases, setTestcases] = useState([{ input: "", output: "", sample: false, explanation: "" }]);
  
  const [comment, setComment] = useState("");

  const [aiResult, setAiResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTab, setShowTab] = useState(false);
  const [tabTitle, setTabTitle] = useState("");

  const { isSignedIn } = useUser();

  const handleAddProblem = async (e) => {
    e.preventDefault();

    if (!isSignedIn) {
      toast.error("Please sign in to submit a problem.");
      return;
    }
    const token = await getToken();
    try {
      const res = await fetch("http://51.20.53.208:5000/api/problem/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          detail: { title, desc, statement, constraints, difficulty },
          testcase: testcases,
        }),
      });
      const data = await res.json();
      console.log("Problem added:", data);
      if (res.ok) {
        toast.success("Problem added successfully!");
        // Optionally, you can reset the form or redirect
        setTitle("");
        setDesc("");
        setStatement("");
        setConstraints("");
        setDifficulty("Easy");
        setTestcases([{ input: "", output: "", sample: false, explanation: "" }]);
      } else {
        toast.error(data.message || "Failed to add problem.");
      }
    } catch (err) {
      console.error("❌ Error adding problem:", err);
    }
  };

  const handleAI = async (type, title) => {
    setLoading(true);
    setShowTab(true);
    setTabTitle(title);
    setAiResult("");

    try {
      const { data } = await axios.post(`http://51.20.53.208:5000/api/ai/${type}`, {
        statement: statement, // get this from your form input state
      });

      if (data.success) setAiResult(data.aiText);
      else setAiResult("⚠️ AI failed to generate a response.");
    } catch (err) {
      setAiResult("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTestcaseChange = (index, field, value) => {
    const updated = [...testcases];
    updated[index][field] = field === "sample" ? value.target.checked : value;
    setTestcases(updated);
  };

  const addTestcase = () => {
    setTestcases([...testcases, { input: "", output: "", sample: false, explanation: "" }]);
  };

  const removeTestcase = (index) => {
    const updated = [...testcases];
    updated.splice(index, 1);
    setTestcases(updated);
  };

  return (
    <form
      onSubmit={handleAddProblem}
      className="pt-28 px-6 md:px-20 lg:px-36 text-white font-mono"
    >
      <h1 className="text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
        Add a New Coding Challenge 🚀
      </h1>
      <p className="text-center text-sm text-gray-400 mb-3">
        Use these tools to improve your problem statement ✨
      </p>

      <div className="flex justify-center gap-8 mb-6">
        <button
          type="button"
          onClick={() => handleAI("refine", "Refined Problem Statement")}
          className="bg-[#1c1c1c] hover:bg-[#2a2a2a] text-yellow-400 rounded-xl px-6 py-4 flex flex-col items-center shadow transition"
        >
          <Sparkles className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Refine Prlbm</span>
        </button>

        <button
          type="button"
          onClick={() => handleAI("test-cases", "Generated Test Cases")}
          className="bg-[#1c1c1c] hover:bg-[#2a2a2a] text-yellow-400 rounded-xl px-6 py-4 flex flex-col items-center shadow transition"
        >
          <Target className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Test Cases</span>
        </button>

        <button
          type="button"
          onClick={() => handleAI("constraints", "Suggested Constraints")}
          className="bg-[#1c1c1c] hover:bg-[#2a2a2a] text-yellow-400 rounded-xl px-6 py-4 flex flex-col items-center shadow transition"
        >
          <BadgeCheck className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Constraints</span>
        </button>
      </div>

      <div className="bg-gray-900 border border-white/10 rounded-xl p-5 mb-6 text-sm text-gray-300 space-y-1 leading-snug shadow-lg">
        <div className="flex items-center gap-2 text-white font-semibold text-base">
          <Info className="w-5 h-5 text-blue-400" />
          Instructions to Add a Problem
        </div>

        <div className="flex items-start gap-3">
          <CornerDownLeft className="w-4 h-4 text-green-400 mt-1" />
          <p>
            If you want a <span className="text-white font-medium">new line</span> in the problem statement or constraints,
            press <span className="text-white font-medium">Enter two times</span> to insert a visible line break.
          </p>
        </div>

        <div className="flex items-start gap-3">
          <CornerDownLeft className="w-4 h-4 text-green-400 mt-1" />
          <p>
            For <span className="text-white font-medium">test cases</span>, a single Enter is enough to move to a new line.
          </p>
        </div>

        <div className="flex items-start gap-3">
          <CheckCircle className="w-4 h-4 text-yellow-400 mt-1" />
          <p>
            If you want to show a test case to users for reference, simply <span className="text-white font-medium">check "Sample Testcase"</span>.
          </p>
        </div>

        <div className="flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-purple-400 mt-1" />
          <p>
            Use the <span className="text-white font-medium">AI tools below</span> to refine your problem statement, generate test cases, and suggest constraints.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* LEFT */}
        <div className="space-y-5">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Problem Title"
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none placeholder-gray-400"
          />
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Short Description"
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 h-20 placeholder-gray-400"
          />
          <textarea
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
            placeholder="Problem Statement"
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 h-28 placeholder-gray-400"
          />
          <textarea
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
            placeholder="Constraints"
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 h-24 placeholder-gray-400"
          />
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full p-3 bg-gradient-to-r from-teal-600 to-blue-600 text-black rounded-lg focus:outline-none"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        {/* RIGHT - TESTCASES */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 rounded-xl border border-white/10 shadow-lg max-h-[500px] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">Testcases</h2>

          {testcases.map((tc, index) => (
            <div key={index} className="bg-gray-800 p-4 mb-4 rounded-lg border border-gray-600 relative space-y-3 shadow-inner">
              <textarea
                value={tc.input}
                onChange={(e) => handleTestcaseChange(index, "input", e.target.value)}
                placeholder="Input"
                className="w-full p-2 bg-gray-700 rounded text-white h-20 placeholder-gray-400"
              />
              <textarea
                value={tc.output}
                onChange={(e) => handleTestcaseChange(index, "output", e.target.value)}
                placeholder="Expected Output"
                className="w-full p-2 bg-gray-700 rounded text-white h-20 placeholder-gray-400"
              />
              <input
                value={tc.explanation}
                onChange={(e) => handleTestcaseChange(index, "explanation", e.target.value)}
                placeholder="Explanation (optional)"
                className="w-full p-2 bg-gray-700 rounded text-white placeholder-gray-400"
              />
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={tc.sample}
                  onChange={(e) => handleTestcaseChange(index, "sample", e)}
                />
                Sample Testcase
              </label>
              {testcases.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTestcase(index)}
                  className="absolute top-2 right-2 text-red-400 text-xs hover:underline"
                >
                  ✕
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addTestcase}
            className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 rounded-lg text-white font-semibold mt-3"
          >
            Add Testcase
          </button>
        </div>
      </div>

      {showTab && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] text-white p-6 rounded-t-2xl z-50 transition-all shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">{tabTitle}</h2>
            <button onClick={() => setShowTab(false)} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          {loading ? (
            <p className="text-blue-400">⏳ Generating with AI...</p>
          ) : (
            <pre className="whitespace-pre-wrap text-sm max-h-64 overflow-y-auto">{aiResult}</pre>
          )}
        </div>
      )}

      {/* Submit Button */}
      <div className="text-center mt-10">
        <button
          type="submit"
          className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90 text-white text-lg rounded-full shadow-lg"
        >
          Submit Problem
        </button>
      </div>
    </form>
    
  );
};

export default AddProblem;
