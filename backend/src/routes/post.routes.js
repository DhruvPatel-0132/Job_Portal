const express = require("express");
const router = express.Router();
const {
  createPostController,
  getPostsController,
  getUserPostsController,
  getSavedPostsController,
  incrementPostViewsController,
  updatePostController,
  deletePostController,
  archivePostController,
  toggleReactionController,
  toggleSavePostController,
  getRecommendedJobsController,
  getMyJobPostsController,
} = require("../controllers/post.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Create a new post
router.post("/", authMiddleware, createPostController);

// Get recommended jobs
router.get("/jobs/recommended", authMiddleware, getRecommendedJobsController);

// Get all posts (public/feed)
router.get("/", authMiddleware, getPostsController);

// Get my posts
router.get("/me", authMiddleware, getUserPostsController);

// Get my saved posts
router.get("/saved", authMiddleware, getSavedPostsController);

// Get my job posts (company)
router.get("/my-job-posts", authMiddleware, getMyJobPostsController);

// Edit a post
router.put("/:id", authMiddleware, updatePostController);

// Delete a post
router.delete("/:id", authMiddleware, deletePostController);

// Archive a post
router.patch("/:id/archive", authMiddleware, archivePostController);

// Increment post views
router.patch("/:id/view", authMiddleware, incrementPostViewsController);
// Toggle reaction on a post
router.post("/:id/react", authMiddleware, toggleReactionController);

// Toggle save on a post
router.post("/:id/save", authMiddleware, toggleSavePostController);

module.exports = router;
