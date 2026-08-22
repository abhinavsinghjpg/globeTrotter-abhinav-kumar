"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { SplitScreenMap, MapPlace } from "@/components/SplitScreenMap";
import { AiAssistantModal } from "@/components/AiAssistantModal";
import { TransportRentalModal } from "@/components/TransportRentalModal";
import { TripMemoriesModal } from "@/components/TripMemoriesModal";
import { CoTravelerModal } from "@/components/CoTravelerModal";
import { LiveAudioGuide } from "@/components/LiveAudioGuide";
import { calculateDistanceInMeters, formatDistance } from "@/lib/geo-distance";
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
  ArrowLeft,
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
  Info,
  Radio,
  Volume2,
} from "lucide-react";

const POPULAR_CITIES = [
  { name: "Jaipur", state: "Rajasthan", coords: { lat: 26.9124, lng: 75.7873 } },
  { name: "Mathura", state: "Uttar Pradesh", coords: { lat: 27.4924, lng: 77.6737 } },
  { name: "Vrindavan", state: "Uttar Pradesh", coords: { lat: 27.5806, lng: 77.7006 } },
  { name: "Ajmer", state: "Rajasthan", coords: { lat: 26.4499, lng: 74.6399 } },
  { name: "Pushkar", state: "Rajasthan", coords: { lat: 26.4897, lng: 74.5511 } },
  { name: "Udaipur", state: "Rajasthan", coords: { lat: 24.5854, lng: 73.7125 } },
  { name: "Varanasi", state: "Uttar Pradesh", coords: { lat: 25.3176, lng: 82.9739 } },
  { name: "Agra", state: "Uttar Pradesh", coords: { lat: 27.1767, lng: 78.0081 } },
  { name: "Hampi", state: "Karnataka", coords: { lat: 15.3350, lng: 76.4600 } },
  { name: "Leh", state: "Ladakh", coords: { lat: 34.1526, lng: 77.5771 } },
];

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
      description: "Original clay kulhad lassi shop since 1944, serving thick churned yogurt lassi crowned with a rich layer of clotted cream (malai) on top.",
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      reviewsCount: "24,800+ Reviews",
      status: "Open (07:00 AM - 04:00 PM)",
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
    {
      id: "shop-3",
      name: "Tripolia Bazaar & Maniharon Ka Rasta",
      hindiName: "त्रिपोलिया बाज़ार (Lac Bangles)",
      category: "shopping",
      lat: 26.9230,
      lng: 75.8220,
      description: "World-famous lane where Muslim artisans handcraft traditional lac bangles encrusted with mirrors and crystals.",
      image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
      rating: 4.7,
      reviewsCount: "8,500+ Reviews",
      status: "Open (10:00 AM - 08:00 PM)",
      entryFee: "Free Entry",
      timing: "10:00 AM – 08:00 PM",
      address: "Tripolia Bazaar, Jaipur",
      specialties: ["Traditional Lac Bangles", "Brass Utensils", "Carpets"],
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
  upcomingEvents: [
    {
      name: "Jaipur Literature Festival (JLF 2026)",
      dates: "January 22 – 26, 2026",
      venue: "Hotel Clarks Amer, JLN Marg, Jaipur",
      description: "The world's greatest celebration of literature and ideas, hosting international Nobel laureates, novelists, poets, and thinkers across 5 vibrant days.",
      tag: "Global Literary Festival",
      ticketType: "Free Delegate Registration",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Royal Teej Festival & Palace Processions",
      dates: "Monsoon Season (August)",
      venue: "City Palace to Tripolia Gate, Pink City",
      description: "Centuries-old royal procession featuring Goddess Teej palanquin, decorated elephants, Kalbelia dancers, and traditional Ghevar feasts.",
      tag: "Royal Cultural Procession",
      ticketType: "Free Public Viewing",
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "SkyWaltz Sunrise Hot Air Balloon Safari",
      dates: "Daily Morning Flights (October – March)",
      venue: "Amer Fort & Kukas Ridge Launch Pad",
      description: "Float 2,000 feet above the rugged Aravalli ridges and hilltop forts as golden morning light illuminates the desert landscape.",
      tag: "Adventure & Aerial Safari",
      ticketType: "₹12,500 / person",
      image: "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=800&q=80",
    },
  ],
};

