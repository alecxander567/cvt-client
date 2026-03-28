import React, { useState } from "react";
import CameraModal from "./CameraModal";

function CameraButton({ onSuccess, onError }) {
  const [cameraOpen, setCameraOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setCameraOpen(true)}
        className="
          fixed z-40
          w-20 h-20 rounded-full bg-black shadow-xl
          flex items-center justify-center
          hover:bg-gray-800 active:scale-95 transition-all duration-150

          bottom-6 left-1/2 -translate-x-1/2
          md:left-auto md:translate-x-0 md:right-8 md:bottom-8
        "
        title="Open Camera"
        aria-label="Open Camera">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <path
            d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="12"
            cy="13"
            r="4"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {cameraOpen && (
        <CameraModal
          onClose={() => setCameraOpen(false)}
          onSuccess={onSuccess}
          onError={onError}
        />
      )}
    </>
  );
}

export default CameraButton;
