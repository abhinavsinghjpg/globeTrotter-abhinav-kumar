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
  Clock,
  Shield,
  Star,
  Search,
  ExternalLink,
  Navigation,
  Sun,
  Ticket,
  Eye,
  Bookmark,
  Send,
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
    id: string;
    name: string;
    subName: string;
    category: string;
    description: string;
    status: "Open" | "Temporarily Closed";
    statusDetail: string;
    entryFee: string;
    timing: string;
    image: string;
    hiddenGem?: boolean;
    reelsCount?: string;
    rating: number;
    reviewsCount: string;
    address: string;
  }[];
  famousFoods: {
    id: string;
    name: string;
    famousEatery: string;
    specialty: string;
    priceForTwo: string;
    rating: number;
    reviewsCount: string;
    address: string;
    timing: string;
    mustTry: string[];
    image: string;
  }[];
  culturalShops: {
    id: string;
    name: string;
    bazaar: string;
    specialties: string[];
    description: string;
    priceRange: string;
    rating: number;
    reviewsCount: string;
    timing: string;
    image: string;
  }[];
  upcomingEvents: {
    name: string;
    dates: string;
    venue: string;
    description: string;
    tag: string;
    ticketType: string;
  }[];
  activities: {
    name: string;
    provider: string;
    cost: string;
    duration: string;
    description: string;
    image: string;
    tag: string;
  }[];
}

