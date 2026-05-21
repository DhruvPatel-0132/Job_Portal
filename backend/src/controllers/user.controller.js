const User = require("../models/User");
const Profile = require("../models/Profile");

/* GET CURRENT USER + PROFILE */
exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    // 🔥 run both queries in parallel (better performance)
    const [user, profile] = await Promise.all([
      User.findById(userId).select("-password"),
      Profile.findOne({ userId }),
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
      profile: profile || {}, // fallback if not found
    });
  } catch (err) {
    console.error("getMe error:", err);
    res.status(500).json({ message: "Server error" });
  }
};