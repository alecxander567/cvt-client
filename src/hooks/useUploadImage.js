import { useState } from "react";
import axios from "axios";

/**
 * useUploadImage
 * Returns { upload, uploading, error }
 *
 * Usage:
 *   const { upload, uploading, error } = useUploadImage();
 *   const url = await upload(base64DataUrl);
 */
export function useUploadImage() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const upload = async (base64DataUrl) => {
    setUploading(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Not authenticated. Please log in again.");

      // Convert base64 data URL → Blob
      const res = await fetch(base64DataUrl);
      const blob = await res.blob();

      const formData = new FormData();
      formData.append("file", blob, "capture.png");

      const response = await axios.post(
        "http://localhost:8000/images/upload",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      return response.data.url; 
    } catch (err) {
      // Axios wraps server errors in err.response — extract detail if present
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
