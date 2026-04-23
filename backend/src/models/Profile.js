const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema(
  {
    title: String,
    company: String,
    location: String,
    startDate: Date,
    endDate: Date,
    currentlyWorking: Boolean,
    description: String,
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    school: String,
    degree: String,
    fieldOfStudy: String,
    startYear: Number,
    endYear: Number,
    grade: String,
    description: String,
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    fullName: {
      type: String,
      trim: true,
      default: "",
    },

    headline: {
      type: String,
      default: "",
    },

    avatar: {
      type: String,
      default: "",
    },

    banner: {
      type: String,
      default: "",
    },

    country: {
      type: String,
      default: "",
    },

    code: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    about: {
      type: String,
      maxlength: 1000,
      default: "",
    },

    skills: [
      {
        type: String,
      },
    ],

    experience: [experienceSchema],
    education: [educationSchema],
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;