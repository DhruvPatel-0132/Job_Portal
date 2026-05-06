const CompanyFollower = require("../models/CompanyFollower");
const Company = require("../models/Company");

exports.followCompany = async (req, res) => {
  try {
    const userId = req.user.id;
    const { companyId } = req.body;

    const existingFollow = await CompanyFollower.findOne({ userId, companyId });

    if (existingFollow) {
      return res.status(400).json({ success: false, message: "Already following this company" });
    }

    await CompanyFollower.create({ userId, companyId });

    // Update followers count
    await Company.findByIdAndUpdate(companyId, { $inc: { followersCount: 1 } });

    res.status(200).json({ success: true, message: "Company followed" });
  } catch (error) {
    console.error("followCompany error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.unfollowCompany = async (req, res) => {
  try {
    const userId = req.user.id;
    const { companyId } = req.params;

    const follow = await CompanyFollower.findOneAndDelete({ userId, companyId });

    if (!follow) {
      return res.status(404).json({ success: false, message: "Not following this company" });
    }

    // Update followers count
    await Company.findByIdAndUpdate(companyId, { $inc: { followersCount: -1 } });

    res.status(200).json({ success: true, message: "Company unfollowed" });
  } catch (error) {
    console.error("unfollowCompany error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getFollowedCompanies = async (req, res) => {
  try {
    const userId = req.user.id;
    const follows = await CompanyFollower.find({ userId }).populate("companyId");
    
    const companies = follows.map(f => f.companyId);
    
    res.status(200).json({ success: true, companies });
  } catch (error) {
    console.error("getFollowedCompanies error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
