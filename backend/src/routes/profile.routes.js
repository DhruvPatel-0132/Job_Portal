const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { getProfile, updateProfile } = require("../controllers/profile.controller");

// Protected routes
router.get("/me", authMiddleware, getProfile);
router.put("/me", authMiddleware, updateProfile);

module.exports = router;
