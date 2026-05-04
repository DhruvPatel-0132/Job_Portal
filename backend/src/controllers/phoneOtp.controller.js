const twilio = require("twilio");
const Otp = require("../models/Otp");
const User = require("../models/User");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// SEND OTP
const sendPhoneOTP = async (req, res) => {
  try {
    const { countryCode, mobile } = req.body;

    const phone = `${countryCode}${mobile}`;
    const otp = generateOTP();

    await Otp.create({
      phone,
      otp,
      expiresAt: new Date(Date.now() + 30 * 1000),
    });

    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    res.json({ success: true, message: "OTP sent" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// VERIFY OTP
const verifyPhoneOTP = async (req, res) => {
  try {
    const { countryCode, mobile, otp } = req.body;

    const phoneWithCode = `${countryCode}${mobile}`;

    const record = await Otp.findOne({ phone: phoneWithCode });

    if (!record) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (record.expiresAt < Date.now()) {
      await Otp.deleteOne({ phone: phoneWithCode });
      return res.status(400).json({ message: "OTP expired" });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await Otp.deleteOne({ phone: phoneWithCode });

    // 🔥 FIX: REMOVE COUNTRY CODE BEFORE USER SEARCH
    const rawPhone = mobile;

    const user = await User.findOneAndUpdate(
      { emailOrPhone: rawPhone },
      { isVerified: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

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

    res.json({
      success: true,
      message: "Phone verified",
      accessToken,
      refreshToken,
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  sendPhoneOTP,
  verifyPhoneOTP,
};