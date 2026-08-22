"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Compass,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  Shield,
  Clock,
  Utensils,
  ShoppingBag,
  Users,
  MessageCircle,
  CheckCircle2,
  DollarSign,
  Flame,
} from "lucide-react";

export default function HomePage() {
  const [startCity, setStartCity] = useState("Delhi");
  const [destCity, setDestCity] = useState("Jaipur");
  const [days, setDays] = useState(3);
  const [budgetMode, setBudgetMode] = useState("standard");
  const [travelStyle, setTravelStyle] = useState("culture");

  const whatsappUrl =
    "https://wa.me/919876543210?text=Namaste!%20I%20am%20planning%20a%20trip%20to%20Jaipur%20and%20need%20assistance.";

  return (
    <div className="min-h-screen space-y-24 pb-24">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4 pt-12 sm:px-6 lg:px-8">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-600/20 via-slate-950 to-slate-950 -z-10" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-jaipur-pink/15 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="mx-auto max-w-5xl text-center space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-300 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-brand-400" />
            India&apos;s Location-Aware Travel Intelligence Platform
          </div>

          <h1 className="font-heading text-4xl sm:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Discover, Plan & Experience <br />
            <span className="gradient-text-jaipur">Incredible India</span>
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-xl text-slate-300 leading-relaxed font-normal">
            Unified multi-city itinerary generation, real-time place status alerts, local food spots, cultural bazaars, and verified guides in one intelligent platform.
          </p>

          {/* Interactive Quick Trip Planner Bar */}
          <div className="mx-auto max-w-4xl glass-card p-4 sm:p-6 shadow-2xl border-slate-700/80 text-left space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-brand-400" />
                  Destination
                </label>
                <select
                  value={destCity}
                  onChange={(e) => setDestCity(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2.5 text-sm font-semibold text-white focus:border-brand-500 focus:outline-none"
                >
                  <option value="Jaipur">Jaipur (Pink City)</option>
                  <option value="Udaipur">Udaipur (City of Lakes)</option>
                  <option value="Jodhpur">Jodhpur (Blue City)</option>
                  <option value="Goa">Goa (Beaches & Heritage)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-brand-400" />
                  Trip Duration
                </label>
                <select
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2.5 text-sm font-semibold text-white focus:border-brand-500 focus:outline-none"
                >
                  <option value={2}>2 Days (Weekend Trip)</option>
                  <option value={3}>3 Days (Heritage Explorer)</option>
                  <option value={5}>5 Days (Deep Culture & Food)</option>
                  <option value={7}>7 Days (Royal Circuit)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5 text-brand-400" />
                  Budget Level
                </label>
                <select
                  value={budgetMode}
                  onChange={(e) => setBudgetMode(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2.5 text-sm font-semibold text-white focus:border-brand-500 focus:outline-none"
                >
                  <option value="budget">Budget (Hostels & Stalls)</option>
                  <option value="standard">Standard (Comfort Hotels)</option>
                  <option value="luxury">Luxury (Heritage Haveli)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="h-3.5 w-3.5 text-brand-400" />
                  Main Interest
                </label>
                <select
                  value={travelStyle}
                  onChange={(e) => setTravelStyle(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2.5 text-sm font-semibold text-white focus:border-brand-500 focus:outline-none"
                >
                  <option value="culture">Forts, Palaces & Culture</option>
                  <option value="food">Street Food & Royal Thalis</option>
                  <option value="adventure">Safaris & Cycling</option>
                  <option value="shopping">Handicrafts & Kundan</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-xs text-slate-400">
                ✨ Estimated {days}-Day Jaipur Cost: <strong className="text-white">₹{days * (budgetMode === 'budget' ? 1800 : budgetMode === 'standard' ? 4200 : 9500)}</strong> per person
              </span>

              <Link
                href="/destinations/jaipur"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 via-jaipur-pink to-brand-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-500/25 hover:opacity-95 transition-all"
              >
                <span>Generate {destCity} Itinerary</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FLAGSHIP DESTINATION SHOWCASE: JAIPUR */}
      <section id="explore" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-jaipur-pink uppercase tracking-wider mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              Flagship Destination
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
              Jaipur — The Royal Pink City
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Explore 5 magnificent forts, iconic street food joints, centuries-old Kundan jewelry quarters, and live heritage festivals.
            </p>
          </div>

          <Link
            href="/destinations/jaipur"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-400 hover:text-brand-300 transition-colors"
          >
            <span>Explore Full Jaipur Guide</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card-interactive overflow-hidden group flex flex-col justify-between">
            <div className="relative h-56 w-full">
              <Image
                src="https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80"
                alt="Hawa Mahal"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 rounded-md bg-jaipur-royal/90 px-2.5 py-1 text-[11px] font-bold text-white uppercase backdrop-blur-sm">
                953 Jharokhas
              </div>
            </div>
            <div className="p-6 space-y-3">
              <h3 className="font-heading text-xl font-bold text-white">Hawa Mahal & Amer Fort</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Experience the 18th-century royal Rajput architecture, Sheesh Mahal mirror work, and Nahargarh sunset fortress ridges.
              </p>
              <Link
                href="/destinations/jaipur"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-400 pt-2"
              >
                View 5 Forts & Palaces <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="glass-card-interactive overflow-hidden group flex flex-col justify-between">
            <div className="relative h-56 w-full">
              <Image
                src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"
                alt="Rajasthani Food"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 rounded-md bg-amber-600/90 px-2.5 py-1 text-[11px] font-bold text-white uppercase backdrop-blur-sm">
                Iconic Food
              </div>
            </div>
            <div className="p-6 space-y-3">
              <h3 className="font-heading text-xl font-bold text-white">Pyaaz Kachori & Royal Thalis</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Rawat Mishtan Bhandar&apos;s world-famous onion kachori, LMB Paneer Ghevar, and authentic Chokhi Dhani village dining.
              </p>
              <Link
                href="/destinations/jaipur"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-400 pt-2"
              >
                Explore Food Stalls <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="glass-card-interactive overflow-hidden group flex flex-col justify-between">
            <div className="relative h-56 w-full">
              <Image
                src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80"
                alt="Johari Bazaar"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 rounded-md bg-jaipur-pink/90 px-2.5 py-1 text-[11px] font-bold text-white uppercase backdrop-blur-sm">
                Bazaars
              </div>
            </div>
            <div className="p-6 space-y-3">
              <h3 className="font-heading text-xl font-bold text-white">Johari & Bapu Bazaars</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Shop authentic Kundan jewelry, camel leather mojaris, Bandhani sarees, and traditional Jaipuri blue pottery.
              </p>
              <Link
                href="/destinations/jaipur"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-400 pt-2"
              >
                Discover Cultural Shops <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES (§64 PRD) */}
      <section id="features" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
            Why GlobeTrotter is Different
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Not just another places listing website — a complete location-aware travel intelligence layer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-6 space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-xl font-bold text-white">Live Place Status & Alerts (§28)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              If a fort or trail is temporarily closed for renovation or weather, GlobeTrotter warns you before departure and auto-suggests nearby alternatives.
            </p>
          </div>

          <div className="glass-card p-6 space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-jaipur-pink/20 text-jaipur-pink">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-xl font-bold text-white">Where You Are Standing (§19)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instant location-aware recommendations for tea stalls, vegetarian restaurants, and hidden spots within 15 minutes of your exact coordinates.
            </p>
          </div>

          <div className="glass-card p-6 space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
              <MessageCircle className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-xl font-bold text-white">Direct WhatsApp Concierge</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Connect with verified local guides, get real-time assistance, and share customized trip itineraries seamlessly over WhatsApp.
            </p>
          </div>
        </div>
      </section>

      {/* WHATSAPP CTA BANNER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass-card gradient-bg-jaipur p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border-emerald-500/30">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-semibold text-emerald-400">
              <MessageCircle className="h-4 w-4" />
              Live India Travel Help Desk
            </div>
            <h3 className="font-heading text-3xl font-bold text-white">
              Planning your trip? Chat with our team directly.
            </h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Get personalized hotel stays, cab recommendations, guide bookings, or custom business trip itineraries in seconds on WhatsApp.
            </p>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-2.5 rounded-2xl bg-emerald-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-emerald-600/30 hover:bg-emerald-500 transition-all hover:scale-105"
          >
            <MessageCircle className="h-5 w-5" />
            Open WhatsApp Concierge
          </a>
        </div>
      </section>
    </div>
  );
}
