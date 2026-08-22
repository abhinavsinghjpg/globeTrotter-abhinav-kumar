"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import {
  Compass,
  MapPin,
  Shield,
  Star,
  MessageCircle,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  DollarSign,
  Phone,
  User,
  Sparkles,
  Lock,
} from "lucide-react";

export default function GuideDashboardPage() {
  const { user, role, openAuthModal } = useAuth();
  const [hourlyRate, setHourlyRate] = useState("₹800");
  const [availableToday, setAvailableToday] = useState(true);
  const [languages, setLanguages] = useState("Hindi, English, Rajasthani, French");
  const [isSaved, setIsSaved] = useState(false);

  // If not logged in as Guide or Admin, show restricted access gate
  if (role !== "guide" && role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6 text-slate-900 font-sans">
        <div className="max-w-md w-full rounded-3xl bg-white p-8 shadow-xl border border-slate-200 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <Lock className="h-8 w-8" />
          </div>
          <h2 className="font-heading text-2xl font-extrabold text-slate-900">
            Local Guide Portal Access
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            This dashboard is dedicated to verified local city coordinators and state-licensed tourist guides in India.
          </p>

          <div className="pt-2 space-y-2">
            <button
              onClick={() => openAuthModal("guide")}
              className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3.5 shadow-md shadow-emerald-600/20 transition-all hover:scale-102"
            >
              Sign In as Local Guide
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

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans">
      {/* Top Bar */}
      <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 px-3 py-1.5 rounded-xl transition-colors mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Map Workspace</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-xs">
              <MapPin className="h-4 w-4" />
            </span>
            <div>
              <h1 className="font-heading text-base font-extrabold text-slate-900 leading-none">
                Guide Operations Desk
              </h1>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {user?.city || "Jaipur, Rajasthan"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-3 py-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>{user?.badge || "Govt. Licensed Rajasthan Tourism Guide"}</span>
          </span>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Guide Profile Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-emerald-500/30">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-md shrink-0">
              <Image
                src={
                  user?.avatar ||
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                }
                alt={user?.name || "Guide"}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-2xl font-extrabold">{user?.name || "Vikram Rathore"}</h2>
                <span className="flex items-center gap-1 bg-amber-400 text-slate-950 font-extrabold px-2 py-0.5 rounded-lg text-xs">
                  <Star className="h-3 w-3 fill-slate-950" />
                  4.9 (140+ Tours)
                </span>
              </div>
              <p className="text-xs text-emerald-200 font-medium mt-1">
                📍 Heritage Walks · Amer Fort & Nahargarh Sunset · Kundan Jewelry Trails
              </p>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Languages: <strong>{languages}</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setAvailableToday(!availableToday)}
              className={`rounded-2xl px-5 py-3 text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-2 ${
                availableToday
                  ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                  : "bg-slate-700 text-slate-300"
              }`}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${availableToday ? "bg-emerald-950 animate-pulse" : "bg-red-400"}`} />
              <span>{availableToday ? "Available for Tours Today" : "Currently Unavailable"}</span>
            </button>
          </div>
        </div>

        {/* Operational Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* 1. Rates & WhatsApp Booking Settings */}
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-600" />
              Tour Pricing & Availability
            </h3>

            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Standard Hourly Rate</label>
                <input
                  type="text"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full rounded-2xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Spoken Languages</label>
                <input
                  type="text"
                  value={languages}
                  onChange={(e) => setLanguages(e.target.value)}
                  className="w-full rounded-2xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <button
                onClick={() => {
                  setIsSaved(true);
                  setTimeout(() => setIsSaved(false), 2500);
                }}
                className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 shadow-md shadow-emerald-600/20 transition-all"
              >
                {isSaved ? "✓ Profile Updated Successfully" : "Save Pricing & Hours"}
              </button>
            </div>
          </div>

          {/* 2. Recent Tourist Inquiries via WhatsApp */}
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-teal-600" />
              Recent Tourist Inquiries
            </h3>

            <div className="space-y-2.5">
              {[
                { name: "Ananya S. (Delhi)", tour: "Amer Fort & Nahargarh Sunset", time: "2 hours ago", status: "Confirmed" },
                { name: "Marcus W. (UK)", tour: "Old City Food & Kundan Trail", time: "5 hours ago", status: "Inquiry" },
                { name: "Rohan & Family (Mumbai)", tour: "Full Day Jaipur Heritage", time: "Yesterday", status: "Completed" },
              ].map((inq, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{inq.name}</span>
                    <span className="text-[11px] text-slate-500">{inq.tour} · {inq.time}</span>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                      inq.status === "Confirmed"
                        ? "bg-emerald-100 text-emerald-800"
                        : inq.status === "Completed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {inq.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
