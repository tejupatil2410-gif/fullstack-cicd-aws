const { getSSMParameter } = require("./ssm");

async function loadEnv() {
  // ======================
  // ✅ DATABASE (RDS)
  // ======================
  process.env.DB_HOST = await getSSMParameter("/backend/DB_HOST");
  process.env.DB_USER = await getSSMParameter("/backend/DB_USER");
  process.env.DB_PASSWORD = await getSSMParameter("/backend/DB_PASSWORD");
  process.env.DB_NAME = await getSSMParameter("/backend/DB_NAME");
  process.env.DB_PORT = await getSSMParameter("/backend/DB_PORT");

  // ======================
  // ✅ AWS
  // ======================
  process.env.AWS_REGION = await getSSMParameter("/dev/app/aws/region");

  // ======================
  // ✅ AUTH (keep for later)
  // ======================
  process.env.JWT_SECRET = await getSSMParameter("/dev/app/jwt/secret");

  // 🔎 DEBUG (temporary – remove later)
  console.log("DB_HOST =", process.env.DB_HOST);
  console.log("DB_USER =", process.env.DB_USER);
  console.log("DB_NAME =", process.env.DB_NAME);
  console.log("DB_PORT =", process.env.DB_PORT);

  console.log("✅ Secrets loaded from AWS SSM");
}

module.exports = { loadEnv };
