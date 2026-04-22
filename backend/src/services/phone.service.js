// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const twilio = require("twilio");

// const router = express.Router();

// // Middleware
// router.use(cors());
// router.use(express.json());

// // Twilio
// const client = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

// // OTP store
// const otpStore = new Map();

// // Generate OTP
// function generateOTP() {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }

// const OTP_EXPIRY = 30 * 1000; // 🔥 30 seconds (same as email system)

// // ----------------------
// // SEND OTP (PHONE)
// // ----------------------
// router.post("/send-phone-otp", async (req, res) => {
//   try {
//     const { countryCode, mobile } = req.body;
//     const fullNumber = `${countryCode}${mobile}`;

//     const otp = generateOTP();

//     otpStore.set(fullNumber, {
//       otp,
//       expires: Date.now() + OTP_EXPIRY,
//     });

//     await client.messages.create({
//       body: `Your OTP is ${otp}`,
//       from: process.env.TWILIO_PHONE_NUMBER,
//       to: fullNumber,
//     });

//     res.json({
//       success: true,
//       message: "OTP sent successfully",
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       success: false,
//       message: "Failed to send OTP",
//     });
//   }
// });

// // ----------------------
// // VERIFY OTP (PHONE)
// // ----------------------
// router.post("/verify-phone-otp", (req, res) => {
//   try {
//     const { countryCode, mobile, otp } = req.body;
//     const fullNumber = `${countryCode}${mobile}`;

//     const data = otpStore.get(fullNumber);

//     if (!data) {
//       return res.status(400).json({
//         success: false,
//         message: "OTP not found",
//       });
//     }

//     if (Date.now() > data.expires) {
//       otpStore.delete(fullNumber);
//       return res.status(400).json({
//         success: false,
//         message: "OTP expired",
//       });
//     }

//     if (data.otp !== otp) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid OTP",
//       });
//     }

//     otpStore.delete(fullNumber);

//     res.json({
//       success: true,
//       message: "OTP verified successfully",
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       success: false,
//       message: "Verification failed",
//     });
//   }
// });

// module.exports = router;