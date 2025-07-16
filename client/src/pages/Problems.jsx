import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const difficultyColor = {
  Easy: 'text-green-400',
  Medium: 'text-yellow-400',
  Hard: 'text-red-500',
};

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const location = useLocation();

  const query = new URLSearchParams(location.search).get("search")?.toLowerCase() || "";

  useEffect(() => {
    const fetchProblems = async () => {
      const res = await fetch("http://localhost:5000/api/problem");
      const data = await res.json();
      setProblems(data);
    };

    fetchProblems();
  }, []);

  useEffect(() => {
    if (query) {
      setFiltered(problems.filter(p => p.title.toLowerCase().includes(query)));
    } else {
      setFiltered(problems);
    }
  }, [problems, query]);

  return (
    <div className="pt-28 px-6 md:px-16 lg:px-36 font-mono text-white">
      {/* Header */}
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-10 text-center">
        🚀 Explore Coding Problems
      </h1>

      {/* Card Container */}
      <div className="max-w-5xl mx-auto">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        {/* Table Header */}
        <div className="grid grid-cols-2 px-6 py-4 bg-white/10 border-b border-white/10 text-sm font-semibold text-gray-400 uppercase tracking-wide">
          <span>Title</span>
          <div className="flex justify-end space-x-5">
            <span>Difficulty</span>
            <span>Acceptance</span>
          </div>
        </div>

        {/* Problem Rows */}
        {filtered.map((problem, index) => (
            <Link
              key={problem._id}
              to={`/problem/${problem._id}`}
              className="grid grid-cols-2 px-6 py-5 hover:bg-white/10 transition-all duration-150 border-b border-white/5"
            >
              <div className="flex gap-2 items-center">
                <span className="text-gray-300">{index + 1}.</span>
                <span className="text-white font-medium">{problem.title}</span>
              </div>

              <div className="flex justify-end items-center space-x-25 text-sm">
                <span className={`font-semibold ${difficultyColor[problem.difficulty] || 'text-white'}`}>
                  {problem.difficulty}
                </span>
                <span className="text-gray-300">
                  {problem.accuracy || `${(Math.random() * 30 + 40).toFixed(1)}%`}
                </span>
              </div>
            </Link>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-6 text-gray-400">No problems found.</div>
          )}
      </div>
      </div>
    </div>
  );
};

export default Problems;
