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
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" color="blue" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">😕</p>
          <h2 className="text-xl font-bold text-gray-700">Product not found</h2>
          <Link
            href="/products"
            className="text-blue-600 hover:underline text-sm mt-2 block"
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-400 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-blue-600">
            Products
          </Link>
          <span>/</span>
          <span className="text-gray-600 font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* ── Image Gallery ── */}
            <div className="p-6 bg-gray-50">
              <div className="relative rounded-xl overflow-hidden mb-3 aspect-square bg-white border border-gray-100">
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
                          ? "border-blue-500"
                          : "border-gray-200 hover:border-blue-300"
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
                  className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1
                rounded-full font-semibold capitalize border border-indigo-100"
                >
                  {product.category === "android"
                    ? "📱 Android"
                    : product.category === "iphone"
                      ? "🍎 iPhone"
                      : product.category}
                </span>
                {product.quality && (
                  <span
                    className="text-xs bg-yellow-50 text-yellow-700 px-3 py-1
                  rounded-full font-semibold border border-yellow-200"
                  >
                    {QUALITY_LABELS[product.quality]}
                  </span>
                )}
                {product.isFeatured && (
                  <span
                    className="text-xs bg-amber-100 text-amber-700 px-3 py-1
                  rounded-full font-semibold border border-amber-200"
                  >
                    ⭐ Featured
                  </span>
                )}
              </div>

              {/* Name & Brand */}
              <div>
                <h1 className="text-2xl font-extrabold text-gray-800 leading-snug">
                  {product.name}
                </h1>
                {product.brand && (
                  <p className="text-sm text-gray-400 mt-1">
                    by {product.brand}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="flex items-end gap-3">
                <span className="text-3xl font-extrabold text-blue-700">
                  Rs {effectivePrice.toLocaleString("en-NP")}
                </span>
                {discountPercent > 0 && (
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-400 line-through">
                      Rs {product.price.toLocaleString("en-NP")}
                    </span>
                    <span className="text-xs font-bold text-red-500">
                      Save Rs{" "}
                      {(product.price - product.discountPrice).toLocaleString(
                        "en-NP",
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>

              {/* Compatibility */}
              {product.compatibility && (
                <div className="bg-blue-50 rounded-xl px-4 py-3 border border-blue-100">
                  <p className="text-xs font-semibold text-blue-700 mb-0.5">
                    📱 Compatible With
                  </p>
                  <p className="text-sm text-blue-800">
                    {product.compatibility}
                  </p>
                </div>
              )}

              {/* Stock */}
              <p
                className={`text-sm font-semibold ${
                  product.stock === 0
                    ? "text-red-500"
                    : product.stock <= 5
                      ? "text-orange-500"
                      : "text-green-600"
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
                  <span className="text-sm font-semibold text-gray-700">
                    Qty:
                  </span>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 flex items-center justify-center
                      text-gray-600 hover:bg-gray-100 transition font-bold"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-sm font-bold">
                      {qty}
                    </span>
                    <button
                      onClick={() =>
                        setQty((q) => Math.min(product.stock, q + 1))
                      }
                      className="w-9 h-9 flex items-center justify-center
                      text-gray-600 hover:bg-gray-100 transition font-bold"
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
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
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
                className="text-center text-sm text-gray-400 hover:text-blue-600 transition"
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
