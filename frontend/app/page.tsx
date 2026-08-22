"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { SplitScreenMap, MapPlace } from "@/components/SplitScreenMap";
import { AiAssistantModal } from "@/components/AiAssistantModal";
import { TripPlannerModal } from "@/components/TripPlannerModal";
import { TransportRentalModal } from "@/components/TransportRentalModal";
import { TripMemoriesModal } from "@/components/TripMemoriesModal";
import { CoTravelerModal } from "@/components/CoTravelerModal";
import { useAuth } from "@/context/AuthContext";
import {
  searchIndianLocations,
  getDynamicIntelligenceForLocation,
  DynamicLocationData,
} from "@/lib/dynamic-location-service";
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
  Clock,
  Shield,
  Star,
  Search,
  ExternalLink,
  Navigation,
  Sun,
  Ticket,
  Eye,
  X,
  Loader2,
  Camera,
  Layers,
  Car,
  Users,
} from "lucide-react";

// Exhaustive, Deeply Researched Jaipur Dataset (Every Iconic Place, Fort, Food Stall, and Bazaar)
const EXHAUSTIVE_JAIPUR_DATA: DynamicLocationData = {
  name: "Jaipur",
  state: "Rajasthan",
  district: "Jaipur District",
  type: "UNESCO World Heritage City",
  tagline: "The Regal Pink City of 18 Majestic Forts, Fragrant Pyaaz Kachoris, Blue Pottery & Centuries of Royal Craftsmanship",
  description:
    "Founded in 1727 by Maharaja Sawai Jai Singh II, Jaipur is India's first planned city, globally celebrated for its grid layout, terracotta pink colonnaded avenues, UNESCO World Heritage hill citadels, and master craftsmanship spanning Kundan jewelry to blue pottery.",
  coords: { lat: 26.9124, lng: 75.7873 },
  coverImage: "https://images.unsplash.com/photo-1603204077673-83eb6d4d16fe?auto=format&fit=crop&w=1600&q=80",
  bestTimeToVisit: "October to March",
  weather: "24°C (Sunny & Pleasant)",
  mapPlaces: [
    {
      id: "attr-1",
      name: "Hawa Mahal",
      hindiName: "हवा महल (Palace of Winds)",
      category: "attraction",
      lat: 26.9239,
      lng: 75.8267,
      description: "Iconic 5-story pink honeycomb palace with 953 jharokhas built in 1799 by Maharaja Sawai Pratap Singh.",
      image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
      rating: 4.7,
      reviewsCount: "18,400+ Reviews",
      status: "Open (09:00 AM - 05:00 PM)",
      entryFee: "₹50 (Indians) · ₹200 (Foreigners)",
      timing: "09:00 AM – 05:00 PM",
      address: "Hawa Mahal Rd, Badi Choupad, Pink City, Jaipur",
      specialties: ["953 Latticed Jharokhas", "Wind Palace Architecture", "Rooftop Views"],
    },
    {
      id: "attr-2",
      name: "Amer Fort & Sheesh Mahal",
      hindiName: "आमेर का किला (Amber Citadel)",
      category: "attraction",
      lat: 26.9855,
      lng: 75.8513,
      description: "Grand hilltop sandstone citadel overlooking Maota Lake with the world-famous Sheesh Mahal (Mirror Palace).",
      image: "https://images.unsplash.com/photo-1603204077673-83eb6d4d16fe?auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      reviewsCount: "32,900+ Reviews",
      status: "Open (08:00 AM - 05:30 PM)",
      entryFee: "₹100 (Indians) · ₹550 (Foreigners)",
      timing: "08:00 AM – 05:30 PM",
      address: "Devisinghpura, Amer, Jaipur",
      specialties: ["Sheesh Mahal (Mirror Palace)", "Maota Lake View", "Ganesh Pol Gate"],
    },
    {
      id: "attr-3",
      name: "Jaigarh Fort (Jaivana Cannon)",
      hindiName: "जयगढ़ किला (विश्व की सबसे बड़ी तोप)",
      category: "attraction",
      lat: 26.9850,
      lng: 75.8450,
      description: "Formidable fortress housing the Jaivana Cannon — the world's largest cannon on wheels, and secret subterranean passages connecting to Amer Fort.",
      image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
      rating: 4.7,
      reviewsCount: "16,800+ Reviews",
      status: "Open (09:00 AM - 05:00 PM)",
      entryFee: "₹70 (Indians) · ₹150 (Foreigners)",
      timing: "09:00 AM – 05:00 PM",
      address: "Cheel ka Teela, Amer, Jaipur",
      specialties: ["Jaivana Giant Cannon", "Subterranean Escape Tunnels", "Aravalli Defense Ramparts"],
    },
    {
      id: "attr-4",
      name: "Nahargarh Fort Sunset Point",
      hindiName: "नाहरगढ़ फोर्ट (Sunset Point)",
      category: "attraction",
      lat: 26.9378,
      lng: 75.8156,
      description: "Dramatic hilltop fortress atop the Aravalli hills with sweeping sunset panorama over the entire Pink City skyline.",
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      reviewsCount: "14,800+ Reviews",
      status: "Open (10:00 AM - 10:00 PM)",
      entryFee: "₹50 (Indians) · ₹200 (Foreigners)",
      timing: "10:00 AM – 10:00 PM",
      address: "Krishna Nagar, Brahampuri, Jaipur",
      specialties: ["Sunset Ridge Ramparts", "Madhavendra Bhawan", "City Skyline Night View"],
    },
    {
      id: "attr-5",
      name: "City Palace of Jaipur",
      hindiName: "सिटी पैलेस (Chandra Mahal)",
      category: "attraction",
      lat: 26.9258,
      lng: 75.8236,
      description: "Opulent royal residence of the Maharaja of Jaipur, featuring the Peacock Courtyard (Pritam Niwas Chowk) and museum.",
      image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
      rating: 4.7,
      reviewsCount: "26,400+ Reviews",
      status: "Open (09:30 AM - 05:00 PM)",
      entryFee: "₹200 (Indians) · ₹700 (Foreigners)",
      timing: "09:30 AM – 05:00 PM",
      address: "Jaleb Chowk, Near Jantar Mantar, Jaipur",
      specialties: ["Peacock Gate Courtyard", "Silver Urns (Gangajali)", "Royal Carriage Museum"],
    },
    {
      id: "attr-6",
      name: "Jantar Mantar Observatory",
      hindiName: "जंतर मंतर (UNESCO Observatory)",
      category: "attraction",
      lat: 26.9248,
      lng: 75.8246,
      description: "UNESCO World Heritage stone observatory featuring 19 architectural astronomical instruments and the world's largest stone sundial (Samrat Yantra).",
      image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
      rating: 4.7,
      reviewsCount: "21,500+ Reviews",
      status: "Open (09:00 AM - 04:30 PM)",
      entryFee: "₹50 (Indians) · ₹200 (Foreigners)",
      timing: "09:00 AM – 04:30 PM",
      address: "Gangori Bazaar, J.D.A. Market, Jaipur",
      specialties: ["Giant Samrat Yantra Sundial", "Astrological Instruments", "Astronomical Calculations"],
    },
    {
      id: "attr-7",
      name: "Jal Mahal (Water Palace)",
      hindiName: "जल महल (Floating Palace)",
      category: "attraction",
      lat: 26.9656,
      lng: 75.8456,
      description: "Captivating 5-story palace floating in the center of Man Sagar Lake, with 4 submerged floors and Rajput Mughal architecture.",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      rating: 4.6,
      reviewsCount: "19,000+ Reviews",
      status: "Open (Promenade View 24 Hours)",
      entryFee: "Free Viewing Promenade",
      timing: "24 Hours (Evening Lighting at 07:00 PM)",
      address: "Amer Road, Man Sagar Lake, Jaipur",
      specialties: ["Lake Promenade Walk", "Night Illumination", "Migratory Bird Watching"],
    },
    {
      id: "attr-8",
      name: "Panna Meena Ka Kund",
      hindiName: "पन्ना मीना का कुंड (Stepwell)",
      category: "attraction",
      lat: 26.9897,
      lng: 75.8569,
      description: "16th-century geometric stepwell with interlocking criss-cross staircases creating optical illusions. Peaceful hidden spot.",
      image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
      rating: 4.6,
      reviewsCount: "3,200+ Reviews",
      status: "Open (Free Entry)",
      entryFee: "Free Public Entry",
      timing: "07:00 AM – 06:00 PM",
      address: "Near Amer Fort, Jaipur",
      specialties: ["Symmetrical Geometry", "Hidden Heritage", "Photography Spot"],
    },
    {
      id: "attr-9",
      name: "Albert Hall Museum",
      hindiName: "अल्बर्ट हॉल संग्रहालय",
      category: "attraction",
      lat: 26.9116,
      lng: 75.8195,
      description: "Oldest museum of Rajasthan in Ram Niwas Garden, displaying rare miniature paintings, Persian carpets, Egyptian mummy, and dazzling night lights.",
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
      rating: 4.7,
      reviewsCount: "25,300+ Reviews",
      status: "Open (09:00 AM - 05:00 PM & Night 07:00 PM - 10:00 PM)",
      entryFee: "₹40 (Indians) · ₹300 (Foreigners)",
      timing: "09:00 AM – 05:00 PM & 07:00 PM – 10:00 PM",
      address: "Ram Niwas Garden, Kailash Puri, Jaipur",
      specialties: ["Indo-Saracenic Architecture", "Ptolemaic Egyptian Mummy", "Vibrant Night Illumination"],
    },
    {
      id: "attr-10",
      name: "Patrika Gate (Jawahar Circle)",
      hindiName: "पत्रिका गेट (Jawahar Circle)",
      category: "attraction",
      lat: 26.8378,
      lng: 75.7958,
      description: "Magnificent hand-painted rainbow gateway showcasing royal architectural murals and history of all regions of Rajasthan.",
      image: "https://images.unsplash.com/photo-1603204077673-83eb6d4d16fe?auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      reviewsCount: "17,200+ Reviews",
      status: "Open (24 Hours)",
      entryFee: "Free Entry",
      timing: "Open 24 Hours",
      address: "Jawahar Circle, Malviya Nagar, Jaipur",
      specialties: ["Hand-Painted Murals", "Musical Fountain Show", "Vibrant Photography Corridor"],
    },
    {
      id: "attr-11",
      name: "Gatore Ki Chhatriyan",
      hindiName: "गैटोर की छतरियां (Royal Cenotaphs)",
      category: "attraction",
      lat: 26.9421,
      lng: 75.8289,
      description: "Intricately sculpted white marble cenotaphs of Kachwaha Rajput kings nestled in a peaceful valley below Nahargarh hill.",
      image: "https://images.unsplash.com/photo-1598890777032-bde835ba27c2?auto=format&fit=crop&w=800&q=80",
      rating: 4.7,
      reviewsCount: "4,800+ Reviews",
      status: "Open (09:00 AM - 05:00 PM)",
      entryFee: "₹30 (Indians) · ₹100 (Foreigners)",
      timing: "09:00 AM – 05:00 PM",
      address: "Brahampuri, Jaipur",
      specialties: ["Intricate Marble Carvings", "Royal Cenotaphs", "Tranquil Valley Atmosphere"],
    },
    {
      id: "attr-12",
      name: "Galta Ji (Monkey Temple Trail)",
      hindiName: "गलता जी (पवित्र कुंड एवं मंदिर)",
      category: "attraction",
      lat: 26.9167,
      lng: 75.8600,
      description: "Sacred spring water kunds, pavilions, and temple complex built into a mountain pass in the Aravalli range.",
      image: "https://images.unsplash.com/photo-1598890777032-bde835ba27c2?auto=format&fit=crop&w=800&q=80",
      rating: 4.5,
      reviewsCount: "9,200+ Reviews",
      status: "Open (05:00 AM - 08:30 PM)",
      entryFee: "Free Entry",
      timing: "05:00 AM – 08:30 PM",
      address: "Galtaji Pass, Khania-Balaji, Jaipur",
      specialties: ["Holy Spring Water Pavilions", "Aravalli Mountain Ridge", "Ancient Spiritual Shrines"],
    },
    {
      id: "food-1",
      name: "Rawat Mishtan Bhandar",
      hindiName: "रावत मिष्ठान भंडार (Pyaaz Kachori)",
      category: "food",
      lat: 26.9208,
      lng: 75.7972,
      description: "World-famous legendary sweet & snack house renowned across India for hot, crispy Pyaaz Kachoris and sweet Mawa Kachoris.",
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
      rating: 4.7,
      reviewsCount: "42,000+ Reviews",
      status: "Open (06:00 AM - 10:30 PM)",
      entryFee: "₹350 for two (Avg Cost)",
      timing: "06:00 AM – 10:30 PM",
      address: "Station Road, Sindhi Camp, Jaipur",
      specialties: ["Crisp Pyaaz Kachori", "Mirchi Vada", "Sweet Mawa Kachori", "Lassi"],
    },
    {
      id: "food-2",
      name: "Laxmi Mishtan Bhandar (LMB)",
      hindiName: "एल.एम.बी. जोहरी बाजार (Paneer Ghevar)",
      category: "food",
      lat: 26.9205,
      lng: 75.8252,
      description: "Historic Johari Bazaar sweet institution dating to 1727, famous for authentic honeycomb Paneer Ghevar and Royal Rajasthani Thali.",
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
      rating: 4.6,
      reviewsCount: "28,500+ Reviews",
      status: "Open (08:00 AM - 11:00 PM)",
      entryFee: "₹1,200 for two",
      timing: "08:00 AM – 11:00 PM",
      address: "Johari Bazaar, Pink City, Jaipur",
      specialties: ["Paneer Ghevar", "Royal Rajasthani Thali", "Dal Baati Churma"],
    },
    {
      id: "food-3",
      name: "Gulab Ji Chai Wale",
      hindiName: "गुलाब जी चाय वाले (Bun Maska)",
      category: "food",
      lat: 26.9172,
      lng: 75.8124,
      description: "Legendary tea stall operational since 1946, celebrated for secret recipe spiced masala chai and toasted bun maska.",
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      reviewsCount: "16,400+ Reviews",
      status: "Open (05:30 AM - 09:30 PM)",
      entryFee: "₹100 for two",
      timing: "05:30 AM – 09:30 PM",
      address: "MI Road & Sindhi Camp, Jaipur",
      specialties: ["Special Masala Chai", "Hot Bun Maska", "Maska Mathri"],
    },
    {
      id: "food-4",
      name: "Lassiwala (Shop 312 Kishan Lal)",
      hindiName: "लस्सीवाला (MI Road Original)",
      category: "food",
      lat: 26.9178,
      lng: 75.8118,
      description: "Original clay kulhad lassi shop since 1944, serving thick churned yogurt lassi crowned with a rich layer of clotted malai cream.",
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      reviewsCount: "24,800+ Reviews",
      status: "Open (07:00 AM - 04:00 PM or until stock lasts)",
      entryFee: "₹160 for two",
      timing: "07:00 AM – 04:00 PM",
      address: "Shop 312, MI Road, Jaipur",
      specialties: ["Thick Kulhad Sweet Lassi", "Salted Lassi", "Malai Layer"],
    },
    {
      id: "shop-1",
      name: "Johari Bazaar (Jewelry Quarter)",
      hindiName: "जौहरी बाज़ार (Kundan & Polki)",
      category: "shopping",
      lat: 26.9212,
      lng: 75.8256,
      description: "World-renowned gemstone and jewelry market where master artisans craft Kundan Polki and Meenakari ornaments.",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      reviewsCount: "12,400+ Reviews",
      status: "Open (10:30 AM - 08:30 PM)",
      entryFee: "Free Entry (Shopping Hub)",
      timing: "10:30 AM – 08:30 PM",
      address: "Johari Bazaar Road, Pink City, Jaipur",
      specialties: ["Kundan Polki Jewelry", "Meenakari Enamel", "Precious Emeralds"],
    },
    {
      id: "shop-2",
      name: "Bapu Bazaar (Textiles & Mojaris)",
      hindiName: "बापू बाज़ार (Bandhej & Quilts)",
      category: "shopping",
      lat: 26.9189,
      lng: 75.8214,
      description: "Famous terracotta-pink market corridor for colorful Bandhani and Leheriya sarees, handcrafted camel leather mojaris, and Jaipuri quilts.",
      image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=800&q=80",
      rating: 4.6,
      reviewsCount: "19,200+ Reviews",
      status: "Open (11:00 AM - 09:00 PM)",
      entryFee: "Free Entry (Shopping Hub)",
      timing: "11:00 AM – 09:00 PM",
      address: "Bapu Bazaar, Pink City, Jaipur",
      specialties: ["Bandhej Silk Sarees", "Camel Leather Mojaris", "Jaipuri Quilts"],
    },
  ],
  attractions: [
    {
      id: "attr-1",
      name: "Hawa Mahal",
      subName: "Palace of Winds",
      category: "Royal Rajput Palace",
      description: "A breathtaking 5-story pink honeycomb facade with 953 intricate jharokhas built in 1799 by Maharaja Sawai Pratap Singh so royal women could observe street festivals.",
      status: "Open",
      statusDetail: "Closes at 5:00 PM",
      entryFee: "₹50 (Indians) · ₹200 (Foreigners)",
      timing: "09:00 AM – 05:00 PM",
      image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
      reelsCount: "14.2K Reels",
      rating: 4.7,
      reviewsCount: "18,400+ reviews",
      address: "Hawa Mahal Rd, Badi Choupad, Pink City",
    },
    {
      id: "attr-2",
      name: "Amer Fort & Sheesh Mahal",
      subName: "Amber Citadel",
      category: "UNESCO World Heritage Site",
      description: "Majestic yellow sandstone citadel perched high on the Aravalli hills overlooking Maota Lake, famous for the opulent Sheesh Mahal (Mirror Palace) and Diwan-e-Aam.",
      status: "Open",
      statusDetail: "Closes at 5:30 PM",
      entryFee: "₹100 (Indians) · ₹550 (Foreigners)",
      timing: "08:00 AM – 05:30 PM",
      image: "https://images.unsplash.com/photo-1603204077673-83eb6d4d16fe?auto=format&fit=crop&w=800&q=80",
      reelsCount: "28.5K Reels",
      rating: 4.8,
      reviewsCount: "32,900+ reviews",
      address: "Devisinghpura, Amer, Jaipur",
    },
    {
      id: "attr-3",
      name: "Jaigarh Fort",
      subName: "Victory Fort & Giant Jaivana Cannon",
      category: "Formidable Military Citadel",
      description: "Massive defense citadel overlooking Amer Fort, housing Jaivana — the world's largest cannon on wheels, royal armory, and secret escape tunnels.",
      status: "Open",
      statusDetail: "Closes at 5:00 PM",
      entryFee: "₹70 (Indians) · ₹150 (Foreigners)",
      timing: "09:00 AM – 05:00 PM",
      image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
      reelsCount: "12.4K Reels",
      rating: 4.7,
      reviewsCount: "16,800+ reviews",
      address: "Cheel ka Teela, Amer, Jaipur",
    },
    {
      id: "attr-4",
      name: "Nahargarh Fort",
      subName: "Sunset Ridge Viewpoint",
      category: "Fortress Ramparts",
      description: "Perched dramatically on the highest ridge of the Aravalli hills, Nahargarh once formed a formidable defensive ring around Jaipur. World-famous today for the city's most spectacular golden hour sunset.",
      status: "Open",
      statusDetail: "Open till 10:00 PM",
      entryFee: "₹50 (Indians) · ₹200 (Foreigners)",
      timing: "10:00 AM – 10:00 PM",
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
      reelsCount: "19.1K Reels",
      rating: 4.8,
      reviewsCount: "14,800+ reviews",
      address: "Krishna Nagar, Brahampuri, Jaipur",
    },
    {
      id: "attr-5",
      name: "City Palace of Jaipur",
      subName: "Royal Court & Chandra Mahal",
      category: "Royal Rajput Residence",
      description: "The grand seat of the Maharaja of Jaipur, showcasing the iconic Peacock Gate courtyard, Pritam Niwas Chowk, and the world's largest sterling silver vessels.",
      status: "Open",
      statusDetail: "Closes at 5:00 PM",
      entryFee: "₹200 (Indians) · ₹700 (Foreigners)",
      timing: "09:30 AM – 05:00 PM",
      image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
      reelsCount: "22.8K Reels",
      rating: 4.7,
      reviewsCount: "26,400+ reviews",
      address: "Jaleb Chowk, Pink City, Jaipur",
    },
    {
      id: "attr-6",
      name: "Jantar Mantar",
      subName: "World's Largest Stone Observatory",
      category: "UNESCO World Heritage Site",
      description: "Collection of 19 architectural astronomical instruments built by Sawai Jai Singh II, featuring the world's largest sundial that calculates local solar time to an accuracy of two seconds.",
      status: "Open",
      statusDetail: "Closes at 4:30 PM",
      entryFee: "₹50 (Indians) · ₹200 (Foreigners)",
      timing: "09:00 AM – 04:30 PM",
      image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
      reelsCount: "15.6K Reels",
      rating: 4.7,
      reviewsCount: "21,500+ reviews",
      address: "Near City Palace, Jaipur",
    },
    {
      id: "attr-7",
      name: "Jal Mahal (Water Palace)",
      subName: "Man Sagar Lake Palace",
      category: "Floating Lake Marvel",
      description: "Enchanting 5-story palace floating in the center of Man Sagar Lake, featuring red sandstone architecture and scenic evening lake promenades.",
      status: "Open",
      statusDetail: "Open 24 Hours Promenade",
      entryFee: "Free Viewing Promenade",
      timing: "24 Hours (Night Illumination 07:00 PM)",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      reelsCount: "31.2K Reels",
      rating: 4.6,
      reviewsCount: "19,000+ reviews",
      address: "Amer Road, Man Sagar Lake, Jaipur",
    },
    {
      id: "attr-8",
      name: "Panna Meena Ka Kund",
      subName: "16th-Century Symmetrical Stepwell",
      category: "Hidden Heritage Marvel",
      description: "An extraordinary 16th-century architectural stepwell featuring geometric, criss-cross stairs that create mesmerizing optical illusions. An extraordinarily peaceful hidden spot located minutes from Amer Fort.",
      status: "Open",
      statusDetail: "Free Public Access",
      entryFee: "Free Entry",
      timing: "07:00 AM – 06:00 PM",
      image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
      hiddenGem: true,
      rating: 4.6,
      reviewsCount: "3,200+ reviews",
      address: "Near Amer Fort, Jaipur",
    },
    {
      id: "attr-9",
      name: "Albert Hall Museum",
      subName: "Central Museum in Ram Niwas Garden",
      category: "Indo-Saracenic Palace Museum",
      description: "Built in 1876 for the visit of the Prince of Wales, displaying a magnificent collection of miniature paintings, Persian carpets, Egyptian mummy, and dazzling night lights.",
      status: "Open",
      statusDetail: "Open Day & Night",
      entryFee: "₹40 (Indians) · ₹300 (Foreigners)",
      timing: "09:00 AM – 05:00 PM & 07:00 PM – 10:00 PM",
      image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
      rating: 4.7,
      reviewsCount: "25,300+ reviews",
      address: "Ram Niwas Garden, Jaipur",
    },
    {
      id: "attr-10",
      name: "Patrika Gate",
      subName: "Jawahar Circle Rainbow Corridor",
      category: "Modern Architectural Masterpiece",
      description: "Stunning hand-painted rainbow gateway where each pillar depicts the rich culture, forts, and miniature art of all regions of Rajasthan.",
      status: "Open",
      statusDetail: "Open 24 Hours",
      entryFee: "Free Public Entry",
      timing: "Open 24 Hours",
      image: "https://images.unsplash.com/photo-1603204077673-83eb6d4d16fe?auto=format&fit=crop&w=800&q=80",
      reelsCount: "48.9K Reels",
      rating: 4.8,
      reviewsCount: "17,200+ reviews",
      address: "Jawahar Circle, Malviya Nagar, Jaipur",
    },
    {
      id: "attr-11",
      name: "Gatore Ki Chhatriyan",
      subName: "Royal Rajput Cenotaphs",
      category: "Hidden Marble Heritage",
      description: "Intricately carved white marble cenotaphs commemorating the Kachwaha Rajput rulers, secluded in a serene valley at the base of Nahargarh hill.",
      status: "Open",
      statusDetail: "Closes at 5:00 PM",
      entryFee: "₹30 (Indians) · ₹100 (Foreigners)",
      timing: "09:00 AM – 05:00 PM",
      image: "https://images.unsplash.com/photo-1598890777032-bde835ba27c2?auto=format&fit=crop&w=800&q=80",
      hiddenGem: true,
      rating: 4.7,
      reviewsCount: "4,800+ reviews",
      address: "Brahampuri, Jaipur",
    },
    {
      id: "attr-12",
      name: "Galta Ji (Monkey Temple)",
      subName: "Holy Spring Water Pavilions",
      category: "Ancient Mountain Pass Shrines",
      description: "Sacred spring water kunds and ancient temples built into a natural mountain ravine in the Aravalli hills, inhabited by playful rhesus macaques.",
      status: "Open",
      statusDetail: "Open Daily",
      entryFee: "Free Public Entry",
      timing: "05:00 AM – 08:30 PM",
      image: "https://images.unsplash.com/photo-1598890777032-bde835ba27c2?auto=format&fit=crop&w=800&q=80",
      hiddenGem: true,
      rating: 4.5,
      reviewsCount: "9,200+ reviews",
      address: "Galtaji Pass, Jaipur",
    },
  ],
  famousFoods: [
    {
      id: "food-1",
      name: "Pyaaz Kachori & Mawa Kachori",
      famousEatery: "Rawat Mishtan Bhandar",
      specialty: "Golden flaky pastry stuffed with richly spiced caramelized onions, served steaming hot with tangy tamarind and mint chutney.",
      priceForTwo: "₹350 for two",
      rating: 4.7,
      address: "Station Road, Sindhi Camp, Jaipur",
      timing: "06:00 AM – 10:30 PM",
      mustTry: ["Hot Pyaaz Kachori", "Mirchi Vada", "Sweet Mawa Kachori", "Kulhad Lassi"],
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "food-2",
      name: "Paneer Ghevar & Royal Thali",
      famousEatery: "Laxmi Mishtan Bhandar (LMB)",
      specialty: "Historic sweet shop dating to 1727, legendary for its melt-in-mouth honeycomb saffron Ghevar and authentic Royal Rajasthani Dal Baati Churma.",
      priceForTwo: "₹1,200 for two",
      rating: 4.6,
      address: "Johari Bazaar, Pink City, Jaipur",
      timing: "08:00 AM – 11:00 PM",
      mustTry: ["Paneer Ghevar", "Royal Rajasthani Thali", "Ker Sangri", "Rajbhog"],
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "food-3",
      name: "Special Masala Chai & Bun Maska",
      famousEatery: "Gulab Ji Chai Wale",
      specialty: "Legendary masala chai brewed with fresh herbs, ginger, and cardamom, served with fresh buttered pav bun since 1946.",
      priceForTwo: "₹100 for two",
      rating: 4.8,
      address: "MI Road & Sindhi Camp, Jaipur",
      timing: "05:30 AM – 09:30 PM",
      mustTry: ["Masala Chai in Kulhad", "Bun Maska", "Spiced Mathri"],
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "food-4",
      name: "Original Clay Kulhad Malai Lassi",
      famousEatery: "Lassiwala (Shop 312 MI Road)",
      specialty: "Traditional sweet churned yogurt lassi served in earthen kulhads with a thick layer of clotted cream (malai) on top.",
      priceForTwo: "₹160 for two",
      rating: 4.8,
      address: "Shop 312, MI Road, Jaipur",
      timing: "07:00 AM – 04:00 PM",
      mustTry: ["Sweet Malai Lassi", "Sugar-Free Lassi", "Salted Mint Lassi"],
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
    },
  ],
  culturalShops: [
    {
      id: "shop-1",
      name: "Johari Bazaar (Gemstone & Jewelry Capital)",
      bazaar: "Pink City Heritage Corridor",
      specialties: ["Kundan Polki Jewelry", "Meenakari Enamel Work", "Natural Emeralds & Rubies", "Silver Heritage Necklaces"],
      description: "World-famous gemstone and jewelry hub where royal courts have commissioned exquisite Kundan and Meenakari wedding ornaments for over 200 years.",
      priceRange: "₹₹₹ (Fixed & Custom Orders)",
      rating: 4.8,
      timing: "10:30 AM – 08:30 PM",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "shop-2",
      name: "Bapu Bazaar (Bandhej Sarees & Mojaris)",
      bazaar: "Terracotta Pink Colonnade",
      specialties: ["Bandhej & Leheriya Sarees", "Camel Leather Mojaris", "Hand-quilted Jaipuri Razai", "Sanganeri Block Prints"],
      description: "Vibrant pink market street renowned for handloom textiles, pure cotton block prints, and handcrafted camel leather mojaris.",
      priceRange: "₹₹ (Bargaining Welcome)",
      rating: 4.6,
      timing: "11:00 AM – 09:00 PM",
      image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "shop-3",
      name: "Tripolia Bazaar & Maniharon Ka Rasta",
      bazaar: "Historic Gate to Chhoti Chaupar",
      specialties: ["Traditional Lac Bangles", "Brass Utensils", "Iron Hardware", "Carpets"],
      description: "World-famous lane (Maniharon Ka Rasta) where Muslim artisans handcraft traditional lac bangles encrusted with mirrors and crystals.",
      priceRange: "₹ (Authentic Handcrafted)",
      rating: 4.7,
      timing: "10:00 AM – 08:00 PM",
      image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
    },
  ],
};

