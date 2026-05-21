const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    emailOrPhone: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: false,
      default: null,
    },

    firstName: String,
    lastName: String,

    role: {
      type: String,
      enum: ["job_seeker", "hire", "company"],
      default: "job_seeker",
    },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    googleId: String,
    avatar: String,

    isVerified: {
      type: Boolean,
      default: false,
    },

    isOnboarded: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);