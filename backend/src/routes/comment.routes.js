const express = require("express");
const router = express.Router();
const {
  addCommentController,
  getCommentsController,
  deleteCommentController,
  addReplyController,
  getRepliesController,
} = require("../controllers/comment.controller");
const authMiddleware = require("../middleware/auth.middleware");

// ── Post-scoped routes ──────────────────────────────────────────────────────
// Get comments for a specific post
router.get("/post/:postId", getCommentsController);

// Add a comment to a post
router.post("/post/:postId", authMiddleware, addCommentController);

// Add a reply to a comment
router.post("/post/:postId/:commentId/reply", authMiddleware, addReplyController);

// ── Comment-scoped routes ───────────────────────────────────────────────────
// Delete a comment or reply (owner only)
router.delete("/:commentId", authMiddleware, deleteCommentController);

// Get replies for a comment
router.get("/:commentId/replies", getRepliesController);

module.exports = router;
