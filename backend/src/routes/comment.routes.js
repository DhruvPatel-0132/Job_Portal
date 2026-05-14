const express = require("express");
const router = express.Router();
const { addCommentController, getCommentsController } = require("../controllers/comment.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Get comments for a specific post
router.get("/:postId", getCommentsController);

// Add a comment to a post
router.post("/:postId", authMiddleware, addCommentController);

module.exports = router;
