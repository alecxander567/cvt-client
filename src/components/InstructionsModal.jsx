import { useState, useEffect } from "react";

function useModalAnimation(isOpen) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(isOpen));
    return () => cancelAnimationFrame(raf);
  }, [isOpen]);
  return visible;
}

function HowToUseModal({ isOpen, onClose }) {
  const visible = useModalAnimation(isOpen);

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen && !visible) return null;

  const steps = [
    {
      number: "01",
      title: "Create an Account",
      description:
        "Sign up with your username, email, and password. Log in to access your personal gallery.",
    },
    {
      number: "02",
      title: "Upload Images",
      description:
        "Use the camera button to capture images directly, or upload from your device. Images are stored securely in the cloud.",
    },
    {
      number: "03",
      title: "Organize with Categories & Albums",
      description:
        "Create categories to tag your images and albums to group them together for easy browsing.",
    },
    {
      number: "04",
      title: "Edit Image Details",
      description:
        "Tap the three-dot menu on any image to edit its name, description, and category at any time.",
    },
    {
      number: "05",
      title: "Compare Images",
      description:
        "Use the Compare feature to capture a new photo and match it against a stored image using AI-powered similarity detection.",
    },
    {
      number: "06",
      title: "Archive & Restore",
      description:
        "Archive images you no longer need in your gallery. They're never permanently deleted — restore them anytime from the Archive page.",
    },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-200 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div
          className={`bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full max-w-md transition-all duration-200 flex flex-col ${
            visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
          style={{ maxHeight: "85vh" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b-2 border-black shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-black rounded-md flex items-center justify-center">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <h2 className="text-sm font-black uppercase tracking-tight text-black">
                How to Use
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-black">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Steps */}
          <div className="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-3">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className="flex gap-4 p-3 rounded-xl border-2 border-black"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(8px)",
                  transition: `opacity 0.3s ease ${i * 0.05 + 0.1}s, transform 0.3s ease ${i * 0.05 + 0.1}s`,
                }}>
                <div className="shrink-0 w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center">
                  <span className="text-[10px] font-black tracking-tight">
                    {step.number}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black uppercase tracking-widest text-black leading-tight">
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t-2 border-black shrink-0">
            <button
              onClick={onClose}
              className="w-full py-2 text-xs font-bold uppercase tracking-widest bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              Got it
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default HowToUseModal;
