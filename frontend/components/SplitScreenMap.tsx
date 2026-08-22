"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Search,
  Plus,
  Minus,
  Navigation,
  Compass,
  Utensils,
  Hotel,
  Layers,
  Sparkles,
  ExternalLink,
  Star,
  CheckCircle2,
  Share2,
  Crosshair,
  MapPin,
  Clock,
  Ticket,
  MessageCircle,
  X,
  Phone,
  Info,
  Camera,
  Heart,
} from "lucide-react";

export interface MapPlace {
  id: string;
  name: string;
  hindiName?: string;
  category: "attraction" | "food" | "hotel" | "shopping";
  lat: number;
  lng: number;
  description: string;
  image?: string;
  rating?: number;
  reviewsCount?: string;
  status?: string;
  statusDetail?: string;
  price?: string;
  entryFee?: string;
  timing?: string;
  address?: string;
  insiderTip?: string;
  specialties?: string[];
}

interface SplitScreenMapProps {
  selectedCity: string;
  cityCoords: { lat: number; lng: number };
  places: MapPlace[];
  activePlaceId?: string | null;
  onSelectPlace?: (place: MapPlace) => void;
  onUserLocationFound?: (coords: { lat: number; lng: number }) => void;
}

declare global {
  interface Window {
    L: any;
  }
}

const GOOGLE_TILE_LAYERS = {
  roadmap: {
    name: "Google Standard Map",
    url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
  },
  hybrid: {
    name: "Google Satellite Hybrid",
    url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
  },
  terrain: {
    name: "Google Terrain",
    url: "https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
  },
};

