const {
  loginUser,
  registerUser,
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


module.exports = { login, register };