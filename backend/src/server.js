const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { loadEnv } = require("./config/env");
const { initDB } = require("./db"); // ✅ DB connection

async function startServer() {
  // 🔐 Load secrets FIRST (SSM / env vars)
  await loadEnv();
  const db = initDB(); // 2️⃣ THEN connect to DB
  
  console.log("DB_HOST =", process.env.DB_HOST);
  console.log("DB_USER =", process.env.DB_USER);
  console.log("DB_NAME =", process.env.DB_NAME);
  console.log("DB_PORT =", process.env.DB_PORT);


  // ✅ NOW test DB (env vars are available)
try {
  await pool.query("SELECT 1");
  console.log("✅ PostgreSQL connected");
} catch (err) {
  console.error("❌ PostgreSQL connection failed", err);
  process.exit(1); // safe to exit here
}

  const app = express();

  // ======================
  // ✅ CORS CONFIG (STABLE)
  // ======================
  const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:4173",
    "http://fullstack-cicd-frontend-prod.s3-website-us-east-1.amazonaws.com",
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(null, false);
      },
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
      optionsSuccessStatus: 204,
    })
  );

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
  // ✅ REGISTER API (S3 + RDS)
  // ======================
  app.post("/api/register", upload.single("cv"), async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const file = req.file;

      if (!name || !email || !password || !file) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // 🔹 Upload CV to S3
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

      // 🔹 Insert user into PostgreSQL
      await pool.query(
        `INSERT INTO users (name, email, password, cv_url)
         VALUES ($1, $2, $3, $4)`,
        [name, email, password, fileUrl]
      );

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