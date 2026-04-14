const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["job_seeker", "hire", "company"],
      required: true,
    },
    hireType: {
      type: String,
      enum: ["individual", "company"],
      required: function() {
        return this.role === "hire";
      },
    },
    // If role is hire and hireType is individual
    skills: {
      type: String,
    },
    experience: {
      type: String,
    },
    project: {
      type: String,
    },
    // If role is company or hireType is company
    companyName: {
      type: String,
    },
    year: {
      type: String,
    },
    about: {
      type: String,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password for login
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
