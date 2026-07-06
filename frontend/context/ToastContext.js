"use client";
import { createContext, useContext, useState, useCallback } from "react";
const ToastContext = createContext();
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback(
    ({ message, type = "info", duration = 4000 }) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => removeToast(id), duration);
    },
    [],
  );
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  const toast = {
    success: (msg) => addToast({ message: msg, type: "success" }),
    error: (msg) => addToast({ message: msg, type: "error" }),
    info: (msg) => addToast({ message: msg, type: "info" }),
    warning: (msg) => addToast({ message: msg, type: "warning" }),
  };
  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast renderer */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            onClick={() => removeToast(t.id)}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl cursor-pointer text-white text-sm font-medium min-w-[280px] max-w-sm animate-slide-in transition-all
                        ${t.type === "success" ? "bg-emerald-500" : ""}
                        ${t.type === "error" ? "bg-red-500" : ""}
                        ${t.type === "info" ? "bg-blue-500" : ""}
                        ${t.type === "warning" ? "bg-amber-500" : ""}`}
          >
            <span className="text-xl">
              {t.type === "success"
                ? "✅"
                : t.type === "error"
                  ? "❌"
                  : t.type === "warning"
                    ? "⚠️"
                    : "ℹ️"}
            </span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
export const useToast = () => useContext(ToastContext);
