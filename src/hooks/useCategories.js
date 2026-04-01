import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

const getHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("access_token");

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/categories/", {
        headers: getHeaders(token),
      });
      setCategories(data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
}

export function useCreateCategory() {
  const [creating, setCreating] = useState(false);
  const token = localStorage.getItem("access_token");

  const createCategory = async (name) => {
    setCreating(true);
    try {
      const { data } = await api.post(
        "/categories/",
        { name },
        { headers: getHeaders(token) },
      );
      return data;
    } finally {
      setCreating(false);
    }
  };

  return { createCategory, creating };
}

export function useUpdateCategory() {
  const [updating, setUpdating] = useState(false);
  const token = localStorage.getItem("access_token");

  const updateCategory = async (id, name) => {
    setUpdating(true);
    try {
      const { data } = await api.patch(
        `/categories/${id}`,
        { name },
        { headers: getHeaders(token) },
      );
      return data;
    } finally {
      setUpdating(false);
    }
  };

  return { updateCategory, updating };
}

export function useDeleteCategory() {
  const [deleting, setDeleting] = useState(false);
  const token = localStorage.getItem("access_token");

  const deleteCategory = async (id) => {
    setDeleting(true);
    try {
      await api.delete(`/categories/${id}`, {
        headers: getHeaders(token),
      });
      return true;
    } finally {
      setDeleting(false);
    }
  };

  return { deleteCategory, deleting };
}
