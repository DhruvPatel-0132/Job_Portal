const express = require("express");
const router = express.Router();
const {
  getConversations,
  getMessages,
  markAsSeen,
} = require("../controllers/message.controller");
const protect = require("../middleware/auth.middleware");

router.use(protect);

router.get("/conversations", getConversations);
router.get("/:userId", getMessages);
router.patch("/:conversationId/seen", markAsSeen);

module.exports = router;
