import React, { useEffect, useState } from "react";

/**
 * ConfirmModal
 *
 * Props:
 *  isOpen        - boolean
 *  title         - string
 *  message       - string
 *  confirmLabel  - string  e.g. "Archive", "Delete", "Restore"  (default: "Confirm")
 *  loadingLabel  - string  e.g. "Archiving...", "Deleting..."   (default: "Please wait...")
 *  onConfirm     - fn
 *  onCancel      - fn
 *  loading       - boolean
 */
function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  loadingLabel,
  onConfirm,
  onCancel,
  loading,
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(isOpen));
    return () => cancelAnimationFrame(raf);
  }, [isOpen]);

  if (!isOpen && !visible) return null;

  const resolvedLoadingLabel = loadingLabel || `${confirmLabel}ing...`;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-200 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div
          className={`bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full max-w-sm transition-all duration-200 ${
            visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}>
          {/* Header */}
          <div className="px-5 py-4 border-b-2 border-black">
            <h2 className="text-sm font-black uppercase tracking-tight text-black">
              {title || "Are you sure?"}
            </h2>
          </div>

          {/* Body */}
          <div className="px-5 py-4">
            <p className="text-sm text-black leading-relaxed">
              {message || "This action cannot be undone."}
            </p>
          </div>

          {/* Actions */}
          <div className="px-5 py-4 border-t-2 border-black flex gap-2">
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-2 text-xs font-bold uppercase tracking-widest bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50">
              {loading ? resolvedLoadingLabel : confirmLabel}
            </button>

            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 py-2 text-xs font-bold uppercase tracking-widest border-2 border-black text-black rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ConfirmModal;
