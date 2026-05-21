const { sendOTPEmail } = require("../services/email.service");
const { setOTP, verifyOTP, clearOTP } = require("../services/otp.service");
const User = require("../models/User");

// SEND OTP
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const otp = await setOTP(email);

    await sendOTPEmail(email, otp);

    return res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (err) {
    console.error("EMAIL ERROR:", err); // 👈 VERY IMPORTANT

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
    
    // Generate tokens
    const { generateAccessToken, generateRefreshToken, hashToken, REFRESH_TOKEN_EXPIRY_MS } = require("../utils/generateTokens");
    const Token = require("../models/Token");

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();

    await Token.create({
      userId: user._id,
      emailOrPhone: user.emailOrPhone,
      refreshToken: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
    });

    return res.json({
      success: true,
      message: "OTP verified successfully",
      accessToken,
      refreshToken,
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