export default function HomePage() {
  const { user, role, isLoggedIn, openAuthModal, logout } = useAuth();
  const [currentLocationData, setCurrentLocationData] = useState<DynamicLocationData>(EXHAUSTIVE_JAIPUR_DATA);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<"all" | "attractions" | "food" | "shops">("all");
  const [activePlaceId, setActivePlaceId] = useState<string | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // PRD Feature Modals State
  const [isTripPlannerOpen, setIsTripPlannerOpen] = useState(false);
  const [isTransportRentalOpen, setIsTransportRentalOpen] = useState(false);
  const [isTripMemoriesOpen, setIsTripMemoriesOpen] = useState(false);
  const [isCoTravelerOpen, setIsCoTravelerOpen] = useState(false);

  // Search state
  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounced Live Geocoding Search
  useEffect(() => {
    if (!searchInputValue || searchInputValue.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchIndianLocations(searchInputValue);
      setSearchResults(results);
      setIsSearching(false);
    }, 280);

    return () => clearTimeout(timer);
  }, [searchInputValue]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Location Selection
  const handleSelectLocation = async (item: any) => {
    setIsDropdownOpen(false);
    setIsLoadingLocation(true);
    setSearchInputValue(item.name || item.displayName);

    try {
      if (item.name.toLowerCase() === "jaipur") {
        setCurrentLocationData(EXHAUSTIVE_JAIPUR_DATA);
      } else {
        const liveData = await getDynamicIntelligenceForLocation(
          item.name,
          item.state,
          item.lat,
          item.lng,
          item.district
        );
        setCurrentLocationData(liveData);
      }
      setActivePlaceId(null);
    } catch (err) {
      console.error("Error loading location intelligence:", err);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Handle Search Form Submit
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInputValue.trim()) return;

    if (searchInputValue.trim().toLowerCase() === "jaipur") {
      handleSelectLocation({ name: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873 });
      return;
    }

    if (searchResults.length > 0) {
      handleSelectLocation(searchResults[0]);
    } else {
      setIsLoadingLocation(true);
      setIsDropdownOpen(false);
      const results = await searchIndianLocations(searchInputValue);
      if (results.length > 0) {
        handleSelectLocation(results[0]);
      } else {
        alert(`Location "${searchInputValue}" not found. Please verify spelling.`);
        setIsLoadingLocation(false);
      }
    }
  };

  const whatsappUrl = `https://wa.me/919876543210?text=Namaste!%20I%20am%20exploring%20${currentLocationData.name}%2C%20${currentLocationData.state}%20and%20need%20a%20verified%20local%20guide%20and%20cabs.`;

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-100 text-slate-900 overflow-hidden font-sans antialiased">
      {/* 1. TOP GLOBAL HEADER */}
      <header className="h-16 shrink-0 border-b border-slate-200 bg-white px-4 sm:px-6 flex items-center justify-between z-40 shadow-xs">
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 via-jaipur-pink to-amber-500 text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Compass className="h-5 w-5" />
            </div>
            <div className="leading-none hidden sm:block">
              <span className="font-heading text-lg font-extrabold tracking-tight text-slate-900">
                Globe<span className="text-brand-600">Trotter</span>
              </span>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                All-India Travel Intel
              </span>
            </div>
          </Link>
        </div>

        {/* Center Search Bar */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-xl mx-3 sm:mx-6">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <div className="flex items-center rounded-full bg-slate-100 border border-slate-300/80 px-4 py-2 text-xs shadow-inner focus-within:ring-2 focus-within:ring-brand-500/30 focus-within:border-brand-500 focus-within:bg-white transition-all">
              {isSearching || isLoadingLocation ? (
                <Loader2 className="h-4 w-4 text-brand-600 animate-spin shrink-0 mr-2.5" />
              ) : (
                <Search className="h-4 w-4 text-slate-400 shrink-0 mr-2.5" />
              )}
              <input
                type="text"
                placeholder="Search ANY city, district, or village in India (e.g. Jaipur, Ajmer, Hampi, Leh)..."
                value={searchInputValue}
                onChange={(e) => {
                  setSearchInputValue(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                className="w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-none placeholder-slate-400"
              />
              {searchInputValue && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInputValue("");
                    setSearchResults([]);
                  }}
                  className="text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </form>

          {/* Autocomplete Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-12 left-0 right-0 rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-h-96 overflow-y-auto">
              <div className="p-2 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between text-[11px] font-extrabold text-slate-500 uppercase tracking-wider px-4">
                <span>Destinations in India</span>
                <span className="text-[10px] text-slate-400 font-normal">Click any place to fly</span>
              </div>

              <div className="p-2 space-y-1">
                {searchResults.length > 0 ? (
                  searchResults.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectLocation(item)}
                      className="w-full flex items-center justify-between rounded-2xl px-4 py-2.5 text-left text-xs transition-colors hover:bg-slate-100 text-slate-700"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-50 text-brand-600 shrink-0">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block text-sm">{item.name}</span>
                          <span className="text-[11px] text-slate-500 font-medium line-clamp-1">
                            {item.district ? `${item.district}, ` : ""}
                            {item.state}
                          </span>
                        </div>
                      </div>

                      <span className="rounded-full bg-slate-100 text-slate-600 text-[10px] font-extrabold px-2.5 py-1 uppercase">
                        {item.type}
                      </span>
                    </button>
                  ))
                ) : isSearching ? (
                  <div className="p-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-brand-600" />
                    <span>Searching places across India...</span>
                  </div>
                ) : searchInputValue.length >= 2 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    <p>Press Enter to search "{searchInputValue}" across India</p>
                  </div>
                ) : (
                  <div className="p-3 space-y-1">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block px-2 py-1">
                      Quick Major Destinations
                    </span>
                    {[
                      { name: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873 },
                      { name: "Ajmer", state: "Rajasthan", lat: 26.4499, lng: 74.6399 },
                      { name: "Pushkar", state: "Rajasthan", lat: 26.4897, lng: 74.5511 },
                      { name: "Udaipur", state: "Rajasthan", lat: 24.5854, lng: 73.7125 },
                      { name: "Varanasi", state: "Uttar Pradesh", lat: 25.3176, lng: 82.9739 },
                      { name: "Agra", state: "Uttar Pradesh", lat: 27.1767, lng: 78.0081 },
                      { name: "Hampi", state: "Karnataka", lat: 15.3350, lng: 76.4600 },
                      { name: "Leh", state: "Ladakh", lat: 34.1526, lng: 77.5771 },
                    ].map((pop) => (
                      <button
                        key={pop.name}
                        onClick={() => handleSelectLocation(pop)}
                        className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs hover:bg-slate-100 text-slate-700"
                      >
                        <span className="font-bold text-slate-900">{pop.name}</span>
                        <span className="text-[10px] text-slate-500 font-semibold">{pop.state}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Actions & Auth */}
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-102"
          >
            <MessageCircle className="h-4 w-4" />
            <span>WhatsApp Concierge</span>
          </a>

          {/* Role-Protected Auth Button / Profile Dropdown */}
          {!isLoggedIn ? (
            <button
              onClick={() => openAuthModal("traveler")}
              className="flex items-center gap-1.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 text-xs font-bold shadow-sm transition-all hover:scale-102"
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Sign In / Join</span>
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 rounded-2xl bg-slate-100 hover:bg-slate-200 p-1.5 pr-3 transition-colors border border-slate-200"
              >
                <div className="relative h-7 w-7 rounded-xl overflow-hidden bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
                  {user?.avatar ? (
                    <Image src={user.avatar} alt={user.name} fill unoptimized className="object-cover" />
                  ) : (
                    user?.name?.charAt(0) || "U"
                  )}
                </div>
                <div className="text-left hidden md:block leading-none">
                  <span className="font-bold text-xs text-slate-900 block truncate max-w-[100px]">{user?.name}</span>
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-brand-600">
                    {role === "admin" ? "🛡️ Admin" : role === "guide" ? "🧭 Guide" : "🧳 Traveler"}
                  </span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {/* User Profile Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-12 w-64 rounded-3xl bg-white shadow-2xl border border-slate-200 p-2 z-50 text-xs text-slate-700 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-3 border-b border-slate-100 bg-slate-50/80 rounded-2xl mb-1">
                    <span className="font-bold text-slate-900 block text-sm">{user?.name}</span>
                    <span className="text-[11px] text-slate-500 block truncate">{user?.email}</span>
                    <span className="inline-block mt-1.5 rounded-full bg-slate-200 text-slate-800 text-[10px] font-extrabold px-2.5 py-0.5">
                      {user?.badge || (role === "admin" ? "Superadmin" : role === "guide" ? "Licensed Guide" : "Traveler")}
                    </span>
                  </div>

                  {/* Role-Specific Unlocked Dashboards */}
                  {role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-purple-50 text-purple-900 font-bold transition-colors"
                    >
                      <Shield className="h-4 w-4 text-purple-600" />
                      <span>Admin Operations Dashboard</span>
                    </Link>
                  )}

                  {role === "guide" && (
                    <Link
                      href="/guide"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-emerald-50 text-emerald-900 font-bold transition-colors"
                    >
                      <MapPin className="h-4 w-4 text-emerald-600" />
                      <span>Guide Operations Desk</span>
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      openAuthModal(role === "admin" ? "guide" : "admin");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-700 font-semibold transition-colors"
                  >
                    <Compass className="h-4 w-4 text-slate-400" />
                    <span>Switch Role / Portal</span>
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 font-bold transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
              }
            }}
            className="flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-xs"
            title="Share"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* 2. SPLIT WORKSPACE */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* A. LEFT SIDEBAR */}
        {!isSidebarHidden && (
          <aside className="w-60 shrink-0 border-r border-slate-200 bg-white flex flex-col justify-between p-4 overflow-y-auto select-none">
            <div className="space-y-5">
              <button
                onClick={() => setIsAiModalOpen(true)}
                className="w-full flex items-center gap-3 rounded-2xl bg-gradient-to-r from-brand-600 via-jaipur-pink to-purple-600 p-3.5 text-white font-bold text-xs shadow-lg shadow-brand-500/25 hover:opacity-95 transition-all hover:scale-102 group"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                  <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
                </div>
                <div className="text-left leading-tight">
                  <span className="block font-bold text-sm">AI Guide</span>
                  <span className="text-[10px] text-white/80 font-medium">Ask about {currentLocationData.name}</span>
                </div>
              </button>

              <div className="space-y-1">
                <span className="px-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">
                  Browse {currentLocationData.name}
                </span>

                {[
                  { id: "all", label: `All Places (${currentLocationData.attractions.length + currentLocationData.famousFoods.length + currentLocationData.culturalShops.length})`, icon: Compass, color: "text-brand-500" },
                  { id: "attractions", label: `Forts & Sites (${currentLocationData.attractions.length})`, icon: MapPin, color: "text-amber-500" },
                  { id: "food", label: `Famous Food (${currentLocationData.famousFoods.length})`, icon: Utensils, color: "text-rose-500" },
                  { id: "shops", label: `Bazaars (${currentLocationData.culturalShops.length})`, icon: ShoppingBag, color: "text-purple-500" },
                ].map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeCategoryFilter === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategoryFilter(cat.id as any)}
                      className={`w-full flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                        isActive
                          ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? "text-white" : cat.color}`} />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}

                {/* PRD ESSENTIAL TRAVEL SUITE TOOLS */}
                <div className="pt-3 border-t border-slate-100 mt-2 space-y-1">
                  <span className="px-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Travel Planning Suite
                  </span>

                  <button
                    onClick={() => setIsTripPlannerOpen(true)}
                    className="w-full flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors group"
                  >
                    <Sparkles className="h-4 w-4 text-amber-500 group-hover:scale-110 transition-transform" />
                    <span>AI Trip & Budget Planner</span>
                  </button>

                  <button
                    onClick={() => setIsTransportRentalOpen(true)}
                    className="w-full flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors group"
                  >
                    <Car className="h-4 w-4 text-orange-500 group-hover:scale-110 transition-transform" />
                    <span>Cabs & Vehicle Rentals</span>
                  </button>

                  <button
                    onClick={() => setIsTripMemoriesOpen(true)}
                    className="w-full flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors group"
                  >
                    <Camera className="h-4 w-4 text-pink-500 group-hover:scale-110 transition-transform" />
                    <span>Trip Memories & Reels</span>
                  </button>

                  <button
                    onClick={() => setIsCoTravelerOpen(true)}
                    className="w-full flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors group"
                  >
                    <Users className="h-4 w-4 text-blue-500 group-hover:scale-110 transition-transform" />
                    <span>Co-Travelers & Groups</span>
                  </button>
                </div>

                {/* ROLE-RESTRICTED SIDEBAR LINKS (ONLY VISIBLE TO ADMIN OR GUIDE) */}
                {role === "admin" && (
                  <div className="pt-2 border-t border-slate-100 mt-2">
                    <Link
                      href="/admin"
                      className="w-full flex items-center gap-2.5 rounded-2xl px-3 py-2 text-xs font-bold text-purple-900 bg-purple-50 hover:bg-purple-100 transition-colors"
                    >
                      <Shield className="h-4 w-4 text-purple-600" />
                      <span>Admin Operations</span>
                    </Link>
                  </div>
                )}

                {role === "guide" && (
                  <div className="pt-2 border-t border-slate-100 mt-2">
                    <Link
                      href="/guide"
                      className="w-full flex items-center gap-2.5 rounded-2xl px-3 py-2 text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                    >
                      <MapPin className="h-4 w-4 text-emerald-600" />
                      <span>Guide Desk</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-1 text-xs text-slate-500 font-semibold">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 py-2 px-3 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
              >
                <MessageCircle className="h-4 w-4 text-emerald-500" />
                <span>WhatsApp Local Desk</span>
              </a>

              <button
                onClick={() => setIsSidebarHidden(true)}
                className="w-full flex items-center gap-2.5 py-2 px-3 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Collapse Sidebar</span>
              </button>
            </div>
          </aside>
        )}

        {isSidebarHidden && (
          <button
            onClick={() => setIsSidebarHidden(false)}
            className="absolute left-3 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-xl border border-slate-200 text-slate-700 hover:bg-slate-50 hover:scale-105 transition-all"
            title="Expand Sidebar"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}

        {/* B. CENTER SCROLLABLE CITY KNOWLEDGE FEED */}
        <main className="flex-1 overflow-y-auto bg-slate-100 min-w-0">
          <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-7 space-y-6 pb-32">
            {isLoadingLocation && (
              <div className="rounded-2xl bg-brand-50 border border-brand-200 p-4 flex items-center gap-3 text-xs text-brand-900 shadow-sm animate-pulse">
                <Loader2 className="h-5 w-5 animate-spin text-brand-600 shrink-0" />
                <div>
                  <span className="font-bold block text-sm">Fetching Live Location Intelligence...</span>
                  <p className="text-brand-700">
                    Loading real Wikipedia history, GPS monuments, and weather for {searchInputValue}.
                  </p>
                </div>
              </div>
            )}

            {/* 1. Hero Destination Cover Banner */}
            <div className="relative h-64 sm:h-72 w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 group">
              <Image
                src={currentLocationData.coverImage}
                alt={currentLocationData.name}
                fill
                priority
                unoptimized
                className="object-cover object-center group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 rounded-2xl bg-white/95 backdrop-blur-xl p-5 shadow-xl border border-white/60 space-y-2.5 text-slate-900">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-jaipur-pink/15 text-jaipur-pink px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider">
                        {currentLocationData.state}, India
                      </span>
                      <span className="text-slate-400 text-xs">•</span>
                      <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                        <Sun className="h-3 w-3 text-amber-500" />
                        {currentLocationData.weather}
                      </span>
                    </div>

                    <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                      {currentLocationData.name}
                    </h1>
                  </div>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 text-xs font-bold shadow-md shadow-emerald-600/25 transition-all hover:scale-102 shrink-0"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>Hire Guide</span>
                  </a>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-3">
                  {currentLocationData.description || currentLocationData.tagline}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-600 pt-2 border-t border-slate-100">
                  <span>🗓️ Best Season: <strong className="text-slate-900">{currentLocationData.bestTimeToVisit}</strong></span>
                  <span>📍 <strong className="text-slate-900">{currentLocationData.attractions.length} Heritage Sights & Palaces</strong></span>
                </div>
              </div>
            </div>

            {/* 2. Live Operational Alert (§28 PRD) */}
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3 text-xs text-amber-900 shadow-xs">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <span className="font-bold block text-xs text-amber-950">
                  Live Monument Operational Status Alert (§28 PRD)
                </span>
                <p className="text-amber-900 leading-relaxed font-medium">
                  Major monuments in {currentLocationData.name} (Hawa Mahal, Amer Fort, City Palace, Nahargarh) are <strong>Open</strong> today.
                </p>
              </div>
            </div>

            {/* 3. ATTRACTIONS & FORTS (All 12+ Places in Jaipur) */}
            {(activeCategoryFilter === "all" || activeCategoryFilter === "attractions") && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <Compass className="h-5 w-5 text-brand-500" />
                    Famous Forts, Palaces & Sights in {currentLocationData.name}
                  </h3>
                  <span className="text-xs font-bold text-slate-500">
                    {currentLocationData.attractions.length} Places
                  </span>
                </div>

                <div className="space-y-4">
                  {currentLocationData.attractions.map((attraction) => {
                    const isCardActive = activePlaceId === attraction.id;
                    return (
                      <div
                        key={attraction.id}
                        onClick={() => setActivePlaceId(attraction.id)}
                        className={`rounded-3xl bg-white border overflow-hidden transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl group ${
                          isCardActive
                            ? "border-brand-500 ring-2 ring-brand-500/25"
                            : "border-slate-200/90 hover:border-brand-300"
                        }`}
                      >
                        <div className="relative h-56 sm:h-64 w-full overflow-hidden">
                          <Image
                            src={attraction.image}
                            alt={attraction.name}
                            fill
                            unoptimized
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30" />

                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                            <span className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white uppercase tracking-wider border border-white/20">
                              {attraction.category}
                            </span>

                            <span
                              className={`flex items-center gap-1.5 rounded-full backdrop-blur-md px-3 py-1 text-xs font-bold border shadow-sm ${
                                attraction.status === "Open"
                                  ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                                  : "bg-amber-950/80 text-amber-300 border-amber-500/40"
                              }`}
                            >
                              <span
                                className={`h-2 w-2 rounded-full ${
                                  attraction.status === "Open" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                                }`}
                              />
                              {attraction.status}
                            </span>
                          </div>

                          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                            <div className="flex items-center gap-1.5">
                              <span className="flex items-center gap-1 bg-amber-400 text-slate-950 font-extrabold px-2 py-0.5 rounded-lg text-xs">
                                <Star className="h-3.5 w-3.5 fill-slate-950" />
                                {attraction.rating}
                              </span>
                              <span className="text-white/90 text-[11px] font-medium">
                                ({attraction.reviewsCount})
                              </span>
                            </div>

                            {attraction.reelsCount && (
                              <span className="rounded-full bg-black/50 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-bold text-pink-300 border border-pink-500/30">
                                📸 {attraction.reelsCount}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-5 space-y-3">
                          <div>
                            <div className="flex items-baseline justify-between gap-2">
                              <h4 className="font-heading text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                                {attraction.name}
                              </h4>
                              {attraction.subName && (
                                <span className="text-xs font-semibold text-slate-400 shrink-0">
                                  {attraction.subName}
                                </span>
                              )}
                            </div>

                            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                              {attraction.description}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                            <div className="flex items-center gap-2">
                              <Ticket className="h-4 w-4 text-brand-500 shrink-0" />
                              <span>Entry: <strong className="text-slate-900">{attraction.entryFee}</strong></span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-brand-500 shrink-0" />
                              <span>Timing: <strong className="text-slate-900">{attraction.timing}</strong></span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <span className="text-[11px] text-slate-400 font-medium truncate max-w-[200px]">
                              📍 {attraction.address}
                            </span>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActivePlaceId(attraction.id);
                                }}
                                className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 px-3 py-1.5 rounded-xl transition-colors"
                              >
                                <Navigation className="h-3.5 w-3.5" />
                                <span>Show on Map</span>
                              </button>

                              <a
                                href={`https://wa.me/919876543210?text=Namaste!%20I%20want%20to%20visit%20${attraction.name}%20in%20${currentLocationData.name}.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-xl shadow-xs transition-colors"
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                                <span>Guide</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 4. FAMOUS FOODS & EATERIES */}
            {(activeCategoryFilter === "all" || activeCategoryFilter === "food") && currentLocationData.famousFoods.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-jaipur-pink" />
                    Famous Foods & Iconic Eateries in {currentLocationData.name}
                  </h3>
                  <span className="text-xs font-bold text-slate-500">Legendary Flavors</span>
                </div>

                <div className="space-y-4">
                  {currentLocationData.famousFoods.map((food) => {
                    const isCardActive = activePlaceId === food.id;
                    return (
                      <div
                        key={food.id}
                        onClick={() => setActivePlaceId(food.id)}
                        className={`rounded-3xl bg-white border overflow-hidden transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl group ${
                          isCardActive
                            ? "border-jaipur-pink ring-2 ring-jaipur-pink/25"
                            : "border-slate-200/90 hover:border-jaipur-pink/40"
                        }`}
                      >
                        <div className="relative h-52 sm:h-56 w-full overflow-hidden">
                          <Image
                            src={food.image}
                            alt={food.name}
                            fill
                            unoptimized
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30" />

                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                            <span className="rounded-full bg-jaipur-pink/90 backdrop-blur-md px-3 py-1 text-[11px] font-extrabold text-white uppercase tracking-wider shadow">
                              {food.famousEatery}
                            </span>

                            <span className="flex items-center gap-1 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-extrabold text-slate-900 shadow">
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                              {food.rating}
                            </span>
                          </div>

                          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-bold">
                            <span>💰 {food.priceForTwo}</span>
                            <span>⏰ {food.timing}</span>
                          </div>
                        </div>

                        <div className="p-5 space-y-3">
                          <div>
                            <h4 className="font-heading text-xl font-bold text-slate-900 group-hover:text-jaipur-pink transition-colors">
                              {food.name}
                            </h4>
                            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                              {food.specialty}
                            </p>
                          </div>

                          <div className="space-y-2 pt-2 border-t border-slate-100">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                              Must-Try Specialties:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {food.mustTry.map((dish, dIdx) => (
                                <span
                                  key={dIdx}
                                  className="rounded-xl bg-slate-100 text-slate-800 px-3 py-1 text-xs font-bold border border-slate-200/70"
                                >
                                  {dish}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                            <span className="text-slate-500 font-medium">📍 {food.address}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActivePlaceId(food.id);
                              }}
                              className="flex items-center gap-1 font-bold text-jaipur-pink hover:text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl transition-colors"
                            >
                              <Navigation className="h-3.5 w-3.5" />
                              <span>Locate Stall</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 5. CULTURAL SHOPS & BAZAARS */}
            {(activeCategoryFilter === "all" || activeCategoryFilter === "shops") && currentLocationData.culturalShops.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-purple-600" />
                    Centuries-Old Cultural Shops & Bazaars
                  </h3>
                  <span className="text-xs font-bold text-slate-500">Heritage Crafts</span>
                </div>

                <div className="space-y-4">
                  {currentLocationData.culturalShops.map((shop) => (
                    <div
                      key={shop.id}
                      onClick={() => setActivePlaceId(shop.id)}
                      className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    >
                      <div className="relative h-48 sm:h-52 w-full overflow-hidden">
                        <Image
                          src={shop.image}
                          alt={shop.name}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30" />

                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className="rounded-full bg-purple-700/90 backdrop-blur-md px-3 py-1 text-[11px] font-extrabold text-white uppercase tracking-wider shadow">
                            {shop.bazaar}
                          </span>
                          <span className="flex items-center gap-1 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-extrabold text-slate-900 shadow">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            {shop.rating}
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-bold">
                          <span>💎 {shop.priceRange}</span>
                          <span>⏰ {shop.timing}</span>
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <div>
                          <h4 className="font-heading text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                            {shop.name}
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
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
                                className="rounded-xl bg-purple-50 text-purple-900 px-3 py-1 text-xs font-bold border border-purple-200/60"
                              >
                                {spec}
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

            {/* 6. WhatsApp Local Concierge Banner */}
            <div className="rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 p-7 sm:p-8 text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-emerald-500/30">
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/30 px-3.5 py-1 text-xs font-extrabold text-emerald-300">
                  <MessageCircle className="h-4 w-4" />
                  Live Local Concierge Desk
                </div>
                <h4 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                  Want to hire a verified local guide in {currentLocationData.name}?
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed">
                  Connect with verified coordinators on WhatsApp for private driver cabs, haveli bookings, and heritage walk schedules.
                </p>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-2 rounded-2xl bg-white text-emerald-950 hover:bg-slate-100 px-6 py-4 text-sm font-extrabold shadow-xl transition-all hover:scale-105"
              >
                <MessageCircle className="h-5 w-5 text-emerald-600" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </main>

        {/* C. RIGHT COLUMN: FULL-HEIGHT SPLIT-SCREEN MAP VIEW */}
        <div className="hidden md:block w-1/2 shrink-0 h-full border-l border-slate-200/80 relative">
          <SplitScreenMap
            selectedCity={currentLocationData.name}
            cityCoords={currentLocationData.coords}
            places={currentLocationData.mapPlaces}
            activePlaceId={activePlaceId}
            onSelectPlace={(p) => setActivePlaceId(p.id)}
          />
        </div>
      </div>

      {/* Floating AI Assistant Bubble */}
      <button
        onClick={() => setIsAiModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-brand-600 via-jaipur-pink to-purple-600 text-white shadow-2xl shadow-brand-500/40 hover:scale-110 transition-transform"
        title="Open AI Virtual Tourist Guide"
      >
        <Sparkles className="h-6 w-6 text-amber-300 animate-spin-slow" />
      </button>

      {/* AI Assistant Chat Modal */}
      <AiAssistantModal
        currentCity={currentLocationData.name}
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      {/* PRD Feature Modals */}
      <TripPlannerModal
        isOpen={isTripPlannerOpen}
        onClose={() => setIsTripPlannerOpen(false)}
        defaultCity={currentLocationData.name}
      />

      <TransportRentalModal
        isOpen={isTransportRentalOpen}
        onClose={() => setIsTransportRentalOpen(false)}
        city={currentLocationData.name}
      />

      <TripMemoriesModal
        isOpen={isTripMemoriesOpen}
        onClose={() => setIsTripMemoriesOpen(false)}
        city={currentLocationData.name}
      />

      <CoTravelerModal
        isOpen={isCoTravelerOpen}
        onClose={() => setIsCoTravelerOpen(false)}
        city={currentLocationData.name}
      />
    </div>
  );
}
