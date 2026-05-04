import api from "../api/axios";
import axios from "axios";

export const uploadToCloudinary = async (file) => {
  try {
    // 1. Get signature from backend
    const { data } = await api.get("/upload/signature");
    const { signature, timestamp, cloud_name, api_key, folder } = data;

    // 2. Prepare form data for Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("signature", signature);
    formData.append("timestamp", timestamp);
    formData.append("api_key", api_key);
    formData.append("folder", folder);

    // 3. Upload directly to Cloudinary
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;
    const response = await axios.post(cloudinaryUrl, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
};
