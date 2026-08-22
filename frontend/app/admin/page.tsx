"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Shield,
  Users,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Eye,
  Edit,
  UserCheck,
  UserX,
  MessageCircle,
  Sparkles,
  Lock,
  ArrowLeft,
} from "lucide-react";

export default function AdminPage() {
  const { user, role, openAuthModal } = useAuth();
  const [activeSection, setActiveSection] = useState<"overview" | "places" | "users">("overview");

  // Admin Role Protection Guard
  if (role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6 text-slate-900 font-sans">
        <div className="max-w-md w-full rounded-3xl bg-white p-8 shadow-xl border border-slate-200 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
            <Lock className="h-8 w-8" />
          </div>
          <h2 className="font-heading text-2xl font-extrabold text-slate-900">
            Restricted Admin Area
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            This portal is strictly confidential and reserved for GlobeTrotter operations superadministrators and platform moderators.
          </p>

          <div className="pt-2 space-y-2">
            <button
              onClick={() => openAuthModal("admin")}
              className="w-full rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs py-3.5 shadow-md shadow-purple-600/20 transition-all hover:scale-102"
            >
              Sign In as Administrator
            </button>
            <Link
              href="/"
              className="block w-full rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 transition-colors"
            >
              Return to Travel Feed
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Sample real-time places data for Admin monitoring
  const [places, setPlaces] = useState([
    {
      id: "p1",
      name: "Hawa Mahal (Palace of Winds)",
      city: "Jaipur",
      category: "Palace",
      status: "Open",
      statusReason: "Normal operating hours",
      lastVerified: "Today, 10:30 AM",
      confidence: "98%",
    },
    {
      id: "p2",
      name: "Amer Fort & Sheesh Mahal",
      city: "Jaipur",
      category: "Fort",
      status: "Open",
      statusReason: "Operational",
      lastVerified: "Today, 09:15 AM",
      confidence: "100%",
    },
    {
      id: "p3",
      name: "Nahargarh Fort Viewpoint",
      city: "Jaipur",
      category: "Fort",
      status: "Open",
      statusReason: "Sunset road clear",
      lastVerified: "Yesterday, 06:00 PM",
      confidence: "95%",
    },
    {
      id: "p4",
      name: "Galta Ji (Monkey Temple Mountain Pass)",
      city: "Jaipur",
      category: "Temple",
      status: "Under Maintenance",
      statusReason: "Upper trail monsoon restoration work",
      lastVerified: "Today, 08:00 AM",
      confidence: "90%",
    },
  ]);

  // Sample users list for user management
  const [usersList, setUsersList] = useState([
    {
      id: "u1",
      name: "Abhinav Kumar",
      email: "abhinav@example.com",
      role: "super_admin",
      status: "Active",
      trips: 4,
      joined: "Aug 2026",
    },
    {
      id: "u2",
      name: "Rajesh Sharma (Jaipur Local Guide)",
      email: "rajesh.guide@jaipur.in",
      role: "guide",
      status: "Active",
      trips: 18,
      joined: "Jul 2026",
    },
    {
      id: "u3",
      name: "Priya Patel",
      email: "priya.p@gmail.com",
      role: "traveller",
      status: "Active",
      trips: 2,
      joined: "Aug 2026",
    },
    {
      id: "u4",
      name: "Spam Account",
      email: "spam.bot@test.com",
      role: "traveller",
      status: "Suspended",
      trips: 0,
      joined: "Aug 2026",
    },
  ]);

  const togglePlaceStatus = (id: string) => {
    setPlaces((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextStatus = p.status === "Open" ? "Temporarily Closed" : "Open";
          const nextReason =
            nextStatus === "Temporarily Closed"
              ? "Renovation / Weather closure reported"
              : "Normal operating hours";
          return { ...p, status: nextStatus, statusReason: nextReason, lastVerified: "Just now" };
        }
        return p;
      })
    );
  };

  const toggleUserStatus = (id: string) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          return { ...u, status: u.status === "Active" ? "Suspended" : "Active" };
        }
        return u;
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-400">
              <Shield className="h-3.5 w-3.5" />
              GlobeTrotter Central Control
            </div>
            <h1 className="font-heading text-3xl font-bold text-white">
              Admin & Operations Dashboard
            </h1>
            <p className="text-sm text-slate-400">
              Manage live place statuses, verify local guide submissions, and oversee travel intelligence.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-emerald-600/20 border border-emerald-500/30 px-4 py-2.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-600/30 transition-all"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Concierge Logs
            </a>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="glass-card p-5 space-y-2 border-l-4 border-l-brand-500">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Total Travelers</span>
              <Users className="h-4 w-4 text-brand-400" />
            </div>
            <p className="font-heading text-3xl font-extrabold text-white">1,420</p>
            <span className="text-[11px] text-emerald-400 font-medium">↑ 18% this month</span>
          </div>

          <div className="glass-card p-5 space-y-2 border-l-4 border-l-jaipur-pink">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Flagship City</span>
              <MapPin className="h-4 w-4 text-jaipur-pink" />
            </div>
            <p className="font-heading text-3xl font-extrabold text-white">Jaipur</p>
            <span className="text-[11px] text-slate-400">5 Forts, 8 Eateries, 2 Bazaars</span>
          </div>

          <div className="glass-card p-5 space-y-2 border-l-4 border-l-emerald-500">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Places Active</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="font-heading text-3xl font-extrabold text-white">
              {places.filter((p) => p.status === "Open").length} / {places.length}
            </p>
            <span className="text-[11px] text-emerald-400">Real-time verification active</span>
          </div>

          <div className="glass-card p-5 space-y-2 border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Status Alerts</span>
              <AlertTriangle className="h-4 w-4 text-amber-400" />
            </div>
            <p className="font-heading text-3xl font-extrabold text-amber-300">
              {places.filter((p) => p.status !== "Open").length} Place Alert
            </p>
            <span className="text-[11px] text-amber-400">Auto-suggesting alternatives</span>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveSection("overview")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeSection === "overview"
                ? "bg-brand-500 text-white shadow-md shadow-brand-500/20"
                : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            }`}
          >
            Overview & Alerts
          </button>
          <button
            onClick={() => setActiveSection("places")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeSection === "places"
                ? "bg-brand-500 text-white shadow-md shadow-brand-500/20"
                : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            }`}
          >
            Place Operational Status ({places.length})
          </button>
          <button
            onClick={() => setActiveSection("users")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeSection === "users"
                ? "bg-brand-500 text-white shadow-md shadow-brand-500/20"
                : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            }`}
          >
            User & Guide Moderation ({usersList.length})
          </button>
        </div>

        {/* SECTION: PLACES STATUS MANAGER */}
        {(activeSection === "overview" || activeSection === "places") && (
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-xl font-bold text-white">
                  Place Status & Closure Manager (§28)
                </h3>
                <p className="text-xs text-slate-400">
                  Update closures instantly to automatically divert travelers to alternative nearby attractions.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Attraction Name</th>
                    <th className="pb-3 font-semibold">City</th>
                    <th className="pb-3 font-semibold">Current Status</th>
                    <th className="pb-3 font-semibold">Status Reason</th>
                    <th className="pb-3 font-semibold">Last Verified</th>
                    <th className="pb-3 font-semibold text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {places.map((place) => (
                    <tr key={place.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-4 font-semibold text-white">
                        {place.name}
                        <span className="block text-[11px] font-normal text-slate-400">{place.category}</span>
                      </td>
                      <td className="py-4 text-slate-300">{place.city}</td>
                      <td className="py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                            place.status === "Open"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {place.status === "Open" ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <AlertTriangle className="h-3 w-3" />
                          )}
                          {place.status}
                        </span>
                      </td>
                      <td className="py-4 text-slate-300">{place.statusReason}</td>
                      <td className="py-4 text-slate-400">{place.lastVerified}</td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => togglePlaceStatus(place.id)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                            place.status === "Open"
                              ? "border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
                              : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                          }`}
                        >
                          {place.status === "Open" ? "Mark Closed / Alert" : "Mark Open"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION: USERS & GUIDES */}
        {(activeSection === "overview" || activeSection === "users") && (
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-xl font-bold text-white">
                  User & Local Guide Management (§50)
                </h3>
                <p className="text-xs text-slate-400">
                  Manage traveler profiles, verified tour guides, and enforce community moderation.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 font-semibold">User</th>
                    <th className="pb-3 font-semibold">Role</th>
                    <th className="pb-3 font-semibold">Trips Created</th>
                    <th className="pb-3 font-semibold">Account Status</th>
                    <th className="pb-3 font-semibold">Joined Date</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-4 font-semibold text-white">
                        {u.name}
                        <span className="block text-[11px] font-normal text-slate-400">{u.email}</span>
                      </td>
                      <td className="py-4">
                        <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-slate-200 uppercase">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 text-slate-300">{u.trips} trips</td>
                      <td className="py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            u.status === "Active"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="py-4 text-slate-400">{u.joined}</td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => toggleUserStatus(u.id)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                            u.status === "Active"
                              ? "border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
                              : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                          }`}
                        >
                          {u.status === "Active" ? "Suspend" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
