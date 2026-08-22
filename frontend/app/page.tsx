"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SplitScreenMap, MapPlace } from "@/components/SplitScreenMap";
import { AiAssistantModal } from "@/components/AiAssistantModal";
import {
  Compass,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Utensils,
  Hotel,
  ShoppingBag,
  Share2,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Users,
  Clock,
  Shield,
  Tag,
  Star,
  Search,
} from "lucide-react";

interface CityIntelligence {
  name: string;
  state: string;
  tagline: string;
  coords: { lat: number; lng: number };
  coverImage: string;
  bestTimeToVisit: string;
  weather: string;
  mapPlaces: MapPlace[];
  attractions: {
    name: string;
    category: string;
    description: string;
    status: "Open" | "Temporarily Closed";
    entryFee: string;
    timing: string;
    image: string;
    hiddenGem?: boolean;
    reelsCount?: string;
  }[];
  famousFoods: {
    name: string;
    famousEatery: string;
    specialty: string;
    priceForTwo: string;
    rating: number;
    address: string;
    mustTry: string[];
    image: string;
  }[];
  culturalShops: {
    name: string;
    bazaar: string;
    specialties: string[];
    description: string;
    priceRange: string;
    rating: number;
    image: string;
  }[];
  upcomingEvents: {
    name: string;
    dates: string;
    venue: string;
    description: string;
    tag: string;
  }[];
  activities: {
    name: string;
    provider: string;
    cost: string;
    duration: string;
    description: string;
    image: string;
  }[];
  hotels: {
    name: string;
    type: string;
    price: string;
    rating: number;
    image: string;
  }[];
}

