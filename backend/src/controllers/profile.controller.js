const Profile = require("../models/Profile");

// Get current user profile
const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ userId: req.user.id });
    
    // If profile doesn't exist, we create an empty one linked to the user
    if (!profile) {
      profile = new Profile({
        userId: req.user.id,
      });
      await profile.save();
    }
    
    return res.status(200).json({ success: true, profile });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update current user profile
const updateProfile = async (req, res) => {
  try {
    // Ensure userId is not modified by the client
    const updateData = { ...req.body };
    delete updateData.userId;

    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      { $set: updateData },
      { new: true, upsert: true }
    );
    
    return res.status(200).json({ success: true, profile });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProfile, updateProfile };
