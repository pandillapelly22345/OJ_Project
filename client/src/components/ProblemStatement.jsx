import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { getSubmissions } from '../api/code';
import { useAuth } from "@clerk/clerk-react";
import { fetchComments, postComment } from "../api/comment";

const ProblemStatement = ({ id }) => {
  const [problem, setProblem] = useState(null);
  const [selectedTab, setSelectedTab] = useState("problem");
  const [submissions, setSubmissions] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const { getToken } = useAuth();

  const fetchAllComments = async () => {
    const data = await fetchComments(id);
    setComments(data);
  };

  useEffect(() => {
    const fetchProblem = async () => {
      const res = await fetch(`http://localhost:5000/api/problem/${id}`);
      const data = await res.json();
      setProblem(data);
    };

    fetchProblem();
  }, [id]);

  useEffect(() => {
    const fetchSubs = async () => {
      const token = await getToken();
      const data = await getSubmissions(id, token);
      setSubmissions(data);
    };

    fetchSubs();
  }, [id, getToken]);

  useEffect(() => {
    if (selectedTab === "comment") fetchAllComments();
  }, [selectedTab, id]);

  useEffect(() => {
    if (selectedTab === "comment") fetchAllComments();
  }, [selectedTab, id]);

  if (!problem) return <p>Loading...</p>;

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    const token = await getToken();
    await postComment(id, commentText, token);
    setCommentText("");
    fetchAllComments(); // refresh comments
  };

  const downloadCode = (code, language) => {
    const extensionMap = {
      cpp: "cpp",
      py: "py",
      c: "c",
    };

    const extension = extensionMap[language] || "txt";
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `submission.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-700 mb-4">
        {["problem", "submission", "comment"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 font-semibold capitalize border-b-2 transition-all duration-200 ${
              selectedTab === tab
                ? "border-blue-500 text-white"
                : "border-transparent text-gray-400 hover:text-white"
            }`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {selectedTab === "problem" && (
        <div className="space-y-6 text-white leading-relaxed">
          {/* Problem Title */}
          <h1 className="text-3xl font-bold text-white">
            {problem.title}
          </h1>

          {/* Problem Statement */}
          <div>
            <h2 className="text-xl font-semibold text-purple-400 mb-2">Problem Description</h2>
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
              {problem.statement}
            </ReactMarkdown>
          </div>

          {/* Constraints */}
          {problem.constraints && (
            <div>
              <h2 className="text-xl font-semibold text-pink-400 mb-2">Constraints</h2>
              <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                {problem.constraints}
              </ReactMarkdown>
            </div>
          )}

          {/* Test Cases */}
          <div>
            <h2 className="text-xl font-semibold">Test Cases</h2>
            {problem.testcase
              ?.filter((tc) => tc.sample) // ✅ Only show sample test cases
              .map((tc, idx) => (
                <div
                  key={idx}
                  className={`space-y-4 pb-4 ${
                    idx !== problem.testcase.filter((t) => t.sample).length - 1
                      ? "border-b border-gray-700"
                      : ""
                  }`}
                >
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Input</p>
                    <pre className="bg-[#0f1117] text-white p-3 rounded-md whitespace-pre-wrap">
                      {tc.input}
                    </pre>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-1">Expected Output</p>
                    <pre className="bg-[#0f1117] text-white p-3 rounded-md whitespace-pre-wrap">
                      {tc.output}
                    </pre>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {selectedTab === "submission" && (
        <div className="mt-4 text-white">
          <h2 className="text-xl font-semibold mb-4">Previous Submissions</h2>
          <ul className="space-y-4">
            {submissions.map((sub, idx) => (
              <li
                key={idx}
                className="bg-[#1f1f1f] border border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-400">
                    {new Date(sub.submittedAt).toLocaleString()}
                  </p>
                  
                  <span
                    className={`px-3 py-1 text-sm rounded-full font-semibold ${
                      sub.verdict === "ac"
                        ? "bg-green-700 text-green-100"
                        : "bg-red-700 text-red-100"
                    }`}
                  >
                    {sub.verdict === "ac" ? "✅ Accepted" : "❌ Not Accepted"}
                  </span>
                </div>

                {/* Show summary output if available */}
                {sub.output && (
                  <div className="bg-[#111] text-sm rounded p-3 mb-2 text-gray-300 font-mono">
                    Summary: {sub.output}
                  </div>
                )}
                <button
                  onClick={() => downloadCode(sub.code, sub.language)}
                  className="text-xs px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600 transition-all"
                >
                   Download Code
                </button>

                {/* Show detailed test case outputs */}
                {/* {sub.outputs && sub.outputs.length > 0 && (
                  <div className="space-y-3">
                    {sub.outputs.map((test, i) => (
                      <div key={i} className="bg-[#111] p-3 rounded text-sm font-mono text-gray-200 border border-gray-700">
                        <p className="text-yellow-300 font-semibold mb-1">Test Case {i + 1}</p>
                        <p><span className="text-gray-400">Input:</span> {test.input}</p>
                        <p><span className="text-gray-400">Expected:</span> {test.expected}</p>
                        <p><span className="text-gray-400">Actual:</span> {test.actual}</p>
                      </div>
                    ))}
                  </div>
                )} */}
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedTab === "comment" && (
        <div className="text-gray-300">
          <h2 className="text-l font-semibold mb-4">Comments</h2>
          <div className="">
            <textarea
              className="w-full px-3 py-1.5 bg-gray-800 text-gray-300 border border-gray-600 rounded text-sm resize-none"
              rows="3"
              placeholder="Write your comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            ></textarea>
            <button
              className="text-xs px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600 transition-all"
              onClick={handlePostComment}
            >
              Post Comment
            </button>
          </div>

          <ul className="mt-6 space-y-4">
            {comments.map((c, i) => (
              <li key={i} className="border-t border-gray-600 pt-2">
                <p className="text-sm text-gray-400">{new Date(c.postedAt).toLocaleString()}</p>
                <p>{c.content}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProblemStatement;
