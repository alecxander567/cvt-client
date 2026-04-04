import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useMyImages() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Not authenticated");

      const res = await axios.get(`${API_BASE_URL}/images/my-images`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setImages(res.data);
    } catch (err) {
      const message =
        err.response?.data?.detail || err.message || "Failed to fetch images";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return { images, loading, error, refetch: fetchImages };
}
