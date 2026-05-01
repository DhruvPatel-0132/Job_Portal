const express = require("express");
const router = express.Router();

const { login, register, googleLogin, logoutController, refresh } = require("../controllers/auth.controller");
const { getMe } = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/login", login);
router.post("/register", register);

/* 🔥 ADD THIS */
router.get("/me", authMiddleware, getMe);
// google auth
router.post("/google", googleLogin);
router.post("/logout", logoutController);
router.post("/refresh-token", refresh);

module.exports = router;
