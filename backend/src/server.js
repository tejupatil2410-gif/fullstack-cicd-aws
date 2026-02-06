const express = require("express");
const cors = require("cors");
const { loadEnv } = require("./config/env");

async function startServer() {
  // 🔐 Load secrets FIRST (SSM, env, etc.)
  await loadEnv();

  const app = express();

  /**
   * ✅ Production-ready CORS configuration
   * Allows:
   *  - Local development frontend
   *  - S3 static website frontend
   */
  const allowedOrigins = [
    "http://localhost:5173",
    "http://fullstack-cicd-frontend-prod.s3-website-us-east-1.amazonaws.com",
  ];

  app.use(
    cors({
      origin: function (origin, callback) {
        // Allow server-to-server calls (curl, Postman, health checks)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    })
  );

  // ✅ Parse JSON after CORS
  app.use(express.json());

  // 🔍 Health check (used by curl / ALB / monitoring)
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

  // 🚀 Start server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Backend running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("❌ Failed to start server", err);
  process.exit(1);
});