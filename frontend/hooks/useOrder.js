// frontend/hooks/useOrder.js
"use client";
import { useState, useCallback } from "react";
import api from "../lib/api";
import { useToast } from "../context/ToastContext";
export const useOrder = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // ── Place order ──
  const placeOrder = useCallback(
    async (payload) => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.post("/orders", payload);
        toast.success("Order placed successfully! 🎉");
        return res.data;
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to place order";
        setError(msg);
        toast.error(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );
  // ── Get my orders ──
  const getMyOrders = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/orders/my", { params });
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  // ── Get single order ──
  const getOrderById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/orders/${id}`);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Order not found");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  // ── Cancel order ──
  const cancelOrder = useCallback(
    async (id, reason = "") => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.patch(`/orders/${id}/cancel`, { reason });
        toast.success("Order cancelled successfully");
        return res.data;
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to cancel order";
        setError(msg);
        toast.error(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );
  // ── Admin: get all orders ──
  const getAllOrdersAdmin = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/orders/admin/all", { params });
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  // ── Admin: update order status ──
  const updateOrderStatus = useCallback(
    async (id, payload) => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.patch(`/orders/admin/${id}/status`, payload);
        toast.success("Order status updated ✅");
        return res.data;
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to update order";
        setError(msg);
        toast.error(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );
  // ── Admin: get order stats ──
  const getOrderStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/orders/admin/stats");
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch stats");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  return {
    loading,
    error,
    placeOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    getAllOrdersAdmin,
    updateOrderStatus,
    getOrderStats,
  };
};
