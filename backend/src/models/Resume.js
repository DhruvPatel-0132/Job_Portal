const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileName: String,
    resumeUrl: String,
    extractedText: String,
    atsScore: Number,
    level: String,
    highlights: [String],
    skills: [String],
    debug: Object,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);
