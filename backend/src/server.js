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

  const multer = require("multer");

// store file in memory (later you can upload to S3)
const upload = multer({ storage: multer.memoryStorage() });

// ✅ User registration endpoint
app.post("/register", upload.single("cv"), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const cvFile = req.file;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    console.log("New user registration:");
    console.log({ name, email });
    console.log("CV file:", cvFile?.originalname);

    // 🔜 Later:
    // - upload CV to S3
    // - hash password
    // - insert into PostgreSQL

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});


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