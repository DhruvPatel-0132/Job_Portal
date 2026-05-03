const mongoose = require("mongoose");

const professionalDetailsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    hireType: {
      type: String,
      default: "",
    },
    requiredExperience: {
      type: String,
      default: "",
    },
    project: {
      type: String,
      default: "",
    },
    currentProfession: {
      type: String,
      default: "",
    },
    skills: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProfessionalDetails", professionalDetailsSchema);
