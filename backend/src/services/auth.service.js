const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Company = require("../models/Company");

const registerUser = async (data) => {
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
    companyName,
    year,
    about,
    selectedCompany,
  } = data;

  const hashedPassword = await bcrypt.hash(
    password,
    Number(process.env.BCRYPT_SALT),
  );
  let email = null;
  let phone = null;

  if (emailOrPhone && emailOrPhone.includes("@")) {
    email = emailOrPhone;
  } else {
    phone = emailOrPhone;
  }
  // 🔥 Prevent duplicate users
  const existing = await User.findOne({
    $or: [{ email }, { phone }],
  });

  if (existing) {
    throw new Error("User already exists");
  }

  let companyId = null;

  // Create company
  if (role === "company") {
    const company = await Company.create({
      name: companyName,
      year,
      about,
    });
    companyId = company._id;
  }

  // Select company
  if (role === "hire" && hireType === "company") {
    const existingCompany = await Company.findOne({
      name: selectedCompany,
    });
    if (existingCompany) companyId = existingCompany._id;
  }

  const user = await User.create({
    email,
    phone,
    password: hashedPassword,
    firstName,
    lastName,
    role,
    hireType,
    skills,
    experience,
    project,
    company: companyId,
  });

  return user;
};

module.exports = { registerUser };
