const express = require("express");
const router = express.Router();

const {
  forgotPassword,
  verifyOtp,
  resetPassword,
  resetPasswordWithOtp,
} = require("../controllers/forgot.controller");

router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.post("/reset-password-otp", resetPasswordWithOtp); // phone

module.exports = router;