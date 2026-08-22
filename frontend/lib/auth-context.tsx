"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "./api";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "traveller" | "contributor" | "guide" | "moderator" | "admin" | "super_admin";
  is_active: boolean;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("globetrotter_token");
      if (!token) {
        setLoading(false);
        return;
      }
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch {
      localStorage.removeItem("globetrotter_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("globetrotter_token", res.data.access_token);
    setUser(res.data.user);
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    await api.post("/auth/register", { name, email, password, phone });
    await login(email, password);
  };

  const logout = () => {
    localStorage.removeItem("globetrotter_token");
    setUser(null);
  };

  const isAdmin = user?.role === "admin" || user?.role === "super_admin" || user?.role === "moderator";

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
