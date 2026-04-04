import { useState } from "react";
import axios from "axios";
import { flagNewActivity } from "../utils/activityFlag";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useRestoreImage() {
  const [restoring, setRestoring] = useState(false);
  const [error, setError] = useState(null);

  const restoreImage = async (imageId) => {
    setRestoring(true);
    setError(null);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Not authenticated");

      await axios.patch(
        `${API_BASE_URL}/images/restore/${imageId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      flagNewActivity();
      return true;
    } catch (err) {
      const message =
        err.response?.data?.detail || err.message || "Failed to restore image";
      setError(message);
      return false;
    } finally {
      setRestoring(false);
    }
  };

  return { restoreImage, restoring, error };
}

export function usePermanentDeleteImage() {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const permanentDelete = async (imageId) => {
    setDeleting(true);
    setError(null);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Not authenticated");

      await axios.delete(`${API_BASE_URL}/images/permanent/${imageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      flagNewActivity();
      return true;
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.message ||
        "Failed to permanently delete image";
      setError(message);
      return false;
    } finally {
      setDeleting(false);
    }
  };

  return { permanentDelete, deleting, error };
}
