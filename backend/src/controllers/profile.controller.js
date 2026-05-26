const User = require("../models/User");
const Profile = require("../models/Profile");
const ProfessionalDetails = require("../models/ProfessionalDetails");
const Connection = require("../models/Connection");
const ConnectRequest = require("../models/ConnectRequest");
const CompanyFollower = require("../models/CompanyFollower");
const Post = require("../models/Post");
const Company = require("../models/Company");

/**
 * Get any user's public profile by their userId.
 * Returns the same data shape as getProfile so the frontend
 * can reuse all existing profile display components.
 * Also returns `role` and `companyData` so the client can
 * decide whether to render a user profile or company profile.
 */
const getPublicProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate that the target user exists, or if it is a company, resolve to its creator
    let resolvedUserId = userId;
    let targetUser = await User.findById(resolvedUserId).select("-password -emailOrPhone -googleId");

    if (!targetUser) {
      // It might be a Company ID! Let's check
      const company = await Company.findById(resolvedUserId);
      if (company && company.createdBy) {
        resolvedUserId = company.createdBy;
        targetUser = await User.findById(resolvedUserId).select("-password -emailOrPhone -googleId");
      }
    }

    if (!targetUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Fetch profile document (create empty one is ok — same as getProfile)
    let profile = await Profile.findOne({ userId: resolvedUserId });
    if (!profile) {
      const company = await Company.findOne({ createdBy: resolvedUserId });
      const fullName = (targetUser.role === "company" && company)
        ? company.name
        : `${targetUser.firstName} ${targetUser.lastName}`.trim();
      const avatar = (targetUser.role === "company" && company && company.logo)
        ? company.logo
        : targetUser.avatar;

      // Return a minimal profile so the page can still render
      return res.status(200).json({
        success: true,
        role: targetUser.role,
        profile: { fullName, avatar },
        companyData: company ? company.toObject() : null,
      });
    }

    const profileObj = profile.toObject();

    // Professional details (hire-type users)
    const profDetails = await ProfessionalDetails.findOne({ userId: resolvedUserId });
    if (profDetails) {
      profileObj.hireType = profDetails.hireType;
      profileObj.industryExperience = profDetails.industryExperience;
      profileObj.portfolioDescription = profDetails.portfolioDescription;
      profileObj.currentProfession = profDetails.currentProfession;
      profileObj.skills = profDetails.skills;
      profileObj.company = profDetails.company;
    }

    // Connection count for this user
    const connectionsCount = await Connection.countDocuments({
      $or: [{ user1: resolvedUserId }, { user2: resolvedUserId }],
    });
    profileObj.connections = connectionsCount;

    // Post count — resolve author model (company vs user)
    let authorId = resolvedUserId;
    let authorModel = "User";
    let companyData = null;

    const company = await Company.findOne({ createdBy: resolvedUserId });
    if ((targetUser.role === "company" || targetUser.role === "hire") && company) {
      authorId = company._id;
      authorModel = "Company";
      companyData = company.toObject();

      // Override fullName and avatar for company role
      if (targetUser.role === "company") {
        profileObj.fullName = company.name;
        if (company.logo) {
          profileObj.avatar = company.logo;
        }
      }
    }

    const postsCount = await Post.countDocuments({
      author: authorId,
      authorModel,
      isDeleted: false,
    });
    profileObj.postsCount = postsCount;

    // --- Relationship Status ---
    const loggedInUserId = req.user.id;
    let connectionStatus = "none";
    let isFollowing = false;

    if (resolvedUserId !== loggedInUserId) {
      // Check Connection
      const isConnected = await Connection.findOne({
        $or: [
          { user1: loggedInUserId, user2: resolvedUserId },
          { user1: resolvedUserId, user2: loggedInUserId },
        ],
      });

      if (isConnected) {
        connectionStatus = "connected";
      } else {
        // Check Pending Requests
        const pendingRequest = await ConnectRequest.findOne({
          $or: [
            { senderId: loggedInUserId, recipientId: resolvedUserId, status: "pending" },
            { senderId: resolvedUserId, recipientId: loggedInUserId, status: "pending" },
          ],
        });
        if (pendingRequest) {
          connectionStatus = pendingRequest.senderId.toString() === loggedInUserId ? "pending_sent" : "pending_received";
        }
      }

      // Check Follow Status
      if (authorModel === "Company" && companyData) {
        const followRecord = await CompanyFollower.findOne({
          userId: loggedInUserId,
          companyId: companyData._id,
        });
        isFollowing = !!followRecord;
      }
    }

    return res.status(200).json({
      success: true,
      role: targetUser.role,
      profile: profileObj,
      companyData,
      connectionStatus,
      isFollowing,
    });
  } catch (error) {
    console.error("getPublicProfile error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


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
    const connectionsCount = await Connection.countDocuments({
      $or: [{ user1: req.user.id }, { user2: req.user.id }],
    });

    // Fetch posts count
    let authorId = req.user.id;
    let authorModel = "User";

    const company = await Company.findOne({ createdBy: req.user.id });
    if ((req.user.role === "company" || req.user.role === "hire") && company) {
      authorId = company._id;
      authorModel = "Company";
    }

    const postsCount = await Post.countDocuments({
      author: authorId,
      authorModel: authorModel,
      isDeleted: false,
    });

    // Convert profile to object to add extra fields
    const profileObj = profile.toObject();
    profileObj.connections = connectionsCount;
    profileObj.postsCount = postsCount;

    if (profDetails) {
      profileObj.hireType = profDetails.hireType;
      profileObj.industryExperience = profDetails.industryExperience;
      profileObj.portfolioDescription = profDetails.portfolioDescription;
      profileObj.currentProfession = profDetails.currentProfession;
      profileObj.skills = profDetails.skills;
      profileObj.company = profDetails.company;
    }

    // Override fullName and avatar for company role
    if (req.user.role === "company" && company) {
      profileObj.fullName = company.name;
      if (company.logo) {
        profileObj.avatar = company.logo;
      }
    }

    return res.status(200).json({ success: true, profile: profileObj });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

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
    // GET CURRENT USER
    // =========================
    const existingUser = await User.findById(req.user.id);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

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

    // =========================
    // EMAIL / PHONE LOGIC
    // =========================

    /*
      IMPORTANT RULE:

      If user originally registered with EMAIL:
      -> emailOrPhone should ALWAYS remain email
      -> adding/updating phone should NOT change login field

      If user originally registered with PHONE:
      -> emailOrPhone should ALWAYS remain phone
      -> adding/updating email should NOT change login field
    */

    const currentLogin = existingUser.emailOrPhone;

    const isEmailLogin = currentLogin.includes("@");

    // Store extra fields in profile only
    if (updateData.email !== undefined) {
      updateData.email = updateData.email;
    }

    if (updateData.phone !== undefined) {
      updateData.phone = updateData.phone;
    }

    // ONLY update login credential type user registered with
    if (isEmailLogin) {
      // User registered with EMAIL

      if (updateData.email) {
        userData.emailOrPhone = updateData.email;
      }

      // phone update will NOT affect login
    } else {
      // User registered with PHONE

      if (updateData.phone) {
        userData.emailOrPhone = updateData.phone;
      }

      // email update will NOT affect login
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
    // POSTS COUNT
    // =========================
    let authorIdForCount = req.user.id;
    let authorModelForCount = "User";

    const userCompany = await Company.findOne({ createdBy: req.user.id });
    if (
      (req.user.role === "company" || req.user.role === "hire") &&
      userCompany
    ) {
      authorIdForCount = userCompany._id;
      authorModelForCount = "Company";
    }

    const postsCount = await Post.countDocuments({
      author: authorIdForCount,
      authorModel: authorModelForCount,
      isDeleted: false,
    });

    // =========================
    // FINAL RESPONSE
    // =========================
    const profileToReturn = updatedProfile.toObject();
    if (req.user.role === "company" && userCompany) {
      profileToReturn.fullName = userCompany.name;
      if (userCompany.logo) {
        profileToReturn.avatar = userCompany.logo;
      }
    }

    return res.status(200).json({
      success: true,
      profile: {
        ...profileToReturn,

        user: updatedUser,

        professionalDetails,

        connections: connectionsCount,
        postsCount: postsCount,
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

module.exports = { getProfile, updateProfile, getPublicProfile };

