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
    // Matches "Current Profession / Skills" from UI
    currentProfession: {
      type: String,
      default: "",
    },
    skills: [
      {
        type: String,
      },
    ],
    // Matches "Years of Experience" from UI
    industryExperience: {
      type: String,
      default: "",
    },
    // Matches "Current Work / Projects" from UI
    portfolioDescription: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProfessionalDetails", professionalDetailsSchema);
