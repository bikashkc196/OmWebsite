"use client";
import { useState } from "react";
import Spinner from "./Spinner";
export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmStyle = "danger",
  onConfirm,
  onCancel,
  showReason = false,
}) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm(reason);
    setLoading(false);
    setReason("");
  };
  if (!isOpen) return null;
  const confirmColors = {
    danger: "bg-red-500 hover:bg-red-600 shadow-red-200",
    warning: "bg-amber-500 hover:bg-amber-600 shadow-amber-200",
    primary: "bg-blue-600 hover:bg-blue-700 shadow-blue-200",
  };
  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      {/* Dialog */}
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl
        p-6 animate-fade-up z-10"
      >
        {/* Icon */}
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center
          text-3xl mx-auto mb-4
          ${confirmStyle === "danger" ? "bg-red-50" : "bg-amber-50"}`}
        >
          {confirmStyle === "danger" ? "🗑️" : "⚠️"}
        </div>
        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
          {title}
        </h3>
        <p className="text-gray-500 text-sm text-center leading-relaxed mb-5">
          {message}
        </p>
        {/* Optional reason field */}
        {showReason && (
          <div className="mb-5">
            <label className="label-style">
              Reason for cancellation{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Tell us why you're cancelling..."
              className="input-style mt-1 resize-none text-sm"
            />
          </div>
        )}
        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-3 rounded-xl border-2 border-gray-200
              text-gray-700 font-semibold text-sm hover:bg-gray-50
              transition disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`flex-1 py-3 rounded-xl text-white font-semibold
              text-sm shadow-lg transition-all flex items-center
              justify-center gap-2 disabled:opacity-60
              ${confirmColors[confirmStyle]}`}
          >
            {loading ? (
              <>
                <Spinner size="sm" color="white" /> Processing...
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
