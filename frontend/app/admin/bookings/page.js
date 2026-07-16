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
  { label: "In Progress", value: "in_progress" },
  { label: "Waiting for Parts", value: "waiting_for_parts" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];
export default function AdminBookingsPage() {
  const {
    getAllBookings,
    updateBookingStatus,
    deleteBooking,
    getInventory,
    addBookingPart,
    removeBookingPart,
    loading,
  } = useAdmin();
  const { toast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  // ── Parts Used ──
  const [inventory, setInventory] = useState([]);
  const [selectedPartId, setSelectedPartId] = useState("");
  const [partQty, setPartQty] = useState(1);
  const [addingPart, setAddingPart] = useState(false);
  const [removingPartId, setRemovingPartId] = useState(null);
  // ── Repair Price ──
  const [priceForm, setPriceForm] = useState({
    estimatedCost: "",
    finalCost: "",
  });
  const [savingPrice, setSavingPrice] = useState(false);
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
  // ── Fetch Inventory (for the "use a part" picker) ──
  const fetchInventory = useCallback(async () => {
    const data = await getInventory();
    if (data) setInventory(data.items || []);
  }, [getInventory]);
  useEffect(() => {
    fetchBookings();
    fetchInventory();
  }, [fetchBookings, fetchInventory]);
  // ── Use a Part on the Selected Booking ──
  const handleAddPart = async () => {
    if (!selectedPartId || !partQty || Number(partQty) < 1) return;
    setAddingPart(true);
    const result = await addBookingPart(
      selectedBooking._id,
      selectedPartId,
      Number(partQty),
    );
    if (result?.booking) {
      setSelectedBooking(result.booking);
      toast.success(result.message || "Part deducted from inventory ✅");
      setSelectedPartId("");
      setPartQty(1);
      fetchInventory();
    } else {
      toast.error("Failed to use part on this booking ❌");
    }
    setAddingPart(false);
  };
  // ── Undo a Part Usage (restocks inventory) ──
  const handleRemovePart = async (partId) => {
    setRemovingPartId(partId);
    const result = await removeBookingPart(selectedBooking._id, partId);
    if (result?.booking) {
      setSelectedBooking(result.booking);
      toast.success("Part usage undone, stock restored 🔄");
      fetchInventory();
    } else {
      toast.error("Failed to undo part usage ❌");
    }
    setRemovingPartId(null);
  };
  // ── Save Repair Price (works even on a completed/cancelled booking) ──
  const handleSavePrice = async () => {
    setSavingPrice(true);
    const res = await updateBookingStatus(
      selectedBooking._id,
      selectedBooking.status,
      {
        estimatedCost:
          priceForm.estimatedCost === ""
            ? undefined
            : Number(priceForm.estimatedCost),
        finalCost:
          priceForm.finalCost === "" ? undefined : Number(priceForm.finalCost),
      },
    );
    if (res?.booking) {
      setSelectedBooking(res.booking);
      setBookings((prev) =>
        prev.map((b) => (b._id === res.booking._id ? res.booking : b)),
      );
      toast.success("Repair price updated ✅");
    } else {
      toast.error("Failed to update price ❌");
    }
    setSavingPrice(false);
  };
  // ── Open Booking Detail Modal ──
  const openBookingDetail = (booking) => {
    setSelectedPartId("");
    setPartQty(1);
    setPriceForm({
      estimatedCost: booking.estimatedCost || "",
      finalCost: booking.finalCost || "",
    });
    setSelectedBooking(booking);
  };
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
          <h1 className="text-2xl text-ink tracking-wide">
            📋 All Bookings
          </h1>
          <p className="text-ink-soft text-sm mt-1">
            Manage and update all repair bookings
          </p>
        </div>
        <button
          onClick={fetchBookings}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-purple to-brand-orange
            text-white text-sm font-semibold rounded-xl
            hover:scale-105 transition shadow-sm"
        >
          🔄 Refresh
        </button>
      </div>
      {/* ── Search & Filter Bar ── */}
      <div
        className="bg-surface rounded-2xl border border-line
        shadow-sm p-4 flex flex-col sm:flex-row gap-4"
      >
        {/* Search Input */}
        <div className="relative flex-1">
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2
            text-ink-soft text-sm"
          >
            🔍
          </span>
          <input
            type="text"
            placeholder="Search by name, email, device, service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-line
              rounded-xl text-sm focus:outline-none focus:ring-2
              focus:ring-brand-purple bg-surface2 text-ink"
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
                    ? "bg-gradient-to-r from-brand-purple to-brand-orange text-white border-transparent"
                    : "bg-surface2 text-ink-soft border-line hover:border-brand-purple/40"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      {/* ── Results Count ── */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-soft">
          Showing{" "}
          <span className="font-semibold text-ink">{filtered.length}</span>{" "}
          of{" "}
          <span className="font-semibold text-ink">{bookings.length}</span>{" "}
          bookings
        </p>
      </div>
      {/* ── Table ── */}
      <div
        className="bg-surface rounded-2xl border border-line
        shadow-sm overflow-hidden"
      >
        <BookingTable
          bookings={filtered}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onView={openBookingDetail}
          loading={pageLoading}
        />
      </div>
      {/* ── Booking Detail Modal ── */}
      {selectedBooking && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm
          flex items-center justify-center z-50 p-4"
        >
          <div
            className="bg-surface border border-line rounded-2xl shadow-2xl w-full
            max-w-lg max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between px-6 py-4
              border-b border-line sticky top-0 bg-surface"
            >
              <h3 className="text-lg font-bold text-ink">
                📋 Booking Details
              </h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-ink-soft hover:text-ink
                  hover:bg-surface2 p-2 rounded-xl transition"
              >
                ✕
              </button>
            </div>
            {/* Modal Body */}
            <div className="px-6 py-5 space-y-5">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-ink-soft">Status</span>
                <StatusBadge status={selectedBooking.status} />
              </div>
              {/* Customer Info */}
              <div className="bg-surface2 rounded-xl p-4 space-y-2">
                <p
                  className="text-xs font-semibold text-ink-soft
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
              <div className="bg-surface2 rounded-xl p-4 space-y-2">
                <p
                  className="text-xs font-semibold text-ink-soft
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
              <div className="bg-surface2 rounded-xl p-4 space-y-2">
                <p
                  className="text-xs font-semibold text-ink-soft
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
                {selectedBooking.notes && (
                  <DetailRow label="Notes" value={selectedBooking.notes} />
                )}
              </div>
              {/* Repair Price (editable — can be set/corrected at any time, even after completion) */}
              <div className="bg-surface2 rounded-xl p-4 space-y-3">
                <p className="text-xs font-semibold text-ink-soft uppercase tracking-wider">
                  💰 Repair Price
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-ink-soft mb-1">
                      Estimated Cost (Rs)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={priceForm.estimatedCost}
                      onChange={(e) =>
                        setPriceForm({
                          ...priceForm,
                          estimatedCost: e.target.value,
                        })
                      }
                      placeholder="e.g. 2500"
                      className="w-full border border-line rounded-lg px-2.5
                      py-1.5 text-sm bg-surface text-ink focus:outline-none focus:ring-2
                      focus:ring-brand-purple"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-ink-soft mb-1">
                      Final Cost (Rs)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={priceForm.finalCost}
                      onChange={(e) =>
                        setPriceForm({
                          ...priceForm,
                          finalCost: e.target.value,
                        })
                      }
                      placeholder="e.g. 2200"
                      className="w-full border border-line rounded-lg px-2.5
                      py-1.5 text-sm bg-surface text-ink focus:outline-none focus:ring-2
                      focus:ring-brand-purple"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSavePrice}
                  disabled={savingPrice}
                  className="w-full py-2 bg-gradient-to-r from-brand-purple to-brand-orange text-white rounded-lg
                  text-xs font-semibold hover:scale-[1.02] transition
                  disabled:opacity-50 disabled:cursor-not-allowed flex
                  items-center justify-center gap-2"
                >
                  {savingPrice ? (
                    <>
                      <Spinner size="sm" color="white" /> Saving...
                    </>
                  ) : (
                    "Save Price"
                  )}
                </button>
              </div>
              {/* Parts Used (deducted from Inventory) */}
              <div className="bg-surface2 rounded-xl p-4 space-y-3">
                <p className="text-xs font-semibold text-ink-soft uppercase tracking-wider">
                  🔧 Parts Used
                </p>
                {selectedBooking.partsUsed?.length > 0 ? (
                  <div className="space-y-2">
                    {selectedBooking.partsUsed.map((p) => (
                      <div
                        key={p._id}
                        className="flex items-center justify-between bg-surface
                        rounded-lg px-3 py-2 border border-line"
                      >
                        <div>
                          <p className="text-sm font-medium text-ink">
                            {p.partName}
                          </p>
                          <p className="text-xs text-ink-soft">
                            {p.partCode} · Qty {p.quantity} · Rs.{" "}
                            {p.unitPrice?.toLocaleString("en-NP")}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemovePart(p._id)}
                          disabled={removingPartId === p._id}
                          className="text-red-400 hover:text-red-300 text-xs
                          font-medium disabled:opacity-50 flex items-center gap-1"
                        >
                          {removingPartId === p._id ? (
                            <Spinner size="sm" color="red" />
                          ) : (
                            "✕ Undo"
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-ink-soft">No parts used yet</p>
                )}
                {/* Add a part */}
                <div className="flex gap-2 pt-2 border-t border-line">
                  <select
                    value={selectedPartId}
                    onChange={(e) => setSelectedPartId(e.target.value)}
                    className="flex-1 border border-line rounded-lg px-2
                    py-1.5 text-xs bg-surface text-ink focus:outline-none focus:ring-2
                    focus:ring-brand-purple"
                  >
                    <option value="">Select a part...</option>
                    {inventory
                      .filter((i) => i.quantity > 0)
                      .map((i) => (
                        <option key={i._id} value={i._id}>
                          {i.partName} ({i.quantity} left)
                        </option>
                      ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={partQty}
                    onChange={(e) => setPartQty(e.target.value)}
                    className="w-16 border border-line rounded-lg px-2
                    py-1.5 text-xs bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                  <button
                    onClick={handleAddPart}
                    disabled={addingPart || !selectedPartId}
                    className="px-3 py-1.5 bg-gradient-to-r from-brand-purple to-brand-orange text-white rounded-lg
                    text-xs font-semibold hover:scale-[1.02] transition
                    disabled:opacity-50 disabled:cursor-not-allowed flex
                    items-center gap-1.5"
                  >
                    {addingPart ? (
                      <Spinner size="sm" color="white" />
                    ) : (
                      "+ Use Part"
                    )}
                  </button>
                </div>
              </div>
            </div>
            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-line">
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-full py-2.5 bg-surface2 text-ink rounded-xl
                  text-sm font-semibold hover:bg-line transition"
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
      <span className="text-xs text-ink-soft flex-shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-sm font-medium text-ink text-right">
        {value || "N/A"}
      </span>
    </div>
  );
}
