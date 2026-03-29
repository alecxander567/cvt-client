import { useState, useEffect, useCallback } from "react";
import { useGetAlbums, useDeleteAlbum } from "../hooks/useAlbum";
import Navbar from "../components/Navbar";
import {
  CreateAlbumModal,
  DeleteAlbumModal,
  ImagePickerModal,
} from "../components/AlbumsModal";

function AlbumIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  );
}

function TrashIcon() {
  return (
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
  );
}

function ImagesIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function AlbumCard({ album, onDelete, onManageImages, style }) {
  const formattedDate =
    album.created_at ?
      new Date(album.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div
      className="group relative bg-white border-2 border-black rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 overflow-hidden"
      style={style}>
      {/* Thumbnail */}
      <div
        className="relative h-28 sm:h-32 bg-gray-50 border-b-2 border-black overflow-hidden cursor-pointer"
        onClick={() => onManageImages(album)}>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[80%] h-20 bg-gray-200 border-2 border-black rounded-xl rotate-3" />
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[80%] h-20 bg-gray-100 border-2 border-black rounded-xl -rotate-1" />
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[80%] h-20 bg-white border-2 border-black rounded-xl flex items-center justify-center">
          <AlbumIcon size={28} />
        </div>

        {/* Hover hint — hidden on touch devices */}
        <div className="absolute inset-0 hidden sm:flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-all duration-200">
          <span className="text-white text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black px-2 py-1 rounded-lg">
            Manage Images
          </span>
        </div>

        {/* Delete button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(album);
          }}
          className="absolute top-2.5 right-2.5 w-8 h-8 flex items-center justify-center bg-white border-2 border-black rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-red-600 hover:border-red-600 hover:text-white transition-all duration-200 z-10"
          title="Delete album">
          <TrashIcon />
        </button>
      </div>

      {/* Info */}
      <div className="px-3 sm:px-4 py-3">
        <p className="font-black text-xs sm:text-sm uppercase tracking-tight text-black truncate">
          {album.name}
        </p>
        {formattedDate && (
          <p className="text-[10px] text-gray-400 mt-0.5">{formattedDate}</p>
        )}
        <button
          onClick={() => onManageImages(album)}
          className="mt-2 w-full flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-black uppercase tracking-widest border-2 border-black rounded-lg hover:bg-black hover:text-white transition-colors">
          <ImagesIcon size={11} />
          Add / Edit Images
        </button>
      </div>
    </div>
  );
}

function EmptyState({ onCreateClick }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24 gap-5 text-center px-4">
      <div className="w-20 h-20 flex items-center justify-center bg-gray-100 border-2 border-black rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        <AlbumIcon size={32} />
      </div>
      <div>
        <p className="font-black text-sm uppercase tracking-widest">
          No Albums Yet
        </p>
        <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
          Create your first album to start organizing your images.
        </p>
      </div>
      <button
        onClick={onCreateClick}
        className="px-5 py-2.5 text-xs font-black uppercase tracking-widest bg-black text-white rounded-xl hover:bg-gray-800 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]">
        + New Album
      </button>
    </div>
  );
}

function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-black text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] border-2 border-black whitespace-nowrap"
      style={{ animation: "slideUp 0.2s ease" }}>
      {message}
    </div>
  );
}

function LoadingDots() {
  return (
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
  );
}

function AlbumsPage() {
  const { albums, loading, fetchAlbums } = useGetAlbums();
  const { deleteAlbum, deleting } = useDeleteAlbum();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [pickerAlbum, setPickerAlbum] = useState(null);
  const [localAlbums, setLocalAlbums] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  useEffect(() => {
    setLocalAlbums(albums);
  }, [albums]);

  const handleCreated = (newAlbum) => {
    setLocalAlbums((prev) => [newAlbum, ...prev]);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const ok = await deleteAlbum(deleteTarget.id);
    if (ok) {
      setLocalAlbums((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const handleImagesSaved = useCallback(({ added, removed }) => {
    const parts = [];
    if (added > 0) parts.push(`${added} image${added !== 1 ? "s" : ""} added`);
    if (removed > 0) parts.push(`${removed} removed`);
    setToast(parts.join(" · ") || "Saved");
  }, []);

  const filtered = localAlbums.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-black text-2xl uppercase tracking-tight text-black leading-none">
              Albums
            </h1>
            <p className="text-xs text-gray-400 mt-1 font-medium">
              {localAlbums.length} album{localAlbums.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
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
                placeholder="Search albums..."
                className="w-full pl-7 pr-3 py-2 sm:py-1.5 text-xs font-bold border-2 border-black rounded-xl outline-none focus:ring-2 focus:ring-black placeholder:font-normal placeholder:text-gray-400"
              />
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center justify-center gap-1.5 px-6 py-2 sm:py-2 text-xs font-black uppercase tracking-widest bg-black text-white rounded-xl hover:bg-gray-800 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,0.25)] whitespace-nowrap w-full sm:w-auto">
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Album
            </button>
          </div>
        </div>

        <div className="h-px bg-black mb-8" />

        {/* Content */}
        {loading ?
          <LoadingDots />
        : localAlbums.length === 0 ?
          <EmptyState onCreateClick={() => setShowCreateModal(true)} />
        : filtered.length === 0 ?
          <div className="flex flex-col items-center py-16 sm:py-20 gap-3 text-center">
            <p className="font-black text-sm uppercase tracking-widest">
              No results
            </p>
            <p className="text-xs text-gray-400">
              No albums match "{searchQuery}"
            </p>
          </div>
        : <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((album, i) => (
              <AlbumCard
                key={album.id}
                album={album}
                onDelete={(a) => setDeleteTarget(a)}
                onManageImages={(a) => setPickerAlbum(a)}
                style={{
                  animation: "fadeUp 0.25s ease both",
                  animationDelay: `${i * 40}ms`,
                }}
              />
            ))}
          </div>
        }
      </div>

      {/* Modals */}
      <CreateAlbumModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreated}
      />

      <DeleteAlbumModal
        isOpen={!!deleteTarget}
        albumName={deleteTarget?.name || ""}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      <ImagePickerModal
        isOpen={!!pickerAlbum}
        album={pickerAlbum}
        onClose={() => setPickerAlbum(null)}
        onSaved={handleImagesSaved}
      />

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      <style>{`
        @keyframes popIn {
          from { transform: scale(0.85); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
        @keyframes fadeUp {
          from { transform: translateY(12px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(40px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </>
  );
}

export default AlbumsPage;
