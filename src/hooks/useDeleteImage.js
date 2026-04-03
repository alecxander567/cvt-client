import { useState } from "react";
import axios from "axios";
import { flagNewActivity } from "../utils/activityFlag";

export function useDeleteImage() {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const deleteImage = async (imageId) => {
    setDeleting(true);
    setError(null);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Not authenticated");

      await axios.delete(`http://localhost:8000/images/${imageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      flagNewActivity();
      return true;
    } catch (err) {
      const message =
        err.response?.data?.detail || err.message || "Failed to archive image";
      setError(message);
      return false;
    } finally {
      setDeleting(false);
    }
  };

  return { deleteImage, deleting, error };
}
