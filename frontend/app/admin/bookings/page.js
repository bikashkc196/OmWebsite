// frontend/app/admin/bookings/page.js
"use client";
import { useEffect, useState, useCallback } from "react";
import { useAdmin } from "../../../hooks/useAdmin";
import { useToast } from "../../../context/ToastContext";
import BookingTable from "../../../components/ui/BookingTable";
import StatusBadge from "../../../components/ui/StatusBadge";
import Spinner from "../../../components/ui/Spinner";

const STATUS_FILTERS = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export default function AdminBookingsPage() {
  const { getAllBookings, updateBookingStatus, deleteBooking, loading } =
    useAdmin();
  const { toast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // ── Fetch All Bookings ──
  const fetchBookings = useCallback(async () => {
    setPageLoading(true);
    const data = await getAllBookings({ sort: "-createdAt" });
    if (data) {
      setBookings(data.bookings || []);
      setFiltered(data.bookings || []);
    }
    setPageLoading(false);
  }, [getAllBookings]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // ── Search & Filter ──
  useEffect(() => {
    let result = [...bookings];

    if (statusFilter) {
      result = result.filter((b) => b.status?.toLowerCase() === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.user?.name?.toLowerCase().includes(q) ||
          b.user?.email?.toLowerCase().includes(q) ||
          b.deviceType?.toLowerCase().includes(q) ||
          b.deviceModel?.toLowerCase().includes(q) ||
          b.serviceType?.toLowerCase().includes(q),
      );
    }

    setFiltered(result);
  }, [search, statusFilter, bookings]);

  // ── Status Change ──
  const handleStatusChange = async (bookingId, newStatus) => {
    const res = await updateBookingStatus(bookingId, newStatus);
    if (res) {
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: newStatus } : b,
        ),
      );
      toast.success(`Status updated to "${newStatus}" ✅`);
    } else {
      toast.error("Failed to update status ❌");
    }
  };

  // ── Delete ──
  const handleDelete = async (bookingId) => {
    const res = await deleteBooking(bookingId);
    if (res) {
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      toast.success("Booking deleted successfully 🗑️");
    } else {
      toast.error("Failed to delete booking ❌");
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">
            📋 All Bookings
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and update all repair bookings
          </p>
        </div>
        <button
          onClick={fetchBookings}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600
            text-white text-sm font-semibold rounded-xl
            hover:bg-blue-700 transition shadow-sm"
        >
          🔄 Refresh
        </button>
      </div>

      {/* ── Search & Filter Bar ── */}
      <div
        className="bg-white rounded-2xl border border-gray-100
        shadow-sm p-4 flex flex-col sm:flex-row gap-4"
      >
        {/* Search Input */}
        <div className="relative flex-1">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2
            text-gray-400 text-sm"
          >
            🔍
          </span>
          <input
            type="text"
            placeholder="Search by name, email, device, service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200
              rounded-xl text-sm focus:outline-none focus:ring-2
              focus:ring-blue-500 bg-gray-50"
          />
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold
                transition border
                ${
                  statusFilter === f.value
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Results Count ── */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-800">{filtered.length}</span>{" "}
          of{" "}
          <span className="font-semibold text-gray-800">{bookings.length}</span>{" "}
          bookings
        </p>
      </div>

      {/* ── Table ── */}
      <div
        className="bg-white rounded-2xl border border-gray-100
        shadow-sm overflow-hidden"
      >
        <BookingTable
          bookings={filtered}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onView={(b) => setSelectedBooking(b)}
          loading={pageLoading}
        />
      </div>

      {/* ── Booking Detail Modal ── */}
      {selectedBooking && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm
          flex items-center justify-center z-50 p-4"
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full
            max-w-lg max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between px-6 py-4
              border-b border-gray-100 sticky top-0 bg-white"
            >
              <h3 className="text-lg font-bold text-gray-800">
                📋 Booking Details
              </h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-gray-400 hover:text-gray-600
                  hover:bg-gray-100 p-2 rounded-xl transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <StatusBadge status={selectedBooking.status} />
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <p
                  className="text-xs font-semibold text-gray-400
                  uppercase tracking-wider mb-3"
                >
                  Customer Info
                </p>
                <DetailRow label="Name" value={selectedBooking.user?.name} />
                <DetailRow label="Email" value={selectedBooking.user?.email} />
                <DetailRow
                  label="Phone"
                  value={selectedBooking.phone || "N/A"}
                />
              </div>

              {/* Device Info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <p
                  className="text-xs font-semibold text-gray-400
                  uppercase tracking-wider mb-3"
                >
                  Device Info
                </p>
                <DetailRow label="Device" value={selectedBooking.deviceType} />
                <DetailRow label="Model" value={selectedBooking.deviceModel} />
                <DetailRow
                  label="Service"
                  value={selectedBooking.serviceType}
                />
              </div>

              {/* Booking Info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <p
                  className="text-xs font-semibold text-gray-400
                  uppercase tracking-wider mb-3"
                >
                  Booking Info
                </p>
                <DetailRow
                  label="Date"
                  value={
                    selectedBooking.preferredDate
                      ? new Date(
                          selectedBooking.preferredDate,
                        ).toLocaleDateString("en-NP", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"
                  }
                />
                <DetailRow
                  label="Estimated Cost"
                  value={`Rs ${
                    selectedBooking.estimatedCost?.toLocaleString("en-NP") ||
                    "—"
                  }`}
                />
                {selectedBooking.notes && (
                  <DetailRow label="Notes" value={selectedBooking.notes} />
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-full py-2.5 bg-gray-800 text-white rounded-xl
                  text-sm font-semibold hover:bg-gray-900 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Helper Component ──
function DetailRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs text-gray-500 flex-shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-sm font-medium text-gray-800 text-right">
        {value || "N/A"}
      </span>
    </div>
  );
}
