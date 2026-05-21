const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { getProfile, updateProfile, getPublicProfile } = require("../controllers/profile.controller");

// Own profile (authenticated user)
router.get("/me", authMiddleware, getProfile);
router.put("/me", authMiddleware, updateProfile);

// Public profile — view any user's profile by their userId
// Must be AFTER /me to avoid "me" being treated as a userId param
router.get("/:userId", authMiddleware, getPublicProfile);

module.exports = router;

