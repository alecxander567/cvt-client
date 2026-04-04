import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useEditImage } from "../hooks/useEditImage";
import { useDeleteImage } from "../hooks/useDeleteImage";
import ConfirmModal from "./ConfirmModal";
import { useCompareImage } from "../hooks/useCompareImage";
import CameraModal from "./CameraModal";
import CompareResultModal from "./CompareResultModal";
import EditImageModal from "./EditImageModal";

function DotsMenu({ onEdit, onArchive, onCompare }) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target) &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      )
        setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleOpen = (e) => {
    e.stopPropagation();
    const rect = buttonRef.current.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + window.scrollY + 6,
      left: rect.right + window.scrollX,
    });
    setOpen((prev) => !prev);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleOpen}
        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-black"
        title="Options">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="none">
          <circle cx="5" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="19" cy="12" r="2" />
        </svg>
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "absolute",
              top: menuPos.top,
              left: menuPos.left,
              transform: "translateX(-100%)",
              zIndex: 9999,
            }}
            className="bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] overflow-hidden min-w-[130px]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                onEdit();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors text-left text-black">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit
            </button>

            <div className="h-px bg-gray-100" />

            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                onCompare();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors text-left text-black">
              <svg
                width="12"
                height="12"
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
              Compare
            </button>

            <div className="h-px bg-gray-100" />

            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                onArchive();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-red-50 text-red-600 transition-colors text-left">
              <svg
                width="12"
                height="12"
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
              Archive
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}

function ImageCard({ image, categories = [], onUpdate, onDelete }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
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
    categories.find((c) => c.id === image.category_id)?.name ||
    image.category ||
    null;

  const handleSave = async ({ name, description, category_id }) => {
    const updated = await editImage(image.id, {
      name,
      description,
      category_id,
    });
    if (updated) {
      setShowEditModal(false);
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

  return (
    <>
      <div className="group relative rounded-xl overflow-hidden border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-white flex flex-col">
        {/* Fixed-size image area */}
        <div
          className="relative w-full bg-gray-50 cursor-pointer flex items-center justify-center overflow-hidden"
          style={{ height: "200px" }}
          onClick={() => setShowImageModal(true)}>
          <img
            src={image.url}
            alt={image.name || "Captured image"}
            className="max-w-full max-h-full object-contain"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
        </div>

        {/* Details */}
        <div className="p-3 border-t-2 border-black flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="font-black uppercase text-xs tracking-tight text-black leading-tight truncate">
                {image.name || "Untitled"}
              </p>
              {formattedDate && (
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {formattedDate}
                </p>
              )}
            </div>

            <DotsMenu
              onEdit={() => setShowEditModal(true)}
              onArchive={() => setShowDeleteModal(true)}
              onCompare={() => setShowCompareModal(true)}
            />
          </div>

          {resolvedCategoryName && (
            <span className="inline-block mt-1.5 text-[10px] font-bold uppercase tracking-widest bg-black text-white px-2 py-0.5 rounded-md">
              {resolvedCategoryName}
            </span>
          )}

          {image.description && (
            <p className="text-xs text-gray-800 mt-1.5 line-clamp-2 leading-relaxed">
              {image.description}
            </p>
          )}
        </div>
      </div>

      {showEditModal &&
        createPortal(
          <EditImageModal
            isOpen={showEditModal}
            image={image}
            categories={categories}
            loading={editing}
            onConfirm={handleSave}
            onCancel={() => setShowEditModal(false)}
          />,
          document.body,
        )}

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
            <button
              onClick={() => setShowImageModal(false)}
              className="fixed top-4 right-4 w-9 h-9 flex items-center justify-center bg-white border-2 border-black rounded-lg hover:bg-black hover:text-white transition-colors z-10">
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
