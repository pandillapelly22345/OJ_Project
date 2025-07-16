import React, { useEffect, useState } from 'react'
import { useUser, SignInButton, SignUpButton } from "@clerk/clerk-react";
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { fetchUserSolvedStats } from "../api/code";
import { ShieldCheck, Rocket, Code2, Users } from "lucide-react";
import { Github, Twitter, Mail } from "lucide-react";


const HomePage = () => {
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const { isSignedIn } = useUser();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/problem`)
        const data = await response.json()
        setProblems(data)
        setLoading(false)
      } catch (err) {
        console.error('Failed to fetch problems:', err)
      }
    }

    fetchProblems()
  }, [])

  useEffect(() => {
    const fetchStats = async () => {
      if (!isSignedIn) return;
      const token = await window.Clerk.session.getToken();
      const res = await fetchUserSolvedStats(token);
      setStats(res);
    };
    fetchStats();
  }, [isSignedIn]);


  return (
    <div className="pt-28 px-6 md:px-16 lg:px-36 ">
      {/* Top banner image */}
      <div className="text-center py-20 mb-12 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 rounded-2xl shadow-xl ">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-wide animate-pulse">
          Code <span className="text-black bg-white px-4 py-1 rounded-lg shadow-md">Rush 🚀</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-white/90 max-w-xl mx-auto">
          Fuel your brain. Conquer problems. Climb the leaderboard.
        </p>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Sharpen Your Coding Skills</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Solve real-world coding challenges and level up your problem-solving skills in our curated practice arena.
        </p>
      </div>

      <div className="px-6 md:px-20 lg:px-36 py-16 text-white font-mono">
        <h2 className="text-4xl font-extrabold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          Why Choose Our Platform?
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Feature 1 */}
          <div className="flex flex-col items-center text-center space-y-3">
            <Rocket className="w-10 h-10 text-blue-400" />
            <h3 className="text-lg font-semibold">Fast Code Execution </h3>
            <p className="text-sm text-gray-400">
              Get instant feedback on your code with our optimized execution engine. And AI powered
            </p>
          </div>


          {/* Feature 2 */}
          <div className="flex flex-col items-center text-center space-y-3">
            <ShieldCheck className="w-10 h-10 text-green-400" />
            <h3 className="text-lg font-semibold">Secure & Fair</h3>
            <p className="text-sm text-gray-400">
              Submissions are sandboxed to ensure security and prevent unfair advantages.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center text-center space-y-3">
            <Code2 className="w-10 h-10 text-yellow-400" />
            <h3 className="text-lg font-semibold">Real Coding Challenges</h3>
            <p className="text-sm text-gray-400">
              Problems designed by developers, for developers. From beginner to advanced.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="flex flex-col items-center text-center space-y-3">
            <Users className="w-10 h-10 text-pink-400" />
            <h3 className="text-lg font-semibold">Community Driven</h3>
            <p className="text-sm text-gray-400">
              Discuss, share, and grow with other passionate coders across the world.
            </p>
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-semibold mb-6 font-mono text-center">Your Status</h1>
      <div className="rounded-l border border-gray-800 bg-[#111111] shadow-lg p-8">
        {isSignedIn ? (
          stats && (
            <>
              
                
                  <h2 className="text-5xl font-extrabold text-center mb-2 text-green-400">
                    {stats.totalSolved}
                  </h2>
                  <p className="text-center text-lg text-white mb-6 font-medium tracking-wide">
                    ✓ Solved
                  </p>

                  <div className="grid grid-cols-3 gap-10 text-center">
                    <div className="rounded-lg border border-green-500 py-3">
                      <p className="text-green-400 font-bold text-sm">Easy</p>
                      <p className="text-white text-xl font-semibold">{stats.easy}</p>
                    </div>
                    <div className="rounded-lg border border-yellow-400 py-3">
                      <p className="text-yellow-400 font-bold text-sm">Medium</p>
                      <p className="text-white text-xl font-semibold">{stats.medium}</p>
                    </div>
                    <div className="rounded-lg border border-red-500 py-3">
                      <p className="text-red-400 font-bold text-sm">Hard</p>
                      <p className="text-white text-xl font-semibold">{stats.hard}</p>
                    </div>
                  </div>
                
              
            </>
          )
        ) : (
          <>
            <h2 className="text-xl font-bold mb-2 text-center">🚀 Start Solving Coding Problems</h2>
            <p className="text-gray-400 mb-4 text-center">
              Sign in to track your progress and unlock all features.
            </p>
            <div className="flex justify-center gap-4">
              <SignInButton mode="modal">
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white rounded font-semibold">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-green-600 hover:bg-green-700 px-4 py-2 text-white rounded font-semibold">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </>
        )}
      </div>

      <br></br>
      <br></br>
      <h1 className="text-2xl font-semibold mb-6 font-mono">Select a problem to solve</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.slice(0, 12).map((problem) => (
            <Link
              key={problem._id}
              to={`/problem/${problem._id}`}
              className="p-6 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl transition duration-200 shadow-md"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">{problem.title}</h3>
                <span
                  className={`text-sm font-medium px-2 py-1 rounded-full ${
                    problem.difficulty === 'Easy'
                      ? 'bg-green-600 text-white'
                      : problem.difficulty === 'Medium'
                      ? 'bg-yellow-500 text-white'
                      : 'bg-red-600 text-white'
                  }`}
                >
                  {problem.difficulty}
                </span>
              </div>
              <p className="text-sm text-gray-300 mt-2 line-clamp-2">{problem.description}</p>
            </Link>
          ))}
        </div>
      )}

      <footer className="mt-20 px-6 md:px-20 lg:px-36 py-10 border-t border-white/10 text-gray-400 font-mono text-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Left Side */}
          <div className="text-center md:text-left">
            <p className="text-lg font-semibold text-white">⚡ CodeRush</p>
            <p className="text-xs mt-1">Built for coders, by coders.</p>
          </div>

          {/* Navigation */}
          <div className="flex space-x-6">
            <Link to="/problems" className="hover:text-white transition">Problems</Link>
            <Link to="/my-problems" className="hover:text-white transition">My Submissions</Link>
            <Link to="/about" className="hover:text-white transition">About</Link>
          </div>

          {/* Social Links */}
          <div className="flex space-x-5">
            <a
              href="https://github.com/pandillapelly22345"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/harshvardhini345/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="mailto:harshvardhini91@gmail.com"
              className="hover:text-white transition"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        <p className="text-center text-xs mt-6 text-gray-500">
          © {new Date().getFullYear()} CodeRush. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

export default HomePage
