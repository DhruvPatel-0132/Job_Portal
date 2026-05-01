const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema(
  {
    title: String,
    company: String,
    employmentType: String,
    locationType: String,
    location: String,
    startDate: Date,
    endDate: Date,
    currentlyWorking: Boolean,
    description: String,
    skills: [{ type: String }],
  },
  { _id: false },
);

const educationSchema = new mongoose.Schema(
  {
    school: String,
    degree: String,
    fieldOfStudy: String,
    startDate: Date,
    endDate: Date,
    grade: String,
    description: String,
    stillStudying: Boolean,
  },
  { _id: false },
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

    email: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    birthday: {
      type: Date,
    },

    about: {
      type: String,
      maxlength: 1000,
      default: "",
    },

    aboutCompany: {
      type: String,
      maxlength: 1000,
      default: "",
    },

    hireType: {
      type: String,
      default: "",
    },

    companyName: {
      type: String,
      default: "",
    },

    establishedYear: {
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
  },
);

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
