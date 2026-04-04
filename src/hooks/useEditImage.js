import { useState } from "react";
import axios from "axios";
import { flagNewActivity } from "../utils/activityFlag";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
        `${API_BASE_URL}/images/${imageId}`,
        updates,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      flagNewActivity();
      return res.data;
    } catch (err) {
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
