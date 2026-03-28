import { useState } from "react";
import axios from "axios";

/**
 * useDeleteImage
 * Returns { deleteImage, deleting, error }
 *
 * Usage:
 *   const { deleteImage, deleting, error } = useDeleteImage();
 *   await deleteImage(imageId);
 */
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

      return true;
    } catch (err) {
      // Axios wraps server errors in err.response — extract detail if present
      const message =
        err.response?.data?.detail || err.message || "Failed to delete image";
      setError(message);
      return false;
    } finally {
      setDeleting(false);
    }
  };

  return { deleteImage, deleting, error };
}
