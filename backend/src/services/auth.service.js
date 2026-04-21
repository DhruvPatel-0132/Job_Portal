const User = require("../models/User");
const Token = require("../models/Token");
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
    return { status: 401, response: { success: false, message: "Invalid credentials" } };
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return { status: 401, response: { success: false, message: "Invalid credentials" } };
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
  const { emailOrPhone, password, firstName, lastName, role } = data;

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

  const { email, name, sub, picture } = payload;

  let user = await User.findOne({ emailOrPhone: email });

  // 🟡 IF USER EXISTS
  if (user) {
    // if local account exists, block mixing (optional rule)
    if (user.provider === "local" && user.password) {
      return {
        status: 400,
        response: {
          success: false,
          message: "Account exists with password login. Use email/password.",
        },
      };
    }
  }

  // 🟢 CREATE NEW USER
  if (!user) {
    user = await User.create({
      emailOrPhone: email,
      firstName: name,
      lastName: "",
      password: null,
      role: null, // default role (change if needed)
      provider: "google",
      googleId: sub,
      avatar: picture,
      isVerified: true, // IMPORTANT: Google is already verified
    });
  }

  // 🔐 TOKEN GENERATION
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
      message: "Google login successful",
      user,
    },
  };
};

module.exports = {
  loginUser,
  registerUser,
  googleLoginUser
};