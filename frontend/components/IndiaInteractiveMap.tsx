"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Sparkles,
  Compass,
  Utensils,
  ShoppingBag,
  Calendar,
  Flame,
  CheckCircle2,
  AlertTriangle,
  MessageCircle,
  ArrowRight,
  ChevronRight,
  Info,
  Shield,
} from "lucide-react";

export interface DestinationData {
  id: string;
  name: string;
  state: string;
  coords: { x: number; y: number }; // SVG Map relative coordinates (0-100%)
  tagline: string;
  category: "heritage" | "food" | "adventure" | "spiritual" | "nature";
  rating: number;
  image: string;
  bestTime: string;
  topAttractions: { name: string; type: string; status: "Open" | "Temporarily Closed"; hidden?: boolean }[];
  iconicFood: { name: string; stall: string }[];
  culturalShopping: string[];
  upcomingEvent?: { name: string; date: string };
  topActivity: { name: string; cost: string };
  guidePhone: string;
  fullPageUrl?: string;
}

export const INDIA_DESTINATIONS: DestinationData[] = [
  {
    id: "jaipur",
    name: "Jaipur",
    state: "Rajasthan",
    coords: { x: 32, y: 38 },
    tagline: "The Regal Pink City of Forts, Bazaars & Royal Cuisine",
    category: "heritage",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
    bestTime: "Oct – March (24°C / 14°C)",
    topAttractions: [
      { name: "Hawa Mahal (953 Jharokhas)", type: "Palace", status: "Open" },
      { name: "Amer Fort & Sheesh Mahal", type: "Fort", status: "Open" },
      { name: "Nahargarh Sunset Point", type: "Viewpoint", status: "Open" },
      { name: "Panna Meena Stepwell", type: "Stepwell", status: "Open", hidden: true },
      { name: "Galta Ji Monkey Temple Trail", type: "Temple", status: "Temporarily Closed", hidden: true },
    ],
    iconicFood: [
      { name: "Pyaaz Kachori & Mawa Kachori", stall: "Rawat Mishtan Bhandar" },
      { name: "Paneer Ghevar & Royal Thali", stall: "Laxmi Mishtan Bhandar (LMB)" },
      { name: "Dal Baati Churma & Chaupal Food", stall: "Chokhi Dhani" },
    ],
    culturalShopping: ["Johari Bazaar (Kundan Jewelry)", "Bapu Bazaar (Bandhani & Mojaris)", "Blue Pottery Art"],
    upcomingEvent: { name: "Jaipur Literature Festival (JLF)", date: "Jan 22–26, 2026" },
    topActivity: { name: "SkyWaltz Sunrise Hot Air Balloon Safari", cost: "₹12,500" },
    guidePhone: "+919876543210",
    fullPageUrl: "/destinations/jaipur",
  },
  {
    id: "udaipur",
    name: "Udaipur",
    state: "Rajasthan",
    coords: { x: 28, y: 46 },
    tagline: "City of Lakes, Floating Palaces & Serene Ghats",
    category: "heritage",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
    bestTime: "Sept – March",
    topAttractions: [
      { name: "City Palace of Udaipur", type: "Palace", status: "Open" },
      { name: "Lake Pichola & Jag Mandir", type: "Lake & Boat", status: "Open" },
      { name: "Saheliyon Ki Bari", type: "Royal Garden", status: "Open" },
      { name: "Bahubali Hill Viewpoint", type: "Lake View", status: "Open", hidden: true },
    ],
    iconicFood: [
      { name: "Kachori & Mirchi Vada", stall: "Jain Nashta Centre" },
      { name: "Authentic Lal Maas", stall: "Tribute Restaurant" },
    ],
    culturalShopping: ["Hathi Pol (Miniature Paintings)", "Bada Bazaar (Silver Jewelry)"],
    upcomingEvent: { name: "Mewar Festival & Lake Procession", date: "March 2026" },
    topActivity: { name: "Sunset Boat Cruise on Lake Pichola", cost: "₹850" },
    guidePhone: "+919876543210",
  },
  {
    id: "jodhpur",
    name: "Jodhpur",
    state: "Rajasthan",
    coords: { x: 23, y: 41 },
    tagline: "The Sun City of Blue Houses & Imposing Mehrangarh",
    category: "heritage",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    bestTime: "Oct – March",
    topAttractions: [
      { name: "Mehrangarh Fort Ramparts", type: "Hill Fort", status: "Open" },
      { name: "Jaswant Thada Cenotaph", type: "Marble Monument", status: "Open" },
      { name: "Toorji Ka Jhalra Stepwell", type: "Historic Stepwell", status: "Open", hidden: true },
      { name: "Blue City Navchokiya Alleys", type: "Walking Quarter", status: "Open" },
    ],
    iconicFood: [
      { name: "Makhaniya Lassi", stall: "Shri Mishrilal Hotel" },
      { name: "Shahi Samosa & Mirchi Bada", stall: "Clock Tower Street" },
    ],
    culturalShopping: ["Clock Tower Market (Mathaniya Spices)", "Sojati Gate (Bandhej Sarees)"],
    upcomingEvent: { name: "Rajasthan International Folk Festival (RIFF)", date: "Oct 2026" },
    topActivity: { name: "Flying Fox Zipline across Fort battlements", cost: "₹1,950" },
    guidePhone: "+919876543210",
  },
  {
    id: "delhi",
    name: "New Delhi",
    state: "Delhi NCR",
    coords: { x: 38, y: 32 },
    tagline: "Historic Capital of Mughal Forts & Legendary Street Food",
    category: "food",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80",
    bestTime: "Oct – March",
    topAttractions: [
      { name: "Qutub Minar Complex", type: "UNESCO Monument", status: "Open" },
      { name: "Humayun's Tomb", type: "Mughal Garden Tomb", status: "Open" },
      { name: "Red Fort (Lal Qila)", type: "Imperial Citadel", status: "Open" },
      { name: "Agrasen Ki Baoli", type: "Hidden Stepwell", status: "Open", hidden: true },
    ],
    iconicFood: [
      { name: "Paranthe Wali Gali", stall: "Old Delhi Heritage Alley" },
      { name: "Natraj Dahi Bhalle & Chaat", stall: "Chandni Chowk" },
      { name: "Karim's Kebabs & Nihari", stall: "Jama Masjid" },
    ],
    culturalShopping: ["Dilli Haat (All-India Crafts)", "Janpath & Tibetan Market", "Dariba Kalan (Silver Jewelry)"],
    upcomingEvent: { name: "India Art Fair", date: "Feb 2026" },
    topActivity: { name: "Old Delhi Heritage Rickshaw & Food Trail", cost: "₹1,200" },
    guidePhone: "+919876543210",
  },
  {
    id: "goa",
    name: "Goa",
    state: "Goa",
    coords: { x: 26, y: 73 },
    tagline: "Sun-Kissed Beaches, Portuguese Quarters & Coastal Flavours",
    category: "nature",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
    bestTime: "Nov – March",
    topAttractions: [
      { name: "Fontainhas Latin Quarter", type: "Portuguese Heritage", status: "Open" },
      { name: "Aguada & Chapora Forts", type: "Sea Forts", status: "Open" },
      { name: "Dudhsagar Waterfalls", type: "Waterfall Trek", status: "Open" },
      { name: "Kakolem Secret Beach", type: "Cove Beach", status: "Open", hidden: true },
    ],
    iconicFood: [
      { name: "Goan Fish Curry & Thali", stall: "Vinayak Family Restaurant" },
      { name: "Bebinca & Poee Bread", stall: "Confeitaria 31 De Janeiro" },
    ],
    culturalShopping: ["Anjuna Flea Market", "Mapusa Spice Market", "Mario Miranda Art Souvenirs"],
    upcomingEvent: { name: "Goa Carnival & Parades", date: "Feb 2026" },
    topActivity: { name: "Scuba Diving & Island Cruise at Grande Island", cost: "₹2,500" },
    guidePhone: "+919876543210",
  },
  {
    id: "varanasi",
    name: "Varanasi",
    state: "Uttar Pradesh",
    coords: { x: 57, y: 44 },
    tagline: "Ancient Spiritual Heart of Sacred Ghats & Evening Ganga Aarti",
    category: "spiritual",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80",
    bestTime: "Oct – March",
    topAttractions: [
      { name: "Dashashwamedh Ghat Ganga Aarti", type: "Sacred Ghat", status: "Open" },
      { name: "Kashi Vishwanath Temple Corridor", type: "Holy Shrine", status: "Open" },
      { name: "Assi Ghat Morning Subah-e-Banaras", type: "Cultural Ghat", status: "Open" },
      { name: "Hidden Narrow Galis & Havelis", type: "Ancient Walk", status: "Open", hidden: true },
    ],
    iconicFood: [
      { name: "Kashi Chaat Bhandar (Tamatar Chaat)", stall: "Godowlia" },
      { name: "Blue Lassi & Malaiyyo (Winter Foam)", stall: "Manikarnika Gali" },
      { name: "Banarasi Paan", stall: "Keshav Tambool Bhandar" },
    ],
    culturalShopping: ["Pure Banarasi Silk & Zari Sarees", "Handmade Wooden Toys", "Gulabi Meenakari"],
    upcomingEvent: { name: "Dev Deepawali (Million Lit Diyas)", date: "Nov 2026" },
    topActivity: { name: "Dawn Sunrise Wooden Boat Ride along 84 Ghats", cost: "₹600" },
    guidePhone: "+919876543210",
  },
  {
    id: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    coords: { x: 26, y: 59 },
    tagline: "Maximum City of Coastal Drives, Art Deco & Street Gastronomy",
    category: "food",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80",
    bestTime: "Nov – Feb",
    topAttractions: [
      { name: "Gateway of India & Colaba Causeway", type: "Harbour Landmark", status: "Open" },
      { name: "Marine Drive Queen's Necklace", type: "Promenade", status: "Open" },
      { name: "Elephanta Caves", type: "Island Cave Temples", status: "Open" },
      { name: "Kala Ghoda Heritage Art Precinct", type: "Art District", status: "Open", hidden: true },
    ],
    iconicFood: [
      { name: "Vada Pav & Pav Bhaji", stall: "Sardar Pav Bhaji / Ashok Vada Pav" },
      { name: "Irani Bun Maska & Chai", stall: "Kyani & Co. Bakery" },
    ],
    culturalShopping: ["Colaba Causeway (Boutiques & Antiques)", "Crawford Market (Spices & Dryfruits)"],
    upcomingEvent: { name: "Kala Ghoda Arts Festival", date: "Jan 2026" },
    topActivity: { name: "South Mumbai Art Deco & Colonial Architecture Walk", cost: "₹900" },
    guidePhone: "+919876543210",
  },
  {
    id: "kochi",
    name: "Kochi & Kerala",
    state: "Kerala",
    coords: { x: 37, y: 90 },
    tagline: "God's Own Country of Backwaters, Chinese Nets & Spice Routes",
    category: "nature",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
    bestTime: "Sept – March",
    topAttractions: [
      { name: "Fort Kochi Chinese Fishing Nets", type: "Harbour Heritage", status: "Open" },
      { name: "Jew Town & Paradesi Synagogue", type: "Historic Quarter", status: "Open" },
      { name: "Alleppey Backwater Canals", type: "Houseboat Lagoons", status: "Open" },
      { name: "Kathakali & Kalaripayattu Theatre", type: "Cultural Martial Art", status: "Open" },
    ],
    iconicFood: [
      { name: "Kerala Sadhya on Banana Leaf", stall: "BTH Sarovaram" },
      { name: "Malabar Parotta & Karimeen Fry", stall: "Grand Hotel Seafood" },
    ],
    culturalShopping: ["Jew Town Antique Market", "Spice Street (Cardamom & Pepper)", "Aranmula Metal Mirror"],
    upcomingEvent: { name: "Kochi-Muziris Biennale", date: "Dec 2026" },
    topActivity: { name: "Traditional Kerala Houseboat Cruise on Vembanad Lake", cost: "₹7,500 / night" },
    guidePhone: "+919876543210",
  },
  {
    id: "manali",
    name: "Manali & Spiti",
    state: "Himachal Pradesh",
    coords: { x: 37, y: 19 },
    tagline: "Snow-Capped Himalayan Valley of Treks, Rivers & Monasteries",
    category: "adventure",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
    bestTime: "March – June & Dec – Feb",
    topAttractions: [
      { name: "Solang Valley & Atal Tunnel", type: "Adventure Valley", status: "Open" },
      { name: "Hadimba Ancient Pine Temple", type: "Wooden Temple", status: "Open" },
      { name: "Old Manali Hippie Cafes & Alleys", type: "Mountain Quarter", status: "Open" },
      { name: "Jogini Waterfall Secret Trek", type: "Nature Trail", status: "Open", hidden: true },
    ],
    iconicFood: [
      { name: "Siddu with Desi Ghee & Chutney", stall: "Local Himachali Dhaba" },
      { name: "Fresh Himalayan Trout Fish", stall: "Johnson's Cafe" },
    ],
    culturalShopping: ["Mall Road (Kullu Shawls & Caps)", "Tibetan Market (Singing Bowls)"],
    upcomingEvent: { name: "Winter Carnival Manali", date: "Jan 2026" },
    topActivity: { name: "Paragliding over Solang Valley Peaks", cost: "₹3,200" },
    guidePhone: "+919876543210",
  },
];

