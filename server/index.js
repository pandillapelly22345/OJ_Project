const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { ClerkExpressRequireAuth } = require("@clerk/express");
const problemRoutes = require("./routes/problem");
const runRoutes = require("./routes/run");

dotenv.config();

require("./jobQueue");

const app = express();
app.use(cors({ 
  origin: ["http://localhost:5173", "https://oj-project-green.vercel.app"],
  credentials: true
}));

app.use(express.json());

// Optional: for testing route
app.get("/", (req, res) => {
  res.send("Backend running");
});

app.use("/api/problem", problemRoutes); // no auth here; handle inside route
app.use("/api/run", runRoutes);
app.use("/api/comment", require("./routes/comment"));
app.use("/api", require("./routes/aiProblemTools"));



// DB connection
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

startServer();
