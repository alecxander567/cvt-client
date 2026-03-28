import React, { useEffect, useState } from "react";
import useLogin from "../hooks/useLogin";
import { Link } from "react-router-dom";
import Alert from "../components/Alert";

function LoginPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    successMessage,
    handleLogin,
  } = useLogin();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10 overflow-hidden">
      <div className="w-full max-w-4xl flex flex-col md:flex-row items-center md:items-stretch gap-10 md:gap-0">
        {/* LEFT — Branding */}
        <div
          className="flex flex-col justify-center md:w-1/2 md:pr-12"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateX(0)" : "translateX(-40px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}>
          <div className="flex justify-center md:justify-start mb-6">
            <div className="flex items-center justify-center w-12 h-12 bg-black rounded-xl">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="7" height="7" fill="white" />
                <rect
                  x="14"
                  y="3"
                  width="7"
                  height="7"
                  fill="white"
                  opacity="0.5"
                />
                <rect
                  x="3"
                  y="14"
                  width="7"
                  height="7"
                  fill="white"
                  opacity="0.5"
                />
                <rect x="14" y="14" width="7" height="7" fill="white" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-black uppercase leading-tight text-center md:text-left">
            Custom
            <br />
            Vision
            <br />
            Tagger
          </h1>
          <p className="text-sm text-gray-400 mt-4 tracking-widest uppercase text-center md:text-left">
            AI-powered image tagging
          </p>
          <div className="hidden md:block mt-10 w-16 h-1 bg-black" />
          <p className="hidden md:block mt-4 text-xs text-gray-400 leading-relaxed max-w-xs">
            Tag, organize, and manage your images with the power of custom
            vision models.
          </p>
        </div>

        {/* Vertical divider — desktop only */}
        <div
          className="hidden md:block w-px bg-black self-stretch"
          style={{
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.6s ease 0.2s",
          }}
        />

        {/* RIGHT — Form */}
        <div
          className="w-full md:w-1/2 md:pl-12 flex flex-col justify-center"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateX(0)" : "translateX(40px)",
            transition: "opacity 0.6s ease 0.15s, transform 0.6s ease 0.15s",
          }}>
          <h2 className="text-xl font-black uppercase tracking-widest text-black mb-1">
            Sign In
          </h2>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-6">
            Welcome back
          </p>

          {/* Alerts */}
          <Alert type="error" message={error} />
          <Alert type="success" message={successMessage} />

          {/* Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-black mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-black rounded-lg text-sm bg-white text-black placeholder-gray-400 focus:outline-none focus:bg-gray-50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-black mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-black rounded-lg text-sm bg-white text-black placeholder-gray-400 focus:outline-none focus:bg-gray-50 transition-colors"
              />
            </div>
          </div>

          {/* Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full mt-6 py-3 bg-black text-white font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-gray-800 active:translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="px-3 text-xs text-gray-400 uppercase tracking-widest">
              or
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Link to Sign Up */}
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-black font-bold underline underline-offset-2 hover:text-gray-600 transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
