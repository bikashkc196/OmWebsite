// frontend/app/(user)/my-orders/page.js
"use client";
import { useEffect, useState, useCallback } from "react";
import { useOrder } from "../../../hooks/useOrder";
import { useAuth } from "../../../context/AuthContext";
import Link from "next/link";
import Spinner from "../../../components/ui/Spinner";
const STATUS_STYLES = {
  pending: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  confirmed: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  processing: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  shipped: "bg-brand-purple/15 text-brand-purple border-brand-purple/30",
  delivered: "bg-green-500/15 text-green-300 border-green-500/30",
  cancelled: "bg-red-500/15 text-red-300 border-red-500/30",
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
      <div className="min-h-screen flex justify-center items-center bg-bg">
        <Spinner size="xl" color="blue" />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-bg py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl text-ink tracking-wide">
              📦 My Orders
            </h1>
            <p className="text-ink-soft text-sm mt-1">
              {orders.length} order{orders.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm text-brand-purple font-semibold hover:underline"
          >
            🛒 Shop More
          </Link>
        </div>
        {orders.length === 0 ? (
          <div className="text-center py-24 bg-surface rounded-2xl border border-line shadow-sm">
            <p className="text-7xl mb-4">📭</p>
            <h2 className="text-xl text-ink mb-2 tracking-wide">
              No orders yet
            </h2>
            <p className="text-ink-soft text-sm mb-6">
              Your placed orders will appear here
            </p>
            <Link
              href="/products"
              className="bg-gradient-to-r from-brand-purple to-brand-orange text-white px-6 py-3 rounded-xl text-sm
              font-semibold hover:scale-105 shadow-md shadow-brand-purple/20 transition"
            >
              Start Shopping →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-surface rounded-2xl border border-line shadow-sm overflow-hidden"
              >
                {/* Order Header */}
                <div
                  className="px-5 py-4 flex flex-wrap items-center justify-between gap-3
                border-b border-line"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-sm text-ink">
                        {order.orderRef}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border
                      ${STATUS_STYLES[order.status] || "bg-ink-soft/15 text-ink-soft border-ink-soft/30"}`}
                      >
                        {STATUS_ICONS[order.status]}{" "}
                        {order.status?.charAt(0).toUpperCase() +
                          order.status?.slice(1)}
                      </span>
                    </div>
                    <p className="text-xs text-ink-soft">
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
                    <p className="text-lg font-display text-brand-orange tracking-wide">
                      Rs. {order.totalAmount?.toLocaleString("en-NP")}
                    </p>
                    <p className="text-xs text-ink-soft capitalize">
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
                        className="w-10 h-10 rounded-lg overflow-hidden bg-surface2
                        border border-line flex-shrink-0"
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
                      <span className="text-xs text-ink-soft font-medium ml-1">
                        +{order.items.length - 3} more
                      </span>
                    )}
                    <button
                      onClick={() =>
                        setExpandedId(
                          expandedId === order._id ? null : order._id,
                        )
                      }
                      className="ml-auto text-xs text-brand-purple font-semibold hover:underline"
                    >
                      {expandedId === order._id
                        ? "Hide Details ▲"
                        : "View Details ▼"}
                    </button>
                  </div>
                </div>
                {/* Expanded Details */}
                {expandedId === order._id && (
                  <div className="px-5 pb-5 border-t border-line pt-4 space-y-4">
                    {/* All Items */}
                    <div className="space-y-2">
                      {order.items?.map((item) => (
                        <div key={item._id} className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-xl overflow-hidden bg-surface2
                          border border-line flex-shrink-0"
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
                            <p className="text-sm font-semibold text-ink truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-ink-soft">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-bold text-brand-orange">
                            Rs.{" "}
                            {(item.priceAtOrder * item.quantity).toLocaleString(
                              "en-NP",
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                    {/* Shipping Info */}
                    <div className="bg-surface2 rounded-xl p-3 text-xs text-ink-soft">
                      <p className="font-semibold text-ink mb-1">
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
                    <div className="bg-brand-purple/10 rounded-xl p-3 text-xs space-y-1">
                      <div className="flex justify-between text-ink-soft">
                        <span>Subtotal</span>
                        <span>
                          Rs. {order.subtotal?.toLocaleString("en-NP")}
                        </span>
                      </div>
                      <div className="flex justify-between text-ink-soft">
                        <span>Delivery</span>
                        <span>
                          {order.deliveryCharge === 0
                            ? "FREE"
                            : `Rs. ${order.deliveryCharge}`}
                        </span>
                      </div>
                      <div className="flex justify-between font-bold text-brand-purple text-sm pt-1 border-t border-brand-purple/20">
                        <span>Total</span>
                        <span>
                          Rs. {order.totalAmount?.toLocaleString("en-NP")}
                        </span>
                      </div>
                    </div>
                    {/* Status History */}
                    {order.statusHistory?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-ink-soft mb-2">
                          🕐 Status History
                        </p>
                        <div className="space-y-1.5">
                          {order.statusHistory.map((h, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-xs text-ink-soft"
                            >
                              <span>{STATUS_ICONS[h.status] || "•"}</span>
                              <span className="capitalize font-medium text-ink">
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
                        className="w-full py-2.5 border border-red-500/25 text-red-400
                        rounded-xl text-sm font-semibold hover:bg-red-500/10 transition"
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center
        justify-center z-50 p-4"
        >
          <div className="bg-surface border border-line rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div className="text-center mb-4">
              <div className="text-5xl mb-3">⚠️</div>
              <h3 className="text-lg text-ink tracking-wide">Cancel Order?</h3>
              <p className="text-sm text-ink-soft mt-1">
                Are you sure you want to cancel this order?
              </p>
            </div>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Reason for cancellation (optional)..."
              rows={3}
              className="w-full border border-line rounded-xl px-3 py-2.5 text-sm bg-surface2 text-ink
              focus:outline-none focus:ring-2 focus:ring-red-400 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setCancelId(null)}
                className="flex-1 py-2.5 border border-line text-ink
                rounded-xl text-sm font-medium hover:bg-surface2 transition"
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
