"use client";
import { useState, useCallback } from "react";
import api from "../lib/api";
import { useToast } from "../context/ToastContext";

export const useBooking = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // ── Fetch my bookings ──
  const fetchMyBookings = useCallback(
    async (params = {}) => {
      setLoading(true);
      try {
        const { data } = await api.get("/bookings/my", { params });
        setBookings(data.bookings);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  // ── Fetch slot availability ──
  const fetchSlots = useCallback(
    async (date) => {
      try {
        const { data } = await api.get(
          `/bookings/slots/available?date=${date}`,
        );
        return data.availability;
      } catch (err) {
        toast.error("Failed to fetch available slots");
        return [];
      }
    },
    [toast],
  );

  // ── Create booking ──
  const createBooking = useCallback(
    async (payload) => {
      setLoading(true);
      try {
        const { data } = await api.post("/bookings", payload);
        toast.success("🎉 Booking confirmed! See you soon.");
        return { success: true, booking: data.booking };
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Booking failed. Try again.",
        );
        return { success: false };
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  // ── Cancel booking ──
  const cancelBooking = useCallback(
    async (bookingId, reason) => {
      try {
        await api.patch(`/bookings/${bookingId}/cancel`, { reason });
        toast.success("Booking cancelled successfully");
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingId ? { ...b, status: "cancelled" } : b,
          ),
        );
        return true;
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to cancel booking");
        return false;
      }
    },
    [toast],
  );

  // ── Fetch single booking ──
  const fetchBookingById = useCallback(
    async (id) => {
      try {
        const { data } = await api.get(`/bookings/${id}`);
        return data.booking;
      } catch (err) {
        toast.error("Failed to load booking details");
        return null;
      }
    },
    [toast],
  );

  return {
    loading,
    bookings,
    total,
    totalPages,
    fetchMyBookings,
    fetchSlots,
    createBooking,
    cancelBooking,
    fetchBookingById,
  };
};
