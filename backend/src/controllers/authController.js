const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

exports.registerUser = async (req, res) => {
  try {
    const {
      identifier,
      password,
      firstName,
      lastName,
      role,
      hireType,
      skills,
      experience,
      project,
      companyName,
      year,
      about,
    } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ identifier });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this identifier" });
    }

    // Create user object based on roles
    const userData = {
      identifier,
      password,
      firstName,
      lastName,
      role,
    };

    if (role === "hire") {
      userData.hireType = hireType;
      if (hireType === "individual") {
        userData.skills = skills;
        userData.experience = experience;
        userData.project = project;
      } else if (hireType === "company") {
        userData.companyName = companyName; // Used as selected or new company
      }
    } else if (role === "company") {
      userData.companyName = companyName;
      userData.year = year;
      userData.about = about;
    }

    const user = await User.create(userData);

    if (user) {
      res.status(201).json({
        _id: user.id,
        identifier: user.identifier,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({ identifier });

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user.id,
        identifier: user.identifier,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: "Invalid identifier or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
