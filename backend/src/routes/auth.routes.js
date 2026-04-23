const express = require("express");
const router = express.Router();

const { login, register, googleLogin } = require("../controllers/auth.controller");
const { getMe } = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/login", login);
router.post("/register", register);

/* 🔥 ADD THIS */
router.get("/me", authMiddleware, getMe);
// google auth
router.post("/google", googleLogin);

module.exports = router;
