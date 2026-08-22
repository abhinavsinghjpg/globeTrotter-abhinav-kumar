"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

export type UserRole = "traveler" | "guide" | "admin";

/** Role vocabulary used by the backend (`app/user_auth/models.py`). */
type ServerRole =
  | "traveller"
  | "contributor"
  | "guide"
  | "moderator"
  | "admin"
  | "super_admin";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  badge?: string;
  phone?: string;
  city?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isLoggedIn: boolean;
  loading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: (defaultRole?: UserRole) => void;
  closeAuthModal: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "globetrotter_token";

/**
 * Collapse the backend's six roles into the three the UI branches on.
 * Privilege is derived from the server's answer only — it is never taken from
 * anything the visitor typed or selected.
 */
function normalizeRole(serverRole: ServerRole | string | undefined): UserRole {
  switch (serverRole) {
    case "admin":
    case "super_admin":
    case "moderator":
      return "admin";
    case "guide":
      return "guide";
    default:
      return "traveler";
  }
}

function toProfile(raw: any): UserProfile {
  const role = normalizeRole(raw?.role);
  return {
    id: String(raw?.id ?? ""),
    name: raw?.name ?? raw?.email?.split("@")[0] ?? "Traveler",
    email: raw?.email ?? "",
    role,
    avatar: raw?.avatar_url ?? undefined,
    phone: raw?.phone ?? undefined,
    city: raw?.city ?? undefined,
    badge:
      role === "admin"
        ? "Platform Administrator"
        : role === "guide"
        ? "Verified Local Guide"
        : "Verified Traveler",
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [, setTargetRole] = useState<UserRole>("traveler");

  // Restore the session by validating the stored token against the server.
  // The profile itself is never read from localStorage, so a tampered copy
  // cannot grant a role the backend did not issue.
  useEffect(() => {
    const restore = async () => {
      try {
        if (!localStorage.getItem(TOKEN_KEY)) return;
        const res = await api.get("/auth/me");
        setUser(toProfile(res.data));
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    restore().catch(() => setLoading(false));
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    const token = res.data?.access_token;
    if (!token) throw new Error("Sign-in failed: no access token returned.");
    localStorage.setItem(TOKEN_KEY, token);

    const profile = res.data?.user
      ? toProfile(res.data.user)
      : toProfile((await api.get("/auth/me")).data);

    setUser(profile);
    setIsAuthModalOpen(false);
  }, []);

  const signUp = useCallback(
    async (input: { name: string; email: string; password: string; phone?: string }) => {
      // The server assigns the role on registration; the client cannot request one.
      await api.post("/auth/register", {
        name: input.name,
        email: input.email,
        password: input.password,
        phone: input.phone,
      });
      await signIn(input.email, input.password);
    },
    [signIn]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const openAuthModal = useCallback((defaultRole: UserRole = "traveler") => {
    setTargetRole(defaultRole);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? "traveler",
        isLoggedIn: !!user,
        loading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        signIn,
        signUp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
