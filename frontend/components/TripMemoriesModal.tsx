"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Camera,
  Heart,
  Share2,
  Plus,
  Sparkles,
  MessageCircle,
  Video,
  Bookmark,
  Calendar,
  CheckCircle2,
} from "lucide-react";

interface TripMemoriesModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  city: string;
  isInline?: boolean;
}

export const TripMemoriesModal: React.FC<TripMemoriesModalProps> = ({
  isOpen = true,
  onClose,
  city,
  isInline = false,
}) => {
  const [activeTab, setActiveTab] = useState<"memories" | "reels">("memories");
  const [newNote, setNewNote] = useState("");
  const [userNotes, setUserNotes] = useState<string[]>([
    "Sunrise at Nahargarh Fort was unreal! The golden light hitting the Jal Mahal lake was breathtaking.",
    "Do not miss the Pyaaz Kachori at Rawat Mishtan — come before 9 AM for the freshest batch.",
  ]);

  if (!isOpen && !isInline) return null;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setUserNotes([newNote.trim(), ...userNotes]);
    setNewNote("");
  };

  const content = (
    <div className={`relative w-full rounded-3xl bg-white shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-slate-900 font-sans ${isInline ? "shadow-md" : "max-w-2xl max-h-[85vh]"}`}>
      {/* Header */}
      <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
            <Camera className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-extrabold leading-tight">
              Trip Memories, Travel Notes & Local Reels (§21 PRD)
            </h3>
            <span className="text-[11px] text-white/80 font-medium">
              Personal Journal · Community Reels in {city}
            </span>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Tab Selection */}
      <div className="p-2 bg-slate-100 border-b border-slate-200 flex gap-1 text-xs font-bold">
        <button
          onClick={() => setActiveTab("memories")}
          className={`flex-1 py-2.5 rounded-2xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "memories" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Bookmark className="h-4 w-4 text-brand-600" />
          <span>My Travel Journal & Notes</span>
        </button>

        <button
          onClick={() => setActiveTab("reels")}
          className={`flex-1 py-2.5 rounded-2xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "reels" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Video className="h-4 w-4 text-pink-600" />
          <span>Trending Instagram Reels & Spots</span>
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
        {activeTab === "memories" ? (
          <div className="space-y-4">
            {/* Add Note Box */}
            <form onSubmit={handleAddNote} className="space-y-2">
              <label className="font-bold text-slate-700 block">Record a Trip Memory or Local Secret</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={`Write a memory or secret spot you discovered in ${city}...`}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 rounded-2xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
                <button
                  type="submit"
                  className="rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold px-4 py-2.5 text-xs shadow-sm transition-all hover:scale-102 flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Note</span>
                </button>
              </div>
            </form>

            {/* Saved Notes Feed */}
            <div className="space-y-2.5 pt-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Your Saved Notes & Highlights ({userNotes.length})
              </span>

              {userNotes.map((note, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <p className="text-xs text-slate-800 font-medium leading-relaxed">"{note}"</p>
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Added during {city} trip
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* TRENDING REELS & CREATOR SPOTS (§22 PRD) */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                title: "Top 5 Hidden Corners of Amer Fort Sheesh Mahal",
                creator: "@wanderlust_raj",
                views: "240K Views",
                image: "https://images.unsplash.com/photo-1603204077673-83eb6d4d16fe?auto=format&fit=crop&w=600&q=80",
              },
              {
                title: "Sunset Chai Point on Nahargarh Ramparts",
                creator: "@jaipur_vibes",
                views: "180K Views",
                image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80",
              },
              {
                title: "Ultimate Street Food Guide — Kachori to Ghevar",
                creator: "@delhi_foodie",
                views: "420K Views",
                image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
              },
              {
                title: "Walking Through Patrika Gate Rainbow Pillars",
                creator: "@travel_india",
                views: "95K Views",
                image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80",
              },
            ].map((reel, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 space-y-2 group shadow-xs"
              >
                <div className="relative h-36 w-full overflow-hidden">
                  <Image
                    src={reel.image}
                    alt={reel.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                  <span className="absolute top-2 right-2 rounded-full bg-pink-600 text-white text-[9px] font-bold px-2 py-0.5 shadow-sm">
                    ▶ Reel
                  </span>
                  <span className="absolute bottom-2 left-2 text-white font-bold text-xs">
                    {reel.views}
                  </span>
                </div>

                <div className="p-3 space-y-1">
                  <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{reel.title}</h4>
                  <span className="text-[11px] text-brand-600 font-semibold">{reel.creator}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (isInline) return content;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      {content}
    </div>
  );
};