const ALL_CITIES_INTELLIGENCE: Record<string, CityIntelligence> = {
  Jaipur: {
    name: "Jaipur",
    state: "Rajasthan",
    tagline: "The Regal Pink City of Hill Forts, Fragrant Pyaaz Kachoris & Centuries of Kundan Craftsmanship",
    coords: { lat: 26.9124, lng: 75.7873 },
    coverImage: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=80",
    bestTimeToVisit: "October to March",
    weather: "24°C / 14°C (Sunny & Pleasant)",
    mapPlaces: [
      {
        id: "1",
        name: "Hawa Mahal (Palace of Winds)",
        category: "attraction",
        lat: 26.9239,
        lng: 75.8267,
        description: "Iconic 5-story pink honeycomb palace with 953 jharokhas built in 1799.",
        rating: 4.7,
        status: "Open (09:00 AM - 05:00 PM)",
      },
      {
        id: "2",
        name: "Amer Fort & Sheesh Mahal",
        category: "attraction",
        lat: 26.9855,
        lng: 75.8513,
        description: "Grand hilltop citadel overlooking Maota Lake with Mirror Palace.",
        rating: 4.8,
        status: "Open (08:00 AM - 05:30 PM)",
      },
      {
        id: "3",
        name: "Nahargarh Fort Sunset Point",
        category: "attraction",
        lat: 26.9378,
        lng: 75.8156,
        description: "Panoramic sunset view over the Pink City skyline from Aravalli hills.",
        rating: 4.8,
        status: "Open (10:00 AM - 10:00 PM)",
      },
      {
        id: "4",
        name: "Panna Meena Ka Kund",
        category: "attraction",
        lat: 26.9897,
        lng: 75.8569,
        description: "16th-century geometric stepwell near Amer Fort. Peaceful hidden spot.",
        rating: 4.6,
        status: "Open (Free Entry)",
      },
      {
        id: "5",
        name: "Rawat Mishtan Bhandar",
        category: "food",
        lat: 26.9208,
        lng: 75.7972,
        description: "Legendary for hot crispy Pyaaz Kachoris and sweet Mawa Kachoris.",
        rating: 4.7,
        status: "Open (06:00 AM - 10:30 PM)",
      },
      {
        id: "6",
        name: "Laxmi Mishtan Bhandar (LMB)",
        category: "food",
        lat: 26.9205,
        lng: 75.8252,
        description: "Historic Johari Bazaar eatery famous for Paneer Ghevar and Royal Thali.",
        rating: 4.6,
        status: "Open (08:00 AM - 11:00 PM)",
      },
      {
        id: "7",
        name: "Chokhi Dhani Cultural Village",
        category: "food",
        lat: 26.7673,
        lng: 75.8285,
        description: "Traditional Rajasthani village experience with Chaupal thali dining.",
        rating: 4.7,
        status: "Open (05:00 PM - 11:00 PM)",
      },
      {
        id: "8",
        name: "Johari Bazaar Jewelry Quarter",
        category: "shopping",
        lat: 26.9212,
        lng: 75.8256,
        description: "World-famous jewelry bazaar for Kundan, Meenakari & precious gemstones.",
        rating: 4.8,
        status: "Open (10:30 AM - 08:30 PM)",
      },
      {
        id: "9",
        name: "Bapu Bazaar Textiles",
        category: "shopping",
        lat: 26.9189,
        lng: 75.8214,
        description: "Famous for Bandhej sarees, camel-leather mojaris & Jaipuri quilts.",
        rating: 4.6,
        status: "Open (11:00 AM - 09:00 PM)",
      },
      {
        id: "10",
        name: "Alsisar Haveli Heritage",
        category: "hotel",
        lat: 26.9234,
        lng: 75.8012,
        description: "Traditional Rajput haveli with frescoed courtyards.",
        rating: 4.8,
        status: "₹5,200 / night",
      },
    ],
    attractions: [
      {
        name: "Hawa Mahal (Palace of Winds)",
        category: "Royal Rajput Palace",
        description: "5-story terracotta-pink facade with 953 jharokhas designed for royal women to view street festivals.",
        status: "Open",
        entryFee: "₹50 (Indians) / ₹200 (Foreigners)",
        timing: "09:00 AM – 05:00 PM",
        image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80",
        reelsCount: "14.2K Reels",
      },
      {
        name: "Amer Fort & Sheesh Mahal",
        category: "Hilltop Citadel",
        description: "Majestic hilltop fort overlooking Maota Lake, world-famous for the intricate Mirror Palace (Sheesh Mahal).",
        status: "Open",
        entryFee: "₹100",
        timing: "08:00 AM – 05:30 PM",
        image: "https://images.unsplash.com/photo-1603204077673-83eb6d4d16fe?auto=format&fit=crop&w=600&q=80",
        reelsCount: "28.5K Reels",
      },
      {
        name: "Nahargarh Fort Sunset Viewpoint",
        category: "Fortress Ramparts",
        description: "Perched on the edge of the Aravalli Hills, providing the most dramatic sunset panorama over the entire Pink City.",
        status: "Open",
        entryFee: "₹50",
        timing: "10:00 AM – 10:00 PM",
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80",
        reelsCount: "18.9K Reels",
      },
      {
        name: "Panna Meena Ka Kund",
        category: "Hidden Geometric Stepwell",
        description: "16th-century architectural marvel with symmetrical zigzag steps. A peaceful hidden photo spot near Amer.",
        status: "Open",
        entryFee: "Free",
        timing: "07:00 AM – 06:00 PM",
        image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80",
        hiddenGem: true,
      },
      {
        name: "Galta Ji (Monkey Temple Mountain Pass)",
        category: "Ancient Temple Ridge",
        description: "Holy spring water kunds and mountain ridge trail. Note: Upper trail is undergoing stone restoration.",
        status: "Temporarily Closed",
        entryFee: "Free",
        timing: "05:00 AM – 09:00 PM",
        image: "https://images.unsplash.com/photo-1598890777032-bde835ba27c2?auto=format&fit=crop&w=600&q=80",
        hiddenGem: true,
      },
    ],
    famousFoods: [
      {
        name: "Famous Pyaaz Kachori & Mawa Kachori",
        famousEatery: "Rawat Mishtan Bhandar",
        specialty: "Crisp flaky crust loaded with spiced onion masala, paired with sweet tamarind chutney",
        priceForTwo: "₹350 for two",
        rating: 4.7,
        address: "Station Road, Sindhi Camp, Jaipur",
        mustTry: ["Pyaaz Kachori", "Mirchi Vada", "Mawa Kachori", "Lassi"],
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Paneer Ghevar & Royal Rajasthani Thali",
        famousEatery: "Laxmi Mishtan Bhandar (LMB)",
        specialty: "Centuries-old recipe for royal honeycomb Ghevar soaked in saffron syrup & rich Dal Baati Churma",
        priceForTwo: "₹1,200 for two",
        rating: 4.6,
        address: "Johari Bazaar, Pink City, Jaipur",
        mustTry: ["Paneer Ghevar", "Royal Thali", "Kadhi", "Ker Sangri"],
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Traditional Chaupal Dining with Ghee & Gur",
        famousEatery: "Chokhi Dhani Cultural Village",
        specialty: "Unlimited authentic village feast served on leaf platters with hot Bajre Ki Roti & garlic chutney",
        priceForTwo: "₹2,200 for two",
        rating: 4.7,
        address: "12 Miles Tonk Road, Jaipur",
        mustTry: ["Unlimited Rajasthani Thali", "Bajre Ki Roti", "Churma Trio"],
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
      },
    ],
    culturalShops: [
      {
        name: "Johari Bazaar Heritage Jewelry Quarter",
        bazaar: "Johari Bazaar Road",
        specialties: ["Kundan Polki Jewelry", "Meenakari Enamel Work", "Precious Emeralds & Rubies", "Silver Ornaments"],
        description: "World-famous gemstone and jewelry hub where royal families commissioned their finest ornaments for 200+ years.",
        priceRange: "₹₹₹",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Bapu Bazaar Cultural Textiles & Mojaris",
        bazaar: "Bapu Bazaar, Pink City",
        specialties: ["Bandhej & Leheriya Silk Sarees", "Handcrafted Camel Leather Mojaris", "Jaipuri Razai (Quilts)"],
        description: "Terracotta-pink corridor filled with authentic Rajasthani textiles, block prints, and camel leather footwear.",
        priceRange: "₹₹",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Kripal Kumbh Traditional Blue Pottery",
        bazaar: "Bani Park, Jaipur",
        specialties: ["Turquoise Blue Pottery", "Hand-painted Ceramic Plates", "Royal Glazed Vases"],
        description: "Founded by Padma Shri Kripal Singh Shekhawat, preserving Jaipur's famous quartz-based blue pottery.",
        priceRange: "₹₹",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80",
      },
    ],
    upcomingEvents: [
      {
        name: "Jaipur Literature Festival (JLF 2026)",
        dates: "January 22 – 26, 2026",
        venue: "Hotel Clarks Amer, Jaipur",
        description: "The world's greatest literary festival uniting global authors, Nobel laureates, poets, and thinkers.",
        tag: "Global Literature Event",
      },
      {
        name: "Teej Royal Procession & Fair",
        dates: "August 16 – 18, 2026",
        venue: "Tripolia Gate to Chaugan Stadium",
        description: "Magnificent royal procession of Goddess Teej with caparisoned elephants, folk dancers, and folk music.",
        tag: "Royal Cultural Festival",
      },
    ],
    activities: [
      {
        name: "SkyWaltz Sunrise Hot Air Balloon Safari",
        provider: "SkyWaltz Balloon Safaris",
        cost: "₹12,500 / person",
        duration: "3 Hours (60 mins airtime)",
        description: "Soar 2,000 feet above Amer Fort and desert mountain ridges during sunrise.",
        image: "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Nahargarh Sunrise Cycling Expedition",
        provider: "Le Tour De India",
        cost: "₹1,800 / person",
        duration: "2.5 Hours",
        description: "Early morning uphill bicycle ride through Aravalli forest to Nahargarh ramparts.",
        image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80",
      },
    ],
    hotels: [
      {
        name: "Alsisar Haveli Heritage Stay",
        type: "Heritage Rajput Haveli",
        price: "₹5,200 / night",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Zostel Jaipur (Social Hostel & Dorms)",
        type: "Backpacker Dorms & Private Rooms",
        price: "₹750 / night",
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80",
      },
    ],
  },
  Udaipur: {
    name: "Udaipur",
    state: "Rajasthan",
    tagline: "The Romantic City of Lakes, Floating Marble Palaces & Aravalli Ghats",
    coords: { lat: 24.5854, lng: 73.7125 },
    coverImage: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=80",
    bestTimeToVisit: "September to March",
    weather: "26°C / 16°C",
    mapPlaces: [
      {
        id: "u1",
        name: "City Palace of Udaipur",
        category: "attraction",
        lat: 24.5764,
        lng: 73.6835,
        description: "Enormous lakeside palace complex with crystal gallery and marble balconies.",
        rating: 4.8,
        status: "Open",
      },
      {
        id: "u2",
        name: "Lake Pichola & Jag Mandir",
        category: "attraction",
        lat: 24.5701,
        lng: 73.6798,
        description: "Scenic lake with sunset boat cruises to Jag Mandir island.",
        rating: 4.9,
        status: "Open",
      },
    ],
    attractions: [
      {
        name: "City Palace of Udaipur",
        category: "Lakeside Royal Complex",
        description: "Majestic palace with towering marble balconies overlooking Lake Pichola.",
        status: "Open",
        entryFee: "₹300",
        timing: "09:30 AM – 05:30 PM",
        image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80",
      },
    ],
    famousFoods: [
      {
        name: "Authentic Lal Maas & Lake View Dining",
        famousEatery: "Tribute Restaurant",
        specialty: "Fiery mutton curry cooked in Mathaniya red chilies",
        priceForTwo: "₹1,400 for two",
        rating: 4.7,
        address: "Fateh Sagar Lake, Udaipur",
        mustTry: ["Lal Maas", "Gatta Curry", "Safed Maas"],
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
      },
    ],
    culturalShops: [
      {
        name: "Hathi Pol Miniature Painting Bazaar",
        bazaar: "Hathi Pol, Udaipur",
        specialties: ["Mewari Miniature Paintings", "Pichwai Silk Art", "Silver Jewelry"],
        description: "Famous art bazaar where traditional artists create miniature paintings on camel bone and silk.",
        priceRange: "₹₹",
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=600&q=80",
      },
    ],
    upcomingEvents: [],
    activities: [],
    hotels: [],
  },
  Delhi: {
    name: "Delhi",
    state: "Delhi NCR",
    tagline: "The Historic Capital of Mughal Forts, Saffron Curries & Endless Bazaars",
    coords: { lat: 28.6139, lng: 77.2090 },
    coverImage: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1600&q=80",
    bestTimeToVisit: "October to March",
    weather: "22°C / 12°C",
    mapPlaces: [
      {
        id: "d1",
        name: "Qutub Minar Complex",
        category: "attraction",
        lat: 28.5245,
        lng: 77.1855,
        description: "73m high UNESCO world heritage brick minaret built in 1192.",
        rating: 4.7,
        status: "Open",
      },
    ],
    attractions: [],
    famousFoods: [],
    culturalShops: [],
    upcomingEvents: [],
    activities: [],
    hotels: [],
  },
  Goa: {
    name: "Goa",
    state: "Goa",
    tagline: "Sun-Kissed Golden Beaches, Portuguese Heritage Quarters & Spice Farms",
    coords: { lat: 15.2993, lng: 74.1240 },
    coverImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=80",
    bestTimeToVisit: "November to March",
    weather: "30°C / 22°C",
    mapPlaces: [],
    attractions: [],
    famousFoods: [],
    culturalShops: [],
    upcomingEvents: [],
    activities: [],
    hotels: [],
  },
};

