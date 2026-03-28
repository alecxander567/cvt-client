import React, { useState, useRef, useEffect } from "react";
import { useUploadImage } from "../hooks/useUploadImage";

function CameraModal({ onClose, onSuccess, onError }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const [facingMode, setFacingMode] = useState("environment");

  const { upload, uploading } = useUploadImage();

  const startCamera = async (mode = facingMode) => {
    try {
      if (stream) stream.getTracks().forEach((t) => t.stop());
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode },
        audio: false,
      });
      setStream(newStream);
      if (videoRef.current) videoRef.current.srcObject = newStream;
      setError(null);
    } catch (err) {
      setError(
        err.name === "NotAllowedError" ?
          "Camera access denied. Please allow camera permissions."
        : "Unable to access camera. Make sure no other app is using it.",
      );
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFlip = () => {
    const newMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(newMode);
    startCamera(newMode);
    setCapturedImage(null);
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    setCapturedImage(canvas.toDataURL("image/png"));
  };

  const handleRetake = () => setCapturedImage(null);

  const handleClose = () => {
    if (stream) stream.getTracks().forEach((t) => t.stop());
    onClose();
  };

  const handleUse = async () => {
    const url = await upload(capturedImage);
    handleClose();
    if (url) {
      onSuccess && onSuccess(url);
    } else {
      onError && onError("Failed to save image. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-black/60 border-b border-white/10">
          <span className="text-white font-bold tracking-widest uppercase text-xs">
            Camera
          </span>
          <button
            onClick={handleClose}
            className="text-white/60 hover:text-white transition-colors p-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Camera / Preview */}
        <div className="relative bg-black aspect-[4/3] w-full flex items-center justify-center">
          {error ?
            <div className="text-center px-6">
              <svg
                className="mx-auto mb-3 text-red-400"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M12 8v4M12 16h.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <p className="text-white/70 text-sm">{error}</p>
            </div>
          : capturedImage ?
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          : <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          }
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-6 py-4 bg-black/80">
          {/* Flip */}
          <button
            onClick={handleFlip}
            disabled={!!capturedImage || !!error || uploading}
            className="text-white/60 hover:text-white transition-colors disabled:opacity-30 p-2"
            title="Flip camera">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M1 4v6h6M23 20v-6h-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Capture / Retake */}
          {capturedImage ?
            <button
              onClick={handleRetake}
              disabled={uploading}
              className="flex items-center gap-2 bg-white text-black text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50">
              Retake
            </button>
          : <button
              onClick={handleCapture}
              disabled={!!error}
              className="w-16 h-16 rounded-full border-4 border-white bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center disabled:opacity-30">
              <span className="w-10 h-10 rounded-full bg-white block" />
            </button>
          }

          {/* Use / spacer */}
          {capturedImage ?
            <button
              onClick={handleUse}
              disabled={uploading}
              className="flex items-center gap-2 bg-black text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full border border-white/20 hover:bg-white/10 transition-colors disabled:opacity-50">
              {uploading ?
                <>
                  <svg
                    className="animate-spin w-3 h-3"
                    viewBox="0 0 24 24"
                    fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray="32"
                      strokeDashoffset="12"
                    />
                  </svg>
                  Saving…
                </>
              : "Use"}
            </button>
          : <div className="w-10" />}
        </div>
      </div>
    </div>
  );
}

export default CameraModal;
