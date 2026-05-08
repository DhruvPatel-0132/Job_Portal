// models/Achievement.js
const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["certification", "award", "honor", "publication", "patent"],
      required: true,
    },
    
    issuer: {
      name: { type: String, required: true },
      logo: String,
    },
    
    // Dates
    issueDate: { type: Date, required: true },
    expiryDate: Date,
    doesNotExpire: { type: Boolean, default: false },
    
    // Credentials
    credentialId: String,
    credentialUrl: String,
    
    // Media
    certificateImage: {
      url: String,
      publicId: String,
    },
    
    skills: [{ type: String, lowercase: true }],
    description: { type: String, maxlength: 1000 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Achievement", achievementSchema);
