import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Problems from './pages/Problems'
import Competitions from './pages/Competitions'
import Problem from './pages/Problem'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'
import AddProblem from './pages/AddProblem'
import MyProblems from './pages/MyProblems'
import EditProblem from './pages/EditProblem'
import ProblemPage from './pages/ProblemPage'
import SolvedProblems from './pages/SolvedProblems'

function App() {


  return (
    <div>
      <Toaster/>
      <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/problems' element={<Problems/>} />
        <Route path='/competitions' element={<Competitions/>} />
        <Route path="/add-problem" element={<AddProblem />} />
        <Route path='/problems/:id' element={<Problem/>} />
        <Route path="/my-problems" element={<MyProblems />} />
        <Route path="/edit-problem/:id" element={<EditProblem />} />
        <Route path="/problem/:id" element={<ProblemPage />} />
        <Route path="/problems-solved" element={<SolvedProblems />} />
      </Routes>

      <Footer/>
    </div>
  )
}

export default App
