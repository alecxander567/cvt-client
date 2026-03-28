import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { data } = await axios.post("http://localhost:8000/auth/login", {
        email,
        password,
      });

      // Store JWT token
      localStorage.setItem("access_token", data.access_token);

      setSuccessMessage("Login successful! Redirecting...");

      setTimeout(() => navigate("/home"), 1000);
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
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    successMessage,
    handleLogin,
  };
}
