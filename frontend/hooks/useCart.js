// frontend/hooks/useCart.js
"use client";
import { useState, useCallback, useEffect } from "react";
import api from "../lib/api";
import { useToast } from "../context/ToastContext";
export const useCart = () => {
  const { toast } = useToast();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  // ── Fetch cart ──
  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/cart");
      setCart(res.data.cart);
    } catch (err) {
      // User not logged in — silently ignore
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("om_token");
    if (token) fetchCart();
  }, [fetchCart]);
  // ── Add to cart ──
  const addToCart = useCallback(
    async (productId, quantity = 1) => {
      setLoading(true);
      try {
        const res = await api.post("/cart/add", { productId, quantity });
        setCart(res.data.cart);
        toast.success("Added to cart! 🛒");
        return res.data;
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to add to cart");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );
  // ── Update quantity ──
  const updateQuantity = useCallback(
    async (productId, quantity) => {
      setLoading(true);
      try {
        const res = await api.patch("/cart/update", { productId, quantity });
        setCart(res.data.cart);
        return res.data;
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to update cart");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );
  // ── Remove from cart ──
  const removeFromCart = useCallback(
    async (productId) => {
      setLoading(true);
      try {
        const res = await api.delete(`/cart/remove/${productId}`);
        setCart(res.data.cart);
        toast.success("Item removed from cart");
        return res.data;
      } catch (err) {
        toast.error("Failed to remove item");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );
  // ── Clear cart ──
  const clearCart = useCallback(async () => {
    setLoading(true);
    try {
      await api.delete("/cart/clear");
      setCart(null);
    } catch (err) {
      toast.error("Failed to clear cart");
    } finally {
      setLoading(false);
    }
  }, [toast]);
  // Cart summary helpers
  const cartCount = cart?.totalItems || 0;
  const cartTotal = cart?.totalPrice || 0;
  return {
    cart,
    loading,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    cartTotal,
  };
};
