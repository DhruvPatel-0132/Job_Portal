// models/Reaction.js
const mongoose = require("mongoose");

const reactionSchema = new mongoose.Schema(
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
    reactionType: {
      type: String,
      enum: [
        "like",       // 👍
        "celebrate",  // 👏
        "support",    // 🤝
        "love",       // ❤️
        "insightful", // 💡
        "funny"       // 😄
      ],
      default: "like",
    },
  },
  { timestamps: true }
);

// Ensure a user can only have one reaction per post
reactionSchema.index({ post: 1, user: 1 }, { unique: true });
reactionSchema.index({ post: 1, reactionType: 1 }); // For quick tallying

module.exports = mongoose.model("Reaction", reactionSchema);
