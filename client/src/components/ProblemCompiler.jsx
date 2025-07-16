import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProblemStatement from "./ProblemStatement";
import CodeEditor from "./CodeEditor";

const ProblemCompiler = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);

  useEffect(() => {
    const fetchProblem = async () => {
      const res = await fetch(`http://localhost:5000/api/problem/${id}`);
      const data = await res.json();
      setProblem(data);
    };
    fetchProblem();
  }, [id]);

  if (!problem) return <p className="text-white p-4">Loading...</p>;

  return (
    <div className="flex pt-4 h-[calc(98vh-4rem)]">
      <div className="w-1/2 h-full custom-scroll overflow-auto bg-[#1e1e1e] text-white p-6">
        <ProblemStatement id={id} />
      </div>

      <div className="w-1/2 h-full custom-scroll overflow-auto bg-[#121212] text-white p-6">
        <CodeEditor testcases={problem.testcase } problemId={problem._id} /> {/* ✅ PASS HERE */}
      </div>
    </div>
  );
};

export default ProblemCompiler;
