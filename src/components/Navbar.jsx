import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import {
  HISTORY_BADGE_KEY,
  clearActivityFlag,
  getActivityFlag,
} from "../utils/activityFlag";

const navLinks = [
  { label: "Gallery", path: "/home", aliases: ["/", "/home"] },
  { label: "Albums", path: "/albums" },
  { label: "Categories", path: "/categories" },
  { label: "History", path: "/history", badge: true },
  { label: "Archive", path: "/archive" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasNewActivity, setHasNewActivity] = useState(() => getActivityFlag());
  const location = useLocation();
  const { logout, loading } = useLogout();

  useEffect(() => {
    const handleStorageEvent = (e) => {
      if (e.key === HISTORY_BADGE_KEY) {
        setHasNewActivity(e.newValue === "true");
      }
    };

    const handleCustomEvent = () => {
      setHasNewActivity(getActivityFlag());
    };

    window.addEventListener("storage", handleStorageEvent);
    window.addEventListener("history-activity-updated", handleCustomEvent);

    return () => {
      window.removeEventListener("storage", handleStorageEvent);
      window.removeEventListener("history-activity-updated", handleCustomEvent);
    };
  }, []);

  const handleNavClick = (path) => {
    if (path === "/history") {
      clearActivityFlag();
      setHasNewActivity(false);
    }
    setMenuOpen(false);
  };

  const isActive = (link) => {
    if (location.pathname === link.path) return true;
    if (link.aliases?.includes(location.pathname)) return true;
    if (link.path !== "/" && location.pathname.startsWith(link.path + "/"))
      return true;
    return false;
  };

  const isProfileSettingsActive =
    location.pathname.startsWith("/profile") ||
    location.pathname.startsWith("/settings");

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
              onClick={() => handleNavClick(link.path)}
              className={`relative px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors ${
                isActive(link) ?
                  "bg-black text-white"
                : "text-gray-500 hover:text-black hover:bg-gray-100"
              }`}>
              {link.label}
              {link.badge && hasNewActivity && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
              )}
            </Link>
          ))}

          <div className="w-px h-5 bg-gray-200 mx-2" />

          <Link
            to="/profile"
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors ${
              isProfileSettingsActive ?
                "bg-black text-white"
              : "text-gray-500 hover:text-black hover:bg-gray-100"
            }`}>
            Profile & Settings
          </Link>

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
              onClick={() => handleNavClick(link.path)}
              className={`relative px-3 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors ${
                isActive(link) ?
                  "bg-black text-white"
                : "text-gray-500 hover:text-black hover:bg-gray-100"
              }`}>
              {link.label}
              {link.badge && hasNewActivity && (
                <span className="absolute top-2 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
              )}
            </Link>
          ))}
          <Link
            to="/profile"
            onClick={() => setMenuOpen(false)}
            className={`px-3 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors ${
              isProfileSettingsActive ?
                "bg-black text-white"
              : "text-gray-500 hover:text-black hover:bg-gray-100"
            }`}>
            Profile & Settings
          </Link>
          <div className="h-px bg-gray-200 my-1" />
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
