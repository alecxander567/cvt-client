import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";

const navLinks = [
  { label: "Gallery", path: "/gallery", aliases: ["/", "/home"] },
  { label: "Albums", path: "/albums" },
  { label: "Categories", path: "/categories" },
  { label: "History", path: "/history" },
  { label: "Archive", path: "/archive" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { logout, loading } = useLogout();

  const isActive = (link) =>
    location.pathname === link.path ||
    (link.aliases?.includes(location.pathname) ?? false);

  const isActivePath = (path) => location.pathname === path;

  return (
    <nav className="w-full border-b-2 border-black bg-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* LEFT — Logo + Title */}
        <Link to="/home" className="flex items-center gap-3 group">
          <div className="flex items-center justify-center w-9 h-9 bg-black rounded-lg shrink-0">
            <svg
              width="20"
              height="20"
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
          <span className="text-sm font-black uppercase tracking-tight text-black group-hover:text-gray-600 transition-colors">
            Custom Vision Tagger
          </span>
        </Link>

        {/* RIGHT — Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors ${
                isActive(link) ?
                  "bg-black text-white"
                : "text-gray-500 hover:text-black hover:bg-gray-100"
              }`}>
              {link.label}
            </Link>
          ))}

          <div className="w-px h-5 bg-gray-200 mx-2" />

          <Link
            to="/profile"
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors ${
              isActivePath("/profile") ?
                "bg-black text-white"
              : "text-gray-500 hover:text-black hover:bg-gray-100"
            }`}>
            Profile
          </Link>

          <Link
            to="/settings"
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors ${
              isActivePath("/settings") ?
                "bg-black text-white"
              : "text-gray-500 hover:text-black hover:bg-gray-100"
            }`}>
            Settings
          </Link>

          {/* Desktop Log Out */}
          <button
            onClick={logout}
            disabled={loading}
            className="ml-1 px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded-lg border-2 border-black text-black hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? "..." : "Log Out"}
          </button>
        </div>

        {/* RIGHT — Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5"
          aria-label="Toggle menu">
          <span
            className={`block w-5 h-0.5 bg-black transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-black transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-black transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-96 border-t-2 border-black" : "max-h-0"}`}>
        <div className="px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors ${
                isActive(link) ?
                  "bg-black text-white"
                : "text-gray-500 hover:text-black hover:bg-gray-100"
              }`}>
              {link.label}
            </Link>
          ))}
          <Link
            to="/profile"
            onClick={() => setMenuOpen(false)}
            className={`px-3 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors ${
              isActivePath("/profile") ?
                "bg-black text-white"
              : "text-gray-500 hover:text-black hover:bg-gray-100"
            }`}>
            Profile
          </Link>
          <Link
            to="/settings"
            onClick={() => setMenuOpen(false)}
            className={`px-3 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors ${
              isActivePath("/settings") ?
                "bg-black text-white"
              : "text-gray-500 hover:text-black hover:bg-gray-100"
            }`}>
            Settings
          </Link>
          <div className="h-px bg-gray-200 my-1" />

          {/* Mobile Log Out */}
          <button
            onClick={logout}
            disabled={loading}
            className="px-3 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg border-2 border-black text-black hover:bg-black hover:text-white transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? "Logging out..." : "Log Out"}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
