// src/api/code.js
import axios from 'axios';

export const submitCode = async ({ code, language, problemId, userInput, token }) => {
  const response = await axios.post(
    'http://localhost:5000/api/run/submit',
    { code, language, problemId, userInput },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return response.data.jobId;
};

export const getJobStatus = async (jobId) => {
  const response = await axios.get(`http://localhost:5000/api/run/status/${jobId}`);
  return response.data.job;
};

export const getSubmissions = async (problemId, token) => {
  const response = await axios.get(`http://localhost:5000/api/run/submission/${problemId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(response.data)
  return response.data;
  
};

export const fetchUserSolvedStats = async (token) => {
  const res = await axios.get("http://localhost:5000/api/problem/user/solved", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
