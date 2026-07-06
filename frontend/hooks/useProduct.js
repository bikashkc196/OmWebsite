// frontend/hooks/useProduct.js
"use client";
import { useState, useCallback } from "react";
import api from "../lib/api";
export const useProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // ── Get all products (with filters) ──
  const getProducts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/products", { params });
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  // ── Get featured products ──
  const getFeaturedProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/products/featured");
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch featured");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  // ── Get single product ──
  const getProductById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/products/${id}`);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Product not found");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  // ── Admin: get all products ──
  const getAllProductsAdmin = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/products/admin/all", { params });
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  // ── Admin: create product ──
  const createProduct = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/products", data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create product");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  // ── Admin: update product ──
  const updateProduct = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.put(`/products/${id}`, data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update product");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  // ── Admin: delete product ──
  const deleteProduct = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.delete(`/products/${id}`);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete product");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  // ── Admin: toggle featured ──
  const toggleFeatured = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.patch(`/products/${id}/toggle-featured`);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to toggle featured");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  // ── Admin: upload image to Cloudinary ──
  const uploadImage = useCallback(async (file) => {
    setError(null);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await api.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload image");
      return null;
    }
  }, []);
  return {
    loading,
    error,
    getProducts,
    getFeaturedProducts,
    getProductById,
    getAllProductsAdmin,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleFeatured,
    uploadImage,
  };
};
