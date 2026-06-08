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

/* =========================================
   3. SEND TEMPORARY PASSWORD (NEW)
========================================= */
async function sendTemporaryPasswordEmail(email, password) {
  const transporter = await getTransporter();

  await transporter.sendMail({
    from: `Support <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: "Your Temporary Password for Login",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f3f4f6; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 40px 20px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Welcome to TalentForge</h1>
                  </td>
                </tr>
                
                <!-- Body -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="color: #374151; font-size: 16px; line-height: 24px; margin: 0 0 24px 0;">
                      Hi there,
                    </p>
                    <p style="color: #374151; font-size: 16px; line-height: 24px; margin: 0 0 24px 0;">
                      You have successfully registered using Google. We've automatically generated a temporary password for you, allowing you to log in securely with your email at any time.
                    </p>
                    
                    <!-- Password Box -->
                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; text-align: center; margin: 32px 0;">
                      <p style="color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px 0; font-weight: 600;">Your Temporary Password</p>
                      <div style="font-family: monospace; font-size: 32px; font-weight: 700; color: #0f172a; letter-spacing: 4px;">
                        ${password}
                      </div>
                    </div>
                    
                    <!-- Alert -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 4px; margin-bottom: 32px;">
                      <tr>
                        <td style="padding: 16px;">
                          <p style="color: #991b1b; font-size: 14px; line-height: 20px; margin: 0; font-weight: 500;">
                            <strong style="color: #b91c1c;">Security Notice:</strong> This temporary password will expire in exactly 7 days. We highly recommend logging in and setting a new, permanent password in your profile settings before then.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="color: #64748b; font-size: 14px; margin: 0 0 8px 0;">
                      Best regards,<br><strong style="color: #475569;">The TalentForge Team</strong>
                    </p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  });
}

module.exports = {
  sendOTPEmail,
  sendResetEmail,
  sendTemporaryPasswordEmail,
};