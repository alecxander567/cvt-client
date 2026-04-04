import { useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function useSignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSignUp = async () => {
    setError(null);
    setSuccessMessage(null);

    if (!username.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(`${API_BASE_URL}/auth/signup`, {
        username,
        email,
        password,
      });

      setSuccessMessage(data.message);

      setUsername("");
      setEmail("");
      setPassword("");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Network error");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    successMessage,
    handleSignUp,
  };
}
