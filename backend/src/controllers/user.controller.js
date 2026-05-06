const User = require("../models/User");
const Profile = require("../models/Profile");
const Company = require("../models/Company");
const ProfessionalDetails = require("../models/ProfessionalDetails");

/* GET CURRENT USER + PROFILE */
exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const Company = require("../models/Company");

    // 🔥 run both queries in parallel (better performance)
    const [user, profile] = await Promise.all([
      User.findById(userId).select("-password"),
      Profile.findOne({ userId }),
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let company = null;
    if (user.role === "company") {
      company = await Company.findOne({ createdBy: userId });
    }

    res.status(200).json({
      success: true,
      user,
      profile: profile || {}, // fallback if not found
      company: company || null,
    });
  } catch (err) {
    console.error("getMe error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* UPDATE ONBOARDING STATUS */
/* UPDATE USER ROLE (used after Google OAuth) */
exports.updateRole = async (req, res) => {
  try {
    const userId = req.user.id;
    const { role, companyName, year, about, hireType, currentProfession, experience, project, selectedCompany, newCompany } = req.body;

    if (!role) {
      return res.status(400).json({ success: false, message: "Role is required" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Create role-specific records
    if (role === "company" && companyName) {
      await Company.create({
        name: companyName,
        establishedYear: year || "",
        about: about || "",
        createdBy: userId,
      }).catch((err) => console.log("Company create error", err));
    } else if (role === "hire" && hireType) {
      const profDetails = { userId, hireType };
      if (hireType === "individual") {
        profDetails.currentProfession = currentProfession || "";
        profDetails.industryExperience = experience || "";
        profDetails.portfolioDescription = project || "";
      } else if (hireType === "company") {
        profDetails.company = selectedCompany || newCompany || "";
        if (newCompany) {
          await Company.create({ name: newCompany, createdBy: userId })
            .catch((err) => console.log("Company create error", err));
        }
      }
      await ProfessionalDetails.create(profDetails)
        .catch((err) => console.log("ProfessionalDetails create error", err));
    }

    res.status(200).json({
      success: true,
      message: "Role updated",
      user,
    });
  } catch (err) {
    console.error("updateRole error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

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

/* GET ALL USERS FOR NETWORK PAGE */
exports.getAllUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    
    // Fetch all users except the current one
    const users = await User.find({ _id: { $ne: currentUserId } }).select("firstName lastName role isVerified avatar");
    
    // Fetch profiles for these users
    const userIds = users.map(user => user._id);
    const profiles = await Profile.find({ userId: { $in: userIds } }).select("userId headline banner avatar");

    // Fetch companies for company users
    const companyUsers = users.filter(u => u.role === "company");
    const companyUserIds = companyUsers.map(u => u._id);
    const companies = await require("../models/Company").find({ createdBy: { $in: companyUserIds } }).select("_id createdBy");

    // Map profiles to users
    const usersWithProfiles = users.map(user => {
      const userProfile = profiles.find(p => p.userId.toString() === user._id.toString());
      const userCompany = companies.find(c => c.createdBy.toString() === user._id.toString());
      
      return {
        _id: user._id,
        name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : (user.firstName || user.lastName || "Unknown User"),
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar || userProfile?.avatar || "/avatar.svg",
        headline: userProfile?.headline || "No headline available",
        banner: userProfile?.banner || "linear-gradient(to bottom right, #a1c4fd, #c2e9fb)",
        companyId: userCompany ? userCompany._id : null
      };
    });

    res.status(200).json({
      success: true,
      users: usersWithProfiles,
    });
  } catch (err) {
    console.error("getAllUsers error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
