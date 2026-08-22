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
}

interface SplitScreenMapProps {
  selectedCity: string;
  cityCoords: { lat: number; lng: number };
  places: MapPlace[];
  onSelectPlace?: (place: MapPlace) => void;
}

declare global {
  interface Window {
    L: any;
  }
}

export const SplitScreenMap: React.FC<SplitScreenMapProps> = ({
  selectedCity,
  cityCoords,
  places,
  onSelectPlace,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "attraction" | "food" | "hotel">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlaceInfo, setSelectedPlaceInfo] = useState<MapPlace | null>(null);

  // 1. Dynamically load Leaflet CDN CSS & Script (Zero NPM bundle issues)
  useEffect(() => {
    let isMounted = true;

    const loadLeafletFromCDN = () => {
      // CSS
      if (!document.getElementById("leaflet-cdn-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-cdn-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      // JS
      if (window.L) {
        initMap();
      } else {
        const existingScript = document.getElementById("leaflet-cdn-js");
        if (!existingScript) {
          const script = document.createElement("script");
          script.id = "leaflet-cdn-js";
          script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
          script.async = true;
          script.onload = () => {
            if (isMounted) initMap();
          };
          document.body.appendChild(script);
        } else {
          existingScript.addEventListener("load", () => {
            if (isMounted) initMap();
          });
        }
      }
    };

    const initMap = () => {
      if (!mapContainerRef.current || !window.L || mapInstanceRef.current) return;

      const L = window.L;
      const map = L.map(mapContainerRef.current, {
        center: [cityCoords.lat, cityCoords.lng],
        zoom: 12,
        zoomControl: false,
      });

      // High-resolution clean CartoDB / OSM tiles
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
        maxZoom: 19,
        subdomains: "abcd",
      }).addTo(map);

      mapInstanceRef.current = map;
      if (isMounted) setMapReady(true);
    };

    loadLeafletFromCDN();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Update Map Markers & Pan when city, places or filters change
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;

    const L = window.L;
    const map = mapInstanceRef.current;

    // Smooth pan to current destination
    map.flyTo([cityCoords.lat, cityCoords.lng], 12, { duration: 1.2 });

    // Clear old pins
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    // Filter places
    const visiblePlaces = places.filter(
      (p) =>
        (activeFilter === "all" || p.category === activeFilter) &&
        (searchQuery === "" || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Add categorized emoji pins
    visiblePlaces.forEach((place) => {
      const isAttraction = place.category === "attraction";
      const isFood = place.category === "food";
      const isHotel = place.category === "hotel";

      const markerColor = isAttraction ? "#f97316" : isFood ? "#e85d75" : "#3b82f6";
      const iconSvg = isAttraction ? "🏰" : isFood ? "🍲" : isHotel ? "🏨" : "🛍️";

      const customIcon = L.divIcon({
        className: "custom-map-marker",
        html: `
          <div style="
            background: ${markerColor};
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 14px rgba(0,0,0,0.3);
            border: 2px solid #ffffff;
            font-size: 14px;
            cursor: pointer;
            transition: transform 0.2s;
          ">
            ${iconSvg}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([place.lat, place.lng], { icon: customIcon }).addTo(map);

      marker.on("click", () => {
        setSelectedPlaceInfo(place);
        if (onSelectPlace) onSelectPlace(place);
      });

      markersRef.current.push(marker);
    });
  }, [cityCoords, places, activeFilter, searchQuery, mapReady]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([cityCoords.lat, cityCoords.lng], 12);
    }
  };

  return (
    <div className="relative h-full w-full bg-slate-100 overflow-hidden select-none">
      {/* Map Canvas Container */}
      <div ref={mapContainerRef} className="h-full w-full z-0" />

      {/* Top Map Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Search box inside map */}
        <div className="flex items-center gap-2 rounded-xl bg-white/95 backdrop-blur-md shadow-lg px-3.5 py-2 border border-slate-200 pointer-events-auto text-slate-800 w-full sm:w-60">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder={`Search in ${selectedCity}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-medium bg-transparent focus:outline-none placeholder-slate-400"
          />
        </div>

        {/* Filter Badges on Map */}
        <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-lg border border-slate-200 pointer-events-auto">
          {[
            { id: "all", label: "All" },
            { id: "attraction", label: "Attractions", icon: Compass },
            { id: "food", label: "Food", icon: Utensils },
            { id: "hotel", label: "Hotels", icon: Hotel },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {Icon && <Icon className="h-3 w-3" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Map Navigation Controls */}
      <div className="absolute right-4 bottom-8 z-10 flex flex-col gap-1.5 pointer-events-auto shadow-lg">
        <button
          onClick={handleRecenter}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 transition-all shadow-md"
          title="Recenter to City"
        >
          <Navigation className="h-4 w-4" />
        </button>
        <div className="flex flex-col rounded-xl bg-white border border-slate-200 overflow-hidden shadow-md">
          <button
            onClick={handleZoomIn}
            className="flex h-9 w-10 items-center justify-center text-slate-700 hover:bg-slate-100 border-b border-slate-200 transition-colors"
            title="Zoom In"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="flex h-9 w-10 items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
            title="Zoom Out"
          >
            <Minus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Selected Place Detail Floating Card on Map */}
      {selectedPlaceInfo && (
        <div className="absolute bottom-6 left-4 right-16 sm:right-auto sm:w-80 z-10 pointer-events-auto">
          <div className="rounded-2xl bg-white p-4 shadow-2xl border border-slate-200 space-y-2.5 text-slate-900">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="rounded-md bg-brand-50 text-brand-600 px-2 py-0.5 text-[10px] font-bold uppercase">
                  {selectedPlaceInfo.category}
                </span>
                <h4 className="font-heading text-base font-bold text-slate-900 mt-1">
                  {selectedPlaceInfo.name}
                </h4>
              </div>
              <button
                onClick={() => setSelectedPlaceInfo(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 line-clamp-2">
              {selectedPlaceInfo.description}
            </p>

            <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs text-slate-500">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <Shield className="h-3 w-3" />
                {selectedPlaceInfo.status || "Open Today"}
              </span>
              <span className="text-amber-500 font-bold">★ {selectedPlaceInfo.rating || 4.7}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
