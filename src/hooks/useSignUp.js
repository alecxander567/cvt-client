import { useState } from "react";
import axios from "axios";

export default function useSignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { data } = await axios.post("http://localhost:8000/auth/signup", {
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
