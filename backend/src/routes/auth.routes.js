const express = require("express");
const upload = require("../middleware/upload.middleware");
const { register } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", upload.single("cv"), register);

module.exports = router;