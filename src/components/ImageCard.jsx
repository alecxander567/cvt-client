import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useEditImage } from "../hooks/useEditImage";
import { useDeleteImage } from "../hooks/useDeleteImage";
import ConfirmModal from "./ConfirmModal";
import { useCompareImage } from "../hooks/useCompareImage";
import CameraModal from "./CameraModal";
import CompareResultModal from "./CompareResultModal";

function ImageCard({ image, categories = [], onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [touched, setTouched] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [name, setName] = useState(image.name || "");
  const [description, setDescription] = useState(image.description || "");
  const [categoryId, setCategoryId] = useState(image.category_id || "");
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const { compareImage, loading: comparing, result } = useCompareImage();
  const { editImage, editing } = useEditImage();
  const { deleteImage, deleting } = useDeleteImage();

  const formattedDate =
    image.created_at ?
      new Date(image.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const resolvedCategoryName =
    categories.find((c) => c.id === (categoryId || image.category_id))?.name ||
    image.category ||
    null;

  const handleSave = async () => {
    const updated = await editImage(image.id, {
      name,
      description,
      category_id: categoryId || null,
    });
    if (updated) {
      setIsEditing(false);
      onUpdate?.();
    }
  };

  const handleNameBlur = async () => {
    if (name !== image.name) {
      await editImage(image.id, { name });
      onUpdate?.();
    }
  };

  const handleDelete = async () => {
    const ok = await deleteImage(image.id);
    if (ok) {
      setShowDeleteModal(false);
      onDelete?.();
    }
  };

  const handleCompare = async (capturedImage) => {
    setShowCompareModal(false);
    setShowResultModal(true);
    await compareImage(image.id, capturedImage);
  };

  const buttonsVisible =
    touched ? "opacity-100" : "opacity-0 group-hover:opacity-100";

  return (
    <>
      <div className="group relative rounded-xl overflow-hidden border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-white flex flex-col">
        {/* Fixed-size image area */}
        <div
          className="relative w-full bg-gray-50 cursor-pointer flex items-center justify-center overflow-hidden"
          style={{ height: "200px" }}
          onClick={() => {
            if (!isEditing) setShowImageModal(true);
            setTouched((prev) => !prev);
          }}>
          <img
            src={image.url}
            alt={image.name || "Captured image"}
            className="max-w-full max-h-full object-contain"
            loading="lazy"
          />

          {/* Hover overlay */}
          <div
            className={`absolute inset-0 transition-all duration-300 ${
              touched ? "bg-black/20" : "bg-black/0 group-hover:bg-black/20"
            }`}
          />

          {/* Action buttons */}
          {!isEditing && (
            <div
              className={`absolute top-3 right-3 flex gap-1 transition-opacity duration-300 ${buttonsVisible}`}>
              {/* Edit */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                  setTouched(false);
                }}
                className="w-8 h-8 flex items-center justify-center bg-white border-2 border-black rounded-lg hover:bg-black hover:text-white transition-colors"
                title="Edit">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>

              {/* Archive (soft delete) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteModal(true);
                  setTouched(false);
                }}
                className="w-8 h-8 flex items-center justify-center bg-white border-2 border-black rounded-lg hover:bg-red-600 hover:border-red-600 hover:text-white transition-colors"
                title="Archive">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                </svg>
              </button>

              {/* Compare */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCompareModal(true);
                  setTouched(false);
                }}
                className="w-8 h-8 flex items-center justify-center bg-white border-2 border-black rounded-lg hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-colors"
                title="Compare with camera">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <rect x="2" y="7" width="10" height="10" rx="1.5" />
                  <rect x="12" y="7" width="10" height="10" rx="1.5" />
                  <line x1="12" y1="5" x2="12" y2="19" strokeWidth="2" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-3 border-t-2 border-black flex-1">
          {isEditing ?
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Image name"
                className="w-full px-2 py-1.5 text-xs font-bold border-2 border-black rounded-lg outline-none focus:ring-2 focus:ring-black"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                rows={2}
                className="w-full px-2 py-1.5 text-xs border-2 border-black rounded-lg outline-none focus:ring-2 focus:ring-black resize-none"
              />
              {/* Category dropdown */}
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-2 py-1.5 text-xs font-bold border-2 border-black rounded-lg outline-none focus:ring-2 focus:ring-black bg-white">
                <option value="">No category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={editing}
                  className="flex-1 py-1.5 text-xs font-bold uppercase tracking-widest bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50">
                  {editing ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setName(image.name || "");
                    setDescription(image.description || "");
                    setCategoryId(image.category_id || "");
                    setIsEditing(false);
                  }}
                  className="flex-1 py-1.5 text-xs font-bold uppercase tracking-widest border-2 border-black rounded-lg hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          : <>
              <div className="flex items-start justify-between gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={handleNameBlur}
                  onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
                  placeholder="Untitled"
                  className="font-black uppercase text-xs tracking-tight text-black leading-tight flex-1 min-w-0 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-black outline-none transition-colors cursor-text"
                />
                {formattedDate && (
                  <span className="text-[10px] text-gray-400 shrink-0 mt-0.5">
                    {formattedDate}
                  </span>
                )}
              </div>

              {/* Category badge */}
              {resolvedCategoryName && (
                <span className="inline-block mt-1.5 text-[10px] font-bold uppercase tracking-widest bg-black text-white px-2 py-0.5 rounded-md">
                  {resolvedCategoryName}
                </span>
              )}

              {/* Description */}
              {image.description && (
                <p className="text-xs text-gray-800 mt-1.5 line-clamp-2 leading-relaxed">
                  {image.description}
                </p>
              )}
            </>
          }
        </div>
      </div>

      {/* Portaled modals */}

      {/* Archive confirm — soft deletes the image, recoverable from Archive page */}
      {showDeleteModal &&
        createPortal(
          <ConfirmModal
            isOpen={showDeleteModal}
            title="Archive Image?"
            message="This image will be moved to your archive. You can restore it anytime."
            confirmLabel="Archive"
            loadingLabel="Archiving..."
            onConfirm={handleDelete}
            onCancel={() => setShowDeleteModal(false)}
            loading={deleting}
          />,
          document.body,
        )}

      {showCompareModal &&
        createPortal(
          <CameraModal
            mode="compare"
            onClose={() => setShowCompareModal(false)}
            onCompare={handleCompare}
          />,
          document.body,
        )}

      {showResultModal &&
        createPortal(
          <CompareResultModal
            isOpen={showResultModal}
            onClose={() => setShowResultModal(false)}
            result={result}
            loading={comparing}
          />,
          document.body,
        )}

      {showImageModal &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowImageModal(false)}
            style={{
              backdropFilter: "blur(12px)",
              background: "rgba(0,0,0,0.6)",
            }}>
            {/* Close button */}
            <button
              onClick={() => setShowImageModal(false)}
              className="fixed top-4 right-4 w-9 h-9 flex items-center justify-center bg-white border-2 border-black rounded-lg hover:bg-black hover:text-white transition-colors shadow-md z-10">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div
              className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}>
              <img
                src={image.url}
                alt={image.name || "Image preview"}
                className="max-w-full max-h-[85vh] object-contain rounded-xl border-2 border-white shadow-2xl"
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

export default ImageCard;
