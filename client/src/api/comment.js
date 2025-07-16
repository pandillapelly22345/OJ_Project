// api/comment.js
import axios from "axios";

export const fetchComments = async (problemId) => {
  const res = await axios.get(`http://localhost:5000/api/comment/${problemId}`);
  return res.data;
};

export const postComment = async (problemId, content, token) => {
  const res = await axios.post(
    `http://localhost:5000/api/comment/${problemId}`,
    { content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
