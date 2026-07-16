// frontend/app/(user)/products/page.js
"use client";
import { useEffect, useState, useCallback } from "react";
import { useProduct } from "../../../hooks/useProduct";
import { useCart } from "../../../hooks/useCart";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import Spinner from "../../../components/ui/Spinner";
import ProductCard from "../../../components/ui/ProductCard";
const CATEGORIES = [
  { label: "All", value: "" },
  { label: "📱 Android", value: "android" },
  { label: "🍎 iPhone", value: "iphone" },
  { label: "🎧 Accessories", value: "accessories" },
  { label: "📟 Tablet", value: "tablet" },
  { label: "💻 Laptop", value: "laptop" },
  { label: "📦 Other", value: "other" },
];
const SORT_OPTIONS = [
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Quality", value: "quality_asc" },
  { label: "Newest First", value: "newest" },
  { label: "Most Popular", value: "popular" },
];
const QUALITY_OPTIONS = [
  { label: "All Quality", value: "" },
  { label: "⭐ Original", value: "original" },
  { label: "🥇 Premium", value: "premium" },
  { label: "✅ Standard", value: "standard" },
  { label: "💰 Economy", value: "economy" },
];
export default function ProductsPage() {
  const { getProducts, loading } = useProduct();
  const { addToCart, cartCount } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [pageLoading, setPageLoading] = useState(true);
  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [quality, setQuality] = useState("");
  const [sortBy, setSortBy] = useState("price_asc");
  const [searchInput, setSearchInput] = useState("");
  // Fetch products
  const fetchProducts = useCallback(async () => {
    setPageLoading(true);
    const [sortField, sortOrder] = sortBy.includes("_")
      ? sortBy === "price_asc"
        ? ["price", "asc"]
        : sortBy === "price_desc"
          ? ["price", "desc"]
          : sortBy === "quality_asc"
            ? ["quality", "asc"]
            : ["createdAt", "desc"]
      : [sortBy, "desc"];
    const data = await getProducts({
      page,
      limit: 12,
      category: category || undefined,
      quality: quality || undefined,
      search: search || undefined,
      sortBy:
        sortBy === "newest"
          ? "newest"
          : sortBy === "popular"
            ? "popular"
            : sortField,
      order: sortOrder,
    });
    if (data) {
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    }
    setPageLoading(false);
  }, [page, category, quality, search, sortBy, getProducts]);
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [category, quality, search, sortBy]);
  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };
  const handleAddToCart = async (productId) => {
    if (!user) {
      router.push("/login");
      return;
    }
    await addToCart(productId);
  };
  return (
    <div className="min-h-screen bg-bg">
      {/* ── Hero Banner ── */}
      <div className="bg-gradient-to-r from-brand-purple to-brand-orange text-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl tracking-wide mb-2">
            🛒 Our Products
          </h1>
          <p className="text-white/80 text-sm md:text-base">
            Genuine parts & accessories — All prices in Nepali Rupees (Rs)
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ── Search Bar ── */}
        <form
          onSubmit={handleSearch}
          className="flex gap-2 mb-6 max-w-xl mx-auto"
        >
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 border border-line rounded-xl px-4 py-3 text-sm
            focus:outline-none focus:ring-2 focus:ring-brand-purple bg-surface text-ink shadow-sm"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-brand-purple to-brand-orange text-white px-5 py-3 rounded-xl text-sm
            font-semibold hover:scale-[1.02] transition shadow-md shadow-brand-purple/20"
          >
            Search
          </button>
        </form>
        {/* ── Category Tabs ── */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                category === cat.value
                  ? "bg-gradient-to-r from-brand-purple to-brand-orange text-white border-transparent shadow-md"
                  : "bg-surface text-ink-soft border-line hover:border-brand-purple/40 hover:text-brand-purple"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        {/* ── Filter Row ── */}
        <div className="flex flex-wrap gap-3 mb-6 items-center justify-between bg-surface rounded-2xl border border-line shadow-sm p-4">
          <div className="flex flex-wrap gap-3">
            {/* Quality Filter */}
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="border border-line rounded-xl px-3 py-2 text-sm
              focus:outline-none focus:ring-2 focus:ring-brand-purple bg-surface2 text-ink"
            >
              {QUALITY_OPTIONS.map((q) => (
                <option key={q.value} value={q.value}>
                  {q.label}
                </option>
              ))}
            </select>
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-line rounded-xl px-3 py-2 text-sm
              focus:outline-none focus:ring-2 focus:ring-brand-purple bg-surface2 text-ink"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-ink-soft font-medium">
            {total} product{total !== 1 ? "s" : ""} found
          </p>
        </div>
        {/* ── Products Grid ── */}
        {pageLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Spinner size="xl" color="blue" />
            <p className="mt-4 text-ink-soft">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 bg-surface rounded-2xl border border-line">
            <p className="text-6xl mb-3">📭</p>
            <p className="text-ink-soft font-medium text-lg">
              No products found
            </p>
            <p className="text-ink-soft/60 text-sm mt-1">
              Try changing your filters or search term
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 rounded-xl border border-line text-sm
              font-medium text-ink-soft hover:bg-surface2 disabled:opacity-40
              disabled:cursor-not-allowed transition"
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-xl text-sm font-semibold transition ${
                  p === page
                    ? "bg-gradient-to-r from-brand-purple to-brand-orange text-white shadow-md"
                    : "border border-line text-ink-soft hover:bg-surface2"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 rounded-xl border border-line text-sm
              font-medium text-ink-soft hover:bg-surface2 disabled:opacity-40
              disabled:cursor-not-allowed transition"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
