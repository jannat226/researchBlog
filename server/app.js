// server/app.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
console.log("MONGO_URI:", process.env.MONGO_URI);

const cors = require("cors");

// Import auth routes
const authRoutes = require("./routes/auth");

const app = express();
app.use(cors());
app.use(express.json());

// Auth routes
app.use("/api/auth", authRoutes);

// Simple root route
app.get("/", (req, res) => res.send("Blog API Running"));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
