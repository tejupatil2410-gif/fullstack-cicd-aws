const { Pool } = require("pg");

// ⚠️ IMPORTANT
// Do NOT use dotenv here in production
// Your loadEnv() already loads vars from SSM

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,

  // ✅ REQUIRED for AWS RDS
  ssl: {
    rejectUnauthorized: false,
  },

  // ✅ Prevent hanging connections
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// ✅ Test DB connection ONCE at startup
(async () => {
  try {
    await pool.query("SELECT 1");
    console.log("✅ PostgreSQL connected successfully");
  } catch (err) {
    console.error("❌ PostgreSQL connection failed", err);
    process.exit(1); // crash app if DB is not reachable
  }
})();

module.exports = pool;