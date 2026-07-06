"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useBooking } from "../../../hooks/useBooking";
import BookingCard from "../../../components/ui/BookingCard";
import BookingModal from "../../../components/ui/BookingModal";
import SkeletonCard from "../../../components/ui/SkeletonCard";
// ── Filter tabs ────────────────────────────────────────────
const STATUS_FILTERS = [
  { label: "All", value: "", icon: "📋" },
  { label: "Pending", value: "pending", icon: "⏳" },
  { label: "Confirmed", value: "confirmed", icon: "✅" },
  { label: "In Progress", value: "in_progress", icon: "🔧" },
  { label: "Waiting", value: "waiting_for_parts", icon: "📦" },
  { label: "Completed", value: "completed", icon: "🎉" },
  { label: "Cancelled", value: "cancelled", icon: "❌" },
];
export default function MyRepairsPage() {
  const {
    fetchMyBookings,
    fetchBookingById,
    loading,
    bookings,
    total,
    totalPages,
  } = useBooking();
  const [activeFilter, setActiveFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [refSearch, setRefSearch] = useState("");
  // Load bookings whenever filter/page changes
  useEffect(() => {
    fetchMyBookings({
      status: activeFilter || undefined,
      page,
      limit: 6,
    });
  }, [activeFilter, page]);
  const handleFilterChange = (value) => {
    setActiveFilter(value);
    setPage(1);
  };
  const handleViewDetail = async (bookingId) => {
    setModalLoading(true);
    const booking = await fetchBookingById(bookingId);
    setSelectedBooking(booking);
    setModalLoading(false);
  };
  const handleCancelled = useCallback(() => {
    fetchMyBookings({ status: activeFilter || undefined, page, limit: 6 });
  }, [activeFilter, page]);
  // Filter by ref number (client-side)
  const displayedBookings = refSearch.trim()
    ? bookings.filter((b) =>
        b.bookingRef?.toLowerCase().includes(refSearch.toLowerCase()),
      )
    : bookings;
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* ── Page Header ── */}
        <div
          className="flex flex-col sm:flex-row sm:items-center
          justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Repairs</h1>
            <p className="text-gray-500 mt-1 text-sm">
              {total > 0
                ? `You have ${total} booking${total > 1 ? "s" : ""} total`
                : "No repair bookings yet"}
            </p>
          </div>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 px-5 py-2.5
              bg-gradient-to-r from-blue-600 to-indigo-600 text-white
              font-semibold text-sm rounded-xl shadow-md
              hover:shadow-blue-300 hover:scale-105 transition-all"
          >
            + Book New Repair
          </Link>
        </div>
        {/* ── Search by Ref ── */}
        <div className="mb-5">
          <div className="relative max-w-sm">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
            <input
              type="text"
              value={refSearch}
              onChange={(e) => setRefSearch(e.target.value)}
              placeholder="Search by booking reference..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200
                bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-300
                transition shadow-sm"
            />
            {refSearch && (
              <button
                onClick={() => setRefSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2
                  text-gray-400 hover:text-gray-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        {/* ── Filter Tabs ── */}
        <div className="flex gap-2 flex-wrap mb-6">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => handleFilterChange(f.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full
                text-xs font-semibold border transition-all
                ${
                  activeFilter === f.value
                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200"
                    : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                }`}
            >
              {f.icon} {f.label}
            </button>
          ))}
        </div>
        {/* ── Content ── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SkeletonCard count={4} />
          </div>
        ) : displayedBookings.length === 0 ? (
          /* ── Empty State ── */
          <div className="text-center py-20">
            <div className="text-7xl mb-4">🔧</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {activeFilter
                ? `No ${activeFilter.replace(/_/g, " ")} bookings`
                : "No repair bookings yet"}
            </h2>
            <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto">
              {activeFilter
                ? "Try selecting a different filter to view other bookings."
                : "Book your first repair and we'll take care of the rest!"}
            </p>
            <Link
              href="/book"
              className="inline-flex items-center gap-2 px-6 py-3
                bg-blue-600 text-white font-semibold rounded-xl shadow-md
                hover:bg-blue-700 transition"
            >
              📅 Book a Repair
            </Link>
          </div>
        ) : (
          <>
            {/* ── Booking Cards Grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedBookings.map((booking) => (
                <div key={booking._id} className="relative group">
                  <BookingCard
                    booking={booking}
                    onCancelled={handleCancelled}
                  />
                  {/* View Details Button */}
                  <div
                    className="absolute top-4 right-4 opacity-0
                    group-hover:opacity-100 transition-opacity"
                  >
                    <button
                      onClick={() => handleViewDetail(booking._id)}
                      disabled={modalLoading}
                      className="flex items-center gap-1.5 text-xs bg-white
                        border border-gray-200 text-gray-600 px-3 py-1.5
                        rounded-full shadow-sm hover:bg-blue-50
                        hover:border-blue-300 hover:text-blue-700 transition"
                    >
                      🔍 Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 rounded-xl border border-gray-200
                    text-sm font-medium text-gray-600 hover:bg-gray-50
                    disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-xl text-sm font-semibold transition
                      ${
                        p === page
                          ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                          : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded-xl border border-gray-200
                    text-sm font-medium text-gray-600 hover:bg-gray-50
                    disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
      {/* ── Booking Detail Modal ── */}
      {selectedBooking && (
        <BookingModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
}
