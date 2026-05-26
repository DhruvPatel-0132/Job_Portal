const express = require("express");
const router = express.Router();
const {
  getConversations,
  getMessages,
  markAsSeen,
  createGroup,
  getUserGroups,
  getGroupMembers,
  exitGroup,
} = require("../controllers/message.controller");
const protect = require("../middleware/auth.middleware");

router.use(protect);

router.get("/conversations", getConversations);
router.post("/groups", createGroup);
router.get("/groups", getUserGroups);
router.get("/groups/:id/members", getGroupMembers);
router.post("/groups/:id/exit", exitGroup);
router.get("/:userId", getMessages);
router.patch("/:conversationId/seen", markAsSeen);

module.exports = router;
