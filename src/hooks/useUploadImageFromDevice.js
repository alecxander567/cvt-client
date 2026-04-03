import { useState } from "react";
import axios from "axios";
import { flagNewActivity } from "../utils/activityFlag";

export function useUploadImageFromDevice() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadImage = async (file, albumId = null) => {
    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);
      if (albumId) formData.append("album_id", albumId);

      const token = localStorage.getItem("access_token");

      const response = await axios.post(
        "http://localhost:8000/images/upload-image",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      flagNewActivity();
      return response.data;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || err.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading, error };
}
