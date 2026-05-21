const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { getSignature } = require("../controllers/upload.controller");

router.get("/signature", authMiddleware, getSignature);

module.exports = router;
