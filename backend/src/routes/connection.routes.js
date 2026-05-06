const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { getUserConnections } = require("../controllers/connection.controller");

router.get("/", authMiddleware, getUserConnections);

module.exports = router;
