const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/health", (req, res) => {
  res.json({ status: "Backend is running" });
});

// 🔥 THIS LINE IS CRITICAL
app.use("/api", authRoutes);

module.exports = app;
