// frontend/app/admin/inventory/page.js
"use client";
import { useEffect, useState, useCallback } from "react";
import { useAdmin } from "../../../hooks/useAdmin";
import { useToast } from "../../../context/ToastContext";
import Spinner from "../../../components/ui/Spinner";

const CATEGORIES = [
  "screen",
  "battery",
  "charging_port",
  "camera",
  "speaker",
  "motherboard",
  "display",
  "other",
];

const EMPTY_FORM = {
  partName: "",
  partCode: "",
  category: "screen",
  compatibleDevices: "",
  quantity: "",
  lowStockThreshold: 5,
  costPrice: "",
  sellingPrice: "",
  supplier: "",
};

export default function AdminInventoryPage() {
  const {
    getInventory,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    loading,
  } = useAdmin();
  const { toast } = useToast();

  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showLowStock, setShowLowStock] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // ── Fetch Inventory ──
  const fetchInventory = useCallback(async () => {
    setPageLoading(true);
    const data = await getInventory();
    if (data) {
      setItems(data.items || []);
      setFiltered(data.items || []);
    }
    setPageLoading(false);
  }, [getInventory]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  // ── Filter Logic ──
  useEffect(() => {
    let result = [...items];
    if (showLowStock) result = result.filter((i) => i.isLowStock);
    if (categoryFilter)
      result = result.filter((i) => i.category === categoryFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.partName?.toLowerCase().includes(q) ||
          i.partCode?.toLowerCase().includes(q) ||
          i.supplier?.toLowerCase().includes(q),
      );
    }
    setFiltered(result);
  }, [search, categoryFilter, showLowStock, items]);

  // ── Open Modal ──
  const openCreate = () => {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      partName: item.partName,
      partCode: item.partCode,
      category: item.category,
      compatibleDevices: item.compatibleDevices?.join(", ") || "",
      quantity: item.quantity,
      lowStockThreshold: item.lowStockThreshold || 5,
      costPrice: item.costPrice,
      sellingPrice: item.sellingPrice,
      supplier: item.supplier || "",
    });
    setShowModal(true);
  };

  // ── Save (Create / Update) ──
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      quantity: Number(form.quantity),
      lowStockThreshold: Number(form.lowStockThreshold),
      costPrice: Number(form.costPrice),
      sellingPrice: Number(form.sellingPrice),
      compatibleDevices: form.compatibleDevices
        .split(",")
        .map((d) => d.trim())
        .filter(Boolean),
    };

    let result;
    if (editItem) {
      result = await updateInventoryItem(editItem._id, payload);
      if (result) toast.success("Item updated successfully! ✅");
    } else {
      result = await createInventoryItem(payload);
      if (result) toast.success("Item created successfully! ✅");
    }

    if (result) {
      setShowModal(false);
      fetchInventory();
    } else {
      toast.error("Something went wrong. Please try again.");
    }
    setSaving(false);
  };

  // ── Delete ──
  const handleDelete = async (id) => {
    setDeletingId(id);
    const result = await deleteInventoryItem(id);
    if (result) {
      toast.success("Item deleted! 🗑️");
      fetchInventory();
    } else {
      toast.error("Failed to delete item.");
    }
    setConfirmDeleteId(null);
    setDeletingId(null);
  };

  const lowStockCount = items.filter((i) => i.isLowStock).length;

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">
            📦 Inventory Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage spare parts and stock levels
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lowStockCount > 0 && (
            <span className="flex items-center gap-1.5 text-xs font-semibold bg-red-100 text-red-600 px-3 py-1.5 rounded-full border border-red-200">
              ⚠️ {lowStockCount} Low Stock
            </span>
          )}
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-blue-600 text-white
            px-4 py-2.5 rounded-xl text-sm font-semibold
            hover:bg-blue-700 shadow-md shadow-blue-200 transition"
          >
            ＋ Add Item
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <input
            type="text"
            placeholder="🔍 Search by name, code, supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] border border-gray-200 rounded-xl
            px-4 py-2.5 text-sm focus:outline-none focus:ring-2
            focus:ring-blue-500 focus:border-transparent"
          />

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.replace("_", " ").toUpperCase()}
              </option>
            ))}
          </select>

          {/* Low Stock Toggle */}
          <button
            onClick={() => setShowLowStock((v) => !v)}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition ${
              showLowStock
                ? "bg-red-500 text-white border-red-500"
                : "bg-white text-gray-600 border-gray-200 hover:border-red-300 hover:text-red-500"
            }`}
          >
            ⚠️ Low Stock Only
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      {pageLoading ? (
        <div className="flex justify-center py-20">
          <div className="text-center">
            <Spinner size="xl" color="blue" />
            <p className="mt-4 text-gray-500">Loading inventory...</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <p className="text-5xl mb-3">📭</p>
          <p className="text-gray-400 font-medium">No inventory items found</p>
          <button
            onClick={openCreate}
            className="mt-4 text-blue-600 text-sm font-semibold hover:underline"
          >
            + Add your first item
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {[
                    "Part Name",
                    "Code",
                    "Category",
                    "Qty",
                    "Cost",
                    "Selling",
                    "Supplier",
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
                {filtered.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Part Name */}
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">
                        {item.partName}
                      </p>
                      {item.compatibleDevices?.length > 0 && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {item.compatibleDevices.slice(0, 2).join(", ")}
                          {item.compatibleDevices.length > 2 && " ..."}
                        </p>
                      )}
                    </td>

                    {/* Code */}
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {item.partCode}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3">
                      <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg font-medium capitalize">
                        {item.category?.replace("_", " ")}
                      </span>
                    </td>

                    {/* Quantity */}
                    <td className="px-4 py-3">
                      <span
                        className={`font-bold text-base ${
                          item.isLowStock ? "text-red-500" : "text-gray-800"
                        }`}
                      >
                        {item.quantity}
                      </span>
                    </td>

                    {/* Cost Price */}
                    <td className="px-4 py-3 text-gray-600 font-medium">
                      Rs {item.costPrice?.toLocaleString()}
                    </td>

                    {/* Selling Price */}
                    <td className="px-4 py-3 text-green-600 font-semibold">
                      Rs {item.sellingPrice?.toLocaleString()}
                    </td>

                    {/* Supplier */}
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {item.supplier || "—"}
                    </td>

                    {/* Stock Status */}
                    <td className="px-4 py-3">
                      {item.isLowStock ? (
                        <span className="text-xs font-semibold bg-red-100 text-red-600 px-2.5 py-1 rounded-full">
                          ⚠️ Low Stock
                        </span>
                      ) : (
                        <span className="text-xs font-semibold bg-green-100 text-green-600 px-2.5 py-1 rounded-full">
                          ✅ In Stock
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(item._id)}
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

          {/* Table Footer */}
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-400">
            Showing {filtered.length} of {items.length} items
          </div>
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">
                {editItem ? "✏️ Edit Item" : "➕ Add New Item"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Part Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Part Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.partName}
                    onChange={(e) =>
                      setForm({ ...form, partName: e.target.value })
                    }
                    placeholder="e.g. iPhone 14 Screen"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5
                    text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Part Code */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Part Code *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.partCode}
                    onChange={(e) =>
                      setForm({ ...form, partCode: e.target.value })
                    }
                    placeholder="e.g. SCR-IP14-001"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5
                    text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5
                    text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c.replace("_", " ").toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Supplier */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Supplier
                  </label>
                  <input
                    type="text"
                    value={form.supplier}
                    onChange={(e) =>
                      setForm({ ...form, supplier: e.target.value })
                    }
                    placeholder="e.g. TechParts Ltd"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5
                    text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Quantity *
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={form.quantity}
                    onChange={(e) =>
                      setForm({ ...form, quantity: e.target.value })
                    }
                    placeholder="e.g. 20"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5
                    text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Low Stock Threshold */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.lowStockThreshold}
                    onChange={(e) =>
                      setForm({ ...form, lowStockThreshold: e.target.value })
                    }
                    placeholder="e.g. 5"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5
                    text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Cost Price */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Cost Price (Rs) *
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={form.costPrice}
                    onChange={(e) =>
                      setForm({ ...form, costPrice: e.target.value })
                    }
                    placeholder="e.g. 2500"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5
                    text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Selling Price */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Selling Price (Rs) *
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={form.sellingPrice}
                    onChange={(e) =>
                      setForm({ ...form, sellingPrice: e.target.value })
                    }
                    placeholder="e.g. 3500"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5
                    text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Compatible Devices */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Compatible Devices
                  <span className="font-normal text-gray-400 ml-1">
                    (comma separated)
                  </span>
                </label>
                <input
                  type="text"
                  value={form.compatibleDevices}
                  onChange={(e) =>
                    setForm({ ...form, compatibleDevices: e.target.value })
                  }
                  placeholder="e.g. iPhone 14, iPhone 14 Pro, iPhone 13"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5
                  text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-700
                  rounded-xl text-sm font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl
                  text-sm font-semibold hover:bg-blue-700 transition
                  disabled:opacity-60 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Spinner size="sm" color="white" />
                      Saving...
                    </>
                  ) : editItem ? (
                    "💾 Update Item"
                  ) : (
                    "✅ Create Item"
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
              <h3 className="text-lg font-bold text-gray-800">Delete Item?</h3>
              <p className="text-sm text-gray-500 mt-1">
                This will permanently delete the inventory item. This action
                cannot be undone.
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
