const mongoose = require("mongoose");

const companyFollowerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate follows
companyFollowerSchema.index({ userId: 1, companyId: 1 }, { unique: true });

module.exports = mongoose.model("CompanyFollower", companyFollowerSchema);
