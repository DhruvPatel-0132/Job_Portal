const {
  loginUser,
  registerUser,
  googleLoginUser 
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

module.exports = {
  login,
  register,
  googleLogin,
};