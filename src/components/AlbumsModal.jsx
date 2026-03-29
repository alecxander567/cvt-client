import { useState, useEffect } from "react";
import {
  useCreateAlbum,
  useGetAllImages,
  useSetAlbumImages,
  useGetAlbumImages,
} from "../hooks/useAlbum";

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

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function DeleteAlbumModal({
  isOpen,
  albumName,
  onConfirm,
  onCancel,
  loading,
}) {
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onCancel();
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(3px)" }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div
        className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] w-full max-w-sm mx-4 p-6"
        style={{ animation: "popIn 0.18s cubic-bezier(0.34,1.56,0.64,1)" }}>
        <p className="font-black text-sm uppercase tracking-widest mb-1">
          Delete Album
        </p>
        <p className="text-xs text-gray-500 mb-5">
          Delete <span className="font-bold text-black">"{albumName}"</span>?
          Images will be kept but removed from the album.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2 text-xs font-black uppercase tracking-widest bg-red-600 text-white border-2 border-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50">
            {loading ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-2 text-xs font-black uppercase tracking-widest border-2 border-black rounded-xl hover:bg-gray-100 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export function CreateAlbumModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState("");
  const { createAlbum, creating } = useCreateAlbum();

  useEffect(() => {
    if (!isOpen) setTimeout(() => setName(""), 0);
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!name.trim()) return;
    const album = await createAlbum(name.trim());
    if (album) {
      onCreate(album);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(3px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] w-full max-w-sm mx-4 overflow-hidden"
        style={{ animation: "popIn 0.18s cubic-bezier(0.34,1.56,0.64,1)" }}>
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b-2 border-black">
          <div className="flex items-center gap-2">
            <AlbumIcon size={16} />
            <span className="font-black text-sm uppercase tracking-widest">
              New Album
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center border-2 border-black rounded-lg hover:bg-black hover:text-white transition-colors text-sm font-bold">
            ✕
          </button>
        </div>
        <div className="px-5 py-5 flex flex-col gap-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">
              Album Name
            </label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="e.g. Summer 2025"
              maxLength={60}
              className="w-full px-3 py-2 text-sm font-bold border-2 border-black rounded-xl outline-none focus:ring-2 focus:ring-black placeholder:font-normal placeholder:text-gray-400"
            />
            <p className="text-[10px] text-gray-400 mt-1 text-right">
              {name.length}/60
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={creating || !name.trim()}
              className="flex-1 py-2.5 text-xs font-black uppercase tracking-widest bg-black text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-40">
              {creating ? "Creating..." : "Create Album"}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 text-xs font-black uppercase tracking-widest border-2 border-black rounded-xl hover:bg-gray-100 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ImagePickerModal({ isOpen, album, onClose, onSaved }) {
  const {
    images: allImages,
    loading: loadingImages,
    fetchImages,
  } = useGetAllImages();
  const { fetchAlbumImages } = useGetAlbumImages();
  const { setAlbumImages, saving } = useSetAlbumImages();

  const [selected, setSelected] = useState(new Set());
  const [original, setOriginal] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!isOpen || !album) return;

    setTimeout(() => {
      setInitialized(false);
      setSearchQuery("");
    }, 0);

    Promise.all([fetchImages(), fetchAlbumImages(album.id)]).then(
      ([, albumImgs]) => {
        const ids = new Set((albumImgs || []).map((img) => img.id));
        setSelected(new Set(ids));
        setOriginal(new Set(ids));
        setInitialized(true);
      },
    );
  }, [isOpen, album]);

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen || !album) return null;

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSave = async () => {
    const added = [...selected].filter((id) => !original.has(id));
    const removed = [...original].filter((id) => !selected.has(id));
    const res = await setAlbumImages(album.id, added, removed);
    if (res !== null) {
      onSaved({ added: added.length, removed: removed.length });
      onClose();
    }
  };

  const filtered = allImages.filter((img) =>
    (img.name || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const added = [...selected].filter((id) => !original.has(id));
  const removed = [...original].filter((id) => !selected.has(id));
  const hasChanges = added.length > 0 || removed.length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(3px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className="bg-white border-2 border-black rounded-t-2xl sm:rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] w-full sm:max-w-2xl mx-0 sm:mx-4 flex flex-col overflow-hidden"
        style={{
          maxHeight: "90vh",
          animation: "slideUp 0.22s cubic-bezier(0.34,1.56,0.64,1)",
        }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b-2 border-black shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <ImagesIcon size={16} />
              <span className="font-black text-sm uppercase tracking-widest">
                Add Images
              </span>
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5 font-medium">
              {album.name} · {selected.size} selected
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center border-2 border-black rounded-lg hover:bg-black hover:text-white transition-colors text-sm font-bold shrink-0">
            ✕
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-3 border-b-2 border-black shrink-0">
          <div className="relative">
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
              placeholder="Search images..."
              className="w-full pl-7 pr-3 py-1.5 text-xs font-bold border-2 border-black rounded-xl outline-none focus:ring-2 focus:ring-black placeholder:font-normal placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Image grid */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {!initialized || loadingImages ?
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-100 rounded-xl animate-pulse border-2 border-black"
                  style={{ animationDelay: `${i * 50}ms` }}
                />
              ))}
            </div>
          : filtered.length === 0 ?
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <ImagesIcon size={32} />
              <p className="font-black text-sm uppercase tracking-widest">
                No images found
              </p>
              <p className="text-xs text-gray-400">
                {searchQuery ?
                  `No results for "${searchQuery}"`
                : "Upload some images to your gallery first."}
              </p>
            </div>
          : <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {filtered.map((img) => {
                const isSelected = selected.has(img.id);
                return (
                  <button
                    key={img.id}
                    onClick={() => toggle(img.id)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-150 focus:outline-none ${
                      isSelected ?
                        "border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] scale-[0.97]"
                      : "border-gray-200 hover:border-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    }`}>
                    <img
                      src={img.url}
                      alt={img.name || "image"}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div
                      className={`absolute inset-0 transition-all duration-150 ${
                        isSelected ? "bg-black/30" : (
                          "bg-transparent hover:bg-black/10"
                        )
                      }`}
                    />
                    <div
                      className={`absolute top-1.5 right-1.5 w-5 h-5 rounded-md flex items-center justify-center transition-all duration-150 border-2 ${
                        isSelected ?
                          "bg-black border-black text-white scale-100"
                        : "bg-white border-gray-300 scale-90 opacity-0"
                      }`}>
                      {isSelected && <CheckIcon />}
                    </div>
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-1.5 pb-1.5 pt-4">
                      <p className="text-white text-[9px] font-bold truncate leading-tight">
                        {img.name || "Untitled"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          }
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t-2 border-black shrink-0 flex items-center gap-2">
          <div className="flex-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            {hasChanges ?
              `${added.length} added · ${removed.length} removed`
            : "No changes"}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-black uppercase tracking-widest border-2 border-black rounded-xl hover:bg-gray-100 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="px-4 py-2 text-xs font-black uppercase tracking-widest bg-black text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-40 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.25)]">
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
