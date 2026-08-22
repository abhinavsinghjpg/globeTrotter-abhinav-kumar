"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  MapPin,
  Search,
  Plus,
  Minus,
  Navigation,
  Compass,
  Utensils,
  Hotel,
  Shield,
  Layers,
  Sparkles,
  ExternalLink,
  Phone,
  Eye,
  Star,
  CheckCircle2,
  AlertTriangle,
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

const TILE_LAYERS = {
  voyager: {
    name: "Standard Voyager",
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
  },
  positron: {
    name: "Clean Light",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
  },
  satellite: {
    name: "Satellite Imagery",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
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
  const [currentTileLayer, setCurrentTileLayer] = useState<"voyager" | "positron" | "satellite">("voyager");
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlaceInfo, setSelectedPlaceInfo] = useState<MapPlace | null>(null);

  // 1. Initialize Leaflet Map from CDN
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
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
      });

      const initialLayer = L.tileLayer(TILE_LAYERS[currentTileLayer].url, {
        maxZoom: 19,
        subdomains: "abcd",
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

  // 2. Change Tile Layer Style (Voyager, Light, Satellite)
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L || !tileLayerRef.current) return;
    const L = window.L;
    const map = mapInstanceRef.current;

    map.removeLayer(tileLayerRef.current);
    const newLayer = L.tileLayer(TILE_LAYERS[currentTileLayer].url, {
      maxZoom: 19,
      subdomains: "abcd",
    }).addTo(map);

    tileLayerRef.current = newLayer;
  }, [currentTileLayer]);

  // 3. Render Custom Markers on Map
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;

    const L = window.L;
    const map = mapInstanceRef.current;

    // Smooth pan to current destination
    map.flyTo([cityCoords.lat, cityCoords.lng], 12, { duration: 1.2 });

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

      const badgeBg = isAttraction
        ? "linear-gradient(135deg, #f97316, #ea580c)"
        : isFood
        ? "linear-gradient(135deg, #f43f5e, #e11d48)"
        : isHotel
        ? "linear-gradient(135deg, #3b82f6, #1d4ed8)"
        : "linear-gradient(135deg, #8b5cf6, #6d28d9)";

      const iconEmoji = isAttraction ? "🏰" : isFood ? "🍲" : isHotel ? "🏨" : "🛍️";
      const isActive = activePlaceId === place.id || selectedPlaceInfo?.id === place.id;

      const customIcon = L.divIcon({
        className: "custom-pin",
        html: `
          <div style="
            position: relative;
            cursor: pointer;
            transform: ${isActive ? "scale(1.25)" : "scale(1)"};
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            filter: drop-shadow(0 6px 12px rgba(0,0,0,0.25));
          ">
            <div style="
              background: ${badgeBg};
              color: white;
              padding: 6px 10px;
              border-radius: 9999px;
              border: 2px solid #ffffff;
              display: flex;
              align-items: center;
              gap: 5px;
              font-family: inherit;
              font-size: 11px;
              font-weight: 700;
              white-space: nowrap;
              box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            ">
              <span>${iconEmoji}</span>
              <span style="max-width: 110px; overflow: hidden; text-overflow: ellipsis;">${place.name.split(" ")[0]}</span>
            </div>
            <div style="
              position: absolute;
              bottom: -6px;
              left: 50%;
              transform: translateX(-50%);
              width: 0;
              height: 0;
              border-left: 6px solid transparent;
              border-right: 6px solid transparent;
              border-top: 6px solid #ea580c;
            "></div>
          </div>
        `,
        iconSize: [120, 36],
        iconAnchor: [60, 36],
      });

      const marker = L.marker([place.lat, place.lng], { icon: customIcon }).addTo(map);

      marker.on("click", () => {
        setSelectedPlaceInfo(place);
        if (onSelectPlace) onSelectPlace(place);
      });

      markersRef.current.set(place.id, marker);
    });
  }, [cityCoords, places, activeFilter, searchQuery, mapReady, activePlaceId]);

  // When activePlaceId changes from external click, pan to it
  useEffect(() => {
    if (!activePlaceId || !mapInstanceRef.current) return;
    const targetPlace = places.find((p) => p.id === activePlaceId);
    if (targetPlace) {
      mapInstanceRef.current.flyTo([targetPlace.lat, targetPlace.lng], 14, { duration: 1.0 });
      setSelectedPlaceInfo(targetPlace);
    }
  }, [activePlaceId, places]);

  return (
    <div className="relative h-full w-full bg-slate-100 overflow-hidden select-none">
      {/* Map Canvas Container */}
      <div ref={mapContainerRef} className="h-full w-full z-0" />

      {/* Top Floating Glass Search & Category Bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2.5 pointer-events-none">
        {/* Search Bar inside map */}
        <div className="flex items-center gap-2 rounded-2xl bg-white/95 backdrop-blur-xl shadow-xl shadow-slate-900/5 px-4 py-2.5 border border-slate-200/80 pointer-events-auto text-slate-800 w-full sm:w-64 transition-all focus-within:ring-2 focus-within:ring-brand-500/20">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder={`Search ${selectedCity}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-semibold bg-transparent focus:outline-none placeholder-slate-400"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-xl p-1.5 rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200/80 pointer-events-auto overflow-x-auto">
          {[
            { id: "all", label: "All Spots", icon: Compass },
            { id: "attraction", label: "Forts & Palaces", icon: MapPin },
            { id: "food", label: "Food Stalls", icon: Utensils },
            { id: "hotel", label: "Stays", icon: Hotel },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Map Navigation & Layer Switcher Controls */}
      <div className="absolute right-4 bottom-8 z-10 flex flex-col gap-2 pointer-events-auto">
        {/* Layer Switcher Button */}
        <div className="relative">
          <button
            onClick={() => setIsLayerMenuOpen(!isLayerMenuOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-xl shadow-slate-900/10 transition-all hover:scale-105"
            title="Switch Map Layers"
          >
            <Layers className="h-5 w-5 text-slate-700" />
          </button>

          {isLayerMenuOpen && (
            <div className="absolute right-14 bottom-0 rounded-2xl bg-white p-2 shadow-2xl border border-slate-200 w-44 space-y-1 z-20">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-2 py-1">
                Map View Style
              </span>
              {(["voyager", "positron", "satellite"] as const).map((layerKey) => (
                <button
                  key={layerKey}
                  onClick={() => {
                    setCurrentTileLayer(layerKey);
                    setIsLayerMenuOpen(false);
                  }}
                  className={`w-full text-left rounded-xl px-3 py-2 text-xs font-semibold transition-colors flex items-center justify-between ${
                    currentTileLayer === layerKey
                      ? "bg-brand-50 text-brand-600 font-bold"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <span>{TILE_LAYERS[layerKey].name}</span>
                  {currentTileLayer === layerKey && <CheckCircle2 className="h-3.5 w-3.5 text-brand-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Recenter button */}
        <button
          onClick={() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.flyTo([cityCoords.lat, cityCoords.lng], 12, { duration: 1 });
            }
          }}
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-xl shadow-slate-900/10 transition-all hover:scale-105"
          title="Recenter Map"
        >
          <Navigation className="h-5 w-5 text-brand-600" />
        </button>

        {/* Zoom In/Out */}
        <div className="flex flex-col rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xl shadow-slate-900/10">
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="flex h-10 w-11 items-center justify-center text-slate-700 hover:bg-slate-100 border-b border-slate-200 transition-colors"
            title="Zoom In"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="flex h-10 w-11 items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
            title="Zoom Out"
          >
            <Minus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Selected Place Detail Floating Card on Map (Interactive Drawer) */}
      {selectedPlaceInfo && (
        <div className="absolute bottom-6 left-4 right-16 sm:right-auto sm:w-96 z-10 pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="rounded-3xl bg-white/95 backdrop-blur-xl p-5 shadow-2xl border border-slate-200 space-y-3 text-slate-900">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="rounded-md bg-brand-50 text-brand-600 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider">
                    {selectedPlaceInfo.category}
                  </span>
                  <span className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {selectedPlaceInfo.rating || 4.8}
                  </span>
                </div>
                <h4 className="font-heading text-lg font-bold text-slate-900 leading-tight">
                  {selectedPlaceInfo.name}
                </h4>
              </div>

              <button
                onClick={() => setSelectedPlaceInfo(null)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {selectedPlaceInfo.description}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {selectedPlaceInfo.status || "Open Today"}
              </span>

              <a
                href={`https://wa.me/919876543210?text=Namaste!%20I%20want%20to%20visit%20${selectedPlaceInfo.name}%20in%20${selectedCity}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-[11px] font-bold shadow-md transition-all"
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