export default function HomePage() {
  const { user, role, isLoggedIn, openAuthModal, logout } = useAuth();
  const [currentLocationData, setCurrentLocationData] = useState<DynamicLocationData>(EXHAUSTIVE_JAIPUR_DATA);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<"all" | "attractions" | "food" | "shops" | "events">("all");
  const [activePlaceId, setActivePlaceId] = useState<string | null>(null);
  const [activeInlineDetail, setActiveInlineDetail] = useState<any | null>(null);
  const [activeToolView, setActiveToolView] = useState<null | "planner" | "transport" | "memories" | "groups" | "ai">(null);
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // User's Active Itinerary & Custom Added Places
  const [itineraryPlaceIds, setItineraryPlaceIds] = useState<string[]>([
    "attr-1", "attr-2", "attr-3", "attr-4", "attr-5"
  ]);
  const [customPlaces, setCustomPlaces] = useState<any[]>([]);
  const [isAddPlaceModalOpen, setIsAddPlaceModalOpen] = useState(false);
  const [newPlaceName, setNewPlaceName] = useState("");
  const [newPlaceFee, setNewPlaceFee] = useState("₹50");
  const [newPlaceTiming, setNewPlaceTiming] = useState("09:00 AM – 06:00 PM");

  const togglePlaceInItinerary = (placeId: string) => {
    setItineraryPlaceIds(prev =>
      prev.includes(placeId) ? prev.filter(id => id !== placeId) : [...prev, placeId]
    );
  };

  const handleAddCustomPlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaceName.trim()) return;
    const newId = "custom-" + Date.now();
    const newPlace = {
      id: newId,
      name: newPlaceName.trim(),
      category: "attraction",
      entryFee: newPlaceFee || "Free Entry",
      timing: newPlaceTiming || "09:00 AM – 06:00 PM",
      rating: 4.8,
      reviewsCount: "Custom Place",
      status: "Open" as const,
      image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80",
      description: "Custom place added to your personalized itinerary.",
      address: `${newPlaceName.trim()}, ${currentLocationData.name}`,
    };
    setCustomPlaces(prev => [...prev, newPlace]);
    setItineraryPlaceIds(prev => [...prev, newId]);
    setNewPlaceName("");
    setIsAddPlaceModalOpen(false);
  };

  // Search state
  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Live GPS Location Tracking & Audio Guide Proximity Engine
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsStatus, setGpsStatus] = useState<"idle" | "prompt" | "tracking" | "denied">("idle");
  const [proximityPlace, setProximityPlace] = useState<any | null>(null);
  const [hasPromptedLocation, setHasPromptedLocation] = useState(false);

  // Request GPS Location when user is logged in
  useEffect(() => {
    if (isLoggedIn && !hasPromptedLocation && gpsStatus === "idle") {
      setGpsStatus("prompt");
    }
  }, [isLoggedIn, hasPromptedLocation, gpsStatus]);

  const requestGpsPermission = () => {
    setHasPromptedLocation(true);
    setGpsStatus("tracking");

    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        async (err) => {
          console.warn("Standard GPS timed out or unavailable, falling back to IP:", err.message);
          try {
            const res = await fetch("https://ipwho.is/", { cache: "no-store" });
            if (res.ok) {
              const data = await res.json();
              if (data && data.latitude && data.longitude) {
                setUserCoords({ lat: data.latitude, lng: data.longitude });
                return;
              }
            }
          } catch (e) {
            console.warn("IP Geolocation fallback failed:", e);
          }
          // Default to city center
          setUserCoords(currentLocationData.coords);
        },
        { enableHighAccuracy: false, timeout: 6000, maximumAge: 300000 }
      );
    } else {
      setUserCoords(currentLocationData.coords);
    }
  };

  // Check Proximity Arrival whenever userCoords or currentLocationData changes
  useEffect(() => {
    if (!userCoords) return;

    const allPlaces = [
      ...currentLocationData.attractions.map((a) => {
        const poi = currentLocationData.mapPlaces.find((p) => p.id === a.id);
        return { ...a, lat: poi?.lat || currentLocationData.coords.lat, lng: poi?.lng || currentLocationData.coords.lng };
      }),
      ...currentLocationData.famousFoods.map((f) => {
        const poi = currentLocationData.mapPlaces.find((p) => p.id === f.id);
        return { ...f, lat: poi?.lat || currentLocationData.coords.lat, lng: poi?.lng || currentLocationData.coords.lng };
      }),
    ];

    for (const place of allPlaces) {
      if (place.lat && place.lng) {
        const dist = calculateDistanceInMeters(userCoords.lat, userCoords.lng, place.lat, place.lng);
        if (dist <= 400) {
          setProximityPlace(place);
          return;
        }
      }
    }
  }, [userCoords, currentLocationData]);

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
    setActiveInlineDetail(null);

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

  // Open detail inside this window
  const handleOpenPlaceDetail = (place: any) => {
    setActiveInlineDetail(place);
    setActivePlaceId(place.id);
  };

  const whatsappUrl = `https://wa.me/919876543210?text=Namaste!%20I%20am%20exploring%20${currentLocationData.name}%2C%20${currentLocationData.state}%20and%20need%20a%20verified%20local%20guide%20and%20cabs.`;

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-100 text-slate-900 overflow-hidden font-sans antialiased">
      {/* 1. TOP GLOBAL HEADER (WANDERLOG STYLE) */}
      <header className="h-16 shrink-0 border-b border-slate-200 bg-white px-4 sm:px-6 flex items-center justify-between z-40 shadow-xs">
        <div className="flex items-center gap-3 shrink-0">
          {/* Toggle Sidebar Button */}
          <button
            onClick={() => setIsSidebarHidden(!isSidebarHidden)}
              className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-slate-100 text-slate-700 transition-colors"
              title="Toggle Sidebar"
            >
              <Layers className="h-4 w-4" />
            </button>

            {/* Wanderlog Breadcrumb / Trip Title */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold text-sm shadow-md">
                <Compass className="h-4 w-4" />
              </div>
              <div className="hidden sm:block leading-tight">
                <span className="font-heading text-sm font-extrabold text-slate-900 block">
                  Trip to {currentLocationData.name}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {currentLocationData.state}, India · Wanderlog Plan
                </span>
              </div>
            </div>
          </div>

          {/* Center Search Bar */}
          <div ref={searchContainerRef} className="relative w-72 sm:w-80 md:w-96 mx-2">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchInputValue}
                onChange={(e) => {
                  setSearchInputValue(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder={`Search destinations (e.g. Jaipur, Mathura, Agra)...`}
                className="w-full rounded-2xl bg-slate-100 hover:bg-slate-200/80 focus:bg-white pl-10 pr-9 py-2 text-xs font-semibold text-slate-900 placeholder:text-slate-500 border border-transparent focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all outline-none"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 h-3.5 w-3.5 animate-spin text-brand-600" />
              )}
              {!isSearching && searchInputValue && (
                <button
                  onClick={() => {
                    setSearchInputValue("");
                    setSearchResults([]);
                  }}
                  className="absolute right-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {isDropdownOpen && (searchResults.length > 0 || searchInputValue.length === 0) && (
              <div className="absolute left-0 right-0 top-11 z-50 rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden text-xs divide-y divide-slate-100 max-h-80 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                {searchResults.length > 0 ? (
                  searchResults.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectLocation(item)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-brand-50/70 transition-colors group"
                    >
                      <MapPin className="h-4 w-4 text-brand-500 group-hover:scale-110 transition-transform shrink-0" />
                      <div>
                        <span className="font-bold text-slate-900 block">{item.name}</span>
                        <span className="text-[10px] text-slate-500">{item.state}, India</span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-2 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider block">
                      Popular Heritage Destinations
                    </span>
                    {POPULAR_CITIES.map((pop) => (
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
            )}
          </div>

          {/* Right Actions (Wanderlog Style) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Add Dates Badge */}
            <button
              onClick={() => alert("Trip dates set to Oct 24 – Oct 28 (Peak Season)")}
              className="hidden lg:flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors"
            >
              <Calendar className="h-3.5 w-3.5 text-slate-500" />
              <span>Oct 24 – Oct 28</span>
            </button>

            {/* WhatsApp Concierge */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-bold shadow-xs transition-all"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>Guide</span>
            </a>

            {/* Auth Button / Profile Dropdown */}
            {!isLoggedIn ? (
              <button
                onClick={() => openAuthModal("traveler")}
                className="flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 text-xs font-bold shadow-sm transition-all"
              >
                <Compass className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 p-1 pr-2.5 transition-colors border border-slate-200"
                >
                  <div className="relative h-6 w-6 rounded-lg overflow-hidden bg-brand-600 text-white flex items-center justify-center font-bold text-xs">
                    {user?.avatar ? (
                      <Image src={user.avatar} alt={user.name} fill unoptimized className="object-cover" />
                    ) : (
                      user?.name?.charAt(0) || "U"
                    )}
                  </div>
                  <span className="font-bold text-xs text-slate-900 hidden md:block max-w-[80px] truncate">{user?.name}</span>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </button>

                {/* User Profile Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-10 w-60 rounded-2xl bg-white shadow-2xl border border-slate-200 p-2 z-50 text-xs text-slate-700 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2.5 border-b border-slate-100 bg-slate-50/80 rounded-xl mb-1">
                      <span className="font-bold text-slate-900 block text-sm">{user?.name}</span>
                      <span className="text-[11px] text-slate-500 block truncate">{user?.email}</span>
                    </div>

                    {role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-50 text-purple-900 font-bold transition-colors"
                      >
                        <Shield className="h-4 w-4 text-purple-600" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    {role === "guide" && (
                      <Link
                        href="/guide"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-emerald-50 text-emerald-900 font-bold transition-colors"
                      >
                        <MapPin className="h-4 w-4 text-emerald-600" />
                        <span>Guide Desk</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 font-bold transition-colors"
                    >
                      <X className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* 2. SPLIT WORKSPACE */}
        <div className="flex-1 flex min-h-0 overflow-hidden relative">
          {/* A. LEFT SIDEBAR (EXACT WANDERLOG ACCORDION) */}
          {!isSidebarHidden && (
            <aside className="w-64 shrink-0 border-r border-slate-200 bg-white flex flex-col justify-between p-3.5 overflow-y-auto select-none font-sans text-xs">
              <div className="space-y-4">
                {/* AI Tourist Guide Launcher */}
                <button
                  onClick={() => {
                    setActiveToolView("ai");
                    setActiveInlineDetail(null);
                  }}
                  className="w-full flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-3 text-white font-bold shadow-md shadow-blue-500/20 hover:opacity-95 transition-all group"
                >
                  <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
                  <div className="text-left leading-tight">
                    <span className="block font-bold text-xs">AI Tourist Guide</span>
                    <span className="text-[10px] text-white/80">Live {currentLocationData.name} Assistant</span>
                  </div>
                </button>

                {/* Wanderlog Section 1: Trip Overview & Itinerary */}
                <div className="space-y-1">
                  <span className="px-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Itinerary & Places
                  </span>

                  {[
                    { id: "all", label: `Places to visit (${currentLocationData.attractions.length + currentLocationData.famousFoods.length})`, icon: MapPin, color: "text-blue-600" },
                    { id: "day1", label: "Day 1: Forts & Palaces", icon: Compass, color: "text-amber-500" },
                    { id: "day2", label: "Day 2: Bazaars & Foods", icon: Utensils, color: "text-rose-500" },
                    { id: "day3", label: "Day 3: Sunsets & Crafts", icon: Camera, color: "text-purple-500" },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeCategoryFilter === tab.id && !activeToolView && !activeInlineDetail;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveCategoryFilter(tab.id as any);
                          setActiveInlineDetail(null);
                          setActiveToolView(null);
                        }}
                        className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2 font-bold transition-all ${
                          isActive
                            ? "bg-slate-900 text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        }`}
                      >
                        <Icon className={`h-3.5 w-3.5 ${isActive ? "text-white" : tab.color}`} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Wanderlog Section 2: Explore Guides */}
                <div className="space-y-1 pt-2 border-t border-slate-100">
                  <span className="px-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Explore {currentLocationData.name}
                  </span>

                  <button
                    onClick={() => {
                      setActiveCategoryFilter("attractions");
                      setActiveInlineDetail(null);
                      setActiveToolView(null);
                    }}
                    className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  >
                    <Compass className="h-3.5 w-3.5 text-blue-500" />
                    <span>Top Attractions ({currentLocationData.attractions.length})</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveCategoryFilter("food");
                      setActiveInlineDetail(null);
                      setActiveToolView(null);
                    }}
                    className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  >
                    <Utensils className="h-3.5 w-3.5 text-rose-500" />
                    <span>Famous Eateries ({currentLocationData.famousFoods.length})</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveCategoryFilter("events");
                      setActiveInlineDetail(null);
                      setActiveToolView(null);
                    }}
                    className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  >
                    <Calendar className="h-3.5 w-3.5 text-purple-500" />
                    <span>Festivals & Events ({currentLocationData.upcomingEvents?.length || 0})</span>
                  </button>
                </div>

                {/* Wanderlog Section 3: Travel Tools */}
                <div className="space-y-1 pt-2 border-t border-slate-100">
                  <span className="px-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                    Trip Tools
                  </span>

                  <button
                    onClick={() => {
                      setActiveToolView("ai");
                      setActiveInlineDetail(null);
                    }}
<<<<<<< HEAD
                    className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2 font-bold transition-colors ${
                      activeToolView === "planner" ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    <span>AI Trip & Budget Engine</span>
=======
                    className={`w-full flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-colors group ${
                      activeToolView === "ai" ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Sparkles className="h-4 w-4 text-amber-500 group-hover:scale-110 transition-transform" />
                    <span>AI Travel & Budget Planner</span>
>>>>>>> 7528f0e (Upgrade travel chatbot with Ollama intelligence, conversational trip profiling, and embedded itemized budget breakdowns; remove separate TripPlannerModal)
                  </button>

                  <button
                    onClick={() => {
                      setActiveToolView("transport");
                      setActiveInlineDetail(null);
                    }}
                    className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2 font-bold transition-colors ${
                      activeToolView === "transport" ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <Car className="h-3.5 w-3.5 text-orange-500" />
                    <span>Cabs & Vehicle Rentals</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveToolView("memories");
                      setActiveInlineDetail(null);
                    }}
                    className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2 font-bold transition-colors ${
                      activeToolView === "memories" ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <Camera className="h-3.5 w-3.5 text-pink-500" />
                    <span>Trip Notes & Reels</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveToolView("groups");
                      setActiveInlineDetail(null);
                    }}
                    className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2 font-bold transition-colors ${
                      activeToolView === "groups" ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <Users className="h-3.5 w-3.5 text-blue-500" />
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
          <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-7 space-y-6 pb-32">
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

            {/* INLINE TOOL SUITE VIEW (OPENS DIRECTLY IN THIS WINDOW) */}
            {activeToolView ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-3 duration-300">
                <div className="p-3.5 bg-white border border-slate-200 rounded-3xl flex items-center justify-between shadow-xs">
                  <button
                    onClick={() => setActiveToolView(null)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-2xl transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to {currentLocationData.name} Places</span>
                  </button>

                  <span className="rounded-full bg-brand-50 text-brand-700 text-[10px] font-extrabold px-3 py-1 uppercase tracking-wider">
                    {activeToolView === "ai" && "AI Travel & Itinerary Planner"}
                    {activeToolView === "transport" && "Cabs & Vehicle Rentals"}
                    {activeToolView === "memories" && "Trip Memories & Reels"}
                    {activeToolView === "groups" && "Co-Travelers & Groups"}
                  </span>
                </div>

                {activeToolView === "transport" && (
                  <TransportRentalModal
                    isInline
                    onClose={() => setActiveToolView(null)}
                    city={currentLocationData.name}
                  />
                )}

                {activeToolView === "memories" && (
                  <TripMemoriesModal
                    isInline
                    onClose={() => setActiveToolView(null)}
                    city={currentLocationData.name}
                  />
                )}

                {activeToolView === "groups" && (
                  <CoTravelerModal
                    isInline
                    onClose={() => setActiveToolView(null)}
                    city={currentLocationData.name}
                  />
                )}

                {activeToolView === "ai" && (
                  <AiAssistantModal
                    isInline
                    onClose={() => setActiveToolView(null)}
                    currentCity={currentLocationData.name}
                  />
                )}
              </div>
            ) : activeInlineDetail ? (
              <div className="rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-3 duration-300">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <button
                    onClick={() => setActiveInlineDetail(null)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-xs transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to {currentLocationData.name} Feed</span>
                  </button>

                  <span className="rounded-full bg-brand-50 text-brand-700 text-[10px] font-extrabold px-3 py-1 uppercase tracking-wider">
                    Full Place Details
                  </span>
                </div>

                <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-900">
                  <Image
                    src={activeInlineDetail.image || currentLocationData.coverImage}
                    alt={activeInlineDetail.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  <div className="absolute bottom-4 left-5 right-5 text-white space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-white/25 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-extrabold uppercase">
                        {activeInlineDetail.category || "Heritage Attraction"}
                      </span>
                      <span className="rounded-full bg-emerald-900/80 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 border border-emerald-500/30">
                        {activeInlineDetail.status || "Open Today"}
                      </span>
                    </div>

                    <h2 className="font-heading text-2xl sm:text-3xl font-extrabold leading-tight">
                      {activeInlineDetail.name}
                    </h2>
                    {activeInlineDetail.subName && (
                      <p className="text-xs text-amber-300 font-semibold">{activeInlineDetail.subName}</p>
                    )}
                  </div>
                </div>

                <div className="p-6 space-y-5 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <span className="flex items-center gap-1 bg-amber-400 text-slate-950 font-extrabold px-2 py-0.5 rounded-lg text-xs">
                        <Star className="h-3.5 w-3.5 fill-slate-950" />
                        {activeInlineDetail.rating || 4.7}
                      </span>
                      <span className="text-slate-500 font-medium">
                        ({activeInlineDetail.reviewsCount || "14,000+ Reviews"})
                      </span>
                    </div>

                    <span className="text-slate-500 font-bold">
                      📍 {currentLocationData.name}, {currentLocationData.state}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                      History & Significance
                    </span>
                    <p className="text-slate-700 leading-relaxed text-sm">
                      {activeInlineDetail.description || activeInlineDetail.specialty}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 border border-slate-200">
                    <div className="flex items-center gap-2.5">
                      <Clock className="h-4 w-4 text-brand-600 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-900 block">Timings</span>
                        <span className="text-slate-600">{activeInlineDetail.timing || "08:00 AM – 06:00 PM"}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Ticket className="h-4 w-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-900 block">Entry / Cost</span>
                        <span className="text-slate-600">{activeInlineDetail.entryFee || activeInlineDetail.priceForTwo || "Free Entry / Nominal Fee"}</span>
                      </div>
                    </div>
                  </div>

                  {activeInlineDetail.mustTry && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                        Must-Try Highlights:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeInlineDetail.mustTry.map((item: string, idx: number) => (
                          <span key={idx} className="rounded-xl bg-slate-100 text-slate-900 px-3 py-1 font-bold border border-slate-200">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Swiggy & Zomato Quick Redirect for Eateries */}
                  {(activeInlineDetail.priceForTwo || activeInlineDetail.famousEatery || activeInlineDetail.category === "food") && (
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                        Order Food Online & Book Tables:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <a
                          href={`https://www.swiggy.com/search?query=${encodeURIComponent(activeInlineDetail.name + " " + (activeInlineDetail.famousEatery || "") + " " + currentLocationData.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-3 px-4 text-xs shadow-md shadow-orange-500/20 transition-all hover:scale-102"
                        >
                          <Utensils className="h-4 w-4" />
                          <span>Order on Swiggy</span>
                        </a>
                        <a
                          href={`https://www.zomato.com/search?q=${encodeURIComponent(activeInlineDetail.name + " " + (activeInlineDetail.famousEatery || "") + " " + currentLocationData.name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold py-3 px-4 text-xs shadow-md shadow-red-600/20 transition-all hover:scale-102"
                        >
                          <Utensils className="h-4 w-4" />
                          <span>View on Zomato</span>
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                    <a
                      href={`https://wa.me/919876543210?text=Namaste!%20I%20want%20to%20visit%20${activeInlineDetail.name}%20in%20${currentLocationData.name}%20and%20need%20a%20local%20guide.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-102"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Hire Guide for this Place</span>
                    </a>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeInlineDetail.name + " " + currentLocationData.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 px-4 py-3.5 font-bold transition-colors"
                    >
                      <Navigation className="h-4 w-4 text-brand-600" />
                      <span>Directions</span>
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              /* REGULAR KNOWLEDGE FEED */
              <>
                {/* 1. WANDERLOG TRIP HERO COVER BANNER */}
                <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 bg-slate-900 group">
                  <div className="relative h-60 sm:h-64 w-full overflow-hidden">
                    <Image
                      src={currentLocationData.coverImage || "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=80"}
                      alt={currentLocationData.name}
                      fill
                      priority
                      unoptimized
                      className="object-cover object-center group-hover:scale-102 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                    <div className="absolute bottom-4 left-5 right-5 text-white flex items-end justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-white/20 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider">
                            {currentLocationData.state}, India
                          </span>
                          <span className="text-white/80 text-[11px] font-semibold flex items-center gap-1">
                            <Sun className="h-3 w-3 text-amber-300" />
                            {currentLocationData.weather}
                          </span>
                        </div>
                        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                          Trip to {currentLocationData.name}
                        </h1>
                        <p className="text-xs text-white/90 font-medium">
                          Created by <strong>Traveler</strong> · {currentLocationData.attractions.length + customPlaces.length} Places to visit
                        </p>
                      </div>

                      <div className="hidden sm:flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (navigator.clipboard) {
                              navigator.clipboard.writeText(window.location.href);
                              alert("Plan link copied to clipboard!");
                            }
                          }}
                          className="flex items-center gap-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-white transition-colors"
                        >
                          <Share2 className="h-3.5 w-3.5" />
                          <span>Share</span>
                        </button>
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-3 py-1.5 text-xs font-bold text-slate-950 transition-colors shadow-md"
                        >
                          <MessageCircle className="h-3.5 w-3.5 fill-slate-950" />
                          <span>Hire Guide</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Wanderlog Section Tabs */}
                  <div className="bg-white border-t border-slate-100 px-4 py-2.5 flex items-center gap-2 overflow-x-auto text-xs font-bold text-slate-600">
                    {[
                      { id: "all", label: "Overview" },
                      { id: "all", label: `Places (${currentLocationData.attractions.length + customPlaces.length})` },
                      { id: "day1", label: "Day 1" },
                      { id: "day2", label: "Day 2" },
                      { id: "day3", label: "Day 3" },
                      { id: "events", label: "Events" },
                    ].map((tab, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setActiveCategoryFilter(tab.id as any);
                          setActiveInlineDetail(null);
                          setActiveToolView(null);
                        }}
                        className={`rounded-xl px-3 py-1.5 transition-colors whitespace-nowrap ${
                          activeCategoryFilter === tab.id
                            ? "bg-slate-900 text-white"
                            : "hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. DYNAMIC LIVE ITINERARY BUDGET SUMMARY & ADD PLACE CTA */}
                <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-5 sm:p-6 text-white shadow-xl border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-blue-500/30 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-blue-300 border border-blue-400/30">
                        💰 Live Trip Budget Engine
                      </span>
                      <span className="text-slate-400 text-xs">•</span>
                      <span className="text-xs text-slate-300 font-bold">
                        {itineraryPlaceIds.length} Places Selected
                      </span>
                    </div>

                    <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                      Estimated Budget: ₹{itineraryPlaceIds.length * 280 + 800}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2.5 text-xs text-indigo-200 font-semibold pt-1">
                      <span>🎟️ Entry Fees: ₹{itineraryPlaceIds.length * 80}</span>
                      <span>•</span>
                      <span>🚗 Cabs & Rentals: ₹{itineraryPlaceIds.length * 150}</span>
                      <span>•</span>
                      <span>🍲 Food & Stays: ₹800</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsAddPlaceModalOpen(true)}
                    className="flex items-center gap-2 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 px-5 py-3 text-xs font-extrabold shadow-lg shadow-amber-400/25 transition-all hover:scale-105 shrink-0"
                  >
                    <MapPin className="h-4 w-4" />
                    <span>+ Add Place to Itinerary</span>
                  </button>
                </div>

                {/* CUSTOM PLACE ADD INLINE MODAL */}
                {isAddPlaceModalOpen && (
                  <div className="rounded-3xl bg-white border-2 border-amber-400 p-5 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h4 className="font-heading text-sm font-extrabold text-slate-900 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-amber-500" />
                        <span>Add Custom Place to Itinerary</span>
                      </h4>
                      <button
                        onClick={() => setIsAddPlaceModalOpen(false)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <form onSubmit={handleAddCustomPlace} className="space-y-3 text-xs">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Place / Attraction Name:</label>
                        <input
                          type="text"
                          required
                          value={newPlaceName}
                          onChange={(e) => setNewPlaceName(e.target.value)}
                          placeholder="e.g. Chokhi Dhani, Galta Ji, Sisodia Rani Garden..."
                          className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-semibold focus:outline-none focus:border-brand-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Entry Ticket Fee:</label>
                          <input
                            type="text"
                            value={newPlaceFee}
                            onChange={(e) => setNewPlaceFee(e.target.value)}
                            placeholder="e.g. ₹50 / Free Entry"
                            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-500"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Visiting Hours:</label>
                          <input
                            type="text"
                            value={newPlaceTiming}
                            onChange={(e) => setNewPlaceTiming(e.target.value)}
                            placeholder="e.g. 09:00 AM – 06:00 PM"
                            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-500"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsAddPlaceModalOpen(false)}
                          className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-xs font-extrabold shadow-md transition-colors"
                        >
                          Add to Itinerary
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* 3. GPS LIVE LOCATION PERMISSION PROMPT BANNER */}
                {gpsStatus === "prompt" && (
                  <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 p-4 text-white shadow-md border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                        <Navigation className="h-5 w-5 text-amber-300 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-white">Enable GPS Audio Guide & Walking Radar?</h4>
                        <p className="text-[11px] text-indigo-200">
                          Detects nearby monuments and speaks aloud history as you walk through {currentLocationData.name}.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={requestGpsPermission}
                        className="rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 px-3.5 py-1.5 text-xs font-bold shadow-sm transition-all"
                      >
                        Allow GPS
                      </button>
                      <button
                        onClick={() => setGpsStatus("denied")}
                        className="rounded-xl bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 text-xs font-bold transition-colors"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. WANDERLOG SECTION: PLACES TO VISIT (CLEAN NUMBERED CARDS WITHOUT BULKY DESCRIPTIONS) */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-extrabold shadow-sm">
                        {currentLocationData.attractions.length + customPlaces.length}
                      </span>
                      <span>Places to visit in {currentLocationData.name}</span>
                    </h3>
                    <span className="text-xs font-bold text-slate-500">
                      {itineraryPlaceIds.length} in Active Plan
                    </span>
                  </div>

                  <div className="space-y-3">
                    {[...currentLocationData.attractions, ...customPlaces].map((attraction, idx) => {
                      const isCardActive = activePlaceId === attraction.id;
                      const isInItinerary = itineraryPlaceIds.includes(attraction.id);
                      const poi = currentLocationData.mapPlaces.find((p) => p.id === attraction.id);
                      const distMeters = userCoords && poi ? calculateDistanceInMeters(userCoords.lat, userCoords.lng, poi.lat, poi.lng) : null;

                      return (
                        <React.Fragment key={attraction.id}>
                          {/* Clean Wanderlog Numbered Place Card (No Heavy Descriptions) */}
                          <div
                            onClick={() => handleOpenPlaceDetail(attraction)}
                            className={`rounded-2xl bg-white border transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md group p-3.5 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 ${
                              isInItinerary
                                ? "border-blue-500 ring-2 ring-blue-500/15 bg-blue-50/20"
                                : "border-slate-200 hover:border-blue-300"
                            }`}
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              {/* Number Badge & Thumbnail */}
                              <div className="relative h-20 w-24 sm:h-20 sm:w-28 shrink-0 rounded-xl overflow-hidden bg-slate-900">
                                <Image
                                  src={attraction.image}
                                  alt={attraction.name}
                                  fill
                                  unoptimized
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-1.5 left-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white font-extrabold text-[10px] shadow border border-white">
                                  {idx + 1}
                                </div>
                              </div>

                              {/* Title & Metadata (Spacious & Clean) */}
                              <div className="space-y-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-heading text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                                    {idx + 1}. {attraction.name}
                                  </h4>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-semibold">
                                  <span className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg text-[11px] font-extrabold text-amber-900">
                                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                    <span>{attraction.rating}</span>
                                    <span className="text-[10px] text-amber-700 font-normal">({attraction.reviewsCount})</span>
                                  </span>
                                  <span>⏰ {attraction.timing}</span>
                                  <span>🎟️ {attraction.entryFee}</span>
                                </div>

                                {distMeters !== null && (
                                  <span className="inline-block text-[11px] font-bold text-emerald-700">
                                    📍 {formatDistance(distMeters)} away
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Action Buttons: Add to Itinerary & Guide */}
                            <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 justify-end">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  togglePlaceInItinerary(attraction.id);
                                }}
                                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                                  isInItinerary
                                    ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                                    : "bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200"
                                }`}
                              >
                                {isInItinerary ? (
                                  <>
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    <span>In Itinerary</span>
                                  </>
                                ) : (
                                  <>
                                    <span>+ Add</span>
                                  </>
                                )}
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenPlaceDetail(attraction);
                                }}
                                className="rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 text-xs font-bold transition-colors"
                              >
                                Details
                              </button>

                              <a
                                href={`https://wa.me/919876543210?text=Namaste!%20I%20want%20to%20visit%20${encodeURIComponent(attraction.name)}%20in%20${currentLocationData.name}.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 text-xs font-bold shadow-xs transition-colors"
                              >
                                <MessageCircle className="h-3.5 w-3.5" />
                                <span>Guide</span>
                              </a>
                            </div>
                          </div>

                          {/* Transit Driving Connector Between Consecutive Stops */}
                          {idx < currentLocationData.attractions.length + customPlaces.length - 1 && (
                            <div className="flex items-center gap-3 px-6 py-0.5 text-[11px] font-bold text-slate-500">
                              <div className="h-3 w-0.5 bg-slate-300 mx-2" />
                              <div className="flex items-center gap-1.5 rounded-full bg-slate-200/80 px-2.5 py-0.5 text-slate-700">
                                <Car className="h-3 w-3 text-slate-600" />
                                <span>🚗 8-12 min drive ({((idx + 1) * 2.3).toFixed(1)} km)</span>
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </section>

                {/* 5. FAMOUS FOODS & RESTAURANTS (WITH SWIGGY & ZOMATO BUTTONS) */}
                {currentLocationData.famousFoods.length > 0 && (
                  <section className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                        <Utensils className="h-5 w-5 text-rose-500" />
                        <span>Iconic Food & Legendary Eateries</span>
                      </h3>
                      <span className="text-xs font-bold text-slate-500">
                        {currentLocationData.famousFoods.length} Places
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {currentLocationData.famousFoods.map((food) => (
                        <div
                          key={food.id}
                          onClick={() => handleOpenPlaceDetail(food)}
                          className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                        >
                          <div className="relative h-36 w-full overflow-hidden bg-slate-900">
                            <Image
                              src={food.image}
                              alt={food.name}
                              fill
                              unoptimized
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                            <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-lg">
                              <span>📍 {food.famousEatery}</span>
                            </div>
                            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-xs font-bold">
                              <span>💰 {food.priceForTwo}</span>
                              <span className="flex items-center gap-1 bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded font-extrabold text-[10px]">
                                <Star className="h-2.5 w-2.5 fill-slate-950" />
                                {food.rating}
                              </span>
                            </div>
                          </div>

                          <div className="p-3.5 space-y-2.5">
                            <div>
                              <h4 className="font-heading text-sm font-extrabold text-slate-900 group-hover:text-rose-600 transition-colors">
                                {food.name}
                              </h4>
                              <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                                {food.specialty}
                              </p>
                            </div>

                            {/* Direct Swiggy & Zomato Ordering Buttons */}
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                              <a
                                href={`https://www.swiggy.com/search?query=${encodeURIComponent(food.name + " " + food.famousEatery + " " + currentLocationData.name)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center justify-center gap-1 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold py-2 text-[11px] shadow-xs transition-colors"
                              >
                                <Utensils className="h-3 w-3" />
                                <span>Swiggy</span>
                              </a>
                              <a
                                href={`https://www.zomato.com/search?q=${encodeURIComponent(food.name + " " + food.famousEatery + " " + currentLocationData.name)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center justify-center gap-1 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold py-2 text-[11px] shadow-xs transition-colors"
                              >
                                <Utensils className="h-3 w-3" />
                                <span>Zomato</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* 6. WANDERLOG EXPLORE GUIDES & CAROUSEL LISTS */}
                <section className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-lg font-extrabold text-slate-900 flex items-center gap-2">
                      <Compass className="h-4 w-4 text-blue-600" />
                      <span>Explore Guides for {currentLocationData.name}</span>
                    </h3>
                    <span className="text-xs font-bold text-slate-500">Wanderlog Curated</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        title: `Best attractions in ${currentLocationData.name}`,
                        placeCount: "49 places",
                        author: "Wanderlog Guides",
                        image: "https://images.unsplash.com/photo-1603204077673-83eb6d4d16fe?auto=format&fit=crop&w=600&q=80",
                      },
                      {
                        title: `Best restaurants in ${currentLocationData.name}`,
                        placeCount: "50 places",
                        author: "Local Food Explorers",
                        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
                      },
                      {
                        title: `3-Day ${currentLocationData.name} Itinerary`,
                        placeCount: "18 places",
                        author: "Roberto Soriano",
                        image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80",
                      },
                      {
                        title: `10 Attractions within 100 Km of ${currentLocationData.name}`,
                        placeCount: "10 places",
                        author: "Shakeer Raj",
                        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80",
                      },
                    ].map((guide, gIdx) => (
                      <div
                        key={gIdx}
                        onClick={() => setActiveToolView("planner")}
                        className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                      >
                        <div className="relative h-28 w-full overflow-hidden bg-slate-900">
                          <Image
                            src={guide.image}
                            alt={guide.title}
                            fill
                            unoptimized
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                          <div className="absolute bottom-2 left-3 right-3 text-white">
                            <span className="rounded bg-black/50 px-2 py-0.5 text-[10px] font-bold">
                              {guide.placeCount}
                            </span>
                          </div>
                        </div>

                        <div className="p-3">
                          <h4 className="font-heading text-xs font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {guide.title}
                          </h4>
                          <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
                            By {guide.author}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 8. WhatsApp Local Concierge Banner */}
                <div className="relative rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 p-6 text-white shadow-xl border border-emerald-500/30 overflow-hidden space-y-4">
                  <div className="flex flex-col gap-2 relative z-10">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-extrabold text-emerald-300 border border-emerald-500/30 w-fit">
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>Live Concierge Desk</span>
                    </div>

                    <h4 className="font-heading text-lg sm:text-xl font-extrabold text-white">
                      Hire a Verified Local Guide in {currentLocationData.name}
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      Connect directly on WhatsApp with government-licensed local guides for private haveli walks, fort excursions, and cab rentals.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-emerald-900/60 flex items-center justify-between gap-3 relative z-10">
                    <span className="text-[11px] font-bold text-emerald-300">
                      ★ 4.9 (380+ tours in {currentLocationData.name})
                    </span>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-3 text-xs font-extrabold shadow-lg shadow-emerald-500/25 transition-all hover:scale-102 shrink-0"
                    >
                      <MessageCircle className="h-4 w-4 fill-slate-950 text-emerald-500" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>

        {/* C. RIGHT COLUMN: FULL-HEIGHT SPLIT-SCREEN MAP VIEW */}
        <div className="hidden md:block w-1/2 shrink-0 h-full border-l border-slate-200/80 relative">
          <SplitScreenMap
            selectedCity={currentLocationData.name}
            cityCoords={currentLocationData.coords}
            places={currentLocationData.mapPlaces}
            activePlaceId={activePlaceId}
            onSelectPlace={(p) => handleOpenPlaceDetail(p)}
            onUserLocationFound={(coords) => {
              setUserCoords(coords);
              setGpsStatus("tracking");
            }}
          />
        </div>
      </div>

      {/* Floating AI Assistant Button (Opens AI Guide Directly In Window) */}
      <button
        onClick={() => {
          setActiveToolView("ai");
          setActiveInlineDetail(null);
        }}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-brand-600 via-jaipur-pink to-purple-600 text-white shadow-2xl shadow-brand-500/40 hover:scale-110 transition-transform"
        title="Open AI Virtual Tourist Guide"
      >
        <Sparkles className="h-6 w-6 text-amber-300 animate-spin-slow" />
      </button>
    </div>
  );
}
