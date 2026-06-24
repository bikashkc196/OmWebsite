"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";

const AuthContext = createContext();

// Helper — Set cookie
const setCookie = (name, value, days = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
};

// Helper — Delete cookie
const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch current user on mount
  useEffect(() => {
    const token = localStorage.getItem("om_token");
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
    } catch {
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  const saveAuth = (token, userData) => {
    // Save to localStorage
    localStorage.setItem("om_token", token);
    // Save to cookies for middleware
    setCookie("om_token", token);
    setCookie("om_role", userData.role);
    setUser(userData);
  };

  const clearAuth = () => {
    localStorage.removeItem("om_token");
    deleteCookie("om_token");
    deleteCookie("om_role");
    setUser(null);
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    saveAuth(data.token, data.user);
    return data.user;
  };

  const register = async (formData) => {
    const { data } = await api.post("/auth/register", formData);
    saveAuth(data.token, data.user);
    return data.user;
  };

  const logout = useCallback(() => {
    clearAuth();
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
