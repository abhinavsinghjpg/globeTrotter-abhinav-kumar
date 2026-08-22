"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Compass,
  MapPin,
  Sparkles,
  Calendar,
  Utensils,
  Shield,
  MessageCircle,
  User as UserIcon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Layers,
  Map,
} from "lucide-react";

export const LeftSidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout, isAdmin } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const whatsappUrl =
    "https://wa.me/919876543210?text=Namaste!%20I%20am%20exploring%20GlobeTrotter%20and%20need%20travel%20assistance.";

  const navItems = [
    {
      href: "/",
      label: "India Map Discovery",
      icon: Map,
      badge: "Interactive",
    },
    {
      href: "/destinations/jaipur",
      label: "Jaipur (Pink City)",
      icon: Compass,
      badge: "Flagship",
      highlight: true,
    },
    {
      href: "/#planner",
      label: "AI Itinerary Planner",
      icon: Calendar,
    },
    {
      href: "/#features",
      label: "Food & Live Status",
      icon: Utensils,
    },
  ];

  return (
    <>
      {/* Mobile Top Bar with Drawer Toggle */}
      <div className="lg:hidden sticky top-0 z-50 flex items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-jaipur-pink shadow-md">
            <Compass className="h-5 w-5 text-white" />
          </div>
          <span className="font-heading text-lg font-bold text-white">
            Globe<span className="text-brand-500">Trotter</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-full bg-emerald-600/20 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-400"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>WhatsApp</span>
          </a>

          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-white"
          >
            {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Left Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col border-r border-slate-800/80 bg-slate-950/95 backdrop-blur-2xl transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64 sm:w-72"
        } ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar Header & Brand Logo */}
        <div className="flex h-20 items-center justify-between px-5 border-b border-slate-800/80">
          <Link href="/" className="flex items-center gap-3 overflow-hidden group">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 via-jaipur-pink to-amber-500 shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Compass className="h-6 w-6 text-white" />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-heading text-xl font-bold tracking-tight text-white">
                  Globe<span className="text-brand-500">Trotter</span>
                </span>
                <span className="text-[9px] tracking-widest text-slate-400 uppercase font-semibold">
                  India Intelligence
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Items List */}
        <nav className="flex-1 space-y-1.5 px-3 py-6 overflow-y-auto">
          {!isCollapsed && (
            <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Discover & Plan
            </span>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-brand-600 to-jaipur-pink text-white shadow-lg shadow-brand-500/20"
                    : item.highlight
                    ? "text-jaipur-pink bg-jaipur-pink/10 border border-jaipur-pink/30 hover:bg-jaipur-pink/20"
                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 ${
                    isActive ? "text-white" : item.highlight ? "text-jaipur-pink" : "text-slate-400"
                  }`}
                />

                {!isCollapsed && (
                  <div className="flex flex-1 items-center justify-between truncate">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                          isActive
                            ? "bg-white/20 text-white"
                            : item.highlight
                            ? "bg-jaipur-pink text-white"
                            : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}

          {/* Admin Control Link */}
          {isAdmin && (
            <div className="pt-3">
              {!isCollapsed && (
                <span className="px-3 text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1.5">
                  Management
                </span>
              )}
              <Link
                href="/admin"
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-xs font-semibold transition-all ${
                  pathname === "/admin"
                    ? "bg-amber-500 text-slate-950 font-bold"
                    : "text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20"
                }`}
                title={isCollapsed ? "Admin Panel" : undefined}
              >
                <Shield className="h-5 w-5 shrink-0 text-amber-400" />
                {!isCollapsed && <span>Admin Panel</span>}
              </Link>
            </div>
          )}
        </nav>

        {/* WhatsApp Concierge Banner */}
        <div className="p-3 border-t border-slate-800/80">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 p-3 text-emerald-400 hover:bg-emerald-900/60 transition-all shadow-sm group"
            title={isCollapsed ? "WhatsApp Concierge Help" : undefined}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 group-hover:scale-110 transition-transform">
              <MessageCircle className="h-5 w-5 text-emerald-400" />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-white group-hover:text-emerald-300">
                  WhatsApp Concierge
                </span>
                <span className="text-[10px] text-emerald-400/80">
                  Live local travel desk
                </span>
              </div>
            )}
          </a>
        </div>

        {/* User Account / Auth Section at Bottom */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950">
          {user ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-brand-400">
                  <UserIcon className="h-4 w-4" />
                </div>
                {!isCollapsed && (
                  <div className="flex flex-col truncate">
                    <span className="text-xs font-bold text-slate-200 truncate">{user.name}</span>
                    <span className="text-[10px] text-slate-400 capitalize">{user.role}</span>
                  </div>
                )}
              </div>

              {!isCollapsed && (
                <button
                  onClick={logout}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-rose-400 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                href="/login"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 border border-slate-800 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
              >
                <UserIcon className="h-4 w-4" />
                {!isCollapsed && <span>Sign In</span>}
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
