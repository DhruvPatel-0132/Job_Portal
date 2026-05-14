// models/JobPost.js
const mongoose = require("mongoose");

const jobPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    
    // Categorization
    industry: String,
    category: String, // e.g. Engineering, Marketing
    
    // Requirements
    skillsRequired: [{ type: String, lowercase: true }],
    experienceLevel: {
      type: String,
      enum: ["fresher", "junior", "mid", "senior", "lead", "executive"],
      required: true,
    },
    educationLevel: String,

    // Logistics
    employmentType: {
      type: String,
      enum: ["full_time", "part_time", "internship", "contract", "freelance"],
      required: true,
    },
    workMode: {
      type: String,
      enum: ["on_site", "remote", "hybrid"],
      default: "on_site",
    },
    location: { type: String, required: true },

    // Compensation
    salary: {
      min: Number,
      max: Number,
      currency: { type: String, default: "INR" },
      isNegotiable: { type: Boolean, default: false },
      hideSalary: { type: Boolean, default: false },
    },

    // Metadata
    applicationUrl: String, // Link to external ATS if applicable
    applicationDeadline: Date,
    benefits: [String],
    
    // Performance
    totalApplicants: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Search optimization
jobPostSchema.index({ title: "text", description: "text" });
jobPostSchema.index({ company: 1 });
jobPostSchema.index({ isActive: 1, createdAt: -1 });

module.exports = mongoose.model("JobPost", jobPostSchema);
