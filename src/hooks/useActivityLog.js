import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.get(`${API_BASE_URL}/activity/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load activity logs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    const handleNewActivity = () => fetchLogs();
    window.addEventListener("history-activity-updated", handleNewActivity);
    return () =>
      window.removeEventListener("history-activity-updated", handleNewActivity);
  }, [fetchLogs]);

  return { logs, loading, error, refetch: fetchLogs };
}
