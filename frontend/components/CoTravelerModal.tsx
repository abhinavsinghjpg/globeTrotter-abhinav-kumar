"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Users,
  Calendar,
  MapPin,
  MessageCircle,
  Plus,
  CheckCircle2,
  Sparkles,
  Shield,
} from "lucide-react";

interface CoTravelerModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: string;
}

export const CoTravelerModal: React.FC<CoTravelerModalProps> = ({
  isOpen,
  onClose,
  city,
}) => {
  const [joinedGroup, setJoinedGroup] = useState<string | null>(null);

  if (!isOpen) return null;

  const groups = [
    {
      id: "grp-1",
      title: "Amer Fort & Nahargarh Sunset Group Tour",
      creator: "Karan M. (Delhi)",
      membersCount: "3 / 6 Travellers",
      date: "Tomorrow (08:30 AM)",
      splitCost: "₹450 / person (Private AC Cab Split)",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    },
    {
      id: "grp-2",
      title: "Old City Food & Bazaars Heritage Walk",
      creator: "Sneha & Friends (Bangalore)",
      membersCount: "4 / 8 Foodies",
      date: "This Saturday (04:00 PM)",
      splitCost: "₹300 / person (Guide Fee Split)",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-white shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-slate-900 font-sans">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
              <Users className="h-5 w-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-extrabold leading-tight">
                Co-Travelers & Group Matchmaking in {city}
              </h3>
              <span className="text-[11px] text-white/80 font-medium">
                Split Cab Costs · Meet Fellow Explorers · Safe Community
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div className="rounded-2xl bg-indigo-50 border border-indigo-200 p-3.5 flex items-center gap-2.5 text-indigo-900">
            <Shield className="h-4 w-4 text-indigo-600 shrink-0" />
            <p className="text-[11px] leading-relaxed">
              All co-traveler groups are ID-verified through government credentials for safe group excursions.
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Active Groups Visiting {city}
            </span>

            {groups.map((grp) => {
              const isJoined = joinedGroup === grp.id;
              return (
                <div
                  key={grp.id}
                  className="p-4 rounded-3xl border border-slate-200 bg-slate-50 space-y-3 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-2xl overflow-hidden bg-slate-200 shrink-0">
                        <Image src={grp.avatar} alt={grp.creator} fill unoptimized className="object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{grp.title}</h4>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Created by {grp.creator} · {grp.membersCount}
                        </span>
                      </div>
                    </div>

                    <span className="rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold px-2.5 py-0.5">
                      {grp.date}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <span className="font-bold text-slate-700">
                      💰 Split: <strong className="text-emerald-700">{grp.splitCost}</strong>
                    </span>

                    <button
                      onClick={() => setJoinedGroup(isJoined ? null : grp.id)}
                      className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                        isJoined
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-900 hover:bg-slate-800 text-white hover:scale-102"
                      }`}
                    >
                      {isJoined ? "✓ Joined Group" : "Join Group"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
