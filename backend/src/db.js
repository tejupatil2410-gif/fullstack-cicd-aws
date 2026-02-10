const { Pool } = require("pg");

let pool;

/**
 * Initialize PostgreSQL connection pool
 * Called once after env vars are loaded
 */
function initDB() {
  if (pool) return pool;

  pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    ssl: {
      rejectUnauthorized: false, // required for AWS RDS
    },
  });

  pool
    .query("SELECT 1")
    .then(() => console.log("✅ PostgreSQL connected"))
    .catch((err) => {
      console.error("❌ PostgreSQL connection failed", err);
      process.exit(1);
    });

  return pool;
}

module.exports = { initDB };