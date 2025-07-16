import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

const EditProblem = () => {
  const { id } = useParams();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);

  useEffect(() => {
    const fetchProblem = async () => {
      const res = await fetch(`http://localhost:5000/api/problem`);
      const data = await res.json();
      const found = data.find((p) => p._id === id);
      setProblem(found);
    };

    fetchProblem();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = await getToken();

    const res = await fetch(`http://localhost:5000/api/problem/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(problem),
    });

    if (res.ok) {
      alert("✅ Problem updated!");
      navigate("/my-problems");
    } else {
      alert("❌ Update failed.");
    }
  };

  if (!problem) return <div className="pt-32 text-white">Loading...</div>;

  return (
    <form onSubmit={handleUpdate} className="max-w-3xl mx-auto p-6 pt-32 space-y-6 text-white">
      <h2 className="text-3xl font-bold text-center mb-6">Edit Problem</h2>

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold mb-1">Title</label>
        <input
          type="text"
          value={problem.title}
          onChange={(e) => setProblem({ ...problem, title: e.target.value })}
          placeholder="Problem Title"
          className="w-full bg-gray-800 p-3 rounded border border-gray-600"
        />
      </div>

      {/* Short Description */}
      <div>
        <label className="block text-sm font-semibold mb-1">Short Description</label>
        <textarea
          value={problem.desc}
          onChange={(e) => setProblem({ ...problem, desc: e.target.value })}
          placeholder="Short description..."
          className="w-full bg-gray-800 p-3 rounded border border-gray-600 min-h-[60px]"
        />
      </div>

      {/* Full Statement */}
      <div>
        <label className="block text-sm font-semibold mb-1">Full Problem Statement</label>
        <textarea
          value={problem.statement}
          onChange={(e) => setProblem({ ...problem, statement: e.target.value })}
          placeholder="Full problem statement..."
          className="w-full bg-gray-800 p-3 rounded border border-gray-600 min-h-[120px]"
        />
      </div>

      {/* Constraints */}
      <div>
        <label className="block text-sm font-semibold mb-1">Constraints</label>
        <textarea
          value={problem.constraints}
          onChange={(e) => setProblem({ ...problem, constraints: e.target.value })}
          placeholder="Add problem constraints..."
          className="w-full bg-gray-800 p-3 rounded border border-gray-600 min-h-[60px]"
        />
      </div>

      {/* Difficulty */}
      <div>
        <label className="block text-sm font-semibold mb-1">Difficulty</label>
        <select
          value={problem.difficulty}
          onChange={(e) => setProblem({ ...problem, difficulty: e.target.value })}
          className="w-full bg-gray-800 p-3 rounded border border-gray-600"
        >
          <option value="">Select Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {/* Update Button */}
      <div className="text-center">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-8 py-2 rounded-full text-white font-semibold transition"
        >
          Update Problem
        </button>
      </div>
    </form>
  );
};

export default EditProblem;