export const IndiaInteractiveMap: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<DestinationData>(INDIA_DESTINATIONS[0]); // Default Jaipur
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const filteredCities = INDIA_DESTINATIONS.filter(
    (c) => filterCategory === "all" || c.category === filterCategory
  );

  return (
    <div className="w-full space-y-6">
      {/* Category Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/20 text-brand-400">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-white">
              Interactive India Travel Map
            </h3>
            <p className="text-xs text-slate-400">
              Click any destination pin on the map to explore forts, food stalls, bazaars, and live place status
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[
            { id: "all", label: "All Cities" },
            { id: "heritage", label: "Forts & Heritage" },
            { id: "food", label: "Food Capitals" },
            { id: "adventure", label: "Himalayan & Adventure" },
            { id: "spiritual", label: "Spiritual Ghats" },
            { id: "nature", label: "Coast & Backwaters" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                filterCategory === cat.id
                  ? "bg-gradient-to-r from-brand-600 to-jaipur-pink text-white shadow-md shadow-brand-500/20"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Interactive Map + Intelligence Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Stylized Vector Map of India (5 Cols) */}
        <div className="lg:col-span-5 glass-card p-6 relative overflow-hidden flex flex-col items-center justify-center border-slate-800/80 shadow-2xl">
          <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-semibold text-slate-300">
              <span className="h-2 w-2 rounded-full bg-brand-500 animate-ping"></span>
              {filteredCities.length} Destinations Available
            </span>
            <span className="text-[11px] text-brand-400">Tap pin to view intel</span>
          </div>

          {/* Interactive Map Visual Stage */}
          <div className="relative w-full max-w-[420px] aspect-[4/5] bg-slate-950/60 rounded-2xl border border-slate-800/60 p-4 flex items-center justify-center overflow-hidden">
            {/* Ambient Background Grid & Compass Rose */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute top-4 right-4 text-slate-800/40 font-heading font-extrabold text-5xl select-none pointer-events-none">
              INDIA
            </div>

            {/* India Stylized SVG Silhouette */}
            <svg
              viewBox="0 0 400 500"
              className="w-full h-full drop-shadow-[0_10px_25px_rgba(249,115,22,0.1)] transition-all"
            >
              <defs>
                <linearGradient id="indiaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#151e2e" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="selectedGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#e85d75" />
                </linearGradient>
              </defs>

              {/* India Silhouette Polygon / Path */}
              <path
                d="M 130 50 
                   Q 155 30 180 50 
                   Q 195 70 190 95 
                   L 205 110 
                   L 250 115 
                   Q 290 120 310 140 
                   L 325 155 
                   Q 330 180 300 200 
                   L 280 205 
                   L 270 230 
                   L 250 250 
                   Q 240 280 220 330 
                   L 190 400 
                   Q 180 430 170 460 
                   L 165 440 
                   Q 145 370 135 320 
                   L 125 280 
                   Q 105 260 90 230 
                   L 75 220 
                   Q 65 190 90 170 
                   L 115 155 
                   L 120 120 
                   Z"
                fill="url(#indiaGradient)"
                stroke="#334155"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                className="transition-all duration-700"
              />

              {/* Coastal Wave Curves */}
              <path
                d="M 90 230 Q 125 280 165 440"
                fill="none"
                stroke="#0284c7"
                strokeWidth="1"
                strokeOpacity="0.3"
              />
              <path
                d="M 270 230 Q 220 330 170 460"
                fill="none"
                stroke="#0284c7"
                strokeWidth="1"
                strokeOpacity="0.3"
              />
            </svg>

            {/* Interactive Destination Pins placed on coordinates */}
            {filteredCities.map((city) => {
              const isSelected = selectedCity.id === city.id;
              return (
                <div
                  key={city.id}
                  style={{
                    position: "absolute",
                    left: `${city.coords.x}%`,
                    top: `${city.coords.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  className="z-20 group cursor-pointer"
                  onClick={() => setSelectedCity(city)}
                >
                  {/* Pulsing ring for selected city */}
                  {isSelected && (
                    <span className="absolute -inset-2 rounded-full bg-brand-500/40 animate-ping" />
                  )}

                  {/* Pin button */}
                  <div
                    className={`relative flex items-center justify-center rounded-full transition-all duration-300 shadow-xl ${
                      isSelected
                        ? "h-9 w-9 bg-gradient-to-tr from-brand-600 via-jaipur-pink to-amber-500 scale-125 ring-4 ring-brand-500/30"
                        : "h-6 w-6 bg-slate-800 border border-slate-600 group-hover:scale-125 group-hover:bg-brand-600"
                    }`}
                  >
                    <MapPin
                      className={`transition-colors ${
                        isSelected ? "h-5 w-5 text-white" : "h-3.5 w-3.5 text-slate-300 group-hover:text-white"
                      }`}
                    />
                  </div>

                  {/* Tooltip city name */}
                  <span
                    className={`absolute left-1/2 -bottom-6 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-bold shadow-lg transition-all ${
                      isSelected
                        ? "bg-brand-500 text-white opacity-100 scale-105"
                        : "bg-slate-900/90 text-slate-300 border border-slate-800 opacity-80 group-hover:opacity-100 group-hover:border-brand-500"
                    }`}
                  >
                    {city.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick City Buttons Carousel under the map */}
          <div className="w-full mt-5 pt-4 border-t border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 block mb-2 uppercase tracking-wider">
              Quick Select Destination:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {INDIA_DESTINATIONS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCity(c)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    selectedCity.id === c.id
                      ? "bg-jaipur-pink text-white shadow-sm"
                      : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Instant Destination Intelligence Panel (7 Cols) */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-8 space-y-6 border-slate-700/80 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header of Selected Destination */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-jaipur-pink/20 border border-jaipur-pink/30 px-2.5 py-0.5 text-[10px] font-bold text-jaipur-pink uppercase tracking-wider">
                  {selectedCity.state}
                </span>
                <span className="flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-300">
                  ★ {selectedCity.rating}
                </span>
                <span className="text-xs text-slate-400">
                  🗓️ Best Season: <strong className="text-slate-200">{selectedCity.bestTime}</strong>
                </span>
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {selectedCity.name}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                {selectedCity.tagline}
              </p>
            </div>

            {/* Quick Action CTA */}
            <div className="flex flex-col sm:items-end gap-2 shrink-0">
              {selectedCity.fullPageUrl ? (
                <Link
                  href={selectedCity.fullPageUrl}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-jaipur-pink px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-brand-500/20 hover:opacity-95 transition-all"
                >
                  <span>Explore Full {selectedCity.name} Guide</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ) : (
                <a
                  href={`https://wa.me/919876543210?text=Namaste!%20I%20am%20planning%20a%20trip%20to%20${selectedCity.name}%20and%20need%20itinerary%20and%20guide%20details.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-500 transition-all"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                  Connect with {selectedCity.name} Guide
                </a>
              )}
            </div>
          </div>

          {/* Section 1: Places & Heritage with Live Operational Status (§28 PRD) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-heading text-base font-bold text-white flex items-center gap-2">
                <Compass className="h-4 w-4 text-brand-400" />
                Top Attractions & Live Operational Status (§28)
              </h4>
              <span className="text-[11px] text-slate-400">Verified by local guides</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {selectedCity.topAttractions.map((place, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-xl bg-slate-900/80 border border-slate-800 p-3 hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-100">{place.name}</span>
                      {place.hidden && (
                        <span className="rounded bg-purple-500/20 text-purple-300 text-[9px] font-bold px-1.5 py-0.2">
                          Hidden Gem
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">{place.type}</span>
                  </div>

                  <span
                    className={`shrink-0 flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                      place.status === "Open"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {place.status === "Open" ? (
                      <CheckCircle2 className="h-2.5 w-2.5" />
                    ) : (
                      <AlertTriangle className="h-2.5 w-2.5" />
                    )}
                    {place.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Iconic Food Stalls & Cultural Bazaars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Food Stalls */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 space-y-2.5">
              <h5 className="font-heading text-sm font-bold text-amber-300 flex items-center gap-1.5">
                <Utensils className="h-3.5 w-3.5" />
                Iconic Food Stalls & Eateries
              </h5>
              <div className="space-y-2 text-xs">
                {selectedCity.iconicFood.map((f, fIdx) => (
                  <div key={fIdx} className="border-l-2 border-amber-500/40 pl-2.5 space-y-0.5">
                    <span className="font-semibold text-slate-200 block">{f.name}</span>
                    <span className="text-[11px] text-slate-400">Famous spot: {f.stall}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cultural Shopping Bazaars */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 space-y-2.5">
              <h5 className="font-heading text-sm font-bold text-jaipur-pink flex items-center gap-1.5">
                <ShoppingBag className="h-3.5 w-3.5" />
                Cultural Shopping & Artifacts
              </h5>
              <div className="space-y-2 text-xs">
                {selectedCity.culturalShopping.map((shop, sIdx) => (
                  <div key={sIdx} className="flex items-center gap-2 text-slate-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-jaipur-pink shrink-0" />
                    <span>{shop}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Upcoming Major Events & Safaris */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl bg-slate-900/90 border border-slate-800 p-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-brand-400 tracking-wider">
                Top Adventure / Safari
              </span>
              <p className="text-xs font-bold text-white">
                {selectedCity.topActivity.name} — <strong className="text-emerald-400">{selectedCity.topActivity.cost}</strong>
              </p>
            </div>

            {selectedCity.upcomingEvent && (
              <div className="text-right space-y-0.5 border-t sm:border-t-0 sm:border-l border-slate-800 sm:pl-4 pt-2 sm:pt-0">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  Major Festival Date
                </span>
                <p className="text-xs font-semibold text-slate-200">
                  {selectedCity.upcomingEvent.name} ({selectedCity.upcomingEvent.date})
                </p>
              </div>
            )}
          </div>

          {/* WhatsApp Direct Guide Link Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-emerald-400" />
              Verified Local Guide lead directly on WhatsApp
            </span>

            <a
              href={`https://wa.me/919876543210?text=Namaste!%20I%20am%20planning%20a%20trip%20to%20${selectedCity.name}%20and%20would%20like%20to%20hire%20a%20verified%20local%20guide.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600/20 border border-emerald-500/30 px-4 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-600/30 transition-all"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp for {selectedCity.name}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
