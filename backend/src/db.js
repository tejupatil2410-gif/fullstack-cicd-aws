const { Pool } = require("pg");

/**
 * IMPORTANT:
 * - Do NOT test DB here
 * - Do NOT exit process here
 * - Env vars may not be loaded yet
 */

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false, // required for AWS RDS
  },
});

module.exports = pool;