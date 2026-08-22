"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "traveler" | "guide" | "admin";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  badge?: string; // e.g. "Licensed Rajasthan Guide", "Superadmin"
  phone?: string;
  city?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: (defaultRole?: UserRole) => void;
  closeAuthModal: () => void;
  login: (userData: UserProfile) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "globetrotter_auth_session";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [targetRole, setTargetRole] = useState<UserRole>("traveler");

  // Load persisted user session from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Could not load auth session from localStorage:", e);
    }
  }, []);

  const login = (userData: UserProfile) => {
    setUser(userData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    } catch (e) {
      console.warn("Could not save auth session:", e);
    }
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn("Could not clear auth session:", e);
    }
  };

  const openAuthModal = (defaultRole: UserRole = "traveler") => {
    setTargetRole(defaultRole);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const role: UserRole = user?.role || "traveler";
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isLoggedIn,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        login,
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
