const cloudinary = require("../config/cloudinary");

const getSignature = async (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = `profiles/${req.user.id}`; // Dynamic folder based on user ID

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: folder,
      },
      process.env.CLOUDINARY_API_SECRET
    );

    res.status(200).json({
      signature,
      timestamp,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      folder: folder, // Return the folder to the frontend
    });
  } catch (error) {
    console.error("Cloudinary Signature Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getSignature,
};
