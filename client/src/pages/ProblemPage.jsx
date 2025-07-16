import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProblemCompiler from "../components/ProblemCompiler";

const ProblemPage = () => {
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

  if (!problem) return <div className="p-8">Loading problem...</div>;

  return(
    <div className="">
        <br></br>
        <br></br>
        <br></br>
      <ProblemCompiler problem={problem} />
    </div>
  );
};

export default ProblemPage;
