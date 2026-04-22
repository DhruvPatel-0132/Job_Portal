const crypto = require("crypto");

exports.generateResetToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  return { rawToken, hashedToken };
};

exports.generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};