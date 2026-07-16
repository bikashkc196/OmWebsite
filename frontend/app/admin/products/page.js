// frontend/app/admin/products/page.js
"use client";
import { useEffect, useState, useCallback } from "react";
import { useProduct } from "../../../hooks/useProduct";
import { useToast } from "../../../context/ToastContext";
import Spinner from "../../../components/ui/Spinner";
const CATEGORIES = [
  "android",
  "iphone",
  "accessories",
  "tablet",
  "laptop",
  "other",
];
const QUALITIES = ["original", "premium", "standard", "economy"];
const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  discountPrice: "",
  category: "android",
  brand: "",
  quality: "standard",
  compatibility: "",
  stock: "",
  isFeatured: false,
  images: [{ url: "", alt: "" }],
  tags: "",
};
export default function AdminProductsPage() {
  const {
    getAllProductsAdmin,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleFeatured,
    uploadImage,
    loading,
  } = useProduct();
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  // Modal
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [uploadingIdx, setUploadingIdx] = useState(null);
  // ── Fetch Products ──
  const fetchProducts = useCallback(async () => {
    setPageLoading(true);
    const data = await getAllProductsAdmin({
      page,
      limit: 10,
      search: search || undefined,
      category: categoryFilter || undefined,
    });
    if (data) {
      setProducts(data.products || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    }
    setPageLoading(false);
  }, [page, search, categoryFilter, getAllProductsAdmin]);
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  // ── Open Modal ──
  const openCreate = () => {
    setEditProduct(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };
  const openEdit = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice || "",
      category: product.category,
      brand: product.brand || "",
      quality: product.quality,
      compatibility: product.compatibility || "",
      stock: product.stock,
      isFeatured: product.isFeatured,
      images:
        product.images?.length > 0 ? product.images : [{ url: "", alt: "" }],
      tags: product.tags?.join(", ") || "",
    });
    setShowModal(true);
  };
  // ── Image URL handlers ──
  const handleImageChange = (idx, field, value) => {
    const updated = [...form.images];
    updated[idx] = { ...updated[idx], [field]: value };
    setForm({ ...form, images: updated });
  };
  const addImageField = () => {
    setForm({ ...form, images: [...form.images, { url: "", alt: "" }] });
  };
  const removeImageField = (idx) => {
    const updated = form.images.filter((_, i) => i !== idx);
    setForm({
      ...form,
      images: updated.length > 0 ? updated : [{ url: "", alt: "" }],
    });
  };
  // ── Upload image file to Cloudinary ──
  const handleFileSelect = async (idx, file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB.");
      return;
    }
    setUploadingIdx(idx);
    const result = await uploadImage(file);
    if (result?.url) {
      handleImageChange(idx, "url", result.url);
      toast.success("Image uploaded ✅");
    } else {
      toast.error("Failed to upload image.");
    }
    setUploadingIdx(null);
  };
  // ── Save (Create / Update) ──
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : 0,
      stock: Number(form.stock),
      images: form.images.filter((img) => img.url.trim() !== ""),
      tags: form.tags
        ? form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    };
    let result;
    if (editProduct) {
      result = await updateProduct(editProduct._id, payload);
      if (result) toast.success("Product updated! ✅");
    } else {
      result = await createProduct(payload);
      if (result) toast.success("Product created! 🎉");
    }
    if (result) {
      setShowModal(false);
      fetchProducts();
    } else {
      toast.error("Something went wrong. Try again.");
    }
    setSaving(false);
  };
  // ── Delete ──
  const handleDelete = async (id) => {
    setDeletingId(id);
    const result = await deleteProduct(id);
    if (result) {
      toast.success("Product deleted 🗑️");
      fetchProducts();
    } else {
      toast.error("Failed to delete product.");
    }
    setConfirmDeleteId(null);
    setDeletingId(null);
  };
  // ── Toggle Featured ──
  const handleToggleFeatured = async (id) => {
    const result = await toggleFeatured(id);
    if (result) {
      toast.success(
        `Product ${result.isFeatured ? "featured ⭐" : "unfeatured"}`,
      );
      fetchProducts();
    }
  };
  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl text-ink tracking-wide">🛒 Products</h1>
          <p className="text-ink-soft text-sm mt-1">
            Manage products — {total} total
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-gradient-to-r from-brand-purple to-brand-orange text-white px-4 py-2.5
          rounded-xl text-sm font-semibold hover:scale-105 shadow-md shadow-brand-purple/20 transition"
        >
          ＋ Add Product
        </button>
      </div>
      {/* ── Filters ── */}
      <div className="bg-surface rounded-2xl border border-line shadow-sm p-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="flex-1 min-w-[200px] border border-line rounded-xl px-4 py-2.5 text-sm
          bg-surface2 text-ink focus:outline-none focus:ring-2 focus:ring-brand-purple"
        />
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
          className="border border-line rounded-xl px-4 py-2.5 text-sm bg-surface2 text-ink
          focus:outline-none focus:ring-2 focus:ring-brand-purple"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
      {/* ── Products Table ── */}
      {pageLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="xl" color="blue" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-2xl border border-line">
          <p className="text-5xl mb-3">📭</p>
          <p className="text-ink-soft">No products found</p>
          <button
            onClick={openCreate}
            className="mt-3 text-brand-purple text-sm font-semibold hover:underline"
          >
            + Add your first product
          </button>
        </div>
      ) : (
        <div className="bg-surface rounded-2xl border border-line shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface2 border-b border-line">
                  {[
                    "Image",
                    "Product",
                    "Category",
                    "Price",
                    "Stock",
                    "Featured",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold
                      text-ink-soft uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-surface2 transition-colors"
                  >
                    {/* Image */}
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-surface2 border border-line">
                        {product.images?.[0]?.url ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl">
                            📦
                          </div>
                        )}
                      </div>
                    </td>
                    {/* Product Name */}
                    <td className="px-4 py-3">
                      <p className="font-semibold text-ink max-w-[180px] truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-ink-soft">
                        {product.brand || "—"}
                      </p>
                      <span className="text-xs bg-surface2 text-ink-soft px-1.5 py-0.5 rounded font-medium">
                        {product.quality}
                      </span>
                    </td>
                    {/* Category */}
                    <td className="px-4 py-3">
                      <span className="text-xs bg-brand-purple/10 text-brand-purple px-2.5 py-1 rounded-lg font-medium capitalize">
                        {product.category === "android"
                          ? "📱 Android"
                          : product.category === "iphone"
                            ? "🍎 iPhone"
                            : product.category}
                      </span>
                    </td>
                    {/* Price */}
                    <td className="px-4 py-3">
                      <p className="font-bold text-brand-orange">
                        Rs.{" "}
                        {(product.discountPrice &&
                        product.discountPrice < product.price
                          ? product.discountPrice
                          : product.price
                        ).toLocaleString("en-NP")}
                      </p>
                      {product.discountPrice > 0 &&
                        product.discountPrice < product.price && (
                          <p className="text-xs text-ink-soft line-through">
                            Rs. {product.price.toLocaleString("en-NP")}
                          </p>
                        )}
                    </td>
                    {/* Stock */}
                    <td className="px-4 py-3">
                      <span
                        className={`font-bold ${
                          product.stock === 0
                            ? "text-red-400"
                            : product.stock <= 5
                              ? "text-brand-orange"
                              : "text-ink"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    {/* Featured Toggle */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleFeatured(product._id)}
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold border transition ${
                          product.isFeatured
                            ? "bg-yellow-500/15 text-yellow-300 border-yellow-500/30"
                            : "bg-surface2 text-ink-soft border-line hover:bg-yellow-500/10"
                        }`}
                      >
                        {product.isFeatured ? "⭐ Featured" : "☆ Set Featured"}
                      </button>
                    </td>
                    {/* Active Status */}
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          product.isActive
                            ? "bg-green-500/15 text-green-300"
                            : "bg-red-500/15 text-red-300"
                        }`}
                      >
                        {product.isActive ? "✅ Active" : "❌ Hidden"}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-1.5 text-brand-purple hover:bg-brand-purple/10 rounded-lg transition"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(product._id)}
                          className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-line">
              <p className="text-xs text-ink-soft">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1.5 text-xs border border-line rounded-lg
                  text-ink-soft hover:bg-surface2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ← Prev
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 text-xs border border-line rounded-lg
                  text-ink-soft hover:bg-surface2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {/* ── Add / Edit Modal ── */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center
        justify-center z-50 p-4"
        >
          <div className="bg-surface border border-line rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-line sticky top-0 bg-surface z-10">
              <h2 className="text-lg font-bold text-ink">
                {editProduct ? "✏️ Edit Product" : "➕ Add New Product"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-ink-soft hover:text-ink text-xl transition"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-ink-soft mb-1">
                    Product Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. iPhone 14 OLED Screen"
                    className="w-full border border-line rounded-xl px-3 py-2.5 text-sm
                    bg-surface2 text-ink focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                </div>
                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-ink-soft mb-1">
                    Description *
                  </label>
                  <textarea
                    required
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    rows={3}
                    placeholder="Describe the product..."
                    className="w-full border border-line rounded-xl px-3 py-2.5 text-sm
                    bg-surface2 text-ink focus:outline-none focus:ring-2 focus:ring-brand-purple resize-none"
                  />
                </div>
                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-ink-soft mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full border border-line rounded-xl px-3 py-2.5 text-sm
                    focus:outline-none focus:ring-2 focus:ring-brand-purple bg-surface2 text-ink"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Quality */}
                <div>
                  <label className="block text-xs font-semibold text-ink-soft mb-1">
                    Quality *
                  </label>
                  <select
                    required
                    value={form.quality}
                    onChange={(e) =>
                      setForm({ ...form, quality: e.target.value })
                    }
                    className="w-full border border-line rounded-xl px-3 py-2.5 text-sm
                    focus:outline-none focus:ring-2 focus:ring-brand-purple bg-surface2 text-ink"
                  >
                    {QUALITIES.map((q) => (
                      <option key={q} value={q}>
                        {q.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Brand */}
                <div>
                  <label className="block text-xs font-semibold text-ink-soft mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={form.brand}
                    onChange={(e) =>
                      setForm({ ...form, brand: e.target.value })
                    }
                    placeholder="e.g. Samsung, Apple"
                    className="w-full border border-line rounded-xl px-3 py-2.5 text-sm
                    bg-surface2 text-ink focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                </div>
                {/* Stock */}
                <div>
                  <label className="block text-xs font-semibold text-ink-soft mb-1">
                    Stock *
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })
                    }
                    placeholder="e.g. 25"
                    className="w-full border border-line rounded-xl px-3 py-2.5 text-sm
                    bg-surface2 text-ink focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                </div>
                {/* Price */}
                <div>
                  <label className="block text-xs font-semibold text-ink-soft mb-1">
                    Price (Rs) *
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    placeholder="e.g. 5000"
                    className="w-full border border-line rounded-xl px-3 py-2.5 text-sm
                    bg-surface2 text-ink focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                </div>
                {/* Discount Price */}
                <div>
                  <label className="block text-xs font-semibold text-ink-soft mb-1">
                    Discount Price (Rs)
                    <span className="font-normal text-ink-soft/70 ml-1">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.discountPrice}
                    onChange={(e) =>
                      setForm({ ...form, discountPrice: e.target.value })
                    }
                    placeholder="e.g. 4500"
                    className="w-full border border-line rounded-xl px-3 py-2.5 text-sm
                    bg-surface2 text-ink focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                </div>
                {/* Compatibility */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-ink-soft mb-1">
                    Compatible With
                  </label>
                  <input
                    type="text"
                    value={form.compatibility}
                    onChange={(e) =>
                      setForm({ ...form, compatibility: e.target.value })
                    }
                    placeholder="e.g. iPhone 14, iPhone 14 Pro, iPhone 14 Plus"
                    className="w-full border border-line rounded-xl px-3 py-2.5 text-sm
                    bg-surface2 text-ink focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                </div>
                {/* Tags */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-ink-soft mb-1">
                    Tags
                    <span className="font-normal text-ink-soft/70 ml-1">
                      (comma separated)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="e.g. screen, iphone, oled, replacement"
                    className="w-full border border-line rounded-xl px-3 py-2.5 text-sm
                    bg-surface2 text-ink focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                </div>
                {/* Featured Toggle */}
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(e) =>
                        setForm({ ...form, isFeatured: e.target.checked })
                      }
                      className="w-4 h-4 accent-brand-purple"
                    />
                    <span className="text-sm font-semibold text-ink">
                      ⭐ Mark as Featured Product
                    </span>
                  </label>
                </div>
              </div>
              {/* ── Product Images (Cloudinary Upload) ── */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-ink-soft">
                    🖼️ Product Images
                  </label>
                  <button
                    type="button"
                    onClick={addImageField}
                    className="text-xs text-brand-purple font-semibold hover:underline"
                  >
                    + Add Image
                  </button>
                </div>
                <div className="space-y-2">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      {/* Preview / Upload dropzone */}
                      <label
                        className="w-14 h-14 rounded-xl overflow-hidden border border-dashed
                        border-line flex-shrink-0 flex items-center justify-center
                        cursor-pointer bg-surface2 hover:bg-line transition relative"
                      >
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          className="hidden"
                          onChange={(e) =>
                            handleFileSelect(idx, e.target.files?.[0])
                          }
                        />
                        {uploadingIdx === idx ? (
                          <Spinner size="sm" color="blue" />
                        ) : img.url ? (
                          <img
                            src={img.url}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <span className="text-lg text-ink-soft">📤</span>
                        )}
                      </label>
                      <div className="flex-1 space-y-1.5">
                        <p className="text-xs text-ink-soft truncate">
                          {img.url ? "✅ Uploaded" : "No image uploaded yet"}
                        </p>
                        <input
                          type="text"
                          value={img.alt}
                          onChange={(e) =>
                            handleImageChange(idx, "alt", e.target.value)
                          }
                          placeholder="Image description (optional)"
                          className="w-full border border-line rounded-xl px-3 py-2 text-xs
                          bg-surface2 text-ink focus:outline-none focus:ring-2 focus:ring-brand-purple"
                        />
                      </div>
                      {form.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageField(idx)}
                          className="text-red-400 hover:text-red-300 text-xs mt-2 transition"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {/* Save Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-line text-ink rounded-xl
                  text-sm font-medium hover:bg-surface2 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingIdx !== null}
                  className="flex-1 py-2.5 bg-gradient-to-r from-brand-purple to-brand-orange text-white rounded-xl text-sm
                  font-semibold hover:scale-[1.02] transition disabled:opacity-60
                  disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Spinner size="sm" color="white" /> Saving...
                    </>
                  ) : editProduct ? (
                    "💾 Update Product"
                  ) : (
                    "✅ Create Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ── Confirm Delete Modal ── */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-line rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div className="text-center mb-5">
              <div className="text-5xl mb-3">⚠️</div>
              <h3 className="text-lg text-ink tracking-wide">
                Delete Product?
              </h3>
              <p className="text-sm text-ink-soft mt-1">
                The product will be hidden from users. This can be restored.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 px-4 py-2.5 border border-line text-ink
                rounded-xl text-sm font-medium hover:bg-surface2 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                disabled={deletingId === confirmDeleteId}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl
                text-sm font-semibold hover:bg-red-600 transition disabled:opacity-60"
              >
                {deletingId === confirmDeleteId ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner size="sm" color="white" /> Deleting...
                  </span>
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
