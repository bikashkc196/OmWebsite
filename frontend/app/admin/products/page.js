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
          <h1 className="text-2xl font-extrabold text-gray-800">🛒 Products</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage products — {total} total
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5
          rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-md shadow-blue-200 transition"
        >
          ＋ Add Product
        </button>
      </div>

      {/* ── Filters ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="flex-1 min-w-[200px] border border-gray-200 rounded-xl px-4 py-2.5 text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white
          focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <p className="text-5xl mb-3">📭</p>
          <p className="text-gray-400">No products found</p>
          <button
            onClick={openCreate}
            className="mt-3 text-blue-600 text-sm font-semibold hover:underline"
          >
            + Add your first product
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
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
                      text-gray-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Image */}
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
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
                      <p className="font-semibold text-gray-800 max-w-[180px] truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {product.brand || "—"}
                      </p>
                      <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">
                        {product.quality}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3">
                      <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg font-medium capitalize">
                        {product.category === "android"
                          ? "📱 Android"
                          : product.category === "iphone"
                            ? "🍎 iPhone"
                            : product.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3">
                      <p className="font-bold text-blue-700">
                        Rs{" "}
                        {(product.discountPrice &&
                        product.discountPrice < product.price
                          ? product.discountPrice
                          : product.price
                        ).toLocaleString("en-NP")}
                      </p>
                      {product.discountPrice > 0 &&
                        product.discountPrice < product.price && (
                          <p className="text-xs text-gray-400 line-through">
                            Rs {product.price.toLocaleString("en-NP")}
                          </p>
                        )}
                    </td>

                    {/* Stock */}
                    <td className="px-4 py-3">
                      <span
                        className={`font-bold ${
                          product.stock === 0
                            ? "text-red-500"
                            : product.stock <= 5
                              ? "text-orange-500"
                              : "text-gray-800"
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
                            ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                            : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-yellow-50"
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
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-500"
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
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(product._id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
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

      {/* ── Add / Edit Modal ── */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center
        justify-center z-50 p-4"
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-gray-800">
                {editProduct ? "✏️ Edit Product" : "➕ Add New Product"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Product Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. iPhone 14 OLED Screen"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
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
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Quality *
                  </label>
                  <select
                    required
                    value={form.quality}
                    onChange={(e) =>
                      setForm({ ...form, quality: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={form.brand}
                    onChange={(e) =>
                      setForm({ ...form, brand: e.target.value })
                    }
                    placeholder="e.g. Samsung, Apple"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
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
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
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
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Discount Price */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Discount Price (Rs)
                    <span className="font-normal text-gray-400 ml-1">
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
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Compatibility */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Compatible With
                  </label>
                  <input
                    type="text"
                    value={form.compatibility}
                    onChange={(e) =>
                      setForm({ ...form, compatibility: e.target.value })
                    }
                    placeholder="e.g. iPhone 14, iPhone 14 Pro, iPhone 14 Plus"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Tags */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Tags
                    <span className="font-normal text-gray-400 ml-1">
                      (comma separated)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="e.g. screen, iphone, oled, replacement"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      ⭐ Mark as Featured Product
                    </span>
                  </label>
                </div>
              </div>

              {/* ── Cloudinary Image URLs ── */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-600">
                    🖼️ Product Images (Cloudinary URLs)
                  </label>
                  <button
                    type="button"
                    onClick={addImageField}
                    className="text-xs text-blue-600 font-semibold hover:underline"
                  >
                    + Add Image
                  </button>
                </div>
                <div className="space-y-2">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <div className="flex-1 space-y-1.5">
                        <input
                          type="url"
                          value={img.url}
                          onChange={(e) =>
                            handleImageChange(idx, "url", e.target.value)
                          }
                          placeholder="https://res.cloudinary.com/your-cloud/image/upload/..."
                          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs
                          focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={img.alt}
                          onChange={(e) =>
                            handleImageChange(idx, "alt", e.target.value)
                          }
                          placeholder="Image description (optional)"
                          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs
                          focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      {/* Preview */}
                      {img.url && (
                        <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0">
                          <img
                            src={img.url}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        </div>
                      )}
                      {form.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageField(idx)}
                          className="text-red-400 hover:text-red-600 text-xs mt-2 transition"
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
                  className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl
                  text-sm font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm
                  font-semibold hover:bg-blue-700 transition disabled:opacity-60
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <div className="text-center mb-5">
              <div className="text-5xl mb-3">⚠️</div>
              <h3 className="text-lg font-bold text-gray-800">
                Delete Product?
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                The product will be hidden from users. This can be restored.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700
                rounded-xl text-sm font-medium hover:bg-gray-50 transition"
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
