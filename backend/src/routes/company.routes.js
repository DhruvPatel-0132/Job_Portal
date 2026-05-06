const express = require("express");
const router = express.Router();
const { getCompanies, updateCompany } = require("../controllers/company.controller");
const verifyToken = require("../middleware/auth.middleware");

router.get("/", getCompanies);
router.put("/me", verifyToken, updateCompany);

module.exports = router;
