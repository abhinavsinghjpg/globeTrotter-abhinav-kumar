"use client";

import React, { useState } from "react";
import {
  X,
  Compass,
  Calendar,
  Users,
  DollarSign,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  Shield,
  Utensils,
  Hotel,
  Car,
  Ticket,
  CheckCircle2,
  RefreshCw,
  Plus,
  Trash2,
  Briefcase,
  Layers,
} from "lucide-react";

interface TripPlannerModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  defaultCity?: string;
  isInline?: boolean;
}

export const TripPlannerModal: React.FC<TripPlannerModalProps> = ({
  isOpen = true,
  onClose,
  defaultCity = "Jaipur",
  isInline = false,
}) => {
  // Wizard State
  const [startingCity, setStartingCity] = useState("Delhi");
  const [destinations, setDestinations] = useState<string[]>([defaultCity]);
  const [days, setDays] = useState(3);
  const [travelersCount, setTravelersCount] = useState(2);
  const [ageGroup, setAgeGroup] = useState<"16-26" | "26-45" | "45+">("26-45");
  const [travelStyle, setTravelStyle] = useState<
    "budget" | "standard" | "luxury" | "business" | "family"
  >("standard");
  const [interests, setInterests] = useState<string[]>([
    "Heritage Forts",
    "Local Food Stalls",
    "Cultural Bazaars",
  ]);

  const [isGenerated, setIsGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen && !isInline) return null;

  const toggleInterest = (item: string) => {
    if (interests.includes(item)) {
      setInterests(interests.filter((i) => i !== item));
    } else {
      setInterests([...interests, item]);
    }
  };

  const addDestination = (city: string) => {
    if (!destinations.includes(city)) {
      setDestinations([...destinations, city]);
    }
  };

  const removeDestination = (city: string) => {
    if (destinations.length > 1) {
      setDestinations(destinations.filter((d) => d !== city));
    }
  };

  // Dynamic Budget Calculator (§9 PRD)
  const baseDailyHotel =
    travelStyle === "budget" ? 800 : travelStyle === "standard" ? 2800 : travelStyle === "luxury" ? 8500 : travelStyle === "business" ? 4500 : 3200;
  const baseDailyFood =
    travelStyle === "budget" ? 400 : travelStyle === "standard" ? 900 : travelStyle === "luxury" ? 2200 : 1200;
  const baseDailyTransport =
    travelStyle === "budget" ? 200 : travelStyle === "standard" ? 600 : travelStyle === "luxury" ? 1800 : 800;
  const baseActivities = 500 * days;

  const totalHotel = baseDailyHotel * days * Math.ceil(travelersCount / 2);
  const totalFood = baseDailyFood * days * travelersCount;
  const totalTransport = baseDailyTransport * days * travelersCount + (destinations.length > 1 ? 2500 : 1200);
  const totalActivities = baseActivities * travelersCount;
  const totalGuide = travelStyle === "luxury" || travelStyle === "standard" ? 1200 * days : 0;
  const grandTotal = totalHotel + totalFood + totalTransport + totalActivities + totalGuide;
  const perPersonCost = Math.round(grandTotal / travelersCount);

  const handleGenerateItinerary = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
    }, 600);
  };

  const plannerContent = (
    <div className={`relative w-full rounded-3xl bg-white shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-slate-900 font-sans ${isInline ? "shadow-md" : "max-w-3xl max-h-[90vh]"}`}>
      {/* Modal Header */}
      <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-brand-600 via-jaipur-pink to-purple-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
              <Sparkles className="h-5 w-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <h2 className="font-heading text-xl font-extrabold leading-tight">
                AI Trip Planner & Live Budget Engine
              </h2>
              <span className="text-[11px] text-white/80 font-medium">
                Multi-City Itinerary · Adaptive Budgeting · Weather-Aware Planning
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs">
          {!isGenerated ? (
            /* CONFIGURATION FORM */
            <div className="space-y-5">
              {/* 1. Multi-City Destination Route */}
              <div className="space-y-2">
                <label className="font-bold text-slate-800 text-xs block">
                  Trip Route & Multi-City Stops (§8 PRD)
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-2xl bg-slate-100 border border-slate-200 px-3.5 py-2 font-bold text-slate-700">
                    <span className="text-[10px] text-slate-400 uppercase">From:</span>
                    <input
                      type="text"
                      value={startingCity}
                      onChange={(e) => setStartingCity(e.target.value)}
                      className="bg-transparent text-xs font-bold text-slate-900 focus:outline-none w-20"
                    />
                  </div>

                  <ArrowRight className="h-4 w-4 text-slate-400 shrink-0" />

                  {destinations.map((dest, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 rounded-2xl bg-brand-50 border border-brand-200 px-3.5 py-2 font-bold text-brand-800"
                    >
                      <MapPin className="h-3.5 w-3.5 text-brand-600" />
                      <span>{dest}</span>
                      {destinations.length > 1 && (
                        <button
                          onClick={() => removeDestination(dest)}
                          className="hover:text-red-600 ml-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}

                  <div className="flex items-center gap-1">
                    {["Udaipur", "Jodhpur", "Pushkar", "Agra", "Varanasi"]
                      .filter((c) => !destinations.includes(c))
                      .slice(0, 3)
                      .map((quickCity) => (
                        <button
                          key={quickCity}
                          onClick={() => addDestination(quickCity)}
                          className="flex items-center gap-1 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                          <span>{quickCity}</span>
                        </button>
                      ))}
                  </div>
                </div>
              </div>

              {/* 2. Duration, Travelers & Age Group Selection (§15 PRD, Requirement 6) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Duration (Days)</label>
                  <div className="flex items-center gap-2 rounded-2xl bg-slate-50 border border-slate-200 px-3 py-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      min={1}
                      max={21}
                      value={days}
                      onChange={(e) => setDays(Number(e.target.value))}
                      className="w-full bg-transparent font-bold text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">No. of Travellers</label>
                  <div className="flex items-center gap-2 rounded-2xl bg-slate-50 border border-slate-200 px-3 py-2">
                    <Users className="h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={travelersCount}
                      onChange={(e) => setTravelersCount(Number(e.target.value))}
                      className="w-full bg-transparent font-bold text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Age Group (§15 PRD)</label>
                  <select
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value as any)}
                    className="w-full rounded-2xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none"
                  >
                    <option value="16-26">16–26 (Youth & Backpacking)</option>
                    <option value="26-45">26–45 (Working & Explorer)</option>
                    <option value="45+">45+ (Relaxed & Heritage)</option>
                  </select>
                </div>
              </div>

              {/* 3. Travel Style & Budget Mode */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">
                  Travel Persona & Budget Mode
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: "budget", label: "Budget / Hostels", icon: DollarSign },
                    { id: "standard", label: "Standard / Boutique", icon: Hotel },
                    { id: "luxury", label: "Luxury Heritage", icon: Sparkles },
                    { id: "family", label: "Family Vacation", icon: Users },
                    { id: "business", label: "Business + Leisure", icon: Briefcase },
                  ].map((style) => {
                    const isSelected = travelStyle === style.id;
                    return (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setTravelStyle(style.id as any)}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          isSelected
                            ? "bg-brand-50 border-brand-500 text-brand-900 font-extrabold shadow-sm"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-medium"
                        }`}
                      >
                        <style.icon className={`h-4 w-4 mx-auto mb-1 ${isSelected ? "text-brand-600" : "text-slate-400"}`} />
                        <span className="text-[11px] block">{style.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Interests & Preferences */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">
                  Interests & Must-Include Highlights
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Heritage Forts",
                    "Local Food Stalls",
                    "Cultural Bazaars",
                    "Sunset Viewpoints",
                    "Hidden Stepwells",
                    "Hot Air Balloon Safari",
                    "Spiritual Aarti",
                    "Traditional Folk Dance",
                  ].map((interest) => {
                    const isChecked = interests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all border ${
                          isChecked
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {isChecked ? "✓ " : "+ "}
                        {interest}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Budget Preview Card (§9 PRD) */}
              <div className="rounded-3xl bg-slate-900 text-white p-5 space-y-3 shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider block">
                      Estimated Trip Budget (§9 PRD)
                    </span>
                    <span className="text-2xl font-extrabold text-white">
                      ₹{grandTotal.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs text-slate-400 ml-2">
                      (₹{perPersonCost.toLocaleString("en-IN")} / person for {days} days)
                    </span>
                  </div>

                  <span className="rounded-xl bg-white/10 px-3 py-1 text-[11px] font-bold text-slate-300">
                    {travelersCount} Travellers · {days} Days
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Hotel className="h-3.5 w-3.5 text-brand-400 shrink-0" />
                    <span>Stays: <strong>₹{totalHotel.toLocaleString("en-IN")}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Utensils className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                    <span>Food: <strong>₹{totalFood.toLocaleString("en-IN")}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Car className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span>Travel: <strong>₹{totalTransport.toLocaleString("en-IN")}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Ticket className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Activities: <strong>₹{totalActivities.toLocaleString("en-IN")}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleGenerateItinerary}
                disabled={isGenerating}
                className="w-full rounded-2xl bg-gradient-to-r from-brand-600 via-jaipur-pink to-purple-600 hover:opacity-95 text-white font-extrabold text-sm py-4 shadow-xl shadow-brand-500/25 transition-all hover:scale-102 flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Optimizing Route & Opening Hours...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-amber-300" />
                    <span>Generate Day-by-Day Itinerary Plan</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          ) : (
            /* GENERATED ITINERARY VIEW */
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Itinerary Header Bar */}
              <div className="rounded-2xl bg-brand-50 border border-brand-200 p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg font-extrabold text-brand-950">
                    {startingCity} → {destinations.join(" → ")} ({days} Days)
                  </h3>
                  <p className="text-xs text-brand-700 font-semibold mt-0.5">
                    Adapted for {travelersCount} Travellers ({ageGroup} Age Group) · {travelStyle.toUpperCase()} Style
                  </p>
                </div>

                <button
                  onClick={() => setIsGenerated(false)}
                  className="rounded-xl bg-white border border-brand-300 text-brand-800 text-xs font-bold px-3 py-1.5 hover:bg-brand-100 transition-colors"
                >
                  Edit Parameters
                </button>
              </div>

              {/* Day-by-Day Practical Schedule */}
              <div className="space-y-4">
                {Array.from({ length: days }).map((_, dIdx) => {
                  const currentDayCity = destinations[dIdx % destinations.length];
                  return (
                    <div
                      key={dIdx}
                      className="rounded-3xl bg-slate-50 border border-slate-200 p-5 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="rounded-xl bg-brand-600 text-white font-extrabold px-3 py-1 text-xs">
                            Day {dIdx + 1}
                          </span>
                          <span className="font-bold text-slate-900 text-sm">
                            {currentDayCity} Exploration
                          </span>
                        </div>

                        <span className="text-[11px] font-bold text-slate-500">
                          🌤️ 24°C Sunny · 4 Stops Planned
                        </span>
                      </div>

                      {/* Day Schedule Timeline */}
                      <div className="space-y-2.5 pl-2 border-l-2 border-brand-500/40 ml-2 text-xs">
                        <div className="relative pl-4 space-y-0.5">
                          <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-brand-600 border-2 border-white" />
                          <span className="text-[10px] font-extrabold text-slate-400">08:30 AM – 11:30 AM</span>
                          <h4 className="font-bold text-slate-900 text-sm">
                            {dIdx === 0
                              ? "Amer Fort & Sheesh Mahal Citadel"
                              : dIdx === 1
                              ? "Hawa Mahal & City Palace Royal Quarters"
                              : "Nahargarh Fort & Ancient Stepwells"}
                          </h4>
                          <p className="text-slate-600 text-xs">
                            Explore the UNESCO royal ramparts during early golden hours before afternoon tourist rush.
                          </p>
                        </div>

                        <div className="relative pl-4 space-y-0.5">
                          <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-rose-500 border-2 border-white" />
                          <span className="text-[10px] font-extrabold text-slate-400">12:30 PM – 02:00 PM</span>
                          <h4 className="font-bold text-slate-900 text-sm">
                            {dIdx === 0
                              ? "Rawat Mishtan — Hot Pyaaz Kachori & Lassi"
                              : "LMB Johari Bazaar — Royal Rajasthani Thali"}
                          </h4>
                          <p className="text-slate-600 text-xs">
                            Authentic local feast with pure desi ghee preparations and sweet mawa kachoris.
                          </p>
                        </div>

                        <div className="relative pl-4 space-y-0.5">
                          <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-purple-600 border-2 border-white" />
                          <span className="text-[10px] font-extrabold text-slate-400">04:30 PM – 07:00 PM</span>
                          <h4 className="font-bold text-slate-900 text-sm">
                            {dIdx === 0
                              ? "Nahargarh Sunset Ridge & Madhavendra Palace"
                              : "Johari & Bapu Bazaar Kundan Silk Shopping"}
                          </h4>
                          <p className="text-slate-600 text-xs">
                            Spectacular golden hour views over the city skyline followed by vibrant evening bazaars.
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href={`https://wa.me/919876543210?text=Namaste!%20I%20generated%20a%20${days}-day%20itinerary%20for%20${destinations.join(
                    ", "
                  )}%20(Budget%20₹${grandTotal.toLocaleString("en-IN")})%20and%20want%20to%20book%20a%20guide%20and%20cabs.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3.5 shadow-md shadow-emerald-600/20 transition-all hover:scale-102"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Book Guides & Cabs for this Itinerary</span>
                </a>

                <button
                  onClick={onClose}
                  className="rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-3.5 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
  );

  if (isInline) return plannerContent;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      {plannerContent}
    </div>
  );
};
