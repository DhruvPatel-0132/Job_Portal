const bcrypt = require("bcryptjs");

const User = require("../models/User");
const PasswordResetToken = require("../models/PasswordResetToken");

const { isEmail, isPhone } = require("../utils/validators");
const { generateResetToken, generateOTP } = require("../utils/token.utils");

const { sendResetEmail, sendOTPEmail } = require("../services/email.service");
const sendSMS = require("../services/sms.service");

/* =========================================
   1. FORGOT PASSWORD
========================================= */
exports.forgotPassword = async (req, res) => {
  const { emailOrPhone } = req.body;

  try {
    const user = await User.findOne({ emailOrPhone });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // clear old tokens
    await PasswordResetToken.deleteMany({ userId: user._id });

    /* ========= EMAIL FLOW ========= */
    if (isEmail(emailOrPhone)) {
      const { rawToken, hashedToken } = generateResetToken();

      await PasswordResetToken.create({
        userId: user._id,
        token: hashedToken,
        expiresAt: Date.now() + 15 * 60 * 1000,
      });

      const link = `${process.env.CLIENT_URL}/reset-password?token=${rawToken}`;

      console.log("RESET LINK:", link);

      await sendResetEmail(emailOrPhone, link);

      return res.json({ msg: "Reset link sent to email" });
    }

    /* ========= PHONE FLOW ========= */
    if (isPhone(emailOrPhone)) {
      const otp = generateOTP();

      await PasswordResetToken.create({
        userId: user._id,
        otp,
        expiresAt: Date.now() + 2 * 60 * 1000,
      });

      await sendSMS(emailOrPhone, otp);

      return res.json({ msg: "OTP sent to phone" });
    }

    return res.status(400).json({ msg: "Invalid input" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

/* =========================================
   2. VERIFY OTP
========================================= */
exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;

  try {
    const user = await User.findOne({ emailOrPhone: phone });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const record = await PasswordResetToken.findOne({
      userId: user._id,
      otp,
    });

    if (!record || record.expiresAt < Date.now()) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    return res.json({ msg: "OTP verified" });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

/* =========================================
   3. RESET PASSWORD (EMAIL FLOW)
========================================= */
exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const hashedToken = require("crypto")
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const record = await PasswordResetToken.findOne({
      token: hashedToken,
      expiresAt: { $gt: Date.now() },
    });

    if (!record) {
      return res.status(400).json({ msg: "Invalid or expired token" });
    }

    const user = await User.findById(record.userId);

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    await PasswordResetToken.deleteMany({ userId: user._id });

    return res.json({ msg: "Password reset successful" });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.resetPasswordWithOtp = async (req, res) => {
  const { phone, password } = req.body;

  try {
    const user = await User.findOne({ emailOrPhone: phone });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // check if OTP was verified
    const record = await PasswordResetToken.findOne({
      userId: user._id,
    });

    if (!record) {
      return res.status(400).json({
        msg: "OTP not verified",
      });
    }

    // 🔥 update password
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    // cleanup
    await PasswordResetToken.deleteMany({ userId: user._id });

    return res.json({
      msg: "Password reset successful",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};