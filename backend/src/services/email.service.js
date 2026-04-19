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

async function sendOTPEmail(email, otp) {
  const accessTokenObj = await oauth2Client.getAccessToken();
  const accessToken = accessTokenObj?.token || accessTokenObj;

  const transporter = nodemailer.createTransport({
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

module.exports = sendOTPEmail;