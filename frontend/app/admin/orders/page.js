// frontend/app/admin/orders/page.js
"use client";
import { useEffect, useState, useCallback } from "react";
import { useOrder } from "../../../hooks/useOrder";
import { useToast } from "../../../context/ToastContext";
import Spinner from "../../../components/ui/Spinner";
const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];
const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-indigo-100 text-indigo-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-600",
  cancelled: "bg-red-100 text-red-600",
};
const STATUS_ICONS = {
  pending: "⏳",
  confirmed: "✅",
  processing: "⚙️",
  shipped: "🚚",
  delivered: "📦",
  cancelled: "❌",
};
export default function AdminOrdersPage() {
  const { getAllOrdersAdmin, updateOrderStatus, loading } = useOrder();
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  // Detail Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const fetchOrders = useCallback(async () => {
    setPageLoading(true);
    const data = await getAllOrdersAdmin({
      page,
      limit: 10,
      status: statusFilter || undefined,
      search: search || undefined,
    });
    if (data) {
      setOrders(data.orders || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    }
    setPageLoading(false);
  }, [page, search, statusFilter, getAllOrdersAdmin]);
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  const openDetail = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setAdminNote(order.adminNote || "");
  };
  const handleUpdateStatus = async () => {
    if (!newStatus) return;
    setUpdating(true);
    const result = await updateOrderStatus(selectedOrder._id, {
      status: newStatus,
      adminNote,
    });
    if (result) {
      setOrders((prev) =>
        prev.map((o) => (o._id === selectedOrder._id ? result.order : o)),
      );
      setSelectedOrder(result.order);
    }
    setUpdating(false);
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800">📦 Orders</h1>
        <p className="text-gray-500 text-sm mt-1">{total} total orders</p>
      </div>
      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="🔍 Search by order ref..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="flex-1 min-w-[200px] border border-gray-200 rounded-xl px-4 py-2.5 text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white
          focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
      {/* Table */}
      {pageLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="xl" color="blue" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <p className="text-5xl mb-3">📭</p>
          <p className="text-gray-400">No orders found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {[
                    "Order Ref",
                    "Customer",
                    "Items",
                    "Total",
                    "Payment",
                    "Status",
                    "Date",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold
                    text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Order Ref */}
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-bold text-gray-700">
                        {order.orderRef}
                      </span>
                    </td>
                    {/* Customer */}
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800 text-xs">
                        {order.user?.name || "N/A"}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {order.user?.phone || ""}
                      </p>
                    </td>
                    {/* Items Count */}
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {order.items?.length} item
                      {order.items?.length !== 1 ? "s" : ""}
                    </td>
                    {/* Total */}
                    <td className="px-4 py-3">
                      <span className="font-bold text-blue-700 text-sm">
                        Rs. {order.totalAmount?.toLocaleString("en-NP")}
                      </span>
                    </td>
                    {/* Payment */}
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-500 capitalize">
                        {order.paymentMethod?.replace("_", " ")}
                      </span>
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full
                      ${STATUS_STYLES[order.status] || "bg-gray-100 text-gray-600"}`}
                      >
                        {STATUS_ICONS[order.status]} {order.status}
                      </span>
                    </td>
                    {/* Date */}
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("en-NP", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    {/* Action */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openDetail(order)}
                        className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5
                        rounded-lg font-semibold hover:bg-blue-100 transition"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg
                  hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ← Prev
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg
                  hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {/* ── Order Detail Modal ── */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center
        justify-center z-50 p-4"
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div>
                <h2 className="font-bold text-gray-800">Order Details</h2>
                <p className="text-xs font-mono text-blue-600">
                  {selectedOrder.orderRef}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 text-xl transition"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Customer Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">
                  Customer
                </p>
                <p className="font-semibold text-gray-800">
                  {selectedOrder.user?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {selectedOrder.user?.email}
                </p>
                <p className="text-xs text-gray-500">
                  {selectedOrder.user?.phone}
                </p>
              </div>
              {/* Shipping Address */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">
                  Shipping Address
                </p>
                <p className="text-sm text-gray-700">
                  {selectedOrder.shippingAddress?.fullName}
                </p>
                <p className="text-xs text-gray-500">
                  {selectedOrder.shippingAddress?.phone}
                </p>
                <p className="text-xs text-gray-500">
                  {selectedOrder.shippingAddress?.address},{" "}
                  {selectedOrder.shippingAddress?.city},{" "}
                  {selectedOrder.shippingAddress?.district}
                </p>
              </div>
              {/* Items */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  Items
                </p>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl"
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-base">
                            📦
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          × {item.quantity}
                        </p>
                      </div>
                      <p className="text-xs font-bold text-blue-700">
                        Rs.{" "}
                        {(item.priceAtOrder * item.quantity).toLocaleString(
                          "en-NP",
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Price Breakdown */}
              <div className="bg-blue-50 rounded-xl p-4 space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>
                    Rs. {selectedOrder.subtotal?.toLocaleString("en-NP")}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span>
                    {selectedOrder.deliveryCharge === 0
                      ? "FREE"
                      : `Rs. ${selectedOrder.deliveryCharge}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-blue-700 text-sm pt-1 border-t border-blue-200">
                  <span>Total</span>
                  <span>
                    Rs. {selectedOrder.totalAmount?.toLocaleString("en-NP")}
                  </span>
                </div>
              </div>
              {/* Update Status */}
              <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                <p className="text-xs font-semibold text-gray-600 uppercase">
                  Update Status
                </p>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_ICONS[s]} {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows={2}
                  placeholder="Admin note (optional)..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <button
                  onClick={handleUpdateStatus}
                  disabled={updating || newStatus === selectedOrder.status}
                  className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm
                  font-semibold hover:bg-blue-700 transition disabled:opacity-60
                  flex items-center justify-center gap-2"
                >
                  {updating ? (
                    <>
                      <Spinner size="sm" color="white" /> Updating...
                    </>
                  ) : (
                    "✅ Update Status"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