const ALL_CITIES_INTELLIGENCE: Record<string, CityIntelligence> = {
  Jaipur: {
    name: "Jaipur",
    state: "Rajasthan",
    tagline: "The Regal Pink City of Hill Forts, Fragrant Pyaaz Kachoris & Centuries of Kundan Craftsmanship",
    coords: { lat: 26.9124, lng: 75.7873 },
    coverImage: "https://images.unsplash.com/photo-1603204077673-83eb6d4d16fe?auto=format&fit=crop&w=1600&q=80",
    bestTimeToVisit: "October to March",
    weather: "24°C / 14°C (Sunny & Pleasant)",
    mapPlaces: [
      {
        id: "attr-1",
        name: "Hawa Mahal",
        hindiName: "हवा महल (Palace of Winds)",
        category: "attraction",
        lat: 26.9239,
        lng: 75.8267,
        description: "Iconic 5-story pink honeycomb palace with 953 jharokhas built in 1799 by Maharaja Sawai Pratap Singh so royal women could observe street festivities.",
        image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
        rating: 4.7,
        reviewsCount: "18,400+ Google Reviews",
        status: "Open (09:00 AM - 05:00 PM)",
        entryFee: "₹50 (Indians) · ₹200 (Foreigners)",
        timing: "09:00 AM – 05:00 PM (Daily)",
        address: "Hawa Mahal Rd, Badi Choupad, Pink City, Jaipur",
        specialties: ["953 Latticed Jharokhas", "Wind Palace Architecture", "Rooftop Views of City Palace"],
      },
      {
        id: "attr-2",
        name: "Amer Fort",
        hindiName: "आमेर का किला (Sheesh Mahal)",
        category: "attraction",
        lat: 26.9855,
        lng: 75.8513,
        description: "Grand hilltop sandstone citadel overlooking Maota Lake, famous for the opulent Sheesh Mahal (Mirror Palace) and Diwan-e-Aam.",
        image: "https://images.unsplash.com/photo-1603204077673-83eb6d4d16fe?auto=format&fit=crop&w=800&q=80",
        rating: 4.8,
        reviewsCount: "32,900+ Google Reviews",
        status: "Open (08:00 AM - 05:30 PM)",
        entryFee: "₹100 (Indians) · ₹550 (Foreigners)",
        timing: "08:00 AM – 05:30 PM (Daily)",
        address: "Devisinghpura, Amer, Jaipur",
        specialties: ["Sheesh Mahal (Mirror Palace)", "Maota Lake View", "Ganesh Pol Gate"],
      },
      {
        id: "attr-3",
        name: "Nahargarh Fort",
        hindiName: "नाहरगढ़ फोर्ट (Sunset Point)",
        category: "attraction",
        lat: 26.9378,
        lng: 75.8156,
        description: "Dramatic hilltop fortress atop the Aravalli hills with sweeping panoramic views over the entire Jaipur skyline, celebrated for golden sunset hours.",
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
        rating: 4.8,
        reviewsCount: "14,800+ Google Reviews",
        status: "Open (10:00 AM - 10:00 PM)",
        entryFee: "₹50 (Indians) · ₹200 (Foreigners)",
        timing: "10:00 AM – 10:00 PM (Daily)",
        address: "Krishna Nagar, Brahampuri, Jaipur",
        specialties: ["Sunset Ridge Ramparts", "Madhavendra Bhawan", "City Skyline Night View"],
      },
      {
        id: "attr-4",
        name: "Panna Meena Kund",
        hindiName: "पन्ना मीना का कुंड (Stepwell)",
        category: "attraction",
        lat: 26.9897,
        lng: 75.8569,
        description: "16th-century geometric stepwell with interlocking criss-cross staircases that create optical illusions. A tranquil hidden gem near Amer Fort.",
        image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
        rating: 4.6,
        reviewsCount: "3,200+ Google Reviews",
        status: "Open (Free Entry)",
        entryFee: "Free Public Entry",
        timing: "07:00 AM – 06:00 PM",
        address: "Near Amer Fort, Jaipur",
        specialties: ["Symmetrical Geometry", "Hidden Heritage", "Photography Spot"],
      },
      {
        id: "food-1",
        name: "Rawat Mishtan",
        hindiName: "रावत मिष्ठान भंडार (Pyaaz Kachori)",
        category: "food",
        lat: 26.9208,
        lng: 75.7972,
        description: "World-famous legendary sweet & snack house renowned across India for hot, crispy Pyaaz Kachoris and sweet Mawa Kachoris.",
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
        rating: 4.7,
        reviewsCount: "42,000+ Google Reviews",
        status: "Open (06:00 AM - 10:30 PM)",
        price: "₹350 for two",
        entryFee: "₹350 for two (Avg Cost)",
        timing: "06:00 AM – 10:30 PM (Daily)",
        address: "Station Road, Sindhi Camp, Jaipur",
        specialties: ["Crisp Pyaaz Kachori", "Mirchi Vada", "Sweet Mawa Kachori", "Lassi"],
      },
      {
        id: "food-2",
        name: "Laxmi Mishtan (LMB)",
        hindiName: "एल.एम.बी. जोहरी बाजार (Ghevar)",
        category: "food",
        lat: 26.9205,
        lng: 75.8252,
        description: "Historic Johari Bazaar institution dating to 1727, famous for authentic honeycomb Paneer Ghevar and traditional Royal Rajasthani Thali.",
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
        rating: 4.6,
        reviewsCount: "28,500+ Google Reviews",
        status: "Open (08:00 AM - 11:00 PM)",
        price: "₹1,200 for two",
        entryFee: "₹1,200 for two",
        timing: "08:00 AM – 11:00 PM (Daily)",
        address: "Johari Bazaar, Pink City, Jaipur",
        specialties: ["Paneer Ghevar", "Royal Rajasthani Thali", "Dal Baati Churma"],
      },
      {
        id: "food-3",
        name: "Chokhi Dhani",
        hindiName: "चोखी ढाणी विलेज (Rajasthani Thali)",
        category: "food",
        lat: 26.7673,
        lng: 75.8285,
        description: "Traditional Rajasthani ethnic village resort with live folk dances, camel rides, fire shows, and unlimited Chaupal thali dining.",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
        rating: 4.7,
        reviewsCount: "35,100+ Google Reviews",
        status: "Open (05:00 PM - 11:00 PM)",
        price: "₹2,200 for two",
        entryFee: "₹1,100 / person (Includes Village Entry & Feast)",
        timing: "05:00 PM – 11:00 PM",
        address: "12 Miles Tonk Road, Jaipur",
        specialties: ["Chaupal Feast on Leaf Plates", "Bajre Ki Roti & Ghee", "Folk Dance Performances"],
      },
      {
        id: "shop-1",
        name: "Johari Bazaar",
        hindiName: "जौहरी बाज़ार (Kundan Jewelry)",
        category: "shopping",
        lat: 26.9212,
        lng: 75.8256,
        description: "World-renowned gemstone and jewelry market where master artisans have crafted Kundan Polki and Meenakari ornaments for over 200 years.",
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
        rating: 4.8,
        reviewsCount: "12,400+ Google Reviews",
        status: "Open (10:30 AM - 08:30 PM)",
        entryFee: "Free Entry (Shopping Hub)",
        timing: "10:30 AM – 08:30 PM",
        address: "Johari Bazaar Road, Pink City, Jaipur",
        specialties: ["Kundan Polki Jewelry", "Meenakari Enamel", "Precious Gemstones"],
      },
      {
        id: "shop-2",
        name: "Bapu Bazaar",
        hindiName: "बापू बाज़ार (Bandhej Sarees)",
        category: "shopping",
        lat: 26.9189,
        lng: 75.8214,
        description: "Famous terracotta-pink market corridor for colorful Bandhani and Leheriya sarees, handcrafted camel leather mojaris, and Jaipuri quilts.",
        image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=800&q=80",
        rating: 4.6,
        reviewsCount: "19,200+ Google Reviews",
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
        description: "A breathtaking 5-story pink honeycomb facade with 953 intricate jharokhas (latticed windows) built in 1799 by Maharaja Sawai Pratap Singh so royal women could observe street festivals.",
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
        subName: "Hilltop Amber Citadel",
        category: "UNESCO World Heritage Site",
        description: "Majestic yellow sandstone citadel perched high on the Aravalli hills overlooking Maota Lake. Famous for the opulent Sheesh Mahal (Hall of Mirrors), Diwan-e-Aam, and elephant pathways.",
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
        id: "attr-4",
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
        id: "attr-5",
        name: "Galta Ji (Monkey Temple Trail)",
        subName: "Holy Springs & Hill Pass",
        category: "Ancient Temple Complex",
        description: "Series of sacred water pavilions and holy natural springs built into a narrow mountain pass. Note: Upper trail is undergoing monsoon stone restoration.",
        status: "Temporarily Closed",
        statusDetail: "Trail Restoration in Progress",
        entryFee: "Free Entry",
        timing: "05:00 AM – 09:00 PM",
        image: "https://images.unsplash.com/photo-1598890777032-bde835ba27c2?auto=format&fit=crop&w=800&q=80",
        hiddenGem: true,
        rating: 4.5,
        reviewsCount: "5,600+ reviews",
        address: "Galtaji Pass, Khania-Balaji, Jaipur",
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
        reviewsCount: "42,000+ reviews",
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
        reviewsCount: "28,500+ reviews",
        address: "Johari Bazaar, Pink City, Jaipur",
        timing: "08:00 AM – 11:00 PM",
        mustTry: ["Paneer Ghevar", "Royal Rajasthani Thali", "Ker Sangri", "Rajbhog"],
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "food-3",
        name: "Chaupal Feasting with Ghee & Gur",
        famousEatery: "Chokhi Dhani Cultural Village",
        specialty: "Immersive traditional dining served on leaf plates with hand-crushed Bajre Ki Roti, pure desi ghee, jaggery, garlic chutney, and live Rajasthani folk music.",
        priceForTwo: "₹2,200 for two (Includes Village Entry)",
        rating: 4.7,
        reviewsCount: "35,100+ reviews",
        address: "12 Miles Tonk Road, Jaipur",
        timing: "05:00 PM – 11:00 PM",
        mustTry: ["Unlimited Chaupal Thali", "Bajre Ki Roti with Ghee", "Churma Trio", "Kadhi"],
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
      },
    ],
    culturalShops: [
      {
        id: "shop-1",
        name: "Johari Bazaar Jewelry Quarter",
        bazaar: "Pink City Heritage Corridor",
        specialties: ["Kundan Polki Jewelry", "Meenakari Enamel Work", "Natural Emeralds & Rubies", "Silver Heritage Necklaces"],
        description: "World-famous gemstone and jewelry hub where royal courts have commissioned exquisite Kundan and Meenakari wedding ornaments for over 200 years.",
        priceRange: "₹₹₹ (Fixed & Custom Orders)",
        rating: 4.8,
        reviewsCount: "12,400+ reviews",
        timing: "10:30 AM – 08:30 PM",
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "shop-2",
        name: "Bapu Bazaar Cultural Textiles & Footwear",
        bazaar: "Terracotta Pink Colonnade",
        specialties: ["Bandhej & Leheriya Sarees", "Camel Leather Mojaris", "Hand-quilted Jaipuri Razai", "Sanganeri Block Prints"],
        description: "Vibrant pink market street renowned for handloom textiles, pure cotton block prints, and handcrafted camel leather mojaris.",
        priceRange: "₹₹ (Bargaining Welcome)",
        rating: 4.6,
        reviewsCount: "19,200+ reviews",
        timing: "11:00 AM – 09:00 PM",
        image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "shop-3",
        name: "Kripal Kumbh Traditional Blue Pottery",
        bazaar: "Bani Park Heritage Workshop",
        specialties: ["Turquoise Blue Pottery", "Hand-painted Quartz Plates", "Royal Glazed Vases", "Decorative Tiles"],
        description: "Founded by legendary artist Padma Shri Kripal Singh Shekhawat, producing traditional Jaipur blue pottery made with quartz stone rather than regular clay.",
        priceRange: "₹₹ (Artisanal Authentic)",
        rating: 4.8,
        reviewsCount: "2,800+ reviews",
        timing: "10:00 AM – 07:00 PM",
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
      },
      {
        name: "Teej Royal Procession & Fair",
        dates: "August 16 – 18, 2026",
        venue: "Tripolia Gate to Chaugan Stadium, Pink City",
        description: "Grand traditional procession honoring Goddess Parvati, featuring royal palanquins, caparisoned elephants, folk dancers, and camel bands winding through the historic walled city.",
        tag: "Royal Heritage Festival",
        ticketType: "Open Public Viewing",
      },
    ],
    activities: [
      {
        name: "SkyWaltz Sunrise Hot Air Balloon Safari",
        provider: "SkyWaltz Balloon Safaris",
        cost: "₹12,500 / person",
        duration: "3 Hours (60 mins airtime)",
        description: "Float 2,000 feet above the rugged Aravalli ridges and Amer Fort as golden morning light illuminates the desert landscape.",
        image: "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=800&q=80",
        tag: "Bucket List Adventure",
      },
      {
        name: "Nahargarh Sunrise Bicycle Expedition",
        provider: "Le Tour De India",
        cost: "₹1,800 / person",
        duration: "2.5 Hours",
        description: "Guided uphill morning cycling journey through winding forest trails up to Nahargarh Fort, followed by piping hot masala chai at the summit.",
        image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80",
        tag: "Morning Fitness & Views",
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
    weather: "26°C / 16°C (Pleasant Breeze)",
    mapPlaces: [
      {
        id: "u-attr-1",
        name: "City Palace of Udaipur",
        category: "attraction",
        lat: 24.5764,
        lng: 73.6835,
        description: "Enormous lakeside palace complex with crystal gallery and marble balconies.",
        rating: 4.8,
        status: "Open",
      },
      {
        id: "u-attr-2",
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
        id: "u-attr-1",
        name: "City Palace of Udaipur",
        subName: "Lakeside Rajput Citadel",
        category: "Royal Heritage Complex",
        description: "Magnificent marble palace towering over Lake Pichola, featuring mirror-inlaid halls, courtyards, and hanging gardens.",
        status: "Open",
        statusDetail: "Closes at 5:30 PM",
        entryFee: "₹300 (Adults)",
        timing: "09:30 AM – 05:30 PM",
        image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
        rating: 4.8,
        reviewsCount: "24,500+ reviews",
        address: "Old City, Udaipur",
      },
    ],
    famousFoods: [
      {
        id: "u-food-1",
        name: "Authentic Lal Maas & Lake View Dining",
        famousEatery: "Tribute Restaurant",
        specialty: "Fiery mutton curry simmered with Mathaniya red chilies, served with fresh garlic naans overlooking Fateh Sagar Lake.",
        priceForTwo: "₹1,400 for two",
        rating: 4.7,
        reviewsCount: "8,900+ reviews",
        address: "Fateh Sagar Lake, Udaipur",
        timing: "11:00 AM – 11:00 PM",
        mustTry: ["Lal Maas", "Gatta Curry", "Safed Maas", "Garlic Naan"],
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
      },
    ],
    culturalShops: [
      {
        id: "u-shop-1",
        name: "Hathi Pol Miniature Painting Bazaar",
        bazaar: "Hathi Pol Heritage Street",
        specialties: ["Mewari Miniature Paintings", "Pichwai Silk Art", "Silver Jewelry"],
        description: "Renowned market of master miniature artists creating detailed Mewar court paintings on silk and camel bone.",
        priceRange: "₹₹",
        rating: 4.7,
        reviewsCount: "4,500+ reviews",
        timing: "10:30 AM – 08:30 PM",
        image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=800&q=80",
      },
    ],
    upcomingEvents: [],
    activities: [],
  },
  Delhi: {
    name: "Delhi",
    state: "Delhi NCR",
    tagline: "The Historic Capital of Mughal Forts, Saffron Curries & Endless Bazaars",
    coords: { lat: 28.6139, lng: 77.2090 },
    coverImage: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1600&q=80",
    bestTimeToVisit: "October to March",
    weather: "22°C / 12°C",
    mapPlaces: [],
    attractions: [],
    famousFoods: [],
    culturalShops: [],
    upcomingEvents: [],
    activities: [],
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
  },
};

export default function HomePage() {
  const [selectedCityName, setSelectedCityName] = useState<string>("Jaipur");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<
    "all" | "attractions" | "food" | "shops" | "events" | "activities"
  >("all");
  const [activePlaceId, setActivePlaceId] = useState<string | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);

  const city = ALL_CITIES_INTELLIGENCE[selectedCityName] || ALL_CITIES_INTELLIGENCE["Jaipur"];

  const whatsappUrl = `https://wa.me/919876543210?text=Namaste!%20I%20am%20exploring%20${city.name}%20and%20need%20a%20verified%20local%20guide%20and%20food%20recommendations.`;

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-100 text-slate-900 overflow-hidden font-sans antialiased">
      {/* 1. TOP GLOBAL HEADER */}
      <header className="h-16 shrink-0 border-b border-slate-200 bg-white px-5 flex items-center justify-between z-30 shadow-xs">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 via-jaipur-pink to-amber-500 text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Compass className="h-5 w-5" />
            </div>
            <div className="leading-none">
              <span className="font-heading text-lg font-extrabold tracking-tight text-slate-900">
                Globe<span className="text-brand-600">Trotter</span>
              </span>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                India Travel Intel
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Fast City Switcher Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {Object.keys(ALL_CITIES_INTELLIGENCE).map((cityName) => {
            const isSelected = selectedCityName === cityName;
            return (
              <button
                key={cityName}
                onClick={() => {
                  setSelectedCityName(cityName);
                  setActivePlaceId(null);
                }}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all shrink-0 ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/15 scale-102"
                    : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80"
                }`}
              >
                <MapPin className="h-3.5 w-3.5" />
                <span>{cityName}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-102"
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
            className="flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-xs"
            title="Share"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* 2. SPLIT WORKSPACE BODY */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* A. LEFT NAVIGATION SIDEBAR */}
        {!isSidebarHidden && (
          <aside className="w-60 shrink-0 border-r border-slate-200 bg-white flex flex-col justify-between p-4 overflow-y-auto select-none">
            <div className="space-y-5">
              {/* ✨ AI Assistant Gradient Button */}
              <button
                onClick={() => setIsAiModalOpen(true)}
                className="w-full flex items-center gap-3 rounded-2xl bg-gradient-to-r from-brand-600 via-jaipur-pink to-purple-600 p-3.5 text-white font-bold text-xs shadow-lg shadow-brand-500/25 hover:opacity-95 transition-all hover:scale-102 group"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                  <Sparkles className="h-4 w-4 text-amber-300 animate-pulse" />
                </div>
                <div className="text-left leading-tight">
                  <span className="block font-bold text-sm">AI Guide</span>
                  <span className="text-[10px] text-white/80 font-medium">Ask about {city.name}</span>
                </div>
              </button>

              {/* Navigation Categories Filter */}
              <div className="space-y-1">
                <span className="px-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">
                  Browse {city.name}
                </span>

                {[
                  { id: "all", label: "All Highlights", icon: Compass, color: "text-brand-500" },
                  { id: "attractions", label: "Forts & Palaces", icon: MapPin, color: "text-amber-500" },
                  { id: "food", label: "Food Stalls & Eateries", icon: Utensils, color: "text-rose-500" },
                  { id: "shops", label: "Cultural Bazaars", icon: ShoppingBag, color: "text-purple-500" },
                  { id: "events", label: "Festivals & Events", icon: Calendar, color: "text-blue-500" },
                  { id: "activities", label: "Adventure & Safaris", icon: Flame, color: "text-orange-500" },
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

                <div className="pt-3 border-t border-slate-100 mt-3">
                  <Link
                    href="/admin"
                    className="w-full flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-amber-800 hover:bg-amber-50 transition-colors"
                  >
                    <Shield className="h-4 w-4 text-amber-600" />
                    <span>Admin Operations</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar Bottom Controls */}
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

        {/* Unhide Sidebar Button */}
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
            {/* 1. Hero Panoramic Cover Card */}
            <div className="relative h-64 sm:h-72 w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 group">
              <Image
                src={city.coverImage}
                alt={city.name}
                fill
                priority
                className="object-cover object-center group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 rounded-2xl bg-white/95 backdrop-blur-xl p-5 shadow-xl border border-white/60 space-y-2.5 text-slate-900">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-jaipur-pink/15 text-jaipur-pink px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider">
                        {city.state}, India
                      </span>
                      <span className="text-slate-400 text-xs">•</span>
                      <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                        <Sun className="h-3 w-3 text-amber-500" />
                        {city.weather}
                      </span>
                    </div>

                    <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                      {city.name}
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

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {city.tagline}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-600 pt-2 border-t border-slate-100">
                  <span>🗓️ Best Season: <strong className="text-slate-900">{city.bestTimeToVisit}</strong></span>
                  <span>📍 {city.attractions.length} Heritage Sites</span>
                </div>
              </div>
            </div>

            {/* 2. Live Place Status Alert Bar (§28 PRD) */}
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3 text-xs text-amber-900 shadow-xs">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <span className="font-bold block text-xs text-amber-950">
                  Live Monument Operational Status Alert (§28 PRD)
                </span>
                <p className="text-amber-900 leading-relaxed font-medium">
                  All major forts in {city.name} (Hawa Mahal, Amer Fort, City Palace) are <strong>Open</strong> today. Galta Ji upper mountain trail has stone restoration ongoing.
                </p>
              </div>
            </div>

            {/* 3. FAMOUS FORTS & ATTRACTIONS (World-Class Clean Full-Width Cards) */}
            {(activeCategoryFilter === "all" || activeCategoryFilter === "attractions") && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <Compass className="h-5 w-5 text-brand-500" />
                    Famous Forts, Palaces & Hidden Spots
                  </h3>
                  <span className="text-xs font-bold text-slate-500">{city.attractions.length} Places</span>
                </div>

                <div className="space-y-4">
                  {city.attractions.map((attraction) => {
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
                        {/* 16:9 Full Top Image with Overlay Badges */}
                        <div className="relative h-56 sm:h-64 w-full overflow-hidden">
                          <Image
                            src={attraction.image}
                            alt={attraction.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30" />

                          {/* Top Badges */}
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

                          {/* Bottom Image Info */}
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

                        {/* Card Body Information */}
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

                          {/* Meta Information Bar */}
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

                          {/* Action Footer */}
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
                                href={`https://wa.me/919876543210?text=Namaste!%20I%20want%20to%20visit%20${attraction.name}%20in%20${city.name}.`}
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

            {/* 4. FAMOUS FOODS & ICONIC EATERIES */}
            {(activeCategoryFilter === "all" || activeCategoryFilter === "food") && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-jaipur-pink" />
                    Famous Foods & Iconic Eateries in {city.name}
                  </h3>
                  <span className="text-xs font-bold text-slate-500">Legendary Flavors</span>
                </div>

                <div className="space-y-4">
                  {city.famousFoods.map((food) => {
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
            {(activeCategoryFilter === "all" || activeCategoryFilter === "shops") && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-purple-600" />
                    Centuries-Old Cultural Shops & Bazaars
                  </h3>
                  <span className="text-xs font-bold text-slate-500">Heritage Crafts</span>
                </div>

                <div className="space-y-4">
                  {city.culturalShops.map((shop) => (
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

            {/* 6. UPCOMING EVENTS & FESTIVALS */}
            {(activeCategoryFilter === "all" || activeCategoryFilter === "events") && city.upcomingEvents.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-amber-600" />
                    Major Upcoming Events & Festivals in {city.name}
                  </h3>
                </div>

                <div className="space-y-4">
                  {city.upcomingEvents.map((evt, idx) => (
                    <div
                      key={idx}
                      className="rounded-3xl bg-white border-l-4 border-l-brand-500 border border-slate-200/90 p-6 shadow-sm hover:shadow-lg transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="rounded-full bg-brand-50 text-brand-700 px-3 py-1 font-extrabold uppercase">
                          {evt.tag}
                        </span>
                        <span className="font-extrabold text-brand-600">{evt.dates}</span>
                      </div>

                      <h4 className="font-heading text-xl font-bold text-slate-900">
                        {evt.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {evt.description}
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500 font-bold">
                        <span>📍 Venue: {evt.venue}</span>
                        <span className="text-emerald-700 font-bold">{evt.ticketType}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 7. ADVENTURE & SAFARIS */}
            {(activeCategoryFilter === "all" || activeCategoryFilter === "activities") && city.activities.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <Flame className="h-5 w-5 text-brand-600" />
                    Adventure Sports & Safaris in {city.name}
                  </h3>
                </div>

                <div className="space-y-4">
                  {city.activities.map((act, idx) => (
                    <div
                      key={idx}
                      className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
                    >
                      <div className="relative h-52 sm:h-56 w-full overflow-hidden">
                        <Image
                          src={act.image}
                          alt={act.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30" />

                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className="rounded-full bg-brand-600/90 backdrop-blur-md px-3 py-1 text-[11px] font-extrabold text-white uppercase shadow">
                            {act.tag}
                          </span>
                          <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-extrabold text-white shadow">
                            {act.cost}
                          </span>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-bold">
                          <span>Operator: {act.provider}</span>
                          <span>⏱️ {act.duration}</span>
                        </div>
                      </div>

                      <div className="p-5 space-y-2">
                        <h4 className="font-heading text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                          {act.name}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {act.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 8. WhatsApp Local Concierge Banner */}
            <div className="rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 p-7 sm:p-8 text-white shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-emerald-500/30">
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/30 px-3.5 py-1 text-xs font-extrabold text-emerald-300">
                  <MessageCircle className="h-4 w-4" />
                  Live Local Concierge Desk
                </div>
                <h4 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                  Want to hire a verified local guide in {city.name}?
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
            selectedCity={city.name}
            cityCoords={city.coords}
            places={city.mapPlaces}
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
        currentCity={city.name}
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
}
