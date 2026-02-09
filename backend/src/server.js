const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { loadEnv } = require("./config/env");

async function startServer() {
  // 🔐 Load secrets FIRST (SSM / env vars)
  await loadEnv();

  const app = express();

  // ======================
  // ✅ CORS CONFIG (FINAL)
  // ======================
  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:4173",
    "http://fullstack-cicd-frontend-prod.s3-website-us-east-1.amazonaws.com",
  ];

  app.use(
    cors({
      origin: function (origin, callback) {
        // Allow requests with no origin (curl, server-to-server, preflight)
        if (!origin) {
          return callback(null, true);
        }

        // Allow only known origins
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        // ❌ IMPORTANT: do NOT throw error
        // Just reject silently
        return callback(null, false);
      },
      credentials: true,
    })
  );
  app.options("/api/*", cors());
  
  // ======================
  // ✅ BODY PARSER
  // ======================
  app.use(express.json());

  // ======================
  // ✅ MULTER (FILE UPLOAD)
  // ======================
  const upload = multer({
    storage: multer.memoryStorage(),
  });

  // ======================
  // ✅ S3 CLIENT
  // ======================
  const s3 = new S3Client({
    region: process.env.AWS_REGION,
  });

  // ======================
  // 🔍 HEALTH CHECKS
  // ======================
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

  // ======================
  // ✅ REGISTER API
  // ======================
  app.post("/api/register", upload.single("cv"), async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const file = req.file;

      if (!name || !email || !password || !file) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const fileKey = `cvs/${Date.now()}-${file.originalname}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: "user-cv-uploads-tejaswi",
          Key: fileKey,
          Body: file.buffer,
          ContentType: file.mimetype,
        })
      );

      const fileUrl = `https://user-cv-uploads-tejaswi.s3.amazonaws.com/${fileKey}`;
      console.log("✅ CV uploaded to S3:", fileUrl);

      return res.status(201).json({
        message: "User registered successfully",
        cvUrl: fileUrl,
      });
    } catch (err) {
      console.error("❌ Registration error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // ======================
  // 🚀 START SERVER
  // ======================
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Backend running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("❌ Failed to start server", err);
  process.exit(1);
});