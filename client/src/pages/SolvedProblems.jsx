// pages/SolvedProblems.jsx

import React, { useEffect, useState } from "react";
import { fetchUserSolvedStats } from "../api/code";
import { useAuth } from "@clerk/clerk-react";

const SolvedProblems = () => {
  const [problems, setProblems] = useState([]);
  const { getToken } = useAuth();

  useEffect(() => {
    const load = async () => {
      const token = await getToken();
      const data = await fetchUserSolvedStats(token);
      setProblems(data.problems);
    };
    load();
  }, []);

  return (
    <div className="p-6 text-white pt-28 px-6 md:px-16 lg:px-36">
      <h1 className="text-2xl font-bold mb-4">Solved Problems</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {problems.map((p) => (
          <div key={p._id} className="bg-[#1c1c1c] rounded p-4 border border-gray-700">
            <h3 className="text-lg font-bold">{p.title}</h3>
            <p
              className={`text-sm font-semibold ${
                p.difficulty === "Easy"
                  ? "text-green-400"
                  : p.difficulty === "Medium"
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              {p.difficulty}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SolvedProblems;
