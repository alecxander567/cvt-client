import { useState, useCallback } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8000/albums";
const IMAGES_URL = "http://localhost:8000/images";

function getAuthHeader() {
  const token = localStorage.getItem("access_token");
  return { Authorization: `Bearer ${token}` };
}

export function useGetAlbums() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAlbums = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(BASE_URL + "/", {
        headers: getAuthHeader(),
      });
      setAlbums(res.data);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch albums:", err);
      setError(err?.response?.data?.detail || "Failed to load albums");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return { albums, loading, error, fetchAlbums };
}

export function useCreateAlbum() {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const createAlbum = async (name) => {
    try {
      setCreating(true);
      setError(null);
      const res = await axios.post(
        BASE_URL + "/",
        { name },
        { headers: getAuthHeader() },
      );
      return res.data;
    } catch (err) {
      console.error("Failed to create album:", err);
      setError(err?.response?.data?.detail || "Failed to create album");
      return null;
    } finally {
      setCreating(false);
    }
  };

  return { createAlbum, creating, error };
}

export function useGetAlbum() {
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAlbum = async (albumId) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${BASE_URL}/${albumId}`, {
        headers: getAuthHeader(),
      });
      setAlbum(res.data);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch album:", err);
      setError(err?.response?.data?.detail || "Failed to load album");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { album, loading, error, fetchAlbum };
}

export function useDeleteAlbum() {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const deleteAlbum = async (albumId) => {
    try {
      setDeleting(true);
      setError(null);
      await axios.delete(`${BASE_URL}/${albumId}`, {
        headers: getAuthHeader(),
      });
      return true;
    } catch (err) {
      console.error("Failed to delete album:", err);
      setError(err?.response?.data?.detail || "Failed to delete album");
      return false;
    } finally {
      setDeleting(false);
    }
  };

  return { deleteAlbum, deleting, error };
}

export function useGetAllImages() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(IMAGES_URL + "/my-images", {
        headers: getAuthHeader(),
      });
      setImages(res.data);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch images:", err);
      setError(err?.response?.data?.detail || "Failed to load images");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return { images, loading, error, fetchImages };
}

export function useSetAlbumImages() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const setAlbumImages = async (albumId, imageIds, removedIds = []) => {
    try {
      setSaving(true);
      setError(null);
      const res = await axios.patch(
        `${BASE_URL}/${albumId}/images`,
        { image_ids: imageIds, removed_ids: removedIds },
        { headers: getAuthHeader() },
      );
      return res.data;
    } catch (err) {
      console.error("Failed to update album images:", err);
      setError(err?.response?.data?.detail || "Failed to update album images");
      return null;
    } finally {
      setSaving(false);
    }
  };

  return { setAlbumImages, saving, error };
}

export function useGetAlbumImages() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAlbumImages = useCallback(async (albumId) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${BASE_URL}/${albumId}/images`, {
        headers: getAuthHeader(),
      });
      setImages(res.data);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch album images:", err);
      setError(err?.response?.data?.detail || "Failed to load album images");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return { images, loading, error, fetchAlbumImages };
}
