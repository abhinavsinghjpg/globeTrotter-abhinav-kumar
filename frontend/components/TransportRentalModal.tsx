"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Car,
  Navigation,
  ExternalLink,
  Phone,
  Shield,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle2,
  Bike,
  Sparkles,
} from "lucide-react";

interface TransportRentalModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  city: string;
  isInline?: boolean;
}

export const TransportRentalModal: React.FC<TransportRentalModalProps> = ({
  isOpen = true,
  onClose,
  city,
  isInline = false,
}) => {
  const [activeTab, setActiveTab] = useState<"cabs" | "rentals" | "local">("cabs");

  if (!isOpen && !isInline) return null;

  const content = (
    <div className={`relative w-full rounded-3xl bg-white shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-slate-900 font-sans ${isInline ? "shadow-md" : "max-w-2xl max-h-[85vh]"}`}>
      {/* Header */}
      <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
            <Car className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-extrabold leading-tight">
              Transportation & Vehicle Rentals in {city}
            </h3>
            <span className="text-[11px] text-white/80 font-medium">
              Ola / Uber / Rapido · Zoomcar & Royal Brothers · Local E-Rickshaws
            </span>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Tab Selection */}
      <div className="p-2 bg-slate-100 border-b border-slate-200 flex gap-1 text-xs font-bold">
        <button
          onClick={() => setActiveTab("cabs")}
          className={`flex-1 py-2.5 rounded-2xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "cabs" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Car className="h-4 w-4 text-brand-600" />
          <span>Cab & Bike Taxis</span>
        </button>

        <button
          onClick={() => setActiveTab("rentals")}
          className={`flex-1 py-2.5 rounded-2xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "rentals" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Bike className="h-4 w-4 text-amber-600" />
          <span>Car & Bike Rentals</span>
        </button>

        <button
          onClick={() => setActiveTab("local")}
          className={`flex-1 py-2.5 rounded-2xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "local" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Navigation className="h-4 w-4 text-emerald-600" />
          <span>Local E-Rickshaws & Metro</span>
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
        {/* TAB 1: CABS & BIKE TAXIS */}
        {activeTab === "cabs" && (
          <div className="space-y-3">
            {[
              {
                name: "Uber India",
                tag: "UberGo / UberAuto / Intercity",
                rate: "₹14 - ₹20 / km (Avg ₹250 for city hops)",
                deepLink: "https://m.uber.com/ul/?action=setPickup",
                badge: "Instant 3-min pickup",
                color: "border-black/20 bg-slate-50",
              },
              {
                name: "Ola Cabs",
                tag: "Ola Prime / Micro / Auto",
                rate: "₹13 - ₹18 / km (Verified drivers)",
                deepLink: "https://www.olacabs.com/",
                badge: "Outstation & Rental Available",
                color: "border-emerald-200 bg-emerald-50/50",
              },
              {
                name: "Rapido Bike Taxi",
                tag: "Single Rider Quick Transit",
                rate: "₹8 - ₹10 / km (Fastest through Old City alleys)",
                deepLink: "https://www.rapido.bike/",
                badge: "Best for Bazaars & Forts",
                color: "border-amber-200 bg-amber-50/50",
              },
            ].map((app, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-3xl border ${app.color} flex items-center justify-between shadow-xs`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-heading text-sm font-extrabold text-slate-900">{app.name}</h4>
                    <span className="rounded-full bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5">
                      {app.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">{app.tag}</p>
                  <span className="text-[11px] font-bold text-slate-900 block">💰 Estimated Fare: {app.rate}</span>
                </div>

                <a
                  href={app.deepLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 text-xs font-bold shadow-md transition-all hover:scale-105 shrink-0"
                >
                  <span>Open App</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: CAR & BIKE RENTALS */}
        {activeTab === "rentals" && (
          <div className="space-y-3">
            {[
              {
                name: "Royal Brothers (Bike & Scooty Rental)",
                vehicles: "Activa (₹450/day) · Royal Enfield 350 (₹1,100/day)",
                policy: "Valid Driving License + ₹1,000 Refundable Deposit",
                link: "https://www.royalbrothers.com/",
                tag: "Most Popular for Solo Explorers",
              },
              {
                name: "Zoomcar (Self-Drive Cars)",
                vehicles: "Swift / Baleno (₹1,800/day) · Thar 4x4 (₹3,800/day)",
                policy: "Zero Security Deposit · Unlimited Kilometers",
                link: "https://www.zoomcar.com/",
                tag: "Ideal for Fort Excursions",
              },
            ].map((rental, idx) => (
              <div
                key={idx}
                className="p-4 rounded-3xl border border-slate-200 bg-slate-50 space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-heading text-sm font-extrabold text-slate-900">{rental.name}</h4>
                  <span className="rounded-full bg-brand-100 text-brand-800 text-[10px] font-bold px-2.5 py-0.5">
                    {rental.tag}
                  </span>
                </div>

                <div className="space-y-1 text-slate-700">
                  <p>🛵 <strong>Available:</strong> {rental.vehicles}</p>
                  <p>📋 <strong>Requirements:</strong> {rental.policy}</p>
                </div>

                <div className="pt-2 flex justify-end">
                  <a
                    href={rental.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-xl bg-slate-900 text-white px-3.5 py-2 text-xs font-bold hover:bg-slate-800 transition-colors"
                  >
                    <span>Check Availability & Book</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: LOCAL E-RICKSHAWS & PUBLIC TRANSIT */}
        {activeTab === "local" && (
          <div className="space-y-3">
            <div className="p-4 rounded-3xl border border-emerald-200 bg-emerald-50/50 space-y-2">
              <h4 className="font-heading text-sm font-extrabold text-emerald-950 flex items-center gap-2">
                <Navigation className="h-4 w-4 text-emerald-600" />
                Government Verified E-Rickshaw Stand Rates
              </h4>
              <p className="text-slate-700 text-xs leading-relaxed">
                Eco-friendly E-Rickshaws operate extensively inside the Pink City Walled Bazaars (Badi Choupad to Chhoti Choupad).
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-800 pt-1">
                <span className="p-2 bg-white rounded-xl border border-emerald-200">
                  🛺 Short Hop (1-2 km): ₹20 - ₹30 / person
                </span>
                <span className="p-2 bg-white rounded-xl border border-emerald-200">
                  🏰 Half-Day Old City Tour: ₹400 - ₹500
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (isInline) return content;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      {content}
    </div>
  );
};
