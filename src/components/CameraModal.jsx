import React, { useState, useRef, useEffect } from "react";
import { useUploadImage } from "../hooks/useUploadImage";
import { useUploadImageFromDevice } from "../hooks/useUploadImageFromDevice";

function CameraModal({
  onClose,
  onSuccess,
  onError,
  mode = "upload",
  onCompare,
  albumId = null,
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const [tab, setTab] = useState("camera"); // "camera" | "file"
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [facingMode, setFacingMode] = useState("environment");

  const { upload, uploading: cameraUploading } = useUploadImage();
  const { uploadImage, uploading: fileUploading } = useUploadImageFromDevice();

  const uploading = cameraUploading || fileUploading;

  const startCamera = async (facing = facingMode) => {
    try {
      if (stream) stream.getTracks().forEach((t) => t.stop());
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing },
        audio: false,
      });
      setStream(newStream);
      if (videoRef.current) videoRef.current.srcObject = newStream;
      setCameraError(null);
    } catch (err) {
      setCameraError(
        err.name === "NotAllowedError" ?
          "Camera access denied. Please allow camera permissions."
        : "Unable to access camera. Make sure no other app is using it.",
      );
    }
  };

  const stopCamera = () => {
    if (stream) stream.getTracks().forEach((t) => t.stop());
    setStream(null);
  };

  useEffect(() => {
    if (tab === "camera") {
      startCamera();
    } else {
      stopCamera();
    }
    setCapturedImage(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setCameraError(null);
    setFileError(null);

    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFileError("Please select an image file.");
      return;
    }
    setFileError(null);
    setSelectedFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFileClear = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    stopCamera();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    onClose();
  };

  const handleUse = async () => {
    if (tab === "file") {
      if (!selectedFile) return;

      if (mode === "compare") {
        // compare flow expects base64
        const reader = new FileReader();
        reader.onload = () => {
          onCompare && onCompare(reader.result);
          handleClose();
        };
        reader.readAsDataURL(selectedFile);
        return;
      }

      const result = await uploadImage(selectedFile, albumId);
      handleClose();
      if (result?.url) {
        onSuccess && onSuccess(result.url);
      } else {
        onError && onError("Failed to upload image. Please try again.");
      }
      return;
    }

    if (mode === "compare") {
      onCompare && onCompare(capturedImage);
      handleClose();
      return;
    }

    const url = await upload(capturedImage);
    handleClose();
    if (url) {
      onSuccess && onSuccess(url);
    } else {
      onError && onError("Failed to save image. Please try again.");
    }
  };

  const canSubmit =
    (tab === "camera" && !!capturedImage) || (tab === "file" && !!selectedFile);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-black/60 border-b border-white/10">
          <span className="text-white font-bold tracking-widest uppercase text-xs">
            {mode === "compare" ? "Compare Image" : "Add Image"}
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

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setTab("camera")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[11px] font-black uppercase tracking-widest transition-colors ${
              tab === "camera" ?
                "text-white border-b-2 border-white"
              : "text-white/40 hover:text-white/70"
            }`}>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            Camera
          </button>
          <button
            onClick={() => setTab("file")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[11px] font-black uppercase tracking-widest transition-colors ${
              tab === "file" ?
                "text-white border-b-2 border-white"
              : "text-white/40 hover:text-white/70"
            }`}>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            From Device
          </button>
        </div>

        {/* ── Camera Tab ── */}
        {tab === "camera" && (
          <>
            <div className="relative bg-black aspect-[4/3] w-full flex items-center justify-center">
              {cameraError ?
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
                  <p className="text-white/70 text-sm">{cameraError}</p>
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

            <div className="flex items-center justify-between px-6 py-4 bg-black/80">
              {/* Flip */}
              <button
                onClick={handleFlip}
                disabled={!!capturedImage || !!cameraError || uploading}
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
                  onClick={() => setCapturedImage(null)}
                  disabled={uploading}
                  className="flex items-center gap-2 bg-white text-black text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50">
                  Retake
                </button>
              : <button
                  onClick={handleCapture}
                  disabled={!!cameraError}
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
          </>
        )}

        {/* ── File Tab ── */}
        {tab === "file" && (
          <div className="p-6 flex flex-col gap-4">
            {!previewUrl ?
              /* Drop zone */
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-[4/3] flex flex-col items-center justify-center gap-3 border-2 border-dashed border-white/20 rounded-xl hover:border-white/50 hover:bg-white/5 transition-all">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white/40">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <p className="text-white/50 text-xs font-bold uppercase tracking-widest">
                  Click to select image
                </p>
                <p className="text-white/25 text-[10px]">
                  PNG, JPG, WEBP supported
                </p>
              </button>
            : /* Preview */
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full aspect-[4/3] object-cover rounded-xl border border-white/10"
                />
                <button
                  onClick={handleFileClear}
                  className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-black/70 border border-white/20 rounded-lg text-white hover:bg-black transition-colors">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M18 6L6 18M6 6l12 12"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            }

            {fileError && (
              <p className="text-red-400 text-xs text-center font-medium">
                {fileError}
              </p>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              onClick={
                previewUrl ? handleUse : () => fileInputRef.current?.click()
              }
              disabled={uploading}
              className="w-full py-3 text-xs font-black uppercase tracking-widest bg-white text-black rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-40 flex items-center justify-center gap-2">
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
                  Uploading…
                </>
              : previewUrl ?
                "Use This Image"
              : "Browse Files"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CameraModal;
