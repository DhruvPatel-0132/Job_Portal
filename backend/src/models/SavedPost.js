const mongoose = require("mongoose");

const savedPostSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// A user can only save a specific post once
savedPostSchema.index({ post: 1, user: 1 }, { unique: true });
savedPostSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("SavedPost", savedPostSchema);