export default function HomePage() {
  const [selectedCityName, setSelectedCityName] = useState<string>("Jaipur");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<"all" | "attractions" | "food" | "shops" | "events" | "activities">("all");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);

  const city = ALL_CITIES_INTELLIGENCE[selectedCityName] || ALL_CITIES_INTELLIGENCE["Jaipur"];

  const whatsappUrl = `https://wa.me/919876543210?text=Namaste!%20I%20am%20exploring%20${city.name}%20and%20need%20a%20verified%20local%20guide%20and%20food%20recommendations.`;

  return (
    <div className="h-screen w-screen flex flex-col bg-white text-slate-900 overflow-hidden font-sans">
      {/* 1. TOP GLOBAL NAVBAR */}
      <header className="h-14 shrink-0 border-b border-slate-200 bg-white px-4 flex items-center justify-between z-30 shadow-sm">
        {/* Left: Brand Logo & Tag */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 via-jaipur-pink to-amber-500 text-white shadow-sm">
              <Compass className="h-5 w-5" />
            </div>
            <span className="font-heading text-lg font-bold text-slate-900">
              Globe<span className="text-brand-600">Trotter</span>
            </span>
          </Link>

          <span className="hidden sm:inline-block rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
            India Travel Intelligence
          </span>
        </div>

        {/* Center: Selected City Switcher Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={selectedCityName}
              onChange={(e) => setSelectedCityName(e.target.value)}
              className="appearance-none rounded-xl bg-slate-100 border border-slate-300 pl-3.5 pr-8 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-200 focus:outline-none cursor-pointer"
            >
              {Object.keys(ALL_CITIES_INTELLIGENCE).map((cityName) => (
                <option key={cityName} value={cityName}>
                  📍 {cityName} ({ALL_CITIES_INTELLIGENCE[cityName].state})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
          </div>
        </div>

        {/* Right: WhatsApp Concierge & Share */}
        <div className="flex items-center gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 text-xs font-bold shadow-sm transition-all"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">WhatsApp Concierge</span>
          </a>

          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
              }
            }}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors"
            title="Share"
          >
            <Share2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      {/* 2. SPLIT WORKSPACE BODY (Left Nav + Center City Intelligence + Right Live Map) */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* A. LEFT NAVIGATION SIDEBAR */}
        {!isSidebarHidden && (
          <aside className="w-56 shrink-0 border-r border-slate-200 bg-slate-50/90 flex flex-col justify-between p-3 overflow-y-auto select-none">
            <div className="space-y-4">
              {/* ✨ AI Assistant Gradient Button */}
              <button
                onClick={() => setIsAiModalOpen(true)}
                className="w-full flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 via-jaipur-pink to-purple-600 p-3 text-white font-bold text-xs shadow-md shadow-brand-500/20 hover:opacity-95 transition-all group"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/20">
                  <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
                </div>
                <div className="text-left leading-tight">
                  <span className="block font-bold">AI Assistant</span>
                  <span className="text-[10px] text-white/80 font-normal">Ask anything about {city.name}</span>
                </div>
              </button>

              {/* Navigation Categories Filter for the City */}
              <div className="space-y-1">
                <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Explore {city.name}
                </span>

                {[
                  { id: "all", label: "Overview & All", icon: Compass },
                  { id: "attractions", label: "Forts & Palaces", icon: MapPin },
                  { id: "food", label: "Famous Food Stalls", icon: Utensils },
                  { id: "shops", label: "Cultural Bazaars", icon: ShoppingBag },
                  { id: "events", label: "Upcoming Events", icon: Calendar },
                  { id: "activities", label: "Safaris & Activities", icon: Flame },
                ].map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeCategoryFilter === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategoryFilter(cat.id as any)}
                      className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                        isActive
                          ? "bg-slate-900 text-white shadow-sm"
                          : "text-slate-700 hover:bg-slate-200/80"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}

                <div className="pt-2 border-t border-slate-200 mt-2">
                  <Link
                    href="/admin"
                    className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-amber-800 hover:bg-amber-100 transition-colors"
                  >
                    <Shield className="h-4 w-4 text-amber-600" />
                    Admin Panel
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar Bottom Controls */}
            <div className="pt-4 border-t border-slate-200 space-y-1.5 text-xs text-slate-600 font-medium">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 py-1.5 px-2 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
              >
                <MessageCircle className="h-4 w-4 text-emerald-500" />
                <span>WhatsApp Help</span>
              </a>

              <button
                onClick={() => setIsSidebarHidden(true)}
                className="w-full flex items-center gap-2 py-1.5 px-2 hover:text-slate-900 hover:bg-slate-200 rounded-lg text-slate-500"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Hide sidebar</span>
              </button>
            </div>
          </aside>
        )}

        {/* Unhide Sidebar Button when collapsed */}
        {isSidebarHidden && (
          <button
            onClick={() => setIsSidebarHidden(false)}
            className="absolute left-2 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-md border border-slate-200 text-slate-700 hover:bg-slate-100"
            title="Show Sidebar"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}

        {/* B. CENTER SCROLLABLE CITY KNOWLEDGE FEED */}
        <main className="flex-1 overflow-y-auto bg-slate-50 min-w-0">
          <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 pb-32">
            {/* 1. Hero Destination Cover Banner */}
            <div className="relative h-64 sm:h-72 w-full rounded-3xl overflow-hidden shadow-lg border border-slate-200">
              <Image
                src={city.coverImage}
                alt={city.name}
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

              {/* Floating White Destination Overview Card */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 rounded-2xl bg-white/95 backdrop-blur-md p-5 shadow-xl border border-slate-100 space-y-2 text-slate-900">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="rounded-md bg-jaipur-pink/20 text-jaipur-pink px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      {city.state}, India
                    </span>
                    <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                      {city.name}
                    </h1>
                  </div>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 text-xs font-bold shadow-md transition-all shrink-0"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Hire {city.name} Guide
                  </a>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {city.tagline}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 pt-1 border-t border-slate-100">
                  <span>🗓️ Best Time: <strong className="text-slate-800">{city.bestTimeToVisit}</strong></span>
                  <span>🌤️ Weather: <strong className="text-slate-800">{city.weather}</strong></span>
                </div>
              </div>
            </div>

            {/* 2. Live Place Status Alert Bar (§28 PRD) */}
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3 text-xs text-amber-900 shadow-sm">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold block text-sm">Live Monument Operational Status Alert (§28)</span>
                <p className="text-amber-800 leading-relaxed">
                  All major forts in {city.name} (Hawa Mahal, Amer Fort, City Palace) are <strong>Open</strong> today. Galta Ji upper mountain path has temporary restoration ongoing.
                </p>
              </div>
            </div>

            {/* 3. FAMOUS FORTS & ATTRACTIONS */}
            {(activeCategoryFilter === "all" || activeCategoryFilter === "attractions") && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Compass className="h-5 w-5 text-brand-500" />
                    Famous Forts, Palaces & Hidden Spots
                  </h3>
                  <span className="text-xs text-slate-500">{city.attractions.length} Famous Places</span>
                </div>

                <div className="space-y-4">
                  {city.attractions.map((attraction, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-brand-300 transition-all flex flex-col sm:flex-row"
                    >
                      <div className="relative h-44 sm:h-auto sm:w-56 shrink-0">
                        <Image
                          src={attraction.image}
                          alt={attraction.name}
                          fill
                          className="object-cover"
                        />
                        {attraction.hiddenGem && (
                          <span className="absolute top-3 left-3 rounded-md bg-purple-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase shadow">
                            Hidden Gem
                          </span>
                        )}
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                                {attraction.category}
                              </span>
                              <h4 className="font-heading text-lg font-bold text-slate-900">
                                {attraction.name}
                              </h4>
                            </div>

                            <span
                              className={`shrink-0 flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold ${
                                attraction.status === "Open"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                            >
                              {attraction.status === "Open" ? (
                                <CheckCircle2 className="h-3 w-3" />
                              ) : (
                                <AlertTriangle className="h-3 w-3" />
                              )}
                              {attraction.status}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                            {attraction.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                          <span>Entry: <strong className="text-slate-800">{attraction.entryFee}</strong></span>
                          <span>Timing: <strong className="text-slate-800">{attraction.timing}</strong></span>
                          {attraction.reelsCount && (
                            <span className="text-jaipur-pink font-semibold">📸 {attraction.reelsCount}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 4. FAMOUS FOODS & ICONIC EATERIES */}
            {(activeCategoryFilter === "all" || activeCategoryFilter === "food") && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-jaipur-pink" />
                    Famous Foods & Iconic Eateries in {city.name}
                  </h3>
                  <span className="text-xs text-slate-500">Legendary Taste</span>
                </div>

                <div className="space-y-4">
                  {city.famousFoods.map((food, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-jaipur-pink transition-all flex flex-col sm:flex-row"
                    >
                      <div className="relative h-44 sm:h-auto sm:w-56 shrink-0">
                        <Image
                          src={food.image}
                          alt={food.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[11px] font-bold text-jaipur-pink uppercase tracking-wider block">
                                {food.famousEatery}
                              </span>
                              <h4 className="font-heading text-lg font-bold text-slate-900">
                                {food.name}
                              </h4>
                            </div>

                            <span className="rounded-lg bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700 border border-amber-200">
                              ★ {food.rating}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {food.specialty}
                          </p>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500">
                            <span>📍 {food.address}</span>
                            <span className="font-bold text-slate-800">{food.priceForTwo}</span>
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            {food.mustTry.map((dish, dIdx) => (
                              <span
                                key={dIdx}
                                className="rounded-md bg-slate-100 text-slate-700 px-2 py-0.5 text-[11px] font-semibold"
                              >
                                {dish}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 5. CULTURAL SHOPS & BAZAARS */}
            {(activeCategoryFilter === "all" || activeCategoryFilter === "shops") && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-xl font-bold text-slate-900 flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-purple-600" />
                    Centuries-Old Cultural Shops & Bazaars
                  </h3>
                  <span className="text-xs text-slate-500">Authentic Heritage Crafts</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {city.culturalShops.map((shop, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                          {shop.bazaar}
                        </span>
                        <h4 className="font-heading text-lg font-bold text-slate-900">
                          {shop.name}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {shop.description}
                        </p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                          Famous Specialties:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {shop.specialties.map((spec, sIdx) => (
                            <span
                              key={sIdx}
                              className="rounded-md bg-slate-100 text-slate-800 px-2.5 py-1 text-[11px] font-semibold border border-slate-200"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 6. UPCOMING EVENTS & FESTIVALS */}
            {(activeCategoryFilter === "all" || activeCategoryFilter === "events") && city.upcomingEvents.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-amber-600" />
                    Major Upcoming Events & Festivals in {city.name}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {city.upcomingEvents.map((evt, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl bg-white border-l-4 border-l-brand-500 border border-slate-200 p-5 shadow-sm space-y-2.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="rounded-md bg-brand-50 text-brand-700 px-2 py-0.5 font-bold uppercase">
                          {evt.tag}
                        </span>
                        <span className="font-bold text-brand-600">{evt.dates}</span>
                      </div>

                      <h4 className="font-heading text-lg font-bold text-slate-900">
                        {evt.name}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {evt.description}
                      </p>
                      <p className="text-xs text-slate-500 font-semibold">📍 {evt.venue}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 7. ADVENTURE & SAFARIS */}
            {(activeCategoryFilter === "all" || activeCategoryFilter === "activities") && city.activities.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Flame className="h-5 w-5 text-brand-600" />
                    Adventure Sports & Safaris in {city.name}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {city.activities.map((act, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="relative h-40 w-full">
                        <Image
                          src={act.image}
                          alt={act.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-3 right-3 rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white shadow">
                          {act.cost}
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <span className="text-[11px] font-semibold text-slate-500 block">
                          Operator: {act.provider}
                        </span>
                        <h4 className="font-heading text-base font-bold text-slate-900">
                          {act.name}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-2">
                          {act.description}
                        </p>
                        <p className="text-xs text-slate-500 font-semibold pt-1 border-t border-slate-100">
                          ⏱️ Duration: {act.duration}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 8. WhatsApp Local Concierge Banner */}
            <div className="rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-900 p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold">
                  <MessageCircle className="h-3.5 w-3.5" />
                  Live Local Concierge
                </div>
                <h4 className="font-heading text-2xl font-bold">
                  Want to hire a verified local guide in {city.name}?
                </h4>
                <p className="text-xs text-white/80 max-w-md leading-relaxed">
                  Connect with verified coordinators on WhatsApp for driver cabs, haveli bookings, and heritage walk schedules.
                </p>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-2 rounded-2xl bg-white text-emerald-900 hover:bg-slate-100 px-6 py-3.5 text-sm font-bold shadow-lg transition-all"
              >
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </main>

        {/* C. RIGHT COLUMN: FULL-HEIGHT SPLIT-SCREEN MAP VIEW */}
        <div className="hidden md:block w-1/2 shrink-0 h-full border-l border-slate-200 relative">
          <SplitScreenMap
            selectedCity={city.name}
            cityCoords={city.coords}
            places={city.mapPlaces}
          />
        </div>
      </div>

      {/* Floating AI Assistant Bubble (Bottom Right Trigger) */}
      <button
        onClick={() => setIsAiModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-brand-600 via-jaipur-pink to-purple-600 text-white shadow-2xl shadow-brand-500/40 hover:scale-110 transition-transform"
        title="Open AI Virtual Tourist Guide"
      >
        <Sparkles className="h-6 w-6 text-amber-300 animate-spin-slow" />
      </button>

      {/* AI Assistant Chat Modal */}
      <AiAssistantModal
        currentCity={city.name}
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
}
