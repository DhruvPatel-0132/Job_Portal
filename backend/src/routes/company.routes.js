const express = require("express");
const router = express.Router();
const { getCompanies, updateCompany } = require("../controllers/company.controller");
const verifyToken = require("../middleware/auth.middleware");

const { followCompany, unfollowCompany, getFollowedCompanies } = require("../controllers/companyFollow.controller");

router.get("/", getCompanies);
router.put("/me", verifyToken, updateCompany);

// Follow system
router.post("/follow", verifyToken, followCompany);
router.delete("/unfollow/:companyId", verifyToken, unfollowCompany);
router.get("/followed", verifyToken, getFollowedCompanies);

module.exports = router;