export const SplitScreenMap: React.FC<SplitScreenMapProps> = ({
  selectedCity,
  cityCoords,
  places,
  activePlaceId,
  onSelectPlace,
  onUserLocationFound,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const userMarkerRef = useRef<any>(null);
  const pinDropModeRef = useRef(false);
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const [isPinDropMode, setIsPinDropMode] = useState(false);

  const [mapReady, setMapReady] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "attraction" | "food" | "hotel" | "shopping">("all");
  const [currentLayerType, setCurrentLayerType] = useState<"roadmap" | "hybrid" | "terrain">("roadmap");
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlaceInfo, setSelectedPlaceInfo] = useState<MapPlace | null>(null);

  // 1. Initialize Leaflet Map with Google Maps Tiles
  useEffect(() => {
    let isMounted = true;

    const loadLeaflet = () => {
      if (!document.getElementById("leaflet-cdn-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-cdn-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      if (window.L) {
        initMap();
      } else {
        const script = document.createElement("script");
        script.id = "leaflet-cdn-js";
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.async = true;
        script.onload = () => {
          if (isMounted) initMap();
        };
        document.body.appendChild(script);
      }
    };

    const initMap = () => {
      if (!mapContainerRef.current || !window.L || mapInstanceRef.current) return;

      const L = window.L;
      const map = L.map(mapContainerRef.current, {
        center: [cityCoords.lat, cityCoords.lng],
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
      });

      const initialLayer = L.tileLayer(GOOGLE_TILE_LAYERS[currentLayerType].url, {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
      }).addTo(map);

      // Map click handler for dropping custom location pin
      map.on("click", (e: any) => {
        if (pinDropModeRef.current) {
          renderUserPositionOnMap(e.latlng.lat, e.latlng.lng, "📍 Custom Location (Drag to move)");
          setIsPinDropMode(false);
          pinDropModeRef.current = false;
        }
      });

      tileLayerRef.current = initialLayer;
      mapInstanceRef.current = map;
      if (isMounted) setMapReady(true);
    };

    loadLeaflet();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Change Tile Layer Style
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L || !tileLayerRef.current) return;
    const L = window.L;
    const map = mapInstanceRef.current;

    map.removeLayer(tileLayerRef.current);
    const newLayer = L.tileLayer(GOOGLE_TILE_LAYERS[currentLayerType].url, {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }).addTo(map);

    tileLayerRef.current = newLayer;
  }, [currentLayerType]);

  // 3. Render Google Maps-Style POI Pins
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;

    const L = window.L;
    const map = mapInstanceRef.current;

    // Smooth fly to current destination
    map.flyTo([cityCoords.lat, cityCoords.lng], 13, { duration: 1.2 });

    // Clear old markers
    markersRef.current.forEach((marker) => map.removeLayer(marker));
    markersRef.current.clear();

    // Filter places
    const visiblePlaces = places.filter(
      (p) =>
        (activeFilter === "all" || p.category === activeFilter) &&
        (searchQuery === "" || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    visiblePlaces.forEach((place, index) => {
      const isAttraction = place.category === "attraction";
      const isFood = place.category === "food";
      const isHotel = place.category === "hotel";
      const isShopping = place.category === "shopping";

      const pinColor = isHotel
        ? "#e11d48"
        : isFood
        ? "#f97316"
        : isShopping
        ? "#8b5cf6"
        : "#3b82f6"; // Wanderlog blue

      const textColor = isHotel
        ? "#be123c"
        : isFood
        ? "#c2410c"
        : isShopping
        ? "#6d28d9"
        : "#1d4ed8";

      const isSelected = selectedPlaceInfo?.id === place.id || activePlaceId === place.id;
      const hindiTranslation = place.hindiName || place.name;

      const customIcon = L.divIcon({
        className: "custom-google-poi",
        html: `
          <div style="
            display: flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            user-select: none;
            transform: ${isSelected ? "scale(1.3)" : "scale(1)"};
            transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
            filter: drop-shadow(0 3px 6px rgba(0,0,0,0.35));
          ">
            <div style="
              width: 26px;
              height: 26px;
              border-radius: 50%;
              background: ${pinColor};
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 8px rgba(0,0,0,0.4);
              border: 2.5px solid #ffffff;
              color: #ffffff;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              font-size: 11.5px;
              font-weight: 800;
              flex-shrink: 0;
            ">
              ${index + 1}
            </div>

            <div style="
              display: flex;
              flex-direction: column;
              text-shadow: -1.5px -1.5px 0 #fff, 1.5px -1.5px 0 #fff, -1.5px 1.5px 0 #fff, 1.5px 1.5px 0 #fff, 0 0 5px #fff;
              line-height: 1.15;
            ">
              <span style="
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 11.5px;
                font-weight: 800;
                color: ${textColor};
                white-space: nowrap;
              ">
                ${place.name}
              </span>
              <span style="
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 10px;
                font-weight: 700;
                color: ${textColor};
                opacity: 0.95;
                white-space: nowrap;
              ">
                ${hindiTranslation}
              </span>
            </div>
          </div>
        `,
        iconSize: [170, 32],
        iconAnchor: [13, 13],
      });

      const marker = L.marker([place.lat, place.lng], { icon: customIcon }).addTo(map);

      // CLICK ACTION ON MAP MARKER -> OPENS COMPLETE DETAILS DRAWER
      marker.on("click", () => {
        setSelectedPlaceInfo(place);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([place.lat, place.lng], 15, { duration: 0.8 });
        }
        if (onSelectPlace) onSelectPlace(place);
      });

      markersRef.current.set(place.id, marker);
    });
  }, [cityCoords, places, activeFilter, searchQuery, mapReady, activePlaceId, selectedPlaceInfo]);

  // Synchronize when external card is clicked
  useEffect(() => {
    if (!activePlaceId || !mapInstanceRef.current) return;
    const targetPlace = places.find((p) => p.id === activePlaceId);
    if (targetPlace) {
      mapInstanceRef.current.flyTo([targetPlace.lat, targetPlace.lng], 15, { duration: 0.9 });
      setSelectedPlaceInfo(targetPlace);
    }
  }, [activePlaceId, places]);

  // Locate User Current GPS Position and render pulsing blue marker
  // Render pulsing user marker on map and fly camera
  const renderUserPositionOnMap = (latitude: number, longitude: number, accuracyText?: string) => {
    const L = window.L;
    const map = mapInstanceRef.current;

    if (map && L) {
      if (userMarkerRef.current) {
        map.removeLayer(userMarkerRef.current);
      }

      const userIcon = L.divIcon({
        className: "user-gps-location-pin",
        html: `
          <div style="position: relative; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center;">
            <div style="
              position: absolute;
              width: 38px;
              height: 38px;
              border-radius: 50%;
              background: rgba(37, 99, 235, 0.28);
              animation: pulse-ring 1.8s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
            "></div>
            <div style="
              position: relative;
              width: 18px;
              height: 18px;
              border-radius: 50%;
              background: #2563eb;
              border: 3px solid #ffffff;
              box-shadow: 0 2px 10px rgba(37, 99, 235, 0.6);
            "></div>
          </div>
          <style>
            @keyframes pulse-ring {
              0% { transform: scale(0.6); opacity: 0.9; }
              100% { transform: scale(2.4); opacity: 0; }
            }
          </style>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      const newMarker = L.marker([latitude, longitude], {
        icon: userIcon,
        zIndexOffset: 1000,
        draggable: true,
      }).addTo(map);

      newMarker.on("dragend", (e: any) => {
        const p = e.target.getLatLng();
        newMarker
          .bindPopup(
            `
          <div style="font-family: sans-serif; font-size: 12px; font-weight: 700; padding: 3px;">
            📍 Custom Pin Location
            <div style="font-size: 10px; font-weight: 500; color: #64748b;">${p.lat.toFixed(4)}, ${p.lng.toFixed(4)} (Drag to move)</div>
          </div>
        `
          )
          .openPopup();
        if (onUserLocationFound) {
          onUserLocationFound({ lat: p.lat, lng: p.lng });
        }
      });

      newMarker
        .bindPopup(
          `
        <div style="font-family: sans-serif; font-size: 12px; font-weight: 700; padding: 3px;">
          📍 You are here
          <div style="font-size: 10px; font-weight: 500; color: #64748b;">${accuracyText || "Live Location Detected"} (Drag to move)</div>
        </div>
      `
        )
        .openPopup();

      userMarkerRef.current = newMarker;
      map.flyTo([latitude, longitude], 15, { duration: 1.2 });

      if (onUserLocationFound) {
        onUserLocationFound({ lat: latitude, lng: longitude });
      }
    }
  };

  // Fallback to IP-based Geolocation when browser hardware GPS is unavailable on desktop
  const fallbackToIpGeolocation = async () => {
    try {
      const res = await fetch("https://ipwho.is/", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data && data.latitude && data.longitude) {
          renderUserPositionOnMap(data.latitude, data.longitude, `Near ${data.city || "Your City"} · IP Geolocation`);
          return true;
        }
      }
    } catch (e) {
      console.warn("IP Geolocation fallback failed:", e);
    }
    return false;
  };

  // Robust Direct GPS Location Resolver
  const handleLocateUserCurrentPosition = () => {
    setIsLocatingUser(true);

    if (typeof window !== "undefined" && navigator.geolocation) {
      // 1. Try High Accuracy GPS first
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLocatingUser(false);
          const { latitude, longitude, accuracy } = position.coords;
          renderUserPositionOnMap(latitude, longitude, `GPS accuracy: ±${Math.round(accuracy)}m`);
        },
        (highAccError) => {
          console.warn("High accuracy GPS failed, trying standard WiFi position:", highAccError.message);
          // 2. Fallback to standard geolocation
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              setIsLocatingUser(false);
              const { latitude, longitude, accuracy } = pos.coords;
              renderUserPositionOnMap(latitude, longitude, `GPS accuracy: ±${Math.round(accuracy)}m`);
            },
            async (stdError) => {
              console.warn("Standard geolocation failed, attempting IP fallback:", stdError.message);
              // 3. Fallback to IP Geolocation
              const ipSuccess = await fallbackToIpGeolocation();
              setIsLocatingUser(false);
              if (!ipSuccess) {
                renderUserPositionOnMap(cityCoords.lat, cityCoords.lng, `Centered on ${selectedCity}`);
              }
            },
            { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
          );
        },
        { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }
      );
    } else {
      fallbackToIpGeolocation().finally(() => setIsLocatingUser(false));
    }
  };

  return (
    <div className="relative h-full w-full bg-[#e5e3df] overflow-hidden select-none font-sans">
      {/* 1. Leaflet Canvas Container */}
      <div ref={mapContainerRef} className="h-full w-full z-0" />

      {/* 2. TOP LEFT: Google Maps Export Pill Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-auto">
        <div className="flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 shadow-md border border-slate-200 text-slate-800">
          <div className="flex items-center gap-1.5 font-bold text-xs">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
              />
              <circle cx="12" cy="9" r="2.5" fill="#ffffff" />
            </svg>
            <span className="font-semibold text-slate-800">Export</span>
            <span className="rounded-md bg-amber-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 uppercase tracking-wide">
              PRO
            </span>
          </div>
        </div>

        {isSearchOpen && (
          <div className="flex items-center gap-2 rounded-full bg-white shadow-md border border-slate-200 px-3.5 py-1.5 w-60 text-xs animate-in fade-in slide-in-from-left duration-200">
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder={`Search in ${selectedCity}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-slate-800 placeholder-slate-400 font-medium"
              autoFocus
            />
          </div>
        )}
      </div>

      {/* 3. TOP RIGHT: Google Map Circular Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2.5 pointer-events-auto items-end">
        <button
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 hover:bg-slate-50 shadow-md border border-slate-200 transition-all hover:scale-105"
          title="Search Places"
        >
          <Search className="h-4 w-4 text-slate-700" />
        </button>

        <div className="relative">
          <button
            onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 hover:bg-slate-50 shadow-md border border-slate-200 transition-all hover:scale-105"
            title="Map Layers"
          >
            <Layers className="h-4 w-4 text-slate-700" />
          </button>

          {isLayerMenuOpen && (
            <div className="absolute right-12 top-0 rounded-2xl bg-white p-2 shadow-2xl border border-slate-200 w-48 space-y-1 z-20 animate-in fade-in slide-in-from-right duration-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-2 py-1">
                Map View
              </span>
              {(["roadmap", "hybrid", "terrain"] as const).map((layerKey) => (
                <button
                  key={layerKey}
                  onClick={() => {
                    setCurrentLayerType(layerKey);
                    setIsLayerMenuOpen(false);
                  }}
                  className={`w-full text-left rounded-xl px-3 py-2 text-xs font-semibold transition-colors flex items-center justify-between ${
                    currentLayerType === layerKey
                      ? "bg-blue-50 text-blue-600 font-bold"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span>{GOOGLE_TILE_LAYERS[layerKey].name}</span>
                  {currentLayerType === layerKey && <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setActiveFilter(activeFilter === "hotel" ? "all" : "hotel")}
          className={`flex h-10 w-10 items-center justify-center rounded-full shadow-md border transition-all hover:scale-105 ${
            activeFilter === "hotel"
              ? "bg-pink-600 text-white border-pink-700"
              : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
          }`}
          title="Filter Hotels & Stays"
        >
          <Hotel className="h-4 w-4" />
        </button>
      </div>

      {/* 4. BOTTOM RIGHT: Google Zoom & Location Controls */}
      <div className="absolute right-4 bottom-8 z-10 flex flex-col gap-2.5 pointer-events-auto items-end">
        <button
          onClick={handleLocateUserCurrentPosition}
          disabled={isLocatingUser}
          className={`flex h-10 w-10 items-center justify-center rounded-full shadow-md border border-slate-200 transition-all hover:scale-105 ${
            isLocatingUser ? "bg-blue-600 text-white animate-pulse" : "bg-white text-slate-700 hover:bg-slate-50"
          }`}
          title="Detect My Current Location Automatically"
        >
          <Crosshair className={`h-5 w-5 ${isLocatingUser ? "animate-spin text-white" : "text-slate-700"}`} />
        </button>

        <div className="flex flex-col rounded-lg bg-white border border-slate-200 shadow-md overflow-hidden">
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="flex h-9 w-9 items-center justify-center text-slate-700 hover:bg-slate-100 border-b border-slate-200 transition-colors text-base font-bold"
            title="Zoom in"
          >
            +
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="flex h-9 w-9 items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors text-base font-bold"
            title="Zoom out"
          >
            −
          </button>
        </div>
      </div>

      {/* 5. BOTTOM LEFT: Official Google Maps Footer Attribution */}
      <div className="absolute bottom-1 left-2 z-10 flex items-center gap-2 pointer-events-none text-[10px] text-slate-600 bg-white/75 px-2 py-0.5 rounded backdrop-blur-xs">
        <span className="font-extrabold tracking-tight text-slate-700 font-sans text-xs">Google</span>
        <span>Map data ©2026</span>
        <span>500 m</span>
        <span className="hidden sm:inline">Terms</span>
        <span className="hidden sm:inline">Report a map error</span>
      </div>

      {/* 6. FULL PLACE DETAIL SHEET ON MAP (OPENS ON MAP CLICK) */}
      {selectedPlaceInfo && (
        <div className="absolute top-4 bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-[410px] z-30 pointer-events-auto animate-in fade-in slide-in-from-right duration-300">
          <div className="h-full rounded-3xl bg-white shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-slate-900">
            {/* Header Photo */}
            <div className="relative h-48 w-full shrink-0 overflow-hidden bg-slate-900">
              <Image
                src={
                  selectedPlaceInfo.image ||
                  "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80"
                }
                alt={selectedPlaceInfo.name}
                fill
                unoptimized
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

              {/* Close Button Top Right */}
              <button
                onClick={() => setSelectedPlaceInfo(null)}
                className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/85 backdrop-blur-md transition-all shadow-md"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Category & Status Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-[10px] font-extrabold text-white uppercase tracking-wider border border-white/20">
                  {selectedPlaceInfo.category}
                </span>

                <span
                  className={`rounded-full backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold border ${
                    selectedPlaceInfo.status?.includes("Open") || !selectedPlaceInfo.status
                      ? "bg-emerald-900/80 text-emerald-300 border-emerald-500/30"
                      : "bg-amber-900/80 text-amber-300 border-amber-500/30"
                  }`}
                >
                  {selectedPlaceInfo.status || "Open Today"}
                </span>
              </div>

              {/* Title & Hindi Name on Photo */}
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <h3 className="font-heading text-xl font-extrabold leading-tight">
                  {selectedPlaceInfo.name}
                </h3>
                {selectedPlaceInfo.hindiName && (
                  <p className="text-xs text-amber-300 font-semibold mt-0.5">
                    {selectedPlaceInfo.hindiName}
                  </p>
                )}
              </div>
            </div>

            {/* Scrollable Information Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              {/* Rating & Location Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="flex items-center gap-1 bg-amber-400 text-slate-950 font-extrabold px-2 py-0.5 rounded-lg text-xs">
                    <Star className="h-3.5 w-3.5 fill-slate-950" />
                    {selectedPlaceInfo.rating || 4.7}
                  </span>
                  <span className="text-slate-500 text-[11px] font-semibold">
                    ({selectedPlaceInfo.reviewsCount || "14,200+ Google Reviews"})
                  </span>
                </div>

                <span className="text-[11px] font-bold text-slate-500">
                  📍 {selectedCity}, Rajasthan
                </span>
              </div>

              {/* Full Description & Cultural Significance */}
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  About & Significance
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {selectedPlaceInfo.description}
                </p>
              </div>

              {/* Key Details Grid (Timings, Entry Fee, Pricing) */}
              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80 space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <Clock className="h-4 w-4 text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Timings & Operating Hours</span>
                    <span className="text-slate-600">{selectedPlaceInfo.timing || "09:00 AM – 05:00 PM"}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Ticket className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Entry Fee / Pricing</span>
                    <span className="text-slate-600">{selectedPlaceInfo.entryFee || selectedPlaceInfo.price || "₹50 (Indians) · ₹200 (Foreigners)"}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Exact Address</span>
                    <span className="text-slate-600">{selectedPlaceInfo.address || `${selectedPlaceInfo.name}, Pink City, Jaipur`}</span>
                  </div>
                </div>
              </div>

              {/* Must-Try Specialties or Insider Tips */}
              {selectedPlaceInfo.specialties && selectedPlaceInfo.specialties.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    Must-Try Highlights / Dishes
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPlaceInfo.specialties.map((spec, sIdx) => (
                      <span
                        key={sIdx}
                        className="rounded-xl bg-slate-100 text-slate-800 px-3 py-1 text-xs font-bold border border-slate-200/80"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Insider Photo Tip */}
              <div className="rounded-2xl bg-amber-50/80 border border-amber-200/80 p-3 flex items-start gap-2 text-amber-900">
                <Camera className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <strong>Insider Photo Tip:</strong> Best photo angle is during early morning (08:30 AM) from the opposite street cafes for golden reflections without tourist crowds.
                </div>
              </div>
            </div>

            {/* Sticky Action Bar at Bottom of Sheet */}
            <div className="p-4 border-t border-slate-200 bg-white flex items-center gap-2">
              <a
                href={`https://wa.me/919876543210?text=Namaste!%20I%20want%20to%20visit%20${selectedPlaceInfo.name}%20in%20${selectedCity}%20and%20need%20a%20local%20guide.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-102"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Hire Guide on WhatsApp</span>
              </a>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPlaceInfo.name + " " + selectedCity)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3.5 py-3 text-xs font-bold transition-colors"
                title="Get Google Directions"
              >
                <Navigation className="h-4 w-4 text-brand-600" />
                <span>Directions</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
