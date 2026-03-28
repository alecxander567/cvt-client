import React, { useEffect, useRef, useState } from "react";

function Alert({ type, message, duration = 3000 }) {
  const [visible, setVisible] = useState(false);
  const prevMessage = useRef(null);

  useEffect(() => {
    if (!message || message === prevMessage.current) return;
    prevMessage.current = message;

    const fadeIn = setTimeout(() => setVisible(true), 10);
    const fadeOut = setTimeout(() => setVisible(false), duration);

    return () => {
      clearTimeout(fadeIn);
      clearTimeout(fadeOut);
    };
  }, [message, duration]);

  if (!message) return null;

  const isError = type === "error";

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-full max-w-sm px-4">
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform:
            visible ?
              "translateY(0) scale(1)"
            : "translateY(-12px) scale(0.97)",
          transition: "opacity 0.35s ease, transform 0.35s ease",
        }}
        className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm w-full ${
          isError ? "bg-black text-white" : "bg-white text-black"
        }`}>
        {/* Icon */}
        <span className="shrink-0">
          {isError ?
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1 1L13 13M13 1L1 13"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          : <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1 7L5 11L13 3"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
        </span>

        <p className="flex-1">{message}</p>
      </div>
    </div>
  );
}

export default Alert;
