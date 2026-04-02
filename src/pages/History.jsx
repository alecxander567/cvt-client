import { useState } from "react";
import Navbar from "../components/Navbar";
import { useActivityLogs } from "../hooks/useActivityLog";

const ACTION_STYLES = {
  CREATE: "bg-green-100 text-green-800",
  UPDATE: "bg-blue-100 text-blue-800",
  DELETE: "bg-red-100 text-red-800",
};

function timeAgo(iso) {
  const secs = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (secs < 60) return "just now";
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

function HistoryPage() {
  const { logs, loading, error } = useActivityLogs();
  const [filter, setFilter] = useState("ALL");

  const filtered =
    filter === "ALL" ? logs : logs.filter((log) => log.action === filter);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-black text-2xl uppercase tracking-tight text-black leading-none">
              History
            </h1>
            <p className="text-xs text-gray-400 mt-1 font-medium">
              {!loading && !error ?
                `${filtered.length} activit${filtered.length !== 1 ? "ies" : "y"}`
              : "\u00a0"}
            </p>
          </div>

          {/* Dropdown filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full sm:w-36 px-3 py-2 sm:py-1.5 text-xs font-bold border-2 border-black rounded-xl outline-none focus:ring-2 focus:ring-black bg-white appearance-none cursor-pointer">
            <option value="ALL">All actions</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
          </select>
        </div>

        <div className="h-px bg-black mb-8" />

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

        {error && (
          <div className="text-center py-24">
            <p className="text-sm text-gray-400">
              Could not load history — {error}
            </p>
          </div>
        )}

        {!loading && !error && logs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 8v4l3 3"
                  stroke="#d1d5db"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="#d1d5db"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-300">
              No activity yet
            </p>
            <p className="text-xs text-gray-300 mt-1">
              Actions like uploads, edits, and deletions will appear here
            </p>
          </div>
        )}

        {!loading && !error && logs.length > 0 && filtered.length === 0 && (
          <div className="flex flex-col items-center py-16 sm:py-20 gap-3 text-center">
            <p className="font-black text-sm uppercase tracking-widest">
              No results
            </p>
            <p className="text-xs text-gray-400">
              No activity matches the selected filter
            </p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="flex flex-col gap-3">
            {filtered.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 border-2 border-black rounded-xl px-4 py-3">
                <span
                  className={`mt-0.5 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide flex-shrink-0 ${
                    ACTION_STYLES[log.action] ?? "bg-gray-100 text-gray-600"
                  }`}>
                  {log.action}
                </span>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-black truncate">
                    {log.description || "—"}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    <span className="inline-block bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-wide rounded px-1.5 py-0.5 mr-1.5">
                      {log.entity}
                    </span>
                    {timeAgo(log.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryPage;
