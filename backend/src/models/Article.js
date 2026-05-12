// models/Article.js
const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true }, // SEO friendly URL
    
    bannerImage: {
      url: String,
      publicId: String,
    },
    
    content: { type: String, required: true }, // Rich text / Markdown
    summary: { type: String, maxlength: 500 },
    
    tags: [{ type: String, lowercase: true }],
    
    // Performance & Engagement
    readTime: { type: Number, default: 0 }, // in minutes
    viewCount: { type: Number, default: 0 },
    
    // Status
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    publishedAt: Date,
  },
  { timestamps: true }
);

articleSchema.index({ title: "text", summary: "text" });


module.exports = mongoose.model("Article", articleSchema);
