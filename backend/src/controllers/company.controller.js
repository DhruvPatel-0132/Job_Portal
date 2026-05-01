const Company = require("../models/Company");

exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().select("name").sort({ name: 1 });
    res.status(200).json({ success: true, companies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
