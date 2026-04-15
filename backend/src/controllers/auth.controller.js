const User = require("../models/User");
const Company = require("../models/Company");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  try {
    const {
      emailOrPhone,
      password,
      firstName,
      lastName,
      role,
      hireType,
      skills,
      experience,
      project,
      selectedCompany,
      newCompany,
      companyName,
      year,
      about,
    } = req.body;

    if (!emailOrPhone || !password || !firstName || !lastName || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const exists = await User.findOne({ emailOrPhone });
    if (exists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let profile = {};

    if (role === "job_seeker") {
      profile = {};
    }

    if (role === "hire") {
      if (hireType === "individual") {
        profile = {
          hireType,
          skills,
          experience,
          project,
        };
      }

      if (hireType === "company") {
        let company;

        if (selectedCompany) {
          company = await Company.findOne({ name: selectedCompany });
        }

        if (!company && newCompany) {
          company = await Company.create({ name: newCompany });
        }

        profile = {
          hireType,
          company: company?._id,
        };
      }
    }

    if (role === "company") {
      const company = await Company.create({
        name: companyName,
        establishedYear: year,
        about,
      });

      profile = {
        company: company._id,
      };
    }

    const user = await User.create({
      emailOrPhone,
      password: hashedPassword,
      firstName,
      lastName,
      role,
      profile,
    });

    res.status(201).json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register };