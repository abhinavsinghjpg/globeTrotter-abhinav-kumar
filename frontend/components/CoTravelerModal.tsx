"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
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
  DollarSign,
  Clock,
  ArrowRight,
} from "lucide-react";

interface CoTravelerModalProps {
  isOpen: boolean;
  onClose: () => void;
  city: string;
}

interface TravelGroup {
  id: string;
  title: string;
  creator: string;
  membersCount: string;
  date: string;
  splitCost: string;
  avatar: string;
  meetingPoint?: string;
}

export const CoTravelerModal: React.FC<CoTravelerModalProps> = ({
  isOpen,
  onClose,
  city,
}) => {
  const { user } = useAuth();
  const [joinedGroup, setJoinedGroup] = useState<string | null>(null);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  // Form State for creating new group
  const [groupTitle, setGroupTitle] = useState("");
  const [groupDate, setGroupDate] = useState("Tomorrow (09:00 AM)");
  const [maxMembers, setMaxMembers] = useState(4);
  const [splitCostInput, setSplitCostInput] = useState("₹350 / person (Cab Split)");
  const [meetingPointInput, setMeetingPointInput] = useState(`${city} Railway Station / City Center`);

  const [groups, setGroups] = useState<TravelGroup[]>([
    {
      id: "grp-1",
      title: `${city} Forts & Sunset Ridge Group Tour`,
      creator: "Karan M. (Delhi)",
      membersCount: "3 / 6 Travellers",
      date: "Tomorrow (08:30 AM)",
      splitCost: "₹450 / person (Private AC Cab Split)",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      meetingPoint: "City Palace Gate #2",
    },
    {
      id: "grp-2",
      title: `${city} Old City Street Food & Bazaars Heritage Walk`,
      creator: "Sneha & Friends (Bangalore)",
      membersCount: "4 / 8 Foodies",
      date: "This Saturday (04:00 PM)",
      splitCost: "₹250 / person (Guide Fee Split)",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      meetingPoint: "Main Clock Tower Market",
    },
  ]);

  if (!isOpen) return null;

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupTitle.trim()) {
      alert("Please provide a group title.");
      return;
    }

    const newGroupItem: TravelGroup = {
      id: `grp-${Date.now()}`,
      title: groupTitle.trim(),
      creator: user?.name ? `${user.name} (You)` : "You (Traveler)",
      membersCount: `1 / ${maxMembers} Travellers`,
      date: groupDate,
      splitCost: splitCostInput,
      avatar:
        user?.avatar ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      meetingPoint: meetingPointInput,
    };

    setGroups([newGroupItem, ...groups]);
    setJoinedGroup(newGroupItem.id);
    setIsCreatingGroup(false);
    setGroupTitle("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[88vh] rounded-3xl bg-white shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-slate-900 font-sans">
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
                Create & Join Travel Groups · Split Cabs & Guides
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
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Create Group Action Ribbon */}
          {!isCreatingGroup ? (
            <div className="rounded-3xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 p-4 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-extrabold text-indigo-900 uppercase tracking-wider block">
                  Travelling Solo or Looking to Split Cabs?
                </span>
                <p className="text-xs text-indigo-800 font-bold">
                  Create your own group for {city} and invite fellow explorers!
                </p>
              </div>

              <button
                onClick={() => setIsCreatingGroup(true)}
                className="flex items-center gap-1.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 shadow-md shadow-indigo-600/25 transition-all hover:scale-105 shrink-0"
              >
                <Plus className="h-4 w-4" />
                <span>Create Group</span>
              </button>
            </div>
          ) : (
            /* CREATE GROUP FORM */
            <form
              onSubmit={handleCreateGroup}
              className="rounded-3xl bg-slate-50 border border-slate-200 p-5 space-y-3 animate-in fade-in duration-200"
            >
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h4 className="font-heading text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Plus className="h-4 w-4 text-indigo-600" />
                  Create a New Travel Group in {city}
                </h4>
                <button
                  type="button"
                  onClick={() => setIsCreatingGroup(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Group Trip Title</label>
                  <input
                    type="text"
                    placeholder={`e.g. Sunrise Fort Tour & Cafe Hopping in ${city}`}
                    value={groupTitle}
                    onChange={(e) => setGroupTitle(e.target.value)}
                    className="w-full rounded-2xl bg-white border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Date & Time</label>
                    <input
                      type="text"
                      placeholder="e.g. Tomorrow 08:30 AM"
                      value={groupDate}
                      onChange={(e) => setGroupDate(e.target.value)}
                      className="w-full rounded-2xl bg-white border border-slate-200 px-3.5 py-2 text-xs text-slate-900 font-medium focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Max Travellers</label>
                    <input
                      type="number"
                      min={2}
                      max={12}
                      value={maxMembers}
                      onChange={(e) => setMaxMembers(Number(e.target.value))}
                      className="w-full rounded-2xl bg-white border border-slate-200 px-3.5 py-2 text-xs text-slate-900 font-bold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Estimated Split Cost</label>
                    <input
                      type="text"
                      placeholder="e.g. ₹350 / person (Cab Split)"
                      value={splitCostInput}
                      onChange={(e) => setSplitCostInput(e.target.value)}
                      className="w-full rounded-2xl bg-white border border-slate-200 px-3.5 py-2 text-xs text-slate-900 font-medium focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Meeting Point</label>
                    <input
                      type="text"
                      placeholder="e.g. Hawa Mahal Opposite Tattoo Cafe"
                      value={meetingPointInput}
                      onChange={(e) => setMeetingPointInput(e.target.value)}
                      className="w-full rounded-2xl bg-white border border-slate-200 px-3.5 py-2 text-xs text-slate-900 font-medium focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingGroup(false)}
                    className="rounded-xl px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 shadow-md shadow-indigo-600/20 transition-all hover:scale-102"
                  >
                    <span>Publish Group</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Active Groups List */}
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
              Active Traveler Groups for {city} ({groups.length})
            </span>

            {groups.map((grp) => {
              const isJoined = joinedGroup === grp.id;
              return (
                <div
                  key={grp.id}
                  className={`p-4 rounded-3xl border transition-all space-y-3 shadow-xs ${
                    isJoined
                      ? "bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-2xl overflow-hidden bg-slate-200 shrink-0">
                        <Image src={grp.avatar} alt={grp.creator} fill unoptimized className="object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{grp.title}</h4>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Organized by {grp.creator} · {grp.membersCount}
                        </span>
                      </div>
                    </div>

                    <span className="rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold px-2.5 py-0.5 shrink-0">
                      {grp.date}
                    </span>
                  </div>

                  {grp.meetingPoint && (
                    <div className="text-[11px] text-slate-600 font-medium">
                      📍 <strong>Meetup:</strong> {grp.meetingPoint}
                    </div>
                  )}

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
