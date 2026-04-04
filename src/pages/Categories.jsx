import { useState } from "react";
import Navbar from "../components/Navbar";
import Alert from "../components/Alert";
import ConfirmModal from "../components/ConfirmModal";
import EditCategoryModal from "../components/EditCategoryModal";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "../hooks/useCategories";

function CategoriesPage() {
  const { categories, loading, error, refetch } = useCategories();
  const { createCategory, creating } = useCreateCategory();
  const { updateCategory, updating } = useUpdateCategory();
  const { deleteCategory, deleting } = useDeleteCategory();

  const [alert, setAlert] = useState({ type: "", message: "" });
  const [newName, setNewName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const showAlert = (type, message) => setAlert({ type, message });

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      await createCategory(newName.trim());
      setNewName("");
      showAlert("success", "Category created successfully!");
      refetch();
    } catch (err) {
      showAlert("error", err.message);
    }
  };

  const handleUpdate = async (name) => {
    try {
      await updateCategory(editingCategory.id, name);
      setEditingCategory(null);
      showAlert("success", "Category updated successfully!");
      refetch();
    } catch (err) {
      showAlert("error", err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCategory(deletingId);
      setDeletingId(null);
      showAlert("success", "Category deleted successfully!");
      refetch();
    } catch (err) {
      showAlert("error", err.message);
    }
  };

  const deletingCategory = categories.find((c) => c.id === deletingId);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-black text-2xl uppercase tracking-tight text-black leading-none">
              Categories
            </h1>
            <p className="text-xs text-gray-400 mt-1 font-medium">
              {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
            </p>
          </div>

          {/* Add category input */}
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="New category name..."
              className="w-full sm:w-56 px-3 py-2 sm:py-1.5 text-xs font-bold border-2 border-black rounded-xl outline-none focus:ring-2 focus:ring-black placeholder:font-normal placeholder:text-gray-400"
            />
            <button
              onClick={handleCreate}
              disabled={creating || !newName.trim()}
              className="px-4 py-2 sm:py-1.5 text-xs font-bold uppercase tracking-widest bg-black text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-40 whitespace-nowrap">
              {creating ? "Adding..." : "Add"}
            </button>
          </div>
        </div>

        <div className="h-px bg-black mb-8" />

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
              Could not load categories — {error}
            </p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && categories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"
                  stroke="#d1d5db"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-300">
              No categories yet
            </p>
            <p className="text-xs text-gray-300 mt-1">
              Add a category above to get started
            </p>
          </div>
        )}

        {/* Table */}
        {!loading && !error && categories.length > 0 && (
          <div className="border-2 border-black rounded-xl overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-black text-white">
                  <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-widest">
                    Name
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-black uppercase tracking-widest">
                    Created
                  </th>
                  <th className="px-4 py-3 text-xs font-black uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, idx) => (
                  <tr
                    key={cat.id}
                    className={`border-t-2 border-black ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                    {/* Name cell */}
                    <td className="px-4 py-3">
                      <span className="font-black text-xs uppercase tracking-tight">
                        {cat.name}
                      </span>
                    </td>

                    {/* Date cell */}
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {cat.created_at ?
                        new Date(cat.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                    </td>

                    {/* Actions cell */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit */}
                        <button
                          onClick={() => setEditingCategory(cat)}
                          className="w-8 h-8 flex items-center justify-center bg-white border-2 border-black rounded-lg hover:bg-black hover:text-white transition-colors"
                          title="Edit">
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
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setDeletingId(cat.id)}
                          className="w-8 h-8 flex items-center justify-center bg-white border-2 border-black rounded-lg hover:bg-red-600 hover:border-red-600 hover:text-white transition-colors"
                          title="Delete">
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
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Alert type={alert.type} message={alert.message} />

      <EditCategoryModal
        isOpen={!!editingCategory}
        category={editingCategory}
        loading={updating}
        onConfirm={handleUpdate}
        onCancel={() => setEditingCategory(null)}
      />

      <ConfirmModal
        isOpen={!!deletingId}
        title="Delete Category"
        message={
          deletingCategory ?
            `Are you sure you want to delete "${deletingCategory.name}"? This action cannot be undone.`
          : "Are you sure you want to delete this category?"
        }
        confirmLabel="Delete"
        loadingLabel="Deleting..."
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}

export default CategoriesPage;
