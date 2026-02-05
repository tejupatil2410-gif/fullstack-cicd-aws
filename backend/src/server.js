const express = require("express");
const { loadEnv } = require("./config/env");

async function startServer() {
  // 🔐 Load secrets FIRST
  await loadEnv();

  const app = express();
  app.use(express.json());

  app.get("/health", (req, res) => {
    res.json({ status: "OK" });
  });

  const PORT = process.env.PORT || 3000;
  app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'backend-api',
    version: 'v2',
    deployedAt: new Date().toISOString()
  });
});

  app.listen(PORT, () => {
    console.log(`🚀 Backend running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("❌ Failed to start server", err);
  process.exit(1);
});