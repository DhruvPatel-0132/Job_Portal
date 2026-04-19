const Otp = require("../models/Otp");

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// SAVE OTP (30 sec expiry)
async function setOTP(email) {
  const otp = generateOTP();

  await Otp.findOneAndUpdate(
  { email },
  {
    email,
    otp,
    expiresAt: new Date(Date.now() + 30 * 1000),
  },
  {
    upsert: true,
    returnDocument: "after", // ✅ modern replacement
  }
);

  return otp;
}

// VERIFY OTP
async function verifyOTP(email, otp) {
  const record = await Otp.findOne({ email });

  if (!record) return false;

  if (record.otp !== otp) return false;

  return true;
}

// DELETE AFTER SUCCESS
async function clearOTP(email) {
  await Otp.deleteOne({ email });
}

module.exports = { setOTP, verifyOTP, clearOTP };