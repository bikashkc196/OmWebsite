// frontend/app/(user)/products/[id]/page.js
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProduct } from "../../../../hooks/useProduct";
import { useCart } from "../../../../hooks/useCart";
import { useAuth } from "../../../../context/AuthContext";
import Spinner from "../../../../components/ui/Spinner";
import Link from "next/link";
const QUALITY_LABELS = {
  original: "⭐ Original",
  premium: "🥇 Premium",
  standard: "✅ Standard",
  economy: "💰 Economy",
};
export default function ProductDetailPage() {
  const { id } = useParams();
  const { getProductById, loading } = useProduct();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  useEffect(() => {
    const fetch = async () => {
      const data = await getProductById(id);
      if (data) setProduct(data.product);
    };
    fetch();
  }, [id]);
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-bg">
        <Spinner size="xl" color="blue" />
      </div>
    );
  }
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <p className="text-6xl mb-4">😕</p>
          <h2 className="text-xl text-ink tracking-wide">Product not found</h2>
          <Link
            href="/products"
            className="text-brand-purple hover:underline text-sm mt-2 block"
          >
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }
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
  const handleAddToCart = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setAdding(true);
    await addToCart(product._id, qty);
    setAdding(false);
  };
  return (
    <div className="min-h-screen bg-bg py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-xs text-ink-soft mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-brand-purple">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-brand-purple">
            Products
          </Link>
          <span>/</span>
          <span className="text-ink font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>
        <div className="bg-surface rounded-2xl shadow-sm border border-line overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* ── Image Gallery ── */}
            <div className="p-6 bg-surface2">
              <div className="relative rounded-xl overflow-hidden mb-3 aspect-square bg-surface border border-line">
                {product.images?.[selectedImg]?.url ? (
                  <img
                    src={product.images[selectedImg].url}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-8xl">📦</span>
                  </div>
                )}
                {discountPercent > 0 && (
                  <div
                    className="absolute top-3 left-3 bg-red-500 text-white text-xs
                  font-bold px-2.5 py-1 rounded-full"
                  >
                    -{discountPercent}% OFF
                  </div>
                )}
              </div>
              {/* Thumbnail Row */}
              {product.images?.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImg(idx)}
                      className={`w-16 h-16 rounded-xl border-2 overflow-hidden transition ${
                        selectedImg === idx
                          ? "border-brand-purple"
                          : "border-line hover:border-brand-purple/40"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* ── Product Info ── */}
            <div className="p-6 md:p-8 flex flex-col gap-4">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <span
                  className="text-xs bg-brand-purple/10 text-brand-purple px-3 py-1
                rounded-full font-semibold capitalize border border-brand-purple/20"
                >
                  {product.category === "android"
                    ? "📱 Android"
                    : product.category === "iphone"
                      ? "🍎 iPhone"
                      : product.category}
                </span>
                {product.quality && (
                  <span
                    className="text-xs bg-yellow-500/10 text-yellow-300 px-3 py-1
                  rounded-full font-semibold border border-yellow-500/25"
                  >
                    {QUALITY_LABELS[product.quality]}
                  </span>
                )}
                {product.isFeatured && (
                  <span
                    className="text-xs bg-brand-orange/15 text-brand-orange px-3 py-1
                  rounded-full font-semibold border border-brand-orange/25"
                  >
                    ⭐ Featured
                  </span>
                )}
              </div>
              {/* Name & Brand */}
              <div>
                <h1 className="text-2xl text-ink leading-snug tracking-wide">
                  {product.name}
                </h1>
                {product.brand && (
                  <p className="text-sm text-ink-soft mt-1">
                    by {product.brand}
                  </p>
                )}
              </div>
              {/* Price */}
              <div className="flex items-end gap-3">
                <span className="text-3xl font-display text-brand-orange tracking-wide">
                  Rs. {effectivePrice.toLocaleString("en-NP")}
                </span>
                {discountPercent > 0 && (
                  <div className="flex flex-col">
                    <span className="text-sm text-ink-soft line-through">
                      Rs. {product.price.toLocaleString("en-NP")}
                    </span>
                    <span className="text-xs font-bold text-red-400">
                      Save Rs.{" "}
                      {(product.price - product.discountPrice).toLocaleString(
                        "en-NP",
                      )}
                    </span>
                  </div>
                )}
              </div>
              {/* Description */}
              <p className="text-sm text-ink-soft leading-relaxed">
                {product.description}
              </p>
              {/* Compatibility */}
              {product.compatibility && (
                <div className="bg-brand-purple/10 rounded-xl px-4 py-3 border border-brand-purple/20">
                  <p className="text-xs font-semibold text-brand-purple mb-0.5">
                    📱 Compatible With
                  </p>
                  <p className="text-sm text-ink">
                    {product.compatibility}
                  </p>
                </div>
              )}
              {/* Stock */}
              <p
                className={`text-sm font-semibold ${
                  product.stock === 0
                    ? "text-red-400"
                    : product.stock <= 5
                      ? "text-brand-orange"
                      : "text-green-400"
                }`}
              >
                {product.stock === 0
                  ? "❌ Out of Stock"
                  : product.stock <= 5
                    ? `⚠️ Only ${product.stock} left`
                    : `✅ In Stock (${product.stock} available)`}
              </p>
              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-ink">
                    Qty:
                  </span>
                  <div className="flex items-center border border-line rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 flex items-center justify-center
                      text-ink-soft hover:bg-surface2 transition font-bold"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-ink">
                      {qty}
                    </span>
                    <button
                      onClick={() =>
                        setQty((q) => Math.min(product.stock, q + 1))
                      }
                      className="w-9 h-9 flex items-center justify-center
                      text-ink-soft hover:bg-surface2 transition font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={adding || product.stock === 0}
                className={`w-full py-3.5 rounded-xl font-bold text-base transition
                flex items-center justify-center gap-2
                ${
                  product.stock === 0
                    ? "bg-surface2 text-ink-soft/50 cursor-not-allowed"
                    : "bg-gradient-to-r from-brand-purple to-brand-orange text-white hover:scale-[1.02] shadow-lg shadow-brand-purple/20"
                }`}
              >
                {adding
                  ? "Adding..."
                  : product.stock === 0
                    ? "Out of Stock"
                    : "🛒 Add to Cart"}
              </button>
              {/* Back Link */}
              <Link
                href="/products"
                className="text-center text-sm text-ink-soft hover:text-brand-purple transition"
              >
                ← Back to Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
