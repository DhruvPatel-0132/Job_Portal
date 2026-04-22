const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv").config();

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

// 🔥 Create transporter ONCE (better performance)
let transporter;

const getTransporter = async () => {
  if (transporter) return transporter;

  const accessTokenObj = await oauth2Client.getAccessToken();
  const accessToken = accessTokenObj?.token || accessTokenObj;

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.SENDER_EMAIL,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken,
    },
  });

  return transporter;
};

/* =========================================
   1. SEND OTP EMAIL (YOUR EXISTING FLOW)
========================================= */
async function sendOTPEmail(email, otp) {
  const transporter = await getTransporter();

  await transporter.sendMail({
    from: `OTP System <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: "Your OTP Code",
    html: `
      <div style="font-family:Arial">
        <h2>OTP Verification</h2>
        <h1>${otp}</h1>
        <p>Valid for 30 seconds only</p>
      </div>
    `,
  });
}

/* =========================================
   2. SEND RESET LINK (NEW)
========================================= */
async function sendResetEmail(email, link) {
  const transporter = await getTransporter();

  await transporter.sendMail({
    from: `Support <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: "Reset Your Password",
    html: `
      <div style="font-family:Arial">
        <h2>Password Reset</h2>
        <p>Click the button below to reset your password:</p>
        <a href="${link}" 
           style="display:inline-block;padding:10px 20px;background:#000;color:#fff;text-decoration:none;border-radius:5px;">
           Reset Password
        </a>
        <p>This link expires in 15 minutes.</p>
      </div>
    `,
  });
}

module.exports = {
  sendOTPEmail,
  sendResetEmail,
};