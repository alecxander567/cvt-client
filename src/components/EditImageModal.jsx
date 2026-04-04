import { useState, useEffect, useRef } from "react";

function useModalAnimation(isOpen) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(isOpen));
    return () => cancelAnimationFrame(raf);
  }, [isOpen]);
  return visible;
}

function ImageEditForm({ image, categories, loading, onConfirm, onCancel }) {
  const [name, setName] = useState(image?.name ?? "");
  const [description, setDescription] = useState(image?.description ?? "");
  const [categoryId, setCategoryId] = useState(image?.category_id ?? "");
  const inputRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onConfirm({
      name: name.trim(),
      category_id: categoryId || null,
      description: description || null,
    });
  };

  const hasChanges =
    name.trim() !== (image?.name ?? "") ||
    (categoryId || null) !== (image?.category_id ?? null) ||
    (description || "") !== (image?.description ?? "");

  return (
    <form onSubmit={handleSubmit}>
      <div className="px-5 py-4 border-b-2 border-black">
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-black">
          <img
            src={image?.url}
            alt={image?.name || "image"}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2">
            <p className="text-white text-[10px] font-bold uppercase tracking-widest truncate">
              {image?.name || "Untitled"}
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 flex flex-col gap-4">
        <div className="flex gap-3">
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Name
            </label>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && onCancel()}
              placeholder="Image name..."
              maxLength={60}
              className="w-full px-3 py-2.5 text-sm font-medium border-2 border-black rounded-xl outline-none focus:ring-2 focus:ring-black placeholder:font-normal placeholder:text-gray-400"
            />
            <p className="text-[10px] text-gray-400 text-right">
              {name.length}/60
            </p>
          </div>

          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3 py-2.5 text-sm font-medium border-2 border-black rounded-xl outline-none focus:ring-2 focus:ring-black bg-white appearance-none">
              <option value="">No category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && onCancel()}
            placeholder="Add a description..."
            rows={2}
            className="w-full px-3 py-2.5 text-sm font-medium border-2 border-black rounded-xl outline-none focus:ring-2 focus:ring-black placeholder:font-normal placeholder:text-gray-400 resize-none"
          />
        </div>
      </div>

      <div className="px-5 py-4 border-t-2 border-black flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 py-2 text-xs font-bold uppercase tracking-widest border-2 border-black text-black rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50">
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !name.trim() || !hasChanges}
          className="flex-1 py-2 text-xs font-bold uppercase tracking-widest bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50">
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}

function EditImageModal({
  isOpen,
  image,
  categories,
  loading,
  onConfirm,
  onCancel,
}) {
  const visible = useModalAnimation(isOpen);

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onCancel();
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onCancel]);

  if (!isOpen && !visible) return null;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-200 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onCancel}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div
          className={`bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full max-w-sm transition-all duration-200 ${
            visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}>
          <div className="flex items-center justify-between px-5 py-4 border-b-2 border-black">
            <h2 className="text-sm font-black uppercase tracking-tight text-black">
              Edit Image
            </h2>
            <button
              onClick={onCancel}
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

          <ImageEditForm
            key={image?.id}
            image={image}
            categories={categories}
            loading={loading}
            onConfirm={onConfirm}
            onCancel={onCancel}
          />
        </div>
      </div>
    </>
  );
}

export default EditImageModal;
