const {
  loginUser,
  registerUser,
  googleLoginUser,
  logoutUser,
  refreshAccessToken
} = require("../services/auth.service");

const login = async (req, res) => {
  try {
    const { status, response } = await loginUser(req.body);
    return res.status(status).json(response);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const register = async (req, res) => {
  try {
    const { status, response } = await registerUser(req.body);
    return res.status(status).json(response);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GOOGLE LOGIN
const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const result = await googleLoginUser(token);

    return res.status(result.status).json(result.response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Google login failed",
    });
  }
};

const logoutController = async (req, res) => {
  const refreshToken =
    req.body.refreshToken || req.cookies?.refreshToken;

  const { status, response } = await logoutUser({ refreshToken });

  // 🍪 Clear cookie if you are using cookies
  res.clearCookie("refreshToken");

  return res.status(status).json(response);
};

const refresh = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;
    const { status, response } = await refreshAccessToken(refreshToken);
    return res.status(status).json(response);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  login,
  register,
  googleLogin,
  logoutController,
  refresh
};