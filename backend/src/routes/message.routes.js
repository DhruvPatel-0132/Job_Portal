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
  editGroupDetails,
  addGroupMembers,
  removeGroupMember,
  deleteGroup,
  assignGroupAdmin,
  removeGroupAdmin,
} = require("../controllers/message.controller");
const protect = require("../middleware/auth.middleware");

router.use(protect);

router.get("/conversations", getConversations);
router.post("/groups", createGroup);
router.put("/groups/:id", editGroupDetails);
router.delete("/groups/:id", deleteGroup);
router.post("/groups/:id/members", addGroupMembers);
router.delete("/groups/:id/members/:memberId", removeGroupMember);
router.post("/groups/:id/admins/:userId", assignGroupAdmin);
router.delete("/groups/:id/admins/:userId", removeGroupAdmin);
router.get("/groups", getUserGroups);
router.get("/groups/:id/members", getGroupMembers);
router.post("/groups/:id/exit", exitGroup);
router.get("/:userId", getMessages);
router.patch("/:conversationId/seen", markAsSeen);

module.exports = router;
