const User = require("../models/User");
const Company = require("../models/Company");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    // 1. Validate input
    if (!emailOrPhone || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/Phone and password are required",
      });
    }

    // 2. Find user
    const user = await User.findOne({ emailOrPhone });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 4. Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 5. Send response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        emailOrPhone: user.emailOrPhone,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
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

    // ✅ Required fields check
    if (!emailOrPhone || !password || !firstName || !lastName || !role) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // ✅ Check duplicate user
    const exists = await User.findOne({ emailOrPhone });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // ❗ optional: stronger validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let profile = {};

    // =========================
    // 👤 JOB SEEKER
    // =========================
    if (role === "job_seeker") {
      profile = {};
    }

    // =========================
    // 🧑‍💼 HIRE ROLE
    // =========================
    if (role === "hire") {
      if (hireType === "individual") {
        profile = {
          hireType: "individual",
          skills: skills || [],
          experience: experience || "",
          project: project || "",
        };
      }

      if (hireType === "company") {
        let company = null;

        if (selectedCompany) {
          company = await Company.findOne({ name: selectedCompany });
        }

        if (!company && newCompany) {
          const existing = await Company.findOne({ name: newCompany });

          if (existing) {
            company = existing;
          } else {
            company = await Company.create({
              name: newCompany,
            });
          }
        }

        profile = {
          hireType: "company",
          company: company ? company._id : null,
        };
      }
    }

    // =========================
    // 🏢 COMPANY ROLE
    // =========================
    if (role === "company") {
      if (!companyName) {
        return res.status(400).json({
          success: false,
          message: "Company name is required",
        });
      }

      const existingCompany = await Company.findOne({
        name: companyName,
      });

      const company =
        existingCompany ||
        (await Company.create({
          name: companyName,
          establishedYear: year || null,
          about: about || "",
        }));

      profile = {
        company: company._id,
      };
    }

    // =========================
    // CREATE USER
    // =========================
    const user = await User.create({
      emailOrPhone,
      password: hashedPassword,
      firstName,
      lastName,
      role,
      profile,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        emailOrPhone: user.emailOrPhone,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { register,login };