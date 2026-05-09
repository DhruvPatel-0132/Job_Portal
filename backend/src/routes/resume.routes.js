const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const { uploadResume, getLatestResume } = require("../controllers/resume.controller");

router.post("/upload", auth, upload.single("resume"), uploadResume);
router.get("/latest", auth, getLatestResume);

module.exports = router;
