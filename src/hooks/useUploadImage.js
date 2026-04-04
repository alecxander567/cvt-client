import { useState } from "react";
import axios from "axios";
import { flagNewActivity } from "../utils/activityFlag";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useUploadImage() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const upload = async (base64DataUrl) => {
    setUploading(true);
    setError(null);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Not authenticated. Please log in again.");

      const res = await fetch(base64DataUrl);
      const blob = await res.blob();

      const formData = new FormData();
      formData.append("file", blob, "capture.png");

      const response = await axios.post(
        `${API_BASE_URL}/images/upload`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      flagNewActivity();
      return response.data.url;
    } catch (err) {
      const message =
        err.response?.data?.detail || err.message || "Upload failed";
      setError(message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading, error };
}
