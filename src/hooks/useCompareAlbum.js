import { useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useCompareAlbum() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const compareAlbum = async (albumId, imageBase64) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(imageBase64);
      const blob = await res.blob();

      const formData = new FormData();
      formData.append("file", blob, "capture.png");

      const token = localStorage.getItem("access_token");

      const response = await axios.post(
        `${API_BASE_URL}/images/compare-album/${albumId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data;
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { compareAlbum, loading, error };
}
