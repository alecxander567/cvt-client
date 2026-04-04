import { useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useCompareImage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const compareImage = async (imageId, base64Image) => {
    try {
      setLoading(true);

      const res = await fetch(base64Image);
      const blob = await res.blob();

      const formData = new FormData();
      formData.append("file", blob, "compare.png");

      const token = localStorage.getItem("access_token");

      const response = await axios.post(
        `${API_BASE_URL}/images/compare/${imageId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setResult(response.data);
      return response.data;
    } catch (err) {
      console.error("Compare error:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { compareImage, loading, result };
}
