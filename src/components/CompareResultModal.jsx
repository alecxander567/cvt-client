import { useEffect, useRef } from "react";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Eye,
  Layers,
  Target,
  Loader2,
  X,
  ScanLine,
} from "lucide-react";

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
  const isMatch = result?.is_match;
  const objectMatch = result?.object_match;
  const verdict = result?.verdict;
  const sharedLabels = result?.shared_labels ?? [];

  const getScoreColor = () => {
    if (similarity >= 75) return "#16a34a";
    if (similarity >= 50) return "#d97706";
    return "#dc2626";
  };

  const getScoreLabel = () => {
    if (similarity >= 75) return "Same Object";
    if (similarity >= 50) return "Possibly Similar";
    return "Different Object";
  };

  const getVerdictConfig = () => {
    switch (verdict) {
      case "same_object":
        return {
          icon: <CheckCircle size={16} />,
          label: "Same Object",
          bg: "bg-green-100",
          text: "text-green-800",
          desc: "These images appear to be the exact same object.",
        };
      case "same_category_different_instance":
        return {
          icon: <RefreshCw size={16} />,
          label: "Same Category",
          bg: "bg-blue-100",
          text: "text-blue-800",
          desc: "Same type of object, but a different instance.",
        };
      case "visually_similar_different_object":
        return {
          icon: <AlertTriangle size={16} />,
          label: "Visually Similar",
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          desc: "Images look similar but may be different objects.",
        };
      default:
        return {
          icon: <XCircle size={16} />,
          label: "Different",
          bg: "bg-red-100",
          text: "text-red-700",
          desc: "These images appear to be different subjects.",
        };
    }
  };

  const verdictConfig = result ? getVerdictConfig() : null;

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
            <ScanLine size={18} strokeWidth={2.5} />
            <span className="font-black text-sm uppercase tracking-widest">
              Image Comparison
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center border-2 border-black rounded-lg hover:bg-black hover:text-white transition-colors font-bold">
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-6">
          {loading ?
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="relative w-16 h-16">
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
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 size={22} className="animate-spin" />
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
            <div className="flex flex-col items-center gap-4">
              {/* Verdict badge */}
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-black font-black text-sm uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${verdictConfig.bg} ${verdictConfig.text}`}>
                {verdictConfig.icon}
                {verdictConfig.label}
              </div>

              {/* Circular progress */}
              <div className="relative w-32 h-32">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                  />
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

              {/* Score label + description */}
              <div className="text-center">
                <p
                  className="font-black text-sm uppercase tracking-widest"
                  style={{ color: getScoreColor() }}>
                  {getScoreLabel()}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {verdictConfig.desc}
                </p>
              </div>

              {/* Stats row */}
              <div className="w-full grid grid-cols-3 gap-2">
                <div className="bg-gray-50 border-2 border-black rounded-xl p-3 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                    Score
                  </p>
                  <p className="font-black text-base">
                    {result.similarity.toFixed(2)}
                  </p>
                </div>
                <div className="bg-gray-50 border-2 border-black rounded-xl p-3 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                    Visual
                  </p>
                  <div className="flex justify-center">
                    {isMatch ?
                      <CheckCircle
                        size={18}
                        className="text-green-600"
                        strokeWidth={2.5}
                      />
                    : <XCircle
                        size={18}
                        className="text-red-500"
                        strokeWidth={2.5}
                      />
                    }
                  </div>
                </div>
                <div className="bg-gray-50 border-2 border-black rounded-xl p-3 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                    Object
                  </p>
                  <div className="flex justify-center">
                    {objectMatch ?
                      <CheckCircle
                        size={18}
                        className="text-green-600"
                        strokeWidth={2.5}
                      />
                    : <XCircle
                        size={18}
                        className="text-red-500"
                        strokeWidth={2.5}
                      />
                    }
                  </div>
                </div>
              </div>

              {/* Shared labels */}
              {sharedLabels.length > 0 && (
                <div className="w-full">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Target size={11} className="text-gray-400" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Matched Objects
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {sharedLabels.map((label) => (
                      <span
                        key={label}
                        className="flex items-center gap-1 px-2 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-wider rounded-lg">
                        <Layers size={9} />
                        {label.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          : <div className="flex flex-col items-center gap-3 py-4 text-center">
              <AlertTriangle
                size={40}
                className="text-yellow-500"
                strokeWidth={1.5}
              />
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
