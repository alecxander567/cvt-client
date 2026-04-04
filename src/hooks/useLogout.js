import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useLogout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");

      if (token) {
        await axios.post(
          `${API_BASE_URL}/auth/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      localStorage.removeItem("access_token");
      setLoading(false);
      navigate("/");
    }
  };

  return { logout, loading, error };
}
