import { useState } from "react";
import Navbar from "../components/Navbar";
import CameraButton from "../components/CameraButton";
import Alert from "../components/Alert";
import ImageCard from "../components/ImageCard";
import { useMyImages } from "../hooks/useMyImages";
import { useCategories } from "../hooks/useCategories";

function HomePage() {
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const { images, loading, error, refetch } = useMyImages();
  const { categories } = useCategories();

  const handleSuccess = () => {
    setAlert({ type: "success", message: "Image saved successfully!" });
    refetch();
  };

  const handleError = (msg) => {
    setAlert({ type: "error", message: msg || "Failed to save image." });
  };

  const handleUpdate = () => {
    setAlert({ type: "success", message: "Image updated successfully!" });
    refetch();
  };

  const handleDelete = () => {
    setAlert({ type: "success", message: "Image deleted successfully!" });
    refetch();
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
              Gallery
            </h1>
            <p className="text-xs text-gray-400 mt-1 font-medium">
              {images.length} image{images.length !== 1 ? "s" : ""}
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
              placeholder="Search images..."
              className="w-full pl-7 pr-3 py-2 sm:py-1.5 text-xs font-bold border-2 border-black rounded-xl outline-none focus:ring-2 focus:ring-black placeholder:font-normal placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="h-px bg-black mb-8" />

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

        {error && (
          <div className="text-center py-24">
            <p className="text-sm text-gray-400">
              Could not load images — {error}
            </p>
          </div>
        )}

        {!loading && !error && images.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
                  stroke="#d1d5db"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="13"
                  r="4"
                  stroke="#d1d5db"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-300">
              No images yet
            </p>
            <p className="text-xs text-gray-300 mt-1">
              Tap the camera button to capture your first image
            </p>
          </div>
        )}

        {!loading && !error && images.length > 0 && filtered.length === 0 && (
          <div className="flex flex-col items-center py-16 sm:py-20 gap-3 text-center">
            <p className="font-black text-sm uppercase tracking-widest">
              No results
            </p>
            <p className="text-xs text-gray-400">
              No images match "{searchQuery}"
            </p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {filtered.map((image) => (
              <ImageCard
                key={image.id}
                image={image}
                categories={categories}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <div className="h-28" />

      <CameraButton onSuccess={handleSuccess} onError={handleError} />
      <Alert type={alert.type} message={alert.message} />
    </div>
  );
}

export default HomePage;
