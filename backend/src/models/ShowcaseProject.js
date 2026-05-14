// models/ShowcaseProject.js
const mongoose = require("mongoose");

const showcaseProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    
    // Technical Details
    techStack: [
      {
        name: { type: String, required: true },
        icon: String,
      }
    ],
    
    // Links
    githubUrl: String,
    liveUrl: String,
    demoVideoUrl: String,
    
    // Media
    thumbnail: String,
    gallery: [{ url: String, publicId: String }],
    
    // Team & Collaboration
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    teamMembers: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        role: String, // e.g. Frontend Developer, UI Designer
      }
    ],
    
    // Lifecycle
    projectStatus: {
      type: String,
      enum: ["idea", "in_progress", "beta", "completed", "maintained"],
      default: "completed",
    },
    startDate: Date,
    endDate: Date,
  },
  { timestamps: true }
);

showcaseProjectSchema.index({ owner: 1, createdAt: -1 });

module.exports = mongoose.model("ShowcaseProject", showcaseProjectSchema);
