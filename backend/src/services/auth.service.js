const User = require("../models/User");
const Profile = require("../models/Profile");
const Token = require("../models/Token");
const Company = require("../models/Company");
const ProfessionalDetails = require("../models/ProfessionalDetails");
const bcrypt = require("bcryptjs");

const {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  REFRESH_TOKEN_EXPIRY_MS,
} = require("../utils/generateTokens");

const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// LOGIN SERVICE
const loginUser = async ({ emailOrPhone, password }) => {
  const user = await User.findOne({
    emailOrPhone: emailOrPhone.trim(),
  });

  if (!user || !user.password) {
    return {
      status: 401,
      response: { success: false, message: "Invalid credentials" },
    };
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return {
      status: 401,
      response: { success: false, message: "Invalid credentials" },
    };
  }

  if (!user.isVerified) {
    return {
      status: 200,
      response: {
        success: true,
        requireOTP: true,
        type: "user_verification",
        userId: user._id,
        message: "User not verified",
      },
    };
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();

  // ✅ REMOVE OLD TOKENS
  await Token.deleteMany({ userId: user._id });

  await Token.create({
    userId: user._id,
    emailOrPhone: user.emailOrPhone,
    refreshToken: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
  });

  return {
    status: 200,
    response: {
      success: true,
      accessToken,
      refreshToken,
      isVerified: true,
      message: "Login successful",
    },
  };
};

// REGISTER SERVICE
const registerUser = async (data) => {
  const {
    emailOrPhone, password, firstName, lastName, role,
    hireType, currentProfession, experience, project,
    companyName, year, about, selectedCompany, newCompany
  } = data;

  const exists = await User.findOne({
    emailOrPhone: emailOrPhone.trim(),
  });

  if (exists) {
    return {
      status: 409,
      response: { success: false, message: "User already exists" },
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    emailOrPhone: emailOrPhone.trim(),
    password: hashedPassword,
    firstName,
    lastName,
    role,
  });

  // 🔥 CREATE PROFILE
  const profileData = {
    userId: user._id,
    fullName: `${firstName} ${lastName}`,
    email: emailOrPhone.includes("@") ? emailOrPhone : "",
    phone: emailOrPhone.includes("@") ? "" : emailOrPhone,
  };

  if (role === "company") {
    if (companyName) {
      await Company.create({
        name: companyName,
        establishedYear: year || "",
        about: about || "",
        createdBy: user._id,
      }).catch((err) => console.log("Company already exists or error", err));
    }
  } else if (role === "hire") {
    const profDetails = {
      userId: user._id,
      hireType: hireType || "",
    };

    if (hireType === "individual") {
      profDetails.currentProfession = currentProfession || "";
      profDetails.industryExperience = experience || "";
      profDetails.portfolioDescription = project || "";
    } else if (hireType === "company") {
      if (newCompany) {
        await Company.create({
          name: newCompany,
          createdBy: user._id,
        }).catch((err) => console.log("Company already exists or error", err));
      }
    }

    await ProfessionalDetails.create(profDetails).catch((err) =>
      console.log("Professional details creation error", err)
    );
  }

  await Profile.create(profileData);

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();

  await Token.create({
    userId: user._id,
    emailOrPhone: user.emailOrPhone,
    refreshToken: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return {
    status: 201,
    response: {
      success: true,
      message: "User registered successfully",
      accessToken,
      refreshToken,
      userId: user._id,
      user: {
        id: user._id,
        emailOrPhone: user.emailOrPhone,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    },
  };
};

// GOOGLE LOGIN LOGIC
const googleLoginUser = async (idToken) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  const { email, name, sub, picture, given_name, family_name } = payload;

  // safer split (fallback logic)
  const firstName = given_name || name?.split(" ")[0] || "";
  const lastName = family_name || name?.split(" ").slice(1).join(" ") || "";

  let user = await User.findOne({
    emailOrPhone: email,
  });

  let isNewUser = false;

  // 🟡 EXISTING USER
  if (user) {
    if (user.provider === "local" && user.password) {
      return {
        status: 400,
        response: {
          success: false,
          message: "Account exists with email/password login",
        },
      };
    }
  }

  // 🟢 CREATE USER
  if (!user) {
    isNewUser = true;

    user = await User.create({
      emailOrPhone: email,
      firstName,
      lastName,
      password: null,
      role: "job_seeker",
      provider: "google",
      googleId: sub,
      avatar: picture,
      isVerified: true,
    });

    // 🔥 CREATE PROFILE FOR GOOGLE USER
    await Profile.create({
      userId: user._id,
      fullName: `${firstName} ${lastName}`,
      email: email,
      avatar: picture || "",
    });
  }

  // 🔐 TOKENS
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();

  await Token.deleteMany({ userId: user._id });

  await Token.create({
    userId: user._id,
    emailOrPhone: user.emailOrPhone,
    refreshToken: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
  });

  return {
    status: 200,
    response: {
      success: true,
      accessToken,
      refreshToken,
      isVerified: true,
      isNewUser, // 🔥 IMPORTANT for frontend onboarding
      message: "Google login successful",
      user: {
        _id: user._id,
        email: user.emailOrPhone,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        role: user.role,
      },
    },
  };
};

const logoutUser = async ({ refreshToken }) => {
  try {
    if (!refreshToken) {
      return {
        status: 200,
        response: {
          success: true,
          message: "Already logged out",
        },
      };
    }

    // 🔐 Hash incoming token to match DB
    const hashedToken = hashToken(refreshToken);

    // ❌ Delete refresh token from DB
    const deletedToken = await Token.findOneAndDelete({
      refreshToken: hashedToken,
    });

    if (!deletedToken) {
      return {
        status: 200,
        response: {
          success: true,
          message: "Session already expired",
        },
      };
    }

    return {
      status: 200,
      response: {
        success: true,
        message: "Logout successful",
      },
    };
  } catch (error) {
    console.error("Logout Error:", error);

    return {
      status: 500,
      response: {
        success: false,
        message: "Logout failed",
      },
    };
  }
};

const refreshAccessToken = async (refreshToken) => {
  try {
    if (!refreshToken) {
      return {
        status: 401,
        response: { success: false, message: "Refresh token required" },
      };
    }

    const hashedToken = hashToken(refreshToken);
    const tokenDoc = await Token.findOne({ refreshToken: hashedToken });

    if (!tokenDoc) {
      return {
        status: 401,
        response: { success: false, message: "Invalid refresh token" },
      };
    }

    if (tokenDoc.expiresAt < new Date()) {
      await Token.findByIdAndDelete(tokenDoc._id);
      return {
        status: 401,
        response: { success: false, message: "Refresh token expired" },
      };
    }

    const user = await User.findById(tokenDoc.userId);
    if (!user) {
      return {
        status: 404,
        response: { success: false, message: "User not found" },
      };
    }

    const accessToken = generateAccessToken(user);

    return {
      status: 200,
      response: {
        success: true,
        accessToken,
        message: "Token refreshed",
      },
    };
  } catch (error) {
    console.error("Refresh Token Error:", error);
    return {
      status: 500,
      response: { success: false, message: "Internal server error" },
    };
  }
};

module.exports = {
  loginUser,
  registerUser,
  googleLoginUser,
  logoutUser,
  refreshAccessToken
};
