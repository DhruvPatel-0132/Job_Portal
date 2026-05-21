const Company = require("../models/Company");

exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().select("name").sort({ name: 1 });
    res.status(200).json({ success: true, companies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData.createdBy; // Prevent changing ownership
    delete updateData._id;

    const company = await Company.findOneAndUpdate(
      { createdBy: req.user.id },
      { $set: updateData },
      { new: true, upsert: true }
    );
    res.status(200).json({ success: true, company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
