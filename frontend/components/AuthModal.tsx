"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAuth, UserRole, UserProfile } from "@/context/AuthContext";
import {
  X,
  Compass,
  Shield,
  MapPin,
  Lock,
  Mail,
  User,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Phone,
  Eye,
  EyeOff,
} from "lucide-react";

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>("traveler");
  const [isSignUp, setIsSignUp] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("Jaipur");
  const [showPassword, setShowPassword] = useState(false);
  const [guideLicense, setGuideLicense] = useState("");

  if (!isAuthModalOpen) return null;

  // Preset demo accounts for seamless 1-click verification
  const handleQuickDemoLogin = (roleToLogin: UserRole) => {
    let demoUser: UserProfile;

    if (roleToLogin === "admin") {
      demoUser = {
        id: "usr-admin-01",
        name: "Rajesh Sharma (Admin)",
        email: "admin@globetrotter.in",
        role: "admin",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        badge: "Superadmin · Operations Control",
        city: "Jaipur / Delhi",
      };
    } else if (roleToLogin === "guide") {
      demoUser = {
        id: "usr-guide-01",
        name: "Vikram Rathore",
        email: "vikram.guide@globetrotter.in",
        role: "guide",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
        badge: "Govt. Licensed Rajasthan Tourism Guide (#RJ-9421)",
        city: "Jaipur",
        phone: "+91 98765 43210",
      };
    } else {
      demoUser = {
        id: "usr-trav-01",
        name: "Priya Verma",
        email: "priya.travels@gmail.com",
        role: "traveler",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
        badge: "Verified Explorer",
        city: "Mumbai",
      };
    }

    login(demoUser);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill in your email and password.");
      return;
    }

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: name || (selectedRole === "admin" ? "Admin User" : selectedRole === "guide" ? "Local Guide" : "Traveler"),
      email: email.trim(),
      role: selectedRole,
      badge:
        selectedRole === "admin"
          ? "Platform Administrator"
          : selectedRole === "guide"
          ? `Licensed Guide (${city})`
          : "Verified Traveler",
      city: city || "Jaipur",
    };

    login(newUser);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden text-slate-900">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-brand-600 via-jaipur-pink to-purple-600 p-6 text-white text-center relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md mb-2 shadow-inner">
            {selectedRole === "admin" ? (
              <Shield className="h-6 w-6 text-amber-300" />
            ) : selectedRole === "guide" ? (
              <MapPin className="h-6 w-6 text-emerald-300" />
            ) : (
              <Compass className="h-6 w-6 text-white" />
            )}
          </div>

          <h3 className="font-heading text-xl font-extrabold tracking-tight">
            {selectedRole === "admin"
              ? "Admin Control Portal"
              : selectedRole === "guide"
              ? "Local Guide Portal"
              : "Traveler Access"}
          </h3>
          <p className="text-xs text-white/85 font-medium mt-0.5">
            {selectedRole === "admin"
              ? "Confidential platform management & live alerts"
              : selectedRole === "guide"
              ? "Manage your tours, WhatsApp inquiries & tourist bookings"
              : "Save favorites, ask AI guide & plan your journey"}
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="p-2 bg-slate-100 border-b border-slate-200 flex gap-1">
          <button
            type="button"
            onClick={() => setSelectedRole("traveler")}
            className={`flex-1 py-2 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              selectedRole === "traveler"
                ? "bg-white text-brand-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Traveler</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole("guide")}
            className={`flex-1 py-2 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              selectedRole === "guide"
                ? "bg-white text-emerald-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <MapPin className="h-3.5 w-3.5" />
            <span>Local Guide</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole("admin")}
            className={`flex-1 py-2 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              selectedRole === "admin"
                ? "bg-white text-purple-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {/* 1-Click Quick Demo Sign In Box */}
        <div className="p-5 space-y-4">
          <div className="rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-3 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-extrabold text-amber-900 uppercase tracking-wider block">
                ⚡ Instant Quick Demo Access
              </span>
              <p className="text-xs text-amber-800 font-semibold">
                Sign in instantly as {selectedRole === "admin" ? "Superadmin" : selectedRole === "guide" ? "Licensed Jaipur Guide" : "Traveler"}
              </p>
            </div>

            <button
              onClick={() => handleQuickDemoLogin(selectedRole)}
              className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 shadow-sm transition-all hover:scale-102 flex items-center gap-1 shrink-0"
            >
              <span>1-Click Demo</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="flex items-center gap-3 text-slate-400 text-xs font-semibold">
            <div className="flex-1 h-px bg-slate-200" />
            <span>Or Enter Credentials</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
            {isSignUp && (
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <div className="flex items-center rounded-2xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500">
                  <User className="h-4 w-4 text-slate-400 mr-2" />
                  <input
                    type="text"
                    placeholder="e.g. Rahul Singh"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent focus:outline-none text-slate-800 font-medium"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="font-bold text-slate-700 block mb-1">Email Address</label>
              <div className="flex items-center rounded-2xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500">
                <Mail className="h-4 w-4 text-slate-400 mr-2" />
                <input
                  type="email"
                  placeholder={
                    selectedRole === "admin"
                      ? "admin@globetrotter.in"
                      : selectedRole === "guide"
                      ? "guide@jaipurtourism.com"
                      : "your.email@example.com"
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent focus:outline-none text-slate-800 font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Password</label>
              <div className="flex items-center rounded-2xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-brand-500/20 focus-within:border-brand-500">
                <Lock className="h-4 w-4 text-slate-400 mr-2" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent focus:outline-none text-slate-800 font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {selectedRole === "guide" && isSignUp && (
              <div>
                <label className="font-bold text-slate-700 block mb-1">Govt. Guide License No. (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. RJ-TOUR-2024-884"
                  value={guideLicense}
                  onChange={(e) => setGuideLicense(e.target.value)}
                  className="w-full rounded-2xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none"
                />
              </div>
            )}

            <button
              type="submit"
              className={`w-full rounded-2xl py-3 text-xs font-extrabold text-white shadow-md transition-all hover:scale-102 flex items-center justify-center gap-2 mt-2 ${
                selectedRole === "admin"
                  ? "bg-purple-700 hover:bg-purple-800 shadow-purple-600/20"
                  : selectedRole === "guide"
                  ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
                  : "bg-brand-600 hover:bg-brand-700 shadow-brand-600/20"
              }`}
            >
              <span>{isSignUp ? "Create Account" : `Sign In as ${selectedRole.toUpperCase()}`}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Toggle Sign Up / Sign In */}
          <div className="text-center text-xs text-slate-500 font-medium pt-1">
            {isSignUp ? (
              <span>
                Already have an account?{" "}
                <button onClick={() => setIsSignUp(false)} className="text-brand-600 font-bold hover:underline">
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                New to GlobeTrotter?{" "}
                <button onClick={() => setIsSignUp(true)} className="text-brand-600 font-bold hover:underline">
                  Register as {selectedRole}
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
