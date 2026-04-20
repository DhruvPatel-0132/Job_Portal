const express = require("express");
const router = express.Router();

const { login, register } = require("../controllers/auth.controller");

router.post("/login", login);
router.post("/register", register);

const sendOTPEmail = require("../services/email.service");
const { setOTP, verifyOTP, clearOTP } = require("../services/otp.service");
const User = require("../models/User");

// SEND OTP
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // 🔥 generate new OTP every time (resend included)
    const otp = await setOTP(email);

    await sendOTPEmail(email, otp);

    return res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// VERIFY OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const isValid = await verifyOTP(email, otp);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // ✅ UPDATE USER VERIFICATION STATUS
    const user = await User.findOneAndUpdate(
      { emailOrPhone: email },
      { isVerified: true },
      { returnDocument: "after" }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await clearOTP(email);

    return res.json({
      success: true,
      message: "OTP verified successfully",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
