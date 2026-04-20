const express = require("express");
const router = express.Router();

const {
  sendOTP,
  verifyOTPController,
} = require("../controllers/otp.controller");

// OTP ROUTES
router.post("/send-email-otp", sendOTP);
router.post("/verify-email-otp", verifyOTPController);

module.exports = router;