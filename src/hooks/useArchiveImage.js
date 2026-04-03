import { useState, useEffect, useCallback } from "react";
import axios from "axios";

/**
 * useArchivedImages
 * Fetches all archived (soft-deleted) images for the current user.
 * Returns { images, loading, error, refetch }
 */
export function useArchivedImages() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArchived = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Not authenticated");

      const res = await axios.get("http://localhost:8000/images/archived", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setImages(res.data);
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.message ||
        "Failed to load archived images";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArchived();
  }, [fetchArchived]);

  return { images, loading, error, refetch: fetchArchived };
}
