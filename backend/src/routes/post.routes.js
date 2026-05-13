const express = require("express");
const router = express.Router();
const {
  createPostController,
  getPostsController,
  getUserPostsController,
  incrementPostViewsController,
} = require("../controllers/post.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Create a new post
router.post("/", authMiddleware, createPostController);

// Get all posts (public/feed)
router.get("/", authMiddleware, getPostsController);

// Get my posts
router.get("/me", authMiddleware, getUserPostsController);

// Increment post views
router.patch("/:id/view", authMiddleware, incrementPostViewsController);

module.exports = router;
