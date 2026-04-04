import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { useProfileSettings } from "../hooks/useProfileSettings";
import Alert from "../components/Alert";

// ── small reusable field ──────────────────────────────────────────────────────
function Field({ label, type = "text", value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
        {label}
      </label>
      <div className="relative">
        <input
          type={isPassword && show ? "text" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2.5 text-sm font-medium border-2 border-black rounded-xl outline-none focus:ring-2 focus:ring-black placeholder:font-normal placeholder:text-gray-400 pr-10"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors">
            {show ?
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            : <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            }
          </button>
        )}
      </div>
    </div>
  );
}

// ── section wrapper ───────────────────────────────────────────────────────────
function Section({ title, description, children }) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-sm font-black uppercase tracking-widest text-black">
          {title}
        </h2>
        {description && (
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────
function ProfileSettingsPage() {
  const {
    user,
    loading,
    saving,
    error,
    success,
    updateProfile,
    clearMessages,
  } = useProfileSettings();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });

  // Populate fields once — only on the first time user becomes available
  const initialized = useRef(false);
  useEffect(() => {
    if (user && !initialized.current) {
      initialized.current = true;
      setUsername(user.username || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // Pipe hook error/success into the Alert component
  useEffect(() => {
    if (error) setAlert({ type: "error", message: error });
  }, [error]);

  useEffect(() => {
    if (success) setAlert({ type: "success", message: success });
  }, [success]);

  // Clear hook messages on unmount
  useEffect(() => {
    return () => clearMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setAlert({ type: "", message: "" });
    await updateProfile({ username, email });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setAlert({ type: "", message: "" });

    if (!newPassword) {
      setAlert({ type: "error", message: "New password is required." });
      return;
    }
    if (newPassword.length < 8) {
      setAlert({
        type: "error",
        message: "Password must be at least 8 characters.",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setAlert({ type: "error", message: "Passwords do not match." });
      return;
    }

    const ok = await updateProfile({ password: newPassword });
    if (ok) {
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-black text-2xl uppercase tracking-tight text-black leading-none">
              Profile & Settings
            </h1>
            <p className="text-xs text-gray-400 mt-1 font-medium">
              Manage your account information
            </p>
          </div>
        </div>

        <div className="h-px bg-black mb-8" />

        {/* ── Loading ── */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-2 h-2 bg-black rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {!loading && (
          <div className="flex flex-col gap-10">
            {/* ── Profile Info ── */}
            <form onSubmit={handleSaveProfile} className="flex flex-col gap-6">
              <Section
                title="Account Info"
                description="Update your display name and email address.">
                <Field
                  label="Username"
                  value={username}
                  onChange={setUsername}
                  placeholder="Your username"
                />
                <Field
                  label="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="your@email.com"
                />
              </Section>

              <div className="h-px bg-gray-100" />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-bold uppercase tracking-widest rounded-xl border-2 border-black text-black hover:bg-black hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>

            <div className="h-px bg-black" />

            {/* ── Password ── */}
            <form
              onSubmit={handleChangePassword}
              className="flex flex-col gap-6">
              <Section
                title="Change Password"
                description="Choose a strong password with at least 8 characters.">
                <Field
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(v) => {
                    setNewPassword(v);
                    setAlert({ type: "", message: "" });
                  }}
                  placeholder="••••••••"
                />
                <Field
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(v) => {
                    setConfirmPassword(v);
                    setAlert({ type: "", message: "" });
                  }}
                  placeholder="••••••••"
                />
              </Section>

              <div className="h-px bg-gray-100" />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-bold uppercase tracking-widest rounded-xl border-2 border-black text-black hover:bg-black hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  {saving ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>

            {/* ── Account Meta ── */}
            {user?.created_at && (
              <>
                <div className="h-px bg-black" />
                <Section title="Account Details">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                        Member Since
                      </span>
                      <span className="text-xs font-bold text-black">
                        {new Date(user.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                        User ID
                      </span>
                      <span className="text-xs font-mono text-gray-500">
                        #{user.id}
                      </span>
                    </div>
                  </div>
                </Section>
              </>
            )}
          </div>
        )}
      </div>

      <div className="h-16" />
      <Alert type={alert.type} message={alert.message} />
    </div>
  );
}

export default ProfileSettingsPage;
