// frontend/components/ui/ProductCard.jsx
"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Check,
  Loader2,
  Star,
  Package,
  AlertTriangle,
  XCircle,
  Smartphone,
  Apple,
} from "lucide-react";
import { formatNPR } from "../../lib/currency";

const QUALITY_STYLES = {
  original: "bg-yellow-100 text-yellow-700 border-yellow-200",
  premium: "bg-purple-100 text-purple-700 border-purple-200",
  standard: "bg-blue-100 text-blue-700 border-blue-200",
  economy: "bg-gray-100 text-gray-600 border-gray-200",
};
const QUALITY_LABELS = {
  original: "Original",
  premium: "Premium",
  standard: "Standard",
  economy: "Economy",
};

export default function ProductCard({ product, onAddToCart }) {
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const effectivePrice =
    product.discountPrice && product.discountPrice < product.price
      ? product.discountPrice
      : product.price;
  const discountPercent =
    product.discountPrice && product.discountPrice < product.price
      ? Math.round(
          ((product.price - product.discountPrice) / product.price) * 100,
        )
      : 0;
  const handleAdd = async () => {
    setAdding(true);
    await onAddToCart(product._id);
    setAdding(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };
  const imageUrl = product.images?.[0]?.url;
  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm
    hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
    >
      {/* ── Product Image ── */}
      <Link href={`/products/${product._id}`}>
        <div className="relative h-52 bg-gray-50 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <Package size={56} />
            </div>
          )}
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5">
            {discountPercent > 0 && (
              <span
                className="text-xs font-bold bg-red-500 text-white
              px-2 py-0.5 rounded-full shadow"
              >
                -{discountPercent}%
              </span>
            )}
            {product.isFeatured && (
              <span
                className="text-xs font-bold bg-yellow-400 text-yellow-900
              px-2 py-0.5 rounded-full shadow flex items-center gap-1"
              >
                <Star size={11} fill="currentColor" /> Featured
              </span>
            )}
          </div>
          {/* Out of Stock Overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-sm bg-black/60 px-3 py-1 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>
      {/* ── Product Details ── */}
      <div className="p-4">
        {/* Category + Quality badges */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span
            className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5
          rounded-full font-medium capitalize flex items-center gap-1"
          >
            {product.category === "android" ? (
              <>
                <Smartphone size={12} /> Android
              </>
            ) : product.category === "iphone" ? (
              <>
                <Apple size={12} /> iPhone
              </>
            ) : (
              product.category
            )}
          </span>
          {product.quality && (
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium border
              ${QUALITY_STYLES[product.quality] || QUALITY_STYLES.standard}`}
            >
              {QUALITY_LABELS[product.quality]}
            </span>
          )}
        </div>
        {/* Name */}
        <Link href={`/products/${product._id}`}>
          <h3
            className="font-bold text-gray-800 text-sm leading-snug mb-1
          hover:text-blue-600 transition line-clamp-2"
          >
            {product.name}
          </h3>
        </Link>
        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-gray-400 mb-2">{product.brand}</p>
        )}
        {/* Price — Nepali Rupees */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-extrabold text-blue-700">
            {formatNPR(effectivePrice)}
          </span>
          {discountPercent > 0 && (
            <span className="text-xs text-gray-400 line-through">
              {formatNPR(product.price)}
            </span>
          )}
        </div>
        {/* Stock Info */}
        <p
          className={`text-xs font-medium mb-3 flex items-center gap-1 ${
            product.stock === 0
              ? "text-red-500"
              : product.stock <= 5
                ? "text-orange-500"
                : "text-green-600"
          }`}
        >
          {product.stock === 0 ? (
            <>
              <XCircle size={13} /> Out of Stock
            </>
          ) : product.stock <= 5 ? (
            <>
              <AlertTriangle size={13} /> Only {product.stock} left
            </>
          ) : (
            <>
              <Check size={13} /> In Stock ({product.stock})
            </>
          )}
        </p>
        {/* Add to Cart Button */}
        <button
          onClick={handleAdd}
          disabled={adding || product.stock === 0}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold transition
          flex items-center justify-center gap-2
          ${
            product.stock === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : added
                ? "bg-green-500 text-white"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200 hover:scale-[1.02] active:scale-[0.98]"
          }`}
        >
          {adding ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Adding...
            </>
          ) : added ? (
            <>
              <Check size={16} /> Added!
            </>
          ) : (
            <>
              <ShoppingCart size={16} /> Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
