import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";

const MyProblems = () => {
  const { getToken } = useAuth();
  const [myProblems, setMyProblems] = useState([]);

  const fetchMyProblems = async () => {
    const token = await getToken();
    const res = await fetch("http://localhost:5000/api/problem/my-problems", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setMyProblems(data);
  };

  const deleteProblem = async (id) => {
    const token = await getToken();
    const res = await fetch(`http://localhost:5000/api/problem/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setMyProblems((prev) => prev.filter((p) => p._id !== id));
    }
  };

  useEffect(() => {
    fetchMyProblems();
  }, []);

  return (
    <div className="pt-28 px-4 md:px-16 text-white min-h-screen bg-[#0d0d0d]">
      <h1 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-2">
        My Problems
      </h1>

      {myProblems.length === 0 ? (
        <p className="text-gray-500">No problems created yet.</p>
      ) : (
        <div className="space-y-5">
          {myProblems.map((p) => (
            <div
              key={p._id}
              className="bg-[#161616] border border-gray-700 rounded-lg p-4 shadow-sm hover:shadow transition-shadow"
            >
              <h2 className="text-lg font-semibold text-gray-200 mb-1">
                {p.title}
              </h2>
              <p className="text-gray-400 text-sm mb-3">{p.desc}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    window.location.href = `/edit-problem/${p._id}`;
                  }}
                  className="text-xs px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProblem(p._id)}
                  className="text-xs px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProblems;
