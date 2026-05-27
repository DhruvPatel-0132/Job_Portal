const express = require("express");
const router = express.Router();

const { 
  login, 
  register, 
  googleLogin, 
  logoutController, 
  refresh,
  validatePassword,
  sendPasswordOtp,
  verifyPasswordOtp,
  changePassword 
} = require("../controllers/auth.controller");
const { getMe, getAllUsers, updateOnboarding, updateRole } = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/login", login);
router.post("/register", register);

/* 🔥 ADD THIS */
router.get("/me", authMiddleware, getMe);
router.get("/users", authMiddleware, getAllUsers);
router.put("/update-onboarding", authMiddleware, updateOnboarding);
router.put("/update-role", authMiddleware, updateRole);
// google auth
router.post("/google", googleLogin);
router.post("/logout", logoutController);
router.post("/refresh-token", refresh);

// Change password flow
router.post("/validate-password", authMiddleware, validatePassword);
router.post("/send-otp", authMiddleware, sendPasswordOtp);
router.post("/verify-otp", authMiddleware, verifyPasswordOtp);
router.post("/change-password", authMiddleware, changePassword);

module.exports = router;
