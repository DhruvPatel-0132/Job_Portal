const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    tagline: String,          // headline shown under company name
    about: String,
    banner: String,           // URL for company banner image
    logo: String,             // URL for company logo image

    website: String,
    phone: String,
    industry: String,
    companySize: String,      // e.g., "11-50 employees"
    type: String,             // e.g., "Privately Held", "Public Company"

    location: String,         // general location (city, country)
    headquarters: String,     // detailed HQ address

    establishedYear: String,
    foundedYear: String,

    specialties: [{ type: String }],
    services: [{ type: String }],   // Services List
    followersCount: { type: Number, default: 0 },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);