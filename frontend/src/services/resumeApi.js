import axios from "axios";

const API_URL = "http://localhost:5000/api/resume";

export const uploadResume = async (file) => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("resume", file);

  const res = await axios.post(`${API_URL}/upload`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const getLatestResume = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/latest`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
