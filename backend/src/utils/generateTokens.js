const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

// refresh token = random secure string
const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

// hash for DB storage
const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

// FIXED: 7 DAY CONSTANT (IMPORTANT)
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  REFRESH_TOKEN_EXPIRY_MS,
};