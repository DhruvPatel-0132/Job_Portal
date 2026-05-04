const Profile = require("../models/Profile");
const ProfessionalDetails = require("../models/ProfessionalDetails");

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

    // Fetch professional details from separate model
    const profDetails = await ProfessionalDetails.findOne({ userId: req.user.id });

    // Convert profile to object to add extra fields
    const profileObj = profile.toObject();
    if (profDetails) {
      profileObj.hireType = profDetails.hireType;
      profileObj.industryExperience = profDetails.industryExperience;
      profileObj.portfolioDescription = profDetails.portfolioDescription;
      profileObj.currentProfession = profDetails.currentProfession;
      profileObj.skills = profDetails.skills;
      profileObj.company = profDetails.company;
    }

    return res.status(200).json({ success: true, profile: profileObj });
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

    // Separate data for ProfessionalDetails if role is hire or company recruiter
    const professionalFields = ["hireType", "industryExperience", "portfolioDescription", "currentProfession", "skills", "company"];
    const profData = {};
    
    // Check if the user is a recruiter (role: hire)
    const user = await require("../models/User").findById(req.user.id);
    const isRecruiter = user && user.role === "hire";

    if (isRecruiter) {
      professionalFields.forEach(field => {
        if (updateData[field] !== undefined) {
          profData[field] = updateData[field];
          delete updateData[field];
        }
      });

      if (Object.keys(profData).length > 0) {
        await ProfessionalDetails.findOneAndUpdate(
          { userId: req.user.id },
          { $set: profData },
          { new: true, upsert: true }
        );
      }
    }

    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      { $set: updateData },
      { new: true, upsert: true }
    );

    // Fetch updated professional details to return a complete profile
    const updatedProfDetails = await ProfessionalDetails.findOne({ userId: req.user.id });
    const profileObj = profile.toObject();
    
    if (updatedProfDetails) {
      profileObj.hireType = updatedProfDetails.hireType;
      profileObj.industryExperience = updatedProfDetails.industryExperience;
      profileObj.portfolioDescription = updatedProfDetails.portfolioDescription;
      profileObj.currentProfession = updatedProfDetails.currentProfession;
      profileObj.skills = updatedProfDetails.skills;
      profileObj.company = updatedProfDetails.company;
    }

    return res.status(200).json({ success: true, profile: profileObj });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProfile, updateProfile };
