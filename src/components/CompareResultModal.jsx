import { useEffect, useRef } from "react";

function CompareResultModal({ isOpen, onClose, result, loading }) {
  const backdropRef = useRef(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const similarity = result ? Math.round(result.similarity * 100) : 0;
  const isMatch = similarity >= 50;

  const getScoreColor = () => {
    if (similarity >= 75) return "#16a34a";
    if (similarity >= 50) return "#d97706";
    return "#dc2626";
  };

  const getScoreLabel = () => {
    if (similarity >= 75) return "Strong Match";
    if (similarity >= 50) return "Partial Match";
    return "Low Match";
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(3px)" }}
      onClick={(e) => e.target === backdropRef.current && onClose()}>
      <div
        className="relative bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] w-full max-w-sm mx-4 overflow-hidden"
        style={{ animation: "popIn 0.2s cubic-bezier(0.34,1.56,0.64,1)" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b-2 border-black">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔬</span>
            <span className="font-black text-sm uppercase tracking-widest">
              Image Comparison
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center border-2 border-black rounded-lg hover:bg-black hover:text-white transition-colors text-sm font-bold">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-6">
          {loading ?
            /* Loading state */
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="relative w-16 h-16">
                {/* Spinning ring */}
                <svg
                  className="w-16 h-16 animate-spin"
                  viewBox="0 0 64 64"
                  fill="none">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="#e5e7eb"
                    strokeWidth="6"
                  />
                  <path
                    d="M32 4 A28 28 0 0 1 60 32"
                    stroke="black"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                </svg>
                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl">🔍</span>
                </div>
              </div>
              <div className="text-center">
                <p className="font-black text-sm uppercase tracking-widest">
                  Analyzing...
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Extracting image features
                </p>
              </div>
              {/* Animated dots bar */}
              <div className="flex gap-1.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-black"
                    style={{
                      animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          : result ?
            /* Result state */
            <div className="flex flex-col items-center gap-5">
              {/* Match / No match badge */}
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-black font-black text-sm uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                  isMatch ?
                    "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-700"
                }`}>
                <span className="text-base">{isMatch ? "✅" : "❌"}</span>
                {isMatch ? "Match Found" : "No Match"}
              </div>

              {/* Circular progress */}
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  {/* Background track */}
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                  />
                  {/* Progress arc */}
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke={getScoreColor()}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    strokeDashoffset={`${2 * Math.PI * 50 * (1 - similarity / 100)}`}
                    style={{ transition: "stroke-dashoffset 0.8s ease" }}
                  />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className="text-3xl font-black leading-none"
                    style={{ color: getScoreColor() }}>
                    {similarity}%
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">
                    similarity
                  </span>
                </div>
              </div>

              {/* Score label */}
              <div className="text-center">
                <p
                  className="font-black text-sm uppercase tracking-widest"
                  style={{ color: getScoreColor() }}>
                  {getScoreLabel()}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {isMatch ?
                    "These images appear to be the same subject."
                  : "These images appear to be different subjects."}
                </p>
              </div>

              {/* Stats row */}
              <div className="w-full grid grid-cols-2 gap-2">
                <div className="bg-gray-50 border-2 border-black rounded-xl p-3 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Score
                  </p>
                  <p className="font-black text-lg">
                    {result.similarity.toFixed(4)}
                  </p>
                </div>
                <div className="bg-gray-50 border-2 border-black rounded-xl p-3 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Threshold
                  </p>
                  <p className="font-black text-lg">0.50</p>
                </div>
              </div>
            </div>
          : /* Error/empty state */
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <span className="text-4xl">⚠️</span>
              <p className="font-black text-sm uppercase tracking-widest">
                Comparison Failed
              </p>
              <p className="text-xs text-gray-400">
                Something went wrong. Please try again.
              </p>
            </div>
          }
        </div>

        {/* Footer */}
        <div className="px-5 pb-5">
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full py-2.5 text-xs font-black uppercase tracking-widest bg-black text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-40">
            {loading ? "Processing..." : "Close"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes popIn {
          from { transform: scale(0.85); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50%       { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default CompareResultModal;
