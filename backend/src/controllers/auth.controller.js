const {
  loginUser,
  registerUser,
  googleLoginUser,
  logoutUser,
  refreshAccessToken
} = require("../services/auth.service");

const User = require("../models/User");
const Profile = require("../models/Profile");
const Token = require("../models/Token");
const PasswordHistory = require("../models/PasswordHistory");
const bcrypt = require("bcryptjs");
const { sendOTPEmail } = require("../services/email.service");
const { setOTP, verifyOTP, clearOTP } = require("../services/otp.service");
const { generateAccessToken, generateRefreshToken, hashToken, REFRESH_TOKEN_EXPIRY_MS } = require("../utils/generateTokens");

const login = async (req, res) => {
  try {
    const { status, response } = await loginUser(req.body);
    return res.status(status).json(response);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const register = async (req, res) => {
  try {
    const { status, response } = await registerUser(req.body);
    return res.status(status).json(response);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GOOGLE LOGIN
const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const result = await googleLoginUser(token);

    return res.status(result.status).json(result.response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Google login failed",
    });
  }
};

const logoutController = async (req, res) => {
  const refreshToken =
    req.body.refreshToken || req.cookies?.refreshToken;

  const { status, response } = await logoutUser({ refreshToken });

  // 🍪 Clear cookie if you are using cookies
  res.clearCookie("refreshToken");

  return res.status(status).json(response);
};

const refresh = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;
    const { status, response } = await refreshAccessToken(refreshToken);
    return res.status(status).json(response);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const validatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (!user.password) {
      return res.status(400).json({ success: false, message: "You logged in with a social account. Please set a password first." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ success: false, message: "Password must contain uppercase, lowercase, number and special character" });
    }

    const histories = await PasswordHistory.find({ userId }).sort({ changedAt: -1 }).limit(5);
    for (const history of histories) {
      const isReused = await bcrypt.compare(newPassword, history.oldPassword);
      if (isReused) {
        return res.status(400).json({ success: false, message: "You cannot use old passwords again" });
      }
    }

    return res.json({ success: true, message: "Password is valid" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const sendPasswordOtp = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    // Check if user has an email formatted string in emailOrPhone
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!user.emailOrPhone || !emailRegex.test(user.emailOrPhone)) {
      return res.status(400).json({ success: false, message: "Please add email from profile section first" });
    }

    const otp = await setOTP(user.emailOrPhone, 300); // 5 mins expiry
    await sendOTPEmail(user.emailOrPhone, otp);

    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("OTP ERROR:", err);
    return res.status(500).json({ success: false, message: err.message || "Internal server error" });
  }
};

const verifyPasswordOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);

    const isValid = await verifyOTP(user.emailOrPhone, otp);
    if (!isValid) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    return res.json({ success: true, message: "OTP verified successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { newPassword, otp } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);

    // Double check OTP right before changing
    const isValid = await verifyOTP(user.emailOrPhone, otp);
    if (!isValid) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    if (user.password) {
      await PasswordHistory.create({
        userId: user._id,
        oldPassword: user.password
      });
    }

    user.password = hashedPassword;
    await user.save();

    await clearOTP(user.emailOrPhone);

    // Force logout (clear tokens)
    const Token = require("../models/Token");
    await Token.deleteMany({ userId: user._id });

    res.clearCookie("refreshToken");

    return res.json({ success: true, message: "Password changed successfully. Please login again." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const hibernateAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Incorrect password" });
      }
    }

    await Profile.findOneAndUpdate({ userId }, { status: "hibernated" });

    await Token.deleteMany({ userId });
    res.clearCookie("refreshToken");

    return res.json({ success: true, message: "Account hibernated successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const reactivateRequestOTP = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!user.emailOrPhone || !emailRegex.test(user.emailOrPhone)) {
      return res.status(400).json({ success: false, message: "No valid email found to send OTP." });
    }

    const otp = await setOTP(user.emailOrPhone, 300);
    await sendOTPEmail(user.emailOrPhone, otp);

    return res.json({ success: true, message: "OTP sent to your email" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const reactivateVerify = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const isValid = await verifyOTP(user.emailOrPhone, otp);
    if (!isValid) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    await Profile.findOneAndUpdate({ userId }, { status: "active" });
    await clearOTP(user.emailOrPhone);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();

    await Token.deleteMany({ userId: user._id });
    await Token.create({
      userId: user._id,
      emailOrPhone: user.emailOrPhone,
      refreshToken: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
    });

    return res.json({
      success: true,
      message: "Account reactivated successfully",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        emailOrPhone: user.emailOrPhone,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isOnboarded: user.isOnboarded,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  login,
  register,
  googleLogin,
  logoutController,
  refresh,
  validatePassword,
  sendPasswordOtp,
  verifyPasswordOtp,
  changePassword,
  hibernateAccount,
  reactivateRequestOTP,
  reactivateVerify
};