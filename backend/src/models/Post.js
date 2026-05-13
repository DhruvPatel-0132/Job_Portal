// models/Post.js
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    // Author Identification
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "authorModel",
    },
    authorModel: {
      type: String,
      required: true,
      enum: ["User", "Company"],
    },

    // Post Classification
    postType: {
      type: String,
      required: true,
      enum: ["regular", "media", "article", "job_post", "showcase_project", "achievement"],
      default: "regular",
    },

    // Core Content
    content: {
      type: String,
      trim: true,
      maxlength: 10000, // Industry standard allows for long form text
    },

    // Media (Can be used for regular posts too)
    media: [
      {
        url: { type: String, required: true },
        type: { type: String, enum: ["image", "video", "document"], required: true },
        publicId: String, // Cloudinary/AWS identifier
        thumbnail: String,
        altText: String,
      },
    ],

    // Discovery & Context
    hashtags: [{ type: String, lowercase: true }],
    mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Polymorphic Reference to specialized content
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "referenceModel",
    },
    referenceModel: {
      type: String,
      enum: ["ShowcaseProject", "Achievement", "MediaPost", "Article", "JobPost"],
    },

    // Performance Stats (Denormalized)
    stats: {
      likesCount: { type: Number, default: 0 },
      commentsCount: { type: Number, default: 0 },
      sharesCount: { type: Number, default: 0 },
      savesCount: { type: Number, default: 0 },
      viewsCount: { type: Number, default: 0 },
      viewedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },

    // Audit & Moderation
    isEdited: { type: Boolean, default: false },
    editedAt: Date,
    isDeleted: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    moderationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected", "flagged"],
      default: "approved",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for Feed performance
postSchema.index({ createdAt: -1 });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ hashtags: 1 });
postSchema.index({ moderationStatus: 1, isDeleted: 1 });

module.exports = mongoose.model("Post", postSchema);
