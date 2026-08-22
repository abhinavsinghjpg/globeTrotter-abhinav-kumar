"use client";

import React, { useEffect, useRef, useState } from "react";
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
  Maximize2,
} from "lucide-react";

export interface MapPlace {
  id: string;
  name: string;
  category: "attraction" | "food" | "hotel" | "shopping";
  lat: number;
  lng: number;
  description: string;
  image?: string;
  rating?: number;
  status?: string;
  price?: string;
  address?: string;
  hindiName?: string;
}

interface SplitScreenMapProps {
  selectedCity: string;
  cityCoords: { lat: number; lng: number };
  places: MapPlace[];
  activePlaceId?: string | null;
  onSelectPlace?: (place: MapPlace) => void;
}

declare global {
  interface Window {
    L: any;
  }
}

// Google Maps Tile URLs (Roadmap, Satellite Hybrid, Terrain)
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
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());

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

      // Google Maps Tile Layer
      const initialLayer = L.tileLayer(GOOGLE_TILE_LAYERS[currentLayerType].url, {
        maxZoom: 20,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
      }).addTo(map);

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

  // 3. Render Google Maps-Style POI Pins (Matching Screenshot)
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

    visiblePlaces.forEach((place) => {
      const isAttraction = place.category === "attraction";
      const isFood = place.category === "food";
      const isHotel = place.category === "hotel";
      const isShopping = place.category === "shopping";

      // Google Maps color palette
      // Hotels: Magenta / Pink (#e91e63 / #d81b60)
      // Food / Restaurants: Orange (#e65100 / #f57c00)
      // Attractions / Culture: Purple / Violet (#7b1fa2 / #8e24aa)
      // Shopping / Bazaars: Blue (#1976d2 / #0288d1)
      const pinColor = isHotel
        ? "#e91e63"
        : isFood
        ? "#e65100"
        : isShopping
        ? "#1976d2"
        : "#7b1fa2";

      const textColor = isHotel
        ? "#c2185b"
        : isFood
        ? "#d84315"
        : isShopping
        ? "#1565c0"
        : "#6a1b9a";

      const iconSvg = isHotel
        ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/></svg>`
        : isFood
        ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>`
        : isShopping
        ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z"/></svg>`
        : `<svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2zm0-6h2v4h-2z"/></svg>`;

      const isActive = activePlaceId === place.id || selectedPlaceInfo?.id === place.id;
      const hindiTranslation =
        place.hindiName ||
        (isHotel
          ? "होटल / स्टे"
          : isFood
          ? "प्रसिद्ध खान-पान"
          : isShopping
          ? "बाज़ार / खरीदारी"
          : "ऐतिहासिक स्थल");

      const customIcon = L.divIcon({
        className: "custom-google-poi",
        html: `
          <div style="
            display: flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            user-select: none;
            transform: ${isActive ? "scale(1.2)" : "scale(1)"};
            transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.25));
          ">
            <!-- Circular Pin with Icon -->
            <div style="
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: ${pinColor};
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              border: 1.5px solid #ffffff;
              flex-shrink: 0;
            ">
              ${iconSvg}
            </div>

            <!-- Google Maps Bilingual Label (Matches Screenshot) -->
            <div style="
              display: flex;
              flex-direction: column;
              text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff, 0 0 4px #fff;
              line-height: 1.15;
            ">
              <span style="
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 11px;
                font-weight: 700;
                color: ${textColor};
                white-space: nowrap;
              ">
                ${place.name}
              </span>
              <span style="
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 9.5px;
                font-weight: 600;
                color: ${textColor};
                opacity: 0.9;
                white-space: nowrap;
              ">
                ${hindiTranslation}
              </span>
            </div>
          </div>
        `,
        iconSize: [160, 30],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([place.lat, place.lng], { icon: customIcon }).addTo(map);

      marker.on("click", () => {
        setSelectedPlaceInfo(place);
        if (onSelectPlace) onSelectPlace(place);
      });

      markersRef.current.set(place.id, marker);
    });
  }, [cityCoords, places, activeFilter, searchQuery, mapReady, activePlaceId]);

  // Synchronize map pan when activePlaceId changes
  useEffect(() => {
    if (!activePlaceId || !mapInstanceRef.current) return;
    const targetPlace = places.find((p) => p.id === activePlaceId);
    if (targetPlace) {
      mapInstanceRef.current.flyTo([targetPlace.lat, targetPlace.lng], 14, { duration: 1.0 });
      setSelectedPlaceInfo(targetPlace);
    }
  }, [activePlaceId, places]);

  return (
    <div className="relative h-full w-full bg-[#e5e3df] overflow-hidden select-none font-sans">
      {/* 1. Leaflet Canvas Container with Google Maps Tiles */}
      <div ref={mapContainerRef} className="h-full w-full z-0" />

      {/* 2. TOP LEFT: Google Maps Export Pill Badge (Matches Screenshot) */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-auto">
        <div className="flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 shadow-md border border-slate-200/80 text-slate-800">
          {/* Google Maps Pin Icon */}
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

        {/* Search Bar Toggle */}
        {isSearchOpen && (
          <div className="flex items-center gap-2 rounded-full bg-white shadow-md border border-slate-200 px-3 py-1.5 w-56 text-xs animate-in fade-in slide-in-from-left duration-200">
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder={`Search in ${selectedCity}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-slate-800 placeholder-slate-400"
              autoFocus
            />
          </div>
        )}
      </div>

      {/* 3. TOP RIGHT: Google Map Circular Action Buttons (Matches Screenshot) */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2.5 pointer-events-auto items-end">
        {/* Search Button */}
        <button
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 hover:bg-slate-50 shadow-md border border-slate-200 transition-all hover:scale-105"
          title="Search Places"
        >
          <Search className="h-4 w-4 text-slate-700" />
        </button>

        {/* Layers Button */}
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

        {/* Hotels / Stays Quick Toggle Pill */}
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

      {/* 4. BOTTOM RIGHT: Google Zoom & Location Controls (Matches Screenshot) */}
      <div className="absolute right-4 bottom-8 z-10 flex flex-col gap-2.5 pointer-events-auto items-end">
        {/* Recenter Location Button */}
        <button
          onClick={() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.flyTo([cityCoords.lat, cityCoords.lng], 13, { duration: 1 });
            }
          }}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 hover:bg-slate-50 shadow-md border border-slate-200 transition-all hover:scale-105"
          title="Recenter Map"
        >
          <Crosshair className="h-5 w-5 text-slate-700" />
        </button>

        {/* Zoom In/Out Block (Google style) */}
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

      {/* 5. BOTTOM LEFT: Official Google Maps Footer Attribution (Matches Screenshot) */}
      <div className="absolute bottom-1 left-2 z-10 flex items-center gap-2 pointer-events-none text-[10px] text-slate-600 bg-white/70 px-2 py-0.5 rounded backdrop-blur-xs">
        <span className="font-extrabold tracking-tight text-slate-700 font-sans text-xs">Google</span>
        <span>Map data ©2026</span>
        <span>500 m</span>
        <span className="hidden sm:inline">Terms</span>
        <span className="hidden sm:inline">Report a map error</span>
      </div>

      {/* 6. Selected Place Floating Details Modal on Map */}
      {selectedPlaceInfo && (
        <div className="absolute bottom-6 left-4 right-16 sm:right-auto sm:w-88 z-20 pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="rounded-2xl bg-white p-4 shadow-2xl border border-slate-200 space-y-2.5 text-slate-900">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="rounded bg-blue-50 text-blue-700 px-2 py-0.5 text-[10px] font-bold uppercase">
                  {selectedPlaceInfo.category}
                </span>
                <h4 className="font-heading text-base font-bold text-slate-900 mt-1">
                  {selectedPlaceInfo.name}
                </h4>
              </div>
              <button
                onClick={() => setSelectedPlaceInfo(null)}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {selectedPlaceInfo.description}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {selectedPlaceInfo.status || "Open Today"}
              </span>

              <a
                href={`https://wa.me/919876543210?text=Namaste!%20I%20want%20to%20visit%20${selectedPlaceInfo.name}%20in%20${selectedCity}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-[11px] font-bold shadow-sm transition-all"
              >
                <span>Hire Guide</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
