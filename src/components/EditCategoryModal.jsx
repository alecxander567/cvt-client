import { useState, useEffect, useRef } from "react";

function CategoryForm({ category, loading, onConfirm, onCancel }) {
  const [name, setName] = useState(category?.name ?? "");
  const inputRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || name.trim() === category?.name) return;
    onConfirm(name.trim());
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="px-5 py-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Category Name
          </label>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && onCancel()}
            placeholder="Category name..."
            className="w-full px-3 py-2.5 text-sm font-medium border-2 border-black rounded-xl outline-none focus:ring-2 focus:ring-black placeholder:font-normal placeholder:text-gray-400"
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
          disabled={loading || !name.trim() || name.trim() === category?.name}
          className="flex-1 py-2 text-xs font-bold uppercase tracking-widest bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50">
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}

function EditCategoryModal({ isOpen, category, loading, onConfirm, onCancel }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(isOpen));
    return () => cancelAnimationFrame(raf);
  }, [isOpen]);

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
              Edit Category
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

          <CategoryForm
            key={category?.id}
            category={category}
            loading={loading}
            onConfirm={onConfirm}
            onCancel={onCancel}
          />
        </div>
      </div>
    </>
  );
}

export default EditCategoryModal;
