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

/* UPDATE ONBOARDING STATUS */
exports.updateOnboarding = async (req, res) => {
  try {
    const userId = req.user.id;
    const { isOnboarded } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { isOnboarded },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Onboarding status updated",
      user,
    });
  } catch (err) {
    console.error("updateOnboarding error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};