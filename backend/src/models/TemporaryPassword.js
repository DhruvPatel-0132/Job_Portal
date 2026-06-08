const mongoose = require("mongoose");

const temporaryPasswordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: "7d", // Automatically delete after 7 days
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TemporaryPassword", temporaryPasswordSchema);
