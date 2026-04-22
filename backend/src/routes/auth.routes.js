const express = require("express");
const router = express.Router();

const { login, register, googleLogin } = require("../controllers/auth.controller");

router.post("/login", login);
router.post("/register", register);

// google auth
router.post("/google", googleLogin);
module.exports = router;
