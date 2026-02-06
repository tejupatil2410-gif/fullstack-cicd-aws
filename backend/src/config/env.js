const { getSSMParameter } = require("./ssm");

async function loadEnv() {
  process.env.DB_HOST = await getSSMParameter("/dev/app/db/host");
  process.env.DB_USER = await getSSMParameter("/dev/app/db/user");
  process.env.DB_PASSWORD = await getSSMParameter("/dev/app/db/password");
  process.env.JWT_SECRET = await getSSMParameter("/dev/app/jwt/secret");

  // ✅ FIX: Load AWS_REGION from SSM
  process.env.AWS_REGION = await getSSMParameter("/dev/app/aws/region");

  console.log("✅ Secrets loaded from AWS SSM");
}

module.exports = { loadEnv };
