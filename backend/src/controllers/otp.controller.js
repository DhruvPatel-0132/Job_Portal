const sendOTPEmail = require("../services/email.service");
const { setOTP, verifyOTP, clearOTP } = require("../services/otp.service");
const User = require("../models/User");

// SEND OTP
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

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
};

// VERIFY OTP
const verifyOTPController = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const isValid = await verifyOTP(email, otp);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

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
};

module.exports = {
  sendOTP,
  verifyOTPController,
};