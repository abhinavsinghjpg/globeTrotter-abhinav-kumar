"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Compass,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  ShoppingBag,
  Utensils,
  Camera,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ChevronRight,
  Send,
} from "lucide-react";

export default function JaipurPage() {
  const [activeTab, setActiveTab] = useState<"places" | "food" | "shopping" | "events" | "activities">("places");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const whatsappGuideUrl = "https://wa.me/919876543210?text=Namaste!%20I%20am%20planning%20a%20trip%20to%20Jaipur%20and%20need%20a%20local%20guide%20and%20itinerary%20recommendations.";

  const jaipurPlaces = [
    {
      id: "1",
      name: "Hawa Mahal (Palace of Winds)",
      category: "Palace",
      description: "Iconic 5-story honeycomb pink facade with 953 jharokhas designed for royal women to observe street festivities.",
      entryFee: "₹50 (Indians) / ₹200 (Foreigners)",
      time: "Morning (09:00 AM - 05:00 PM)",
      status: "Open",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
      reels: 1420,
    },
    {
      id: "2",
      name: "Amer Fort & Sheesh Mahal",
      category: "Fort",
      description: "Grand hilltop citadel overlooking Maota Lake with the world-renowned Mirror Palace and Diwan-e-Aam.",
      entryFee: "₹100",
      time: "Morning / Sunset",
      status: "Open",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1603204077673-83eb6d4d16fe?auto=format&fit=crop&w=800&q=80",
      reels: 2850,
    },
    {
      id: "3",
      name: "Nahargarh Fort Sunset Point",
      category: "Fort & Viewpoint",
      description: "Dramatic fortress ridge on the Aravalli Hills providing panoramic views of the entire Pink City skyline.",
      entryFee: "₹50",
      time: "Sunset (04:30 PM - 07:00 PM)",
      status: "Open",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
      reels: 1890,
    },
    {
      id: "4",
      name: "Panna Meena Ka Kund (Hidden Stepwell)",
      category: "Hidden Gem",
      description: "16th-century architectural marvel featuring symmetrical criss-cross stairs. A peaceful hidden photo spot near Amer.",
      entryFee: "Free",
      time: "07:00 AM - 06:00 PM",
      status: "Open",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
      hidden: true,
    },
  ];

  const jaipurFood = [
    {
      name: "Rawat Mishtan Bhandar",
      category: "Iconic Street Food",
      specialty: "Crispy Pyaaz Kachori & Mawa Kachori",
      rating: 4.7,
      priceForTwo: "₹350",
      address: "Station Road, Sindhi Camp",
      mustTry: ["Pyaaz Kachori", "Mirchi Vada", "Lassi"],
    },
    {
      name: "Laxmi Mishtan Bhandar (LMB)",
      category: "Royal Heritage Thali",
      specialty: "Paneer Ghevar & Authentic Dal Baati Churma",
      rating: 4.6,
      priceForTwo: "₹1,200",
      address: "Johari Bazaar, Pink City",
      mustTry: ["Rajasthani Royal Thali", "Ghevar", "Kadhi"],
    },
    {
      name: "Chokhi Dhani Cultural Village",
      category: "Cultural Village Dining",
      specialty: "Traditional Chaupal Dining with Folk Dance",
      rating: 4.7,
      priceForTwo: "₹2,200",
      address: "12 Miles Tonk Road, Jaipur",
      mustTry: ["Unlimited Rajasthani Thali", "Bajre Ki Roti + Ghee + Gur"],
    },
  ];

  const jaipurShopping = [
    {
      name: "Johari Bazaar Heritage Jewelry Quarter",
      category: "Kundan & Meenakari Jewelry",
      description: "Centuries-old royal jewelry quarter famous for authentic emeralds, rubies, Kundan polki, and Rajasthani silver ornaments.",
      specialties: ["Kundan Polki", "Meenakari Enamel", "Precious Gems"],
    },
    {
      name: "Bapu Bazaar Cultural Textiles & Mojaris",
      category: "Handicrafts, Sarees & Jootis",
      description: "Terracotta-pink corridor famed for authentic Bandhej & Leheriya sarees, Jaipuri quilts, and camel-leather footwear.",
      specialties: ["Bandhani Sarees", "Camel Leather Mojaris", "Jaipuri Razai"],
    },
  ];

  const jaipurEvents = [
    {
      name: "Jaipur Literature Festival (JLF)",
      date: "Jan 22 – 26, 2026",
      location: "Hotel Clarks Amer, Jaipur",
      description: "The world's largest free literary festival uniting global authors, poets, thinkers, and musicians.",
      tag: "Major Global Event",
    },
    {
      name: "Teej Royal Procession",
      date: "August 16 – 18, 2026",
      location: "Tripolia Gate to Chaugan Stadium",
      description: "Spectacular royal chariot parade with elephants, folk dancers, and vibrant Rajasthani cultural music.",
      tag: "Cultural Festival",
    },
  ];

  const jaipurActivities = [
    {
      name: "Sunrise Hot Air Balloon Safari",
      provider: "SkyWaltz Balloon Safaris",
      cost: "₹12,500 / person",
      duration: "3 Hours",
      difficulty: "Easy",
      description: "Glide 2,000 feet above Amer Fort and desert mountain ridges during golden hour.",
    },
    {
      name: "Nahargarh Sunrise Bicycle Expedition",
      provider: "Le Tour De India",
      cost: "₹1,800 / person",
      duration: "2.5 Hours",
      difficulty: "Moderate",
      description: "Uphill cycling through Aravalli forests to the fort ramparts with morning masala chai.",
    },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Banner */}
      <div className="relative h-[65vh] min-h-[480px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1800&q=85"
          alt="Jaipur Pink City"
          fill
          priority
          className="object-cover object-center scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent" />

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-jaipur-pink/40 bg-jaipur-pink/20 px-3.5 py-1 text-xs font-semibold text-jaipur-pink backdrop-blur-md mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Flagship Destination — Rajasthan, India
          </div>

          <h1 className="font-heading text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-3">
            Jaipur <span className="gradient-text-jaipur">Pink City</span>
          </h1>

          <p className="max-w-2xl text-base sm:text-lg text-slate-300 mb-6 leading-relaxed">
            The regal capital of forts, royal palaces, fragrant Pyaaz Kachoris, Kundan jewelry, and sunset fortress ridges. Experience India&apos;s most iconic heritage city.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href={whatsappGuideUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500 transition-all"
            >
              <MessageCircle className="h-4 w-4" />
              Connect with Jaipur Guide on WhatsApp
            </a>

            <Link
              href="/#planner"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-jaipur-pink px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 hover:opacity-95 transition-all"
            >
              <Compass className="h-4 w-4" />
              Build Jaipur AI Itinerary
            </Link>

            <div className="flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-900/60 px-4 py-2.5 text-xs text-slate-300 backdrop-blur-md">
              <Calendar className="h-4 w-4 text-brand-400" />
              <span>Best Season: Oct – March (24°C / 14°C)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="sticky top-20 z-40 border-b border-slate-800/90 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          {[
            { key: "places", label: "Forts & Places", icon: Compass },
            { key: "food", label: "Food & Stalls", icon: Utensils },
            { key: "shopping", label: "Cultural Bazaars", icon: ShoppingBag },
            { key: "events", label: "Festivals & Events", icon: Calendar },
            { key: "activities", label: "Adventure & Safaris", icon: Flame },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                  activeTab === tab.key
                    ? "bg-brand-500 text-white shadow-md shadow-brand-500/20"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Area */}
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        {/* PLACES TAB */}
        {activeTab === "places" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-2xl font-bold text-white">
                  Heritage Forts, Palaces & Hidden Stepwells
                </h2>
                <p className="text-sm text-slate-400">
                  Live verification status updated daily by our local Jaipur network
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {jaipurPlaces.map((place) => (
                <div
                  key={place.id}
                  className="glass-card-interactive overflow-hidden flex flex-col group"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={place.image}
                      alt={place.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      {place.hidden ? (
                        <span className="rounded-md bg-purple-600/90 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-sm">
                          Hidden Spot
                        </span>
                      ) : (
                        <span className="rounded-md bg-jaipur-royal/90 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-sm">
                          {place.category}
                        </span>
                      )}
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="flex items-center gap-1 rounded-md bg-emerald-500/90 px-2 py-0.5 text-[11px] font-bold text-white backdrop-blur-sm">
                        <CheckCircle2 className="h-3 w-3" />
                        {place.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-heading text-lg font-bold text-white group-hover:text-brand-400 transition-colors">
                        {place.name}
                      </h3>
                      <p className="mt-1.5 text-xs text-slate-400 line-clamp-2">
                        {place.description}
                      </p>
                    </div>

                    <div className="space-y-2 border-t border-slate-800/80 pt-3 text-xs text-slate-300">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Entry Fee:</span>
                        <span className="font-medium text-slate-200">{place.entryFee}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Best Time:</span>
                        <span className="font-medium text-slate-200">{place.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOOD TAB */}
        {activeTab === "food" && (
          <div className="space-y-6">
            <div>
              <h2 className="font-heading text-2xl font-bold text-white">
                Iconic Jaipur Eateries & Rajasthani Delicacies
              </h2>
              <p className="text-sm text-slate-400">
                Pyaaz Kachoris, royal Ghevar, and traditional Dal Baati Churma recommended by locals
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {jaipurFood.map((item, idx) => (
                <div key={idx} className="glass-card p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="rounded-md bg-brand-500/20 border border-brand-500/30 px-2 py-0.5 text-[10px] font-bold text-brand-300 uppercase">
                        {item.category}
                      </span>
                      <h3 className="font-heading text-xl font-bold text-white mt-2">
                        {item.name}
                      </h3>
                    </div>
                    <span className="rounded-lg bg-amber-500/20 px-2 py-1 text-xs font-bold text-amber-300">
                      ★ {item.rating}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-medium">{item.specialty}</p>

                  <div className="space-y-1.5 text-xs text-slate-400">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-brand-400 shrink-0" />
                      <span>{item.address}</span>
                    </p>
                    <p className="text-slate-400">Avg Cost: <span className="text-white font-semibold">{item.priceForTwo} for two</span></p>
                  </div>

                  <div className="border-t border-slate-800 pt-3">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                      Must Try Dishes:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.mustTry.map((dish, dIdx) => (
                        <span
                          key={dIdx}
                          className="rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-200"
                        >
                          {dish}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SHOPPING TAB */}
        {activeTab === "shopping" && (
          <div className="space-y-6">
            <div>
              <h2 className="font-heading text-2xl font-bold text-white">
                Centuries-Old Cultural Bazaars & Artifacts
              </h2>
              <p className="text-sm text-slate-400">
                Kundan jewellery, camel-leather jootis, Bandhej sarees, and blue pottery
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jaipurShopping.map((shop, idx) => (
                <div key={idx} className="glass-card p-6 space-y-4">
                  <span className="rounded-md bg-jaipur-pink/20 border border-jaipur-pink/30 px-2.5 py-0.5 text-[10px] font-bold text-jaipur-pink uppercase">
                    {shop.category}
                  </span>
                  <h3 className="font-heading text-2xl font-bold text-white">
                    {shop.name}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {shop.description}
                  </p>

                  <div className="border-t border-slate-800 pt-4">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                      Famous Specialties:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {shop.specialties.map((spec, sIdx) => (
                        <span
                          key={sIdx}
                          className="rounded-lg bg-slate-800 px-3 py-1 text-xs font-medium text-slate-200 border border-slate-700"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EVENTS TAB */}
        {activeTab === "events" && (
          <div className="space-y-6">
            <div>
              <h2 className="font-heading text-2xl font-bold text-white">
                Upcoming Festivals & Royal Celebrations
              </h2>
              <p className="text-sm text-slate-400">
                Plan your travel dates around Jaipur&apos;s world-famous literature and royal events
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jaipurEvents.map((evt, idx) => (
                <div key={idx} className="glass-card p-6 space-y-4 border-l-4 border-l-brand-500">
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-brand-500/20 px-2.5 py-0.5 text-[10px] font-bold text-brand-300 uppercase">
                      {evt.tag}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-brand-400 font-semibold">
                      <Calendar className="h-3.5 w-3.5" />
                      {evt.date}
                    </span>
                  </div>

                  <h3 className="font-heading text-2xl font-bold text-white">
                    {evt.name}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {evt.description}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-brand-400" />
                    <span>{evt.location}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACTIVITIES TAB */}
        {activeTab === "activities" && (
          <div className="space-y-6">
            <div>
              <h2 className="font-heading text-2xl font-bold text-white">
                Adventure Sports & Local Experiences
              </h2>
              <p className="text-sm text-slate-400">
                Hot air ballooning over hill forts and fortress cycling expeditions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jaipurActivities.map((act, idx) => (
                <div key={idx} className="glass-card p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400">
                      Operator: <strong className="text-white">{act.provider}</strong>
                    </span>
                    <span className="rounded-lg bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-300">
                      {act.cost}
                    </span>
                  </div>

                  <h3 className="font-heading text-2xl font-bold text-white">
                    {act.name}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {act.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-xs text-slate-400">
                    <span>Duration: <strong className="text-slate-200">{act.duration}</strong></span>
                    <span>Difficulty: <strong className="text-slate-200 capitalize">{act.difficulty}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* WhatsApp Help Floating Prompt at Bottom of Destination */}
      <div className="mx-auto max-w-7xl px-4 mt-16 sm:px-6 lg:px-8">
        <div className="glass-card gradient-bg-jaipur p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 border-brand-500/30 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-heading text-2xl font-bold text-white">
              Want a customized Jaipur trip plan or local guide?
            </h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Our verified local Jaipur travel coordinators can assist you instantly with hotel bookings, driver cabs, and heritage walk schedules directly on WhatsApp.
            </p>
          </div>
          <a
            href={whatsappGuideUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-4 text-base font-bold text-white shadow-xl shadow-emerald-600/30 hover:bg-emerald-500 transition-all hover:scale-105"
          >
            <MessageCircle className="h-5 w-5" />
            Chat with Jaipur Concierge
          </a>
        </div>
      </div>
    </div>
  );
}
