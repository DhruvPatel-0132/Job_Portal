const cloudinary = require("../config/cloudinary");

const mongoose = require("mongoose");

const getSignature = async (req, res) => {
  try {
    let { type, subType, objectId } = req.query;
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    let folder = "general";

    if (type === "post") {
      // If no objectId provided, pre-generate one for the post
      if (!objectId) {
        objectId = new mongoose.Types.ObjectId().toString();
      }
      const postType = subType || "regular";
      folder = `posts/${postType}/${objectId}`;
    } else if (type === "profile") {
      folder = `profiles/${req.user.id}`;
    } else {
      folder = `others/${req.user.id}`;
    }

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
      folder: folder,
      objectId: objectId, // Return the pre-generated ID
    });
  } catch (error) {
    console.error("Cloudinary Signature Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getSignature,
};
