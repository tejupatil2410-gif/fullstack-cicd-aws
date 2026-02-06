const express = require("express");
const cors = require("cors");
const { loadEnv } = require("./config/env");

async function startServer() {
  // 🔐 Load secrets FIRST
  await loadEnv();

  const app = express();

  // ✅ Enable CORS (this is enough)
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );

  // ✅ Body parser AFTER CORS
  app.use(express.json());

  // 🔍 Health check
  app.get("/health", (req, res) => {
    res.json({ status: "OK" });
  });

  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      service: "backend-api",
      version: "v2",
      deployedAt: new Date().toISOString(),
    });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Backend running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("❌ Failed to start server", err);
  process.exit(1);
});