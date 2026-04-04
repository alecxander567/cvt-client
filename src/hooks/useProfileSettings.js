import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return { Authorization: `Bearer ${token}` };
};

export function useProfileSettings() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      setError("Failed to load user data.");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = async ({ username, email, password }) => {
    setError("");
    setSuccess("");
    setSaving(true);

    const payload = {};
    if (username && username !== user?.username) payload.username = username;
    if (email && email !== user?.email) payload.email = email;
    if (password) payload.password = password;

    if (Object.keys(payload).length === 0) {
      setError("No changes detected.");
      setSaving(false);
      return false;
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/users/profile`,
        payload,
        { headers: getAuthHeaders() },
      );

      const updatedUser = response.data.data;

      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        const merged = { ...parsed, ...updatedUser };
        localStorage.setItem("user", JSON.stringify(merged));
        setUser(merged);
      }

      setSuccess("Profile updated successfully!");
      return true;
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to update profile.";
      setError(msg);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  return {
    user,
    loading,
    saving,
    error,
    success,
    updateProfile,
    clearMessages,
  };
}
