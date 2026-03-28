import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
          "http://localhost:8000/auth/logout",
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
