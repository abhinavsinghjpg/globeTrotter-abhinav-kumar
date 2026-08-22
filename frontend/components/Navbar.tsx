"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Compass, MessageCircle, Shield, User as UserIcon, LogOut, Sparkles } from "lucide-react";

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const whatsappUrl = "https://wa.me/919876543210?text=Namaste!%20I%20am%20exploring%20GlobeTrotter%20and%20need%20travel%20assistance.";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 via-jaipur-pink to-amber-500 shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Compass className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="font-heading text-2xl font-bold tracking-tight text-white">
              Globe<span className="text-brand-500">Trotter</span>
            </span>
            <span className="block text-[10px] tracking-widest text-slate-400 uppercase font-semibold">
              India Intelligence
            </span>
          </div>
        </Link>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/destinations/jaipur"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-brand-400 transition-colors"
          >
            <span className="h-2 w-2 rounded-full bg-jaipur-pink animate-pulse"></span>
            Jaipur (Pink City)
          </Link>
          <Link
            href="/#explore"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Destinations
          </Link>
          <Link
            href="/#planner"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            AI Itinerary
          </Link>
          <Link
            href="/#features"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Live Status & Food
          </Link>
        </nav>

        {/* Right Actions: WhatsApp Link + Auth / Admin */}
        <div className="flex items-center gap-4">
          {/* WhatsApp Direct Assist Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-900/60 transition-all shadow-sm shadow-emerald-500/10"
            title="Chat directly with our team on WhatsApp"
          >
            <MessageCircle className="h-4 w-4 fill-emerald-500/20" />
            <span className="hidden sm:inline">WhatsApp Help</span>
          </a>

          {/* Admin Link if Admin */}
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3.5 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-all"
            >
              <Shield className="h-4 w-4 text-amber-400" />
              <span>Admin Panel</span>
            </Link>
          )}

          {/* User Auth */}
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-1.5 border border-slate-800">
                <UserIcon className="h-4 w-4 text-brand-400" />
                <span className="text-xs font-medium text-slate-200">{user.name.split(" ")[0]}</span>
              </div>
              <button
                onClick={logout}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-900 hover:text-rose-400 transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-xl px-4 py-2 text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-jaipur-pink px-4 py-2 text-xs font-semibold text-white shadow-md shadow-brand-500/20 hover:opacity-95 transition-opacity"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
