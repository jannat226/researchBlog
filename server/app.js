// server/app.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import auth and blog routes
const authRoutes = require("./routes/auth");
const blogRoutes = require("./routes/blog");

const app = express();

// Enhanced CORS configuration
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth routes
app.use("/api/auth", authRoutes);
// Blog routes
app.use("/api/blogs", blogRoutes);

// Simple root route - this should fix the 403 error
app.get("/", (req, res) => {
  res.json({
    message: "🚀 Blog API is running successfully!",
    timestamp: new Date().toISOString(),
    endpoints: ["POST /api/auth/register", "POST /api/auth/login"],
  });
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Blog Platform API",
    database:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}`);
});
