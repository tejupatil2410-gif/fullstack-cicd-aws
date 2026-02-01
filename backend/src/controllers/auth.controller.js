const pool = require("../db");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const cv = req.file?.path;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, cv_url)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [name, email, hashedPassword, cv]
    );

    res.status(201).json({
      message: "User registered successfully",
      userId: result.rows[0].id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
