const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { getUserConnections, removeConnection } = require("../controllers/connection.controller");

router.get("/", authMiddleware, getUserConnections);
router.delete("/:userId", authMiddleware, removeConnection);

module.exports = router;
