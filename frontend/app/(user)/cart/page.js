// frontend/app/(user)/cart/page.js
"use client";
import { useCart } from "../../../hooks/useCart";
import { useAuth } from "../../../context/AuthContext";
import Link from "next/link";
import Spinner from "../../../components/ui/Spinner";
export default function CartPage() {
  const {
    cart,
    loading,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
  } = useCart();
  const { user } = useAuth();
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <p className="text-6xl mb-4">🔒</p>
          <h2 className="text-xl text-ink tracking-wide">Login Required</h2>
          <p className="text-ink-soft text-sm mt-1 mb-4">
            Please login to view your cart
          </p>
          <Link
            href="/login"
            className="bg-gradient-to-r from-brand-purple to-brand-orange text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:scale-105 transition"
          >
            Login Now
          </Link>
        </div>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-bg">
        <Spinner size="xl" color="blue" />
      </div>
    );
  }
  const items = cart?.items || [];
  return (
    <div className="min-h-screen bg-bg py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl text-ink tracking-wide">
            🛒 My Cart
            {items.length > 0 && (
              <span className="ml-2 text-base font-semibold text-ink-soft">
                ({items.length} item{items.length !== 1 ? "s" : ""})
              </span>
            )}
          </h1>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-red-400 hover:text-red-300 font-medium border
              border-red-500/25 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition"
            >
              🗑️ Clear Cart
            </button>
          )}
        </div>
        {items.length === 0 ? (
          <div className="text-center py-24 bg-surface rounded-2xl border border-line shadow-sm">
            <p className="text-7xl mb-4">🛒</p>
            <h2 className="text-xl text-ink mb-2 tracking-wide">
              Your cart is empty
            </h2>
            <p className="text-ink-soft text-sm mb-6">
              Browse our products and add items to your cart!
            </p>
            <Link
              href="/products"
              className="bg-gradient-to-r from-brand-purple to-brand-orange text-white px-6 py-3 rounded-xl text-sm
              font-semibold hover:scale-105 shadow-md shadow-brand-purple/20 transition"
            >
              Shop Now →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ── Cart Items ── */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const product = item.product;
                if (!product) return null;
                return (
                  <div
                    key={item._id}
                    className="bg-surface rounded-2xl border border-line shadow-sm p-4 flex gap-4"
                  >
                    {/* Image */}
                    <Link href={`/products/${product._id}`}>
                      <div
                        className="w-20 h-20 rounded-xl overflow-hidden bg-surface2
                      border border-line flex-shrink-0"
                      >
                        {product.images?.[0]?.url ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-3xl">📦</span>
                          </div>
                        )}
                      </div>
                    </Link>
                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${product._id}`}>
                        <h3
                          className="font-bold text-ink text-sm hover:text-brand-purple
                        transition line-clamp-2"
                        >
                          {product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-ink-soft capitalize mt-0.5">
                        {product.category} • {product.quality}
                      </p>
                      <p className="text-brand-orange font-bold mt-1">
                        Rs. {item.priceAtAdd.toLocaleString("en-NP")}
                      </p>
                    </div>
                    {/* Qty Controls + Remove */}
                    <div className="flex flex-col items-end justify-between flex-shrink-0">
                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(product._id)}
                        className="text-red-400 hover:text-red-300 text-xs transition"
                      >
                        ✕ Remove
                      </button>
                      {/* Quantity */}
                      <div className="flex items-center border border-line rounded-xl overflow-hidden">
                        <button
                          onClick={() =>
                            updateQuantity(product._id, item.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center text-ink-soft
                          hover:bg-surface2 transition text-sm font-bold"
                        >
                          −
                        </button>
                        <span className="w-9 text-center text-sm font-bold text-ink">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(product._id, item.quantity + 1)
                          }
                          disabled={item.quantity >= product.stock}
                          className="w-8 h-8 flex items-center justify-center text-ink-soft
                          hover:bg-surface2 transition text-sm font-bold
                          disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>
                      {/* Subtotal */}
                      <p className="text-xs text-ink-soft font-semibold">
                        Rs.{" "}
                        {(item.priceAtAdd * item.quantity).toLocaleString(
                          "en-NP",
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* ── Order Summary ── */}
            <div className="lg:col-span-1">
              <div className="bg-surface rounded-2xl border border-line shadow-sm p-6 sticky top-24">
                <h2 className="text-base font-bold text-ink mb-4">
                  📋 Order Summary
                </h2>
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between text-xs text-ink-soft"
                    >
                      <span className="truncate max-w-[140px]">
                        {item.product?.name} × {item.quantity}
                      </span>
                      <span className="font-semibold text-ink">
                        Rs.{" "}
                        {(item.priceAtAdd * item.quantity).toLocaleString(
                          "en-NP",
                        )}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-line pt-4 mb-5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-ink">Total</span>
                    <span className="text-xl font-display text-brand-orange tracking-wide">
                      Rs. {cartTotal.toLocaleString("en-NP")}
                    </span>
                  </div>
                  <p className="text-xs text-ink-soft mt-1">
                    All prices in Nepali Rupees (Rs)
                  </p>
                </div>
                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="block w-full py-3.5 bg-gradient-to-r from-brand-purple to-brand-orange
  text-white rounded-xl font-bold text-sm hover:shadow-lg
  hover:shadow-brand-purple/30 transition text-center"
                >
                  Proceed to Checkout →
                </Link>
                <Link
                  href="/products"
                  className="block text-center text-xs text-ink-soft mt-3 hover:text-brand-purple transition"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
