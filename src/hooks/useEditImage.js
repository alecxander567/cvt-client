import { useState } from "react";
import axios from "axios";

/**
 * useEditImage
 * Returns { editImage, editing, error }
 *
 * Usage:
 *   const { editImage, editing, error } = useEditImage();
 *   await editImage(imageId, { name: "New name", description: "New desc" });
 */
export function useEditImage() {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);

  const editImage = async (imageId, updates) => {
    setEditing(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Not authenticated");

      const res = await axios.patch(
        `http://localhost:8000/images/${imageId}`,
        updates,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      return res.data;
    } catch (err) {
      // Axios wraps server errors in err.response — extract detail if present
      const message =
        err.response?.data?.detail || err.message || "Failed to update image";
      setError(message);
      return null;
    } finally {
      setEditing(false);
    }
  };

  return { editImage, editing, error };
}
