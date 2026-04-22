const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, index: true },
    phone: { type: String, index: true },

    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// Auto delete after expiry
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Otp", otpSchema);