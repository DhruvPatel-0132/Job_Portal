const express = require("express");
const router = express.Router();

const {
  sendPhoneOTP,
  verifyPhoneOTP,
} = require("../controllers/phoneOtp.controller");

router.post("/send", sendPhoneOTP);
router.post("/verify", verifyPhoneOTP);

module.exports = router;