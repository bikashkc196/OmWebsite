// frontend/hooks/useAdmin.js
"use client";
import { useState, useCallback } from "react";
import api from "../lib/api";

export const useAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ─── Dashboard Stats ───────────────────────────────────────────
  const getStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/admin/stats");
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch stats");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── All Bookings ──────────────────────────────────────────────
  const getAllBookings = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/admin/bookings", { params });
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch bookings");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Update Booking Status ─────────────────────────────────────
  const updateBookingStatus = useCallback(async (bookingId, status) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.put(`/admin/bookings/${bookingId}/status`, {
        status,
      });
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Delete Booking ────────────────────────────────────────────
  const deleteBooking = useCallback(async (bookingId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.delete(`/admin/bookings/${bookingId}`);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete booking");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── All Users ─────────────────────────────────────────────────
  const getAllUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/admin/users");
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Delete User ───────────────────────────────────────────────
  const deleteUser = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.delete(`/admin/users/${userId}`);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Single Booking Detail ─────────────────────────────────────
  const getBookingById = useCallback(async (bookingId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/admin/bookings/${bookingId}`);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch booking");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getStats,
    getAllBookings,
    updateBookingStatus,
    deleteBooking,
    getAllUsers,
    deleteUser,
    getBookingById,
  };
};
