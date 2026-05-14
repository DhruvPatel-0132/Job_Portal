const User = require("../models/User");
const Profile = require("../models/Profile");
const ProfessionalDetails = require("../models/ProfessionalDetails");
const Connection = require("../models/Connection");

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
    const profDetails = await ProfessionalDetails.findOne({
      userId: req.user.id,
    });

    // Fetch connections count
    const Connection = require("../models/Connection");
    const connectionsCount = await Connection.countDocuments({
      $or: [{ user1: req.user.id }, { user2: req.user.id }],
    });

    // Convert profile to object to add extra fields
    const profileObj = profile.toObject();
    profileObj.connections = connectionsCount;

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
    // =========================
    // CLONE BODY
    // =========================
    const updateData = { ...req.body };

    // Prevent sensitive updates
    delete updateData.userId;
    delete updateData.password;
    delete updateData.role;
    delete updateData.provider;
    delete updateData.googleId;
    delete updateData.isVerified;
    delete updateData.isOnboarded;

    // =========================
    // VALIDATION
    // =========================
    // if (updateData.email && updateData.phone) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Update either email or phone, not both",
    //   });
    // }

    // =========================
    // USER UPDATE DATA
    // =========================
    const userData = {};

    // Direct user fields
    const userFields = ["firstName", "lastName", "avatar"];

    userFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        userData[field] = updateData[field];
      }
    });

    // Sync email -> emailOrPhone
    if (updateData.email) {
      userData.emailOrPhone = updateData.email;
    }

    // Sync phone -> emailOrPhone
    if (updateData.phone) {
      userData.emailOrPhone = updateData.phone;
    }

    // =========================
    // UPDATE USER
    // =========================
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: userData,
      },
      {
        new: true,
      },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // =========================
    // PROFESSIONAL DETAILS
    // =========================
    const professionalFields = [
      "hireType",
      "industryExperience",
      "portfolioDescription",
      "currentProfession",
      "skills",
      "company",
    ];

    const profData = {};

    if (updatedUser.role === "hire") {
      professionalFields.forEach((field) => {
        if (updateData[field] !== undefined) {
          profData[field] = updateData[field];

          // Remove from profile payload
          delete updateData[field];
        }
      });

      if (Object.keys(profData).length > 0) {
        await ProfessionalDetails.findOneAndUpdate(
          { userId: req.user.id },
          {
            $set: profData,
          },
          {
            new: true,
            upsert: true,
          },
        );
      }
    }

    // =========================
    // SYNC AVATAR TO PROFILE
    // =========================
    if (userData.avatar) {
      updateData.avatar = userData.avatar;
    }

    // =========================
    // UPDATE PROFILE
    // =========================
    const updatedProfile = await Profile.findOneAndUpdate(
      {
        userId: req.user.id,
      },
      {
        $set: updateData,
      },
      {
        new: true,
        upsert: true,
      },
    );

    // =========================
    // FETCH PROFESSIONAL DETAILS
    // =========================
    const professionalDetails = await ProfessionalDetails.findOne({
      userId: req.user.id,
    });

    // =========================
    // CONNECTION COUNT
    // =========================
    const connectionsCount = await Connection.countDocuments({
      $or: [{ user1: req.user.id }, { user2: req.user.id }],
    });

    // =========================
    // FINAL RESPONSE
    // =========================
    return res.status(200).json({
      success: true,
      profile: {
        ...updatedProfile.toObject(),

        user: updatedUser,

        professionalDetails,

        connections: connectionsCount,
      },
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getProfile, updateProfile };
