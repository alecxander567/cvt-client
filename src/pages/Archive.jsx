import { useState } from "react";
import Navbar from "../components/Navbar";
import Alert from "../components/Alert";
import ConfirmModal from "../components/ConfirmModal";
import { useArchivedImages } from "../hooks/useArchiveImage";
import {
  useRestoreImage,
  usePermanentDeleteImage,
} from "../hooks/useArchiveActions";

function ArchivedImageCard({
  image,
  onRestore,
  onPermanentDelete,
  restoring,
  deleting,
}) {
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const busy = restoring || deleting;

  const formattedDate =
    image.archived_at ?
      new Date(image.archived_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <>
      <div
        className={`group relative rounded-xl overflow-hidden border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-white flex flex-col transition-all duration-200 ${
          busy ? "opacity-60 pointer-events-none" : ""
        }`}>
        {/* Image — same fixed 200px height as ImageCard */}
        <div
          className="relative w-full bg-gray-50 flex items-center justify-center overflow-hidden"
          style={{ height: "200px" }}>
          <img
            src={image.url}
            alt={image.name || "Archived image"}
            className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
            loading="lazy"
          />

          {/* Dim overlay — lifts on hover */}
          <div className="absolute inset-0 bg-black/15 group-hover:bg-black/0 transition-all duration-300" />

          {/* Archived badge */}
          <div className="absolute top-3 left-3">
            <span className="text-[9px] font-black uppercase tracking-widest bg-black text-white px-2 py-0.5 rounded-md">
              Archived
            </span>
          </div>
        </div>

        {/* Details — mirrors ImageCard's p-3 section */}
        <div className="p-3 border-t-2 border-black flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2">
            <p className="font-black uppercase text-xs tracking-tight text-black leading-tight truncate flex-1 min-w-0">
              {image.name || "Untitled"}
            </p>
            {formattedDate && (
              <span className="text-[10px] text-gray-400 shrink-0 mt-0.5">
                {formattedDate}
              </span>
            )}
          </div>

          {/* Category badge */}
          {image.category && (
            <span className="inline-block mt-1.5 text-[10px] font-bold uppercase tracking-widest bg-black text-white px-2 py-0.5 rounded-md w-fit">
              {image.category}
            </span>
          )}

          {/* Description */}
          {image.description && (
            <p className="text-xs text-gray-800 mt-1.5 line-clamp-2 leading-relaxed">
              {image.description}
            </p>
          )}

          {/* Actions — equal width, delete (outline) left, restore (filled) right */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={busy}
              className="flex-1 py-1.5 text-xs font-bold uppercase tracking-widest border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors disabled:opacity-50">
              Delete
            </button>
            <button
              onClick={() => setShowRestoreConfirm(true)}
              disabled={busy}
              className="flex-1 py-1.5 text-xs font-bold uppercase tracking-widest bg-black text-white border-2 border-black rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50">
              Restore
            </button>
          </div>
        </div>
      </div>

      {/* Restore confirm */}
      <ConfirmModal
        isOpen={showRestoreConfirm}
        title="Restore image?"
        message={`"${image.name}" will be moved back to your gallery.`}
        confirmLabel="Restore"
        loadingLabel="Restoring..."
        loading={restoring}
        onConfirm={() => {
          setShowRestoreConfirm(false);
          onRestore(image.id);
        }}
        onCancel={() => setShowRestoreConfirm(false)}
      />

      {/* Permanent delete confirm */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete forever?"
        message={`"${image.name}" will be permanently removed and cannot be recovered.`}
        confirmLabel="Delete"
        loadingLabel="Deleting..."
        loading={deleting}
        onConfirm={() => {
          setShowDeleteConfirm(false);
          onPermanentDelete(image.id);
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}

function ArchivePage() {
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [busyIds, setBusyIds] = useState(new Set());

  const { images, loading, error, refetch } = useArchivedImages();
  const { restoreImage } = useRestoreImage();
  const { permanentDelete } = usePermanentDeleteImage();

  const handleRestore = async (imageId) => {
    setBusyIds((prev) => new Set(prev).add(imageId));
    const ok = await restoreImage(imageId);
    setBusyIds((prev) => {
      const n = new Set(prev);
      n.delete(imageId);
      return n;
    });

    if (ok) {
      setAlert({ type: "success", message: "Image restored to gallery." });
      refetch();
    } else {
      setAlert({ type: "error", message: "Failed to restore image." });
    }
  };

  const handlePermanentDelete = async (imageId) => {
    setBusyIds((prev) => new Set(prev).add(imageId));
    const ok = await permanentDelete(imageId);
    setBusyIds((prev) => {
      const n = new Set(prev);
      n.delete(imageId);
      return n;
    });

    if (ok) {
      setAlert({ type: "success", message: "Image permanently deleted." });
      refetch();
    } else {
      setAlert({ type: "error", message: "Failed to delete image." });
    }
  };

  const filtered = images.filter((img) =>
    (img.name || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-black text-2xl uppercase tracking-tight text-black leading-none">
              Archive
            </h1>
            <p className="text-xs text-gray-400 mt-1 font-medium">
              {images.length} archived image{images.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-44">
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search archive..."
              className="w-full pl-7 pr-3 py-2 sm:py-1.5 text-xs font-bold border-2 border-black rounded-xl outline-none focus:ring-2 focus:ring-black placeholder:font-normal placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="h-px bg-black mb-8" />

        {/* Info banner */}
        {!loading && images.length > 0 && (
          <div className="flex items-center gap-3 mb-6 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-xs text-gray-400 font-medium">
              Archived images are hidden from your gallery. Restore them anytime
              or delete permanently.
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-2 h-2 bg-black rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-24">
            <p className="text-sm text-gray-400">
              Could not load archive — {error}
            </p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && images.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 8v13a2 2 0 01-2 2H5a2 2 0 01-2-2V8"
                  stroke="#d1d5db"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect
                  x="1"
                  y="3"
                  width="22"
                  height="5"
                  rx="1"
                  stroke="#d1d5db"
                  strokeWidth="1.5"
                />
                <line
                  x1="10"
                  y1="12"
                  x2="14"
                  y2="12"
                  stroke="#d1d5db"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-300">
              Archive is empty
            </p>
            <p className="text-xs text-gray-300 mt-1">
              Deleted images will appear here
            </p>
          </div>
        )}

        {/* No search results */}
        {!loading && !error && images.length > 0 && filtered.length === 0 && (
          <div className="flex flex-col items-center py-16 sm:py-20 gap-3 text-center">
            <p className="font-black text-sm uppercase tracking-widest">
              No results
            </p>
            <p className="text-xs text-gray-400">
              No archived images match "{searchQuery}"
            </p>
          </div>
        )}

        {/* Grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {filtered.map((image) => (
              <ArchivedImageCard
                key={image.id}
                image={image}
                onRestore={handleRestore}
                onPermanentDelete={handlePermanentDelete}
                restoring={busyIds.has(image.id)}
                deleting={busyIds.has(image.id)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="h-16" />
      <Alert type={alert.type} message={alert.message} />
    </div>
  );
}

export default ArchivePage;
