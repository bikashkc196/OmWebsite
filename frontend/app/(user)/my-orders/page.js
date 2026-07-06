// frontend/app/(user)/my-orders/page.js
"use client";
import { useEffect, useState, useCallback } from "react";
import { useOrder } from "../../../hooks/useOrder";
import { useAuth } from "../../../context/AuthContext";
import Link from "next/link";
import Spinner from "../../../components/ui/Spinner";
const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  processing: "bg-indigo-100 text-indigo-700 border-indigo-200",
  shipped: "bg-purple-100 text-purple-700 border-purple-200",
  delivered: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-600 border-red-200",
};
const STATUS_ICONS = {
  pending: "⏳",
  confirmed: "✅",
  processing: "⚙️",
  shipped: "🚚",
  delivered: "📦",
  cancelled: "❌",
};
export default function MyOrdersPage() {
  const { getMyOrders, cancelOrder, loading } = useOrder();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [cancelId, setCancelId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const fetchOrders = useCallback(async () => {
    setPageLoading(true);
    const data = await getMyOrders({ limit: 20 });
    if (data) setOrders(data.orders || []);
    setPageLoading(false);
  }, [getMyOrders]);
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  const handleCancel = async () => {
    setCancelling(true);
    const result = await cancelOrder(cancelId, cancelReason);
    if (result) {
      setOrders((prev) =>
        prev.map((o) => (o._id === cancelId ? result.order : o)),
      );
    }
    setCancelId(null);
    setCancelReason("");
    setCancelling(false);
  };
  if (pageLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Spinner size="xl" color="blue" />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800">
              📦 My Orders
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {orders.length} order{orders.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm text-blue-600 font-semibold hover:underline"
          >
            🛒 Shop More
          </Link>
        </div>
        {orders.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-7xl mb-4">📭</p>
            <h2 className="text-xl font-bold text-gray-700 mb-2">
              No orders yet
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Your placed orders will appear here
            </p>
            <Link
              href="/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl text-sm
              font-semibold hover:bg-blue-700 shadow-md shadow-blue-200 transition"
            >
              Start Shopping →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                {/* Order Header */}
                <div
                  className="px-5 py-4 flex flex-wrap items-center justify-between gap-3
                border-b border-gray-50"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-sm text-gray-800">
                        {order.orderRef}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border
                      ${STATUS_STYLES[order.status] || "bg-gray-100 text-gray-600"}`}
                      >
                        {STATUS_ICONS[order.status]}{" "}
                        {order.status?.charAt(0).toUpperCase() +
                          order.status?.slice(1)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("en-NP", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                      {" • "}
                      {order.items?.length} item
                      {order.items?.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-extrabold text-blue-700">
                      Rs. {order.totalAmount?.toLocaleString("en-NP")}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">
                      {order.paymentMethod?.replace("_", " ")}
                    </p>
                  </div>
                </div>
                {/* Items Preview */}
                <div className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    {order.items?.slice(0, 3).map((item) => (
                      <div
                        key={item._id}
                        className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50
                        border border-gray-100 flex-shrink-0"
                      >
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
                    ))}
                    {order.items?.length > 3 && (
                      <span className="text-xs text-gray-400 font-medium ml-1">
                        +{order.items.length - 3} more
                      </span>
                    )}
                    <button
                      onClick={() =>
                        setExpandedId(
                          expandedId === order._id ? null : order._id,
                        )
                      }
                      className="ml-auto text-xs text-blue-600 font-semibold hover:underline"
                    >
                      {expandedId === order._id
                        ? "Hide Details ▲"
                        : "View Details ▼"}
                    </button>
                  </div>
                </div>
                {/* Expanded Details */}
                {expandedId === order._id && (
                  <div className="px-5 pb-5 border-t border-gray-50 pt-4 space-y-4">
                    {/* All Items */}
                    <div className="space-y-2">
                      {order.items?.map((item) => (
                        <div key={item._id} className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50
                          border border-gray-100 flex-shrink-0"
                          >
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xl">
                                📦
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-bold text-blue-700">
                            Rs.{" "}
                            {(item.priceAtOrder * item.quantity).toLocaleString(
                              "en-NP",
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                    {/* Shipping Info */}
                    <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600">
                      <p className="font-semibold text-gray-700 mb-1">
                        📍 Shipped To
                      </p>
                      <p>
                        {order.shippingAddress?.fullName} •{" "}
                        {order.shippingAddress?.phone}
                      </p>
                      <p>
                        {order.shippingAddress?.address},{" "}
                        {order.shippingAddress?.city},{" "}
                        {order.shippingAddress?.district}
                      </p>
                    </div>
                    {/* Pricing Breakdown */}
                    <div className="bg-blue-50 rounded-xl p-3 text-xs space-y-1">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>
                          Rs. {order.subtotal?.toLocaleString("en-NP")}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Delivery</span>
                        <span>
                          {order.deliveryCharge === 0
                            ? "FREE"
                            : `Rs. ${order.deliveryCharge}`}
                        </span>
                      </div>
                      <div className="flex justify-between font-bold text-blue-700 text-sm pt-1 border-t border-blue-200">
                        <span>Total</span>
                        <span>
                          Rs. {order.totalAmount?.toLocaleString("en-NP")}
                        </span>
                      </div>
                    </div>
                    {/* Status History */}
                    {order.statusHistory?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-2">
                          🕐 Status History
                        </p>
                        <div className="space-y-1.5">
                          {order.statusHistory.map((h, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-xs text-gray-500"
                            >
                              <span>{STATUS_ICONS[h.status] || "•"}</span>
                              <span className="capitalize font-medium text-gray-700">
                                {h.status}
                              </span>
                              <span>—</span>
                              <span>{h.note}</span>
                              <span className="ml-auto">
                                {new Date(h.changedAt).toLocaleDateString(
                                  "en-NP",
                                  {
                                    month: "short",
                                    day: "numeric",
                                  },
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Cancel Button */}
                    {["pending", "confirmed"].includes(order.status) && (
                      <button
                        onClick={() => setCancelId(order._id)}
                        className="w-full py-2.5 border border-red-200 text-red-500
                        rounded-xl text-sm font-semibold hover:bg-red-50 transition"
                      >
                        ❌ Cancel Order
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* ── Cancel Confirm Modal ── */}
      {cancelId && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center
        justify-center z-50 p-4"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div className="text-center mb-4">
              <div className="text-5xl mb-3">⚠️</div>
              <h3 className="text-lg font-bold text-gray-800">Cancel Order?</h3>
              <p className="text-sm text-gray-500 mt-1">
                Are you sure you want to cancel this order?
              </p>
            </div>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation (optional)..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
              focus:outline-none focus:ring-2 focus:ring-red-400 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setCancelId(null)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-700
                rounded-xl text-sm font-medium hover:bg-gray-50 transition"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm
                font-semibold hover:bg-red-600 transition disabled:opacity-60
                flex items-center justify-center gap-2"
              >
                {cancelling ? (
                  <>
                    <Spinner size="sm" color="white" /> Cancelling...
                  </>
                ) : (
                  "Yes, Cancel"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
