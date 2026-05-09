const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
} = require("../controllers/notification.controller");

router.get("/", authMiddleware, getNotifications);
router.patch("/read-all", authMiddleware, markAllAsRead);
router.patch("/:id/read", authMiddleware, markAsRead);
router.get("/unread-count", authMiddleware, getUnreadCount);

module.exports = router;
