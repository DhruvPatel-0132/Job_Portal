import api from "../api/axios";
import axios from "axios";

export const uploadToCloudinary = async (file, type = "post", subType = "regular", objectId = null) => {
  try {
    // 1. Get signature from backend
    const { data } = await api.get("/upload/signature", {
      params: { type, subType, objectId }
    });
    const { signature, timestamp, cloud_name, api_key, folder } = data;

    // 2. Prepare form data for Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("signature", signature);
    formData.append("timestamp", timestamp);
    formData.append("api_key", api_key);
    formData.append("folder", folder);

    // 3. Determine resource type (image or video)
    const resourceType = file.type.startsWith("video/") ? "video" : "image";

    // 4. Upload directly to Cloudinary
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/${resourceType}/upload`;
    const response = await axios.post(cloudinaryUrl, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return {
      url: response.data.secure_url,
      publicId: response.data.public_id,
      resource_type: response.data.resource_type,
      folder: response.data.folder,
      objectId: data.objectId // Return the objectId from the signature response
    };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
};
