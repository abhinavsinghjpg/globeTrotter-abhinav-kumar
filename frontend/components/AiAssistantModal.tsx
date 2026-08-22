"use client";

import React, { useState } from "react";
import { api } from "@/lib/api";
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  MessageCircle,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Utensils,
  Clock,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Car,
  Home,
  Ticket,
  Compass,
  RotateCcw
} from "lucide-react";

interface AiAssistantModalProps {
  currentCity: string;
  isOpen?: boolean;
  onClose?: () => void;
  isInline?: boolean;
}

interface ActivitySlot {
  name: string;
  category: string;
  startTime: string;
  endTime: string;
  cost: number;
  reason?: string;
}

interface DaySchedule {
  day: number;
  date: string;
  city: string;
  dayCost: number;
  activities: ActivitySlot[];
}

interface BudgetBreakdown {
  transportation: number;
  accommodation: number;
  food: number;
  activities_tickets: number;
  local_transportation: number;
  miscellaneous: number;
  estimated_total: number;
  currency: string;
  tier: string;
}

interface TripProfile {
  destinations?: string[];
  duration_days?: number;
  travelers_count?: number;
  budget_amount?: number;
  food_preference?: string;
  travel_style?: string;
  transportation_preference?: string;
}

interface ChatMessage {
  sender: "ai" | "user";
  text: string;
  profile?: TripProfile;
  itinerary?: {
    days: DaySchedule[];
    tripSummary?: {
      estimatedCost: number;
      budget: number;
      remainingBudget: number;
      preferenceScore: number;
      feasibilityScore: number;
    };
  };
  budgetBreakdown?: BudgetBreakdown;
  reasons?: string[];
  suggestedAction?: { label: string; url?: string; isWhatsApp?: boolean };
  quickChips?: string[];
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  currentCity,
  isOpen = true,
  onClose,
  isInline = false,
}) => {
  const [input, setInput] = useState("");
  const [tripProfile, setTripProfile] = useState<TripProfile>({
    destinations: [currentCity],
  });
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [showBudgetDetails, setShowBudgetDetails] = useState<boolean>(true);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "ai",
      text: `Namaste! I am your AI Travel Planning Assistant for ${currentCity}. Tell me your travel plans (e.g. "Plan a 3-day trip for 2 with ₹15,000 budget, vegetarian food"), ask for street food spots, or check live monument status!`,
      quickChips: [
        `Plan 3-Day ${currentCity} Trip`,
        `Best street food in ${currentCity}`,
        `Budget under ₹15,000`,
        `Chat with Verified Guide`
      ]
    },
  ]);
  const [loading, setLoading] = useState(false);

  if (!isOpen && !isInline) return null;

  const handleResetTrip = () => {
    setTripProfile({ destinations: [currentCity] });
    setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        text: `Trip reset! Where would you like to travel, for how many days, and what is your approximate budget?`,
        quickChips: [
          `3 Days in Jaipur`,
          `5 Days in Rajasthan`,
          `4 Days in Goa`,
          `Weekend Trip in Delhi`
        ]
      }
    ]);
  };

  const handleSend = async (userText: string) => {
    if (!userText.trim()) return;

    if (userText.toLowerCase() === "start new trip" || userText.toLowerCase() === "reset trip") {
      handleResetTrip();
      return;
    }

    const newMsgs = [...messages, { sender: "user" as const, text: userText }];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);

    try {
      // Connect to FastAPI Backend AI Tourist Guide & Planner Endpoint.
      // Routed through the shared api client so the host comes from
      // NEXT_PUBLIC_API_URL and the chatbot keeps working once deployed.
      const res = await api.post("/ai/chat", {
        message: userText,
        city: currentCity,
        existing_profile: tripProfile,
      });

      if (res.data) {
        const data = res.data;
        if (data.profile) {
          setTripProfile((prev) => ({ ...prev, ...data.profile }));
        }

        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: data.reply,
            profile: data.profile,
            itinerary: data.itinerary,
            budgetBreakdown: data.budget_breakdown,
            reasons: data.reasons,
            suggestedAction: data.action
              ? {
                  label: data.action.label,
                  url: data.action.url,
                  isWhatsApp: data.action.is_whatsapp || true,
                }
              : undefined,
            quickChips: data.quick_chips || [
              "Modify Itinerary",
              "Reduce Budget",
              "Change Food to Veg",
              "Start New Trip",
              "WhatsApp Guide"
            ]
          },
        ]);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn("Backend AI chat unreachable, using client heuristic:", err);
    }

    // Client heuristic fallback
    setTimeout(() => {
      let aiReply = "";
      let action: any = null;
      const lower = userText.toLowerCase();

      if (lower.includes("food") || lower.includes("kachori") || lower.includes("eat")) {
        aiReply = `In ${currentCity}, you must try iconic culinary stops like Rawat Mishtan Bhandar for Pyaaz Kachoris, LMB for royal Dal Baati Churma, and clay pot Kulhad Lassi at Lassiwala!`;
      } else if (lower.includes("guide") || lower.includes("whatsapp")) {
        aiReply = `I can connect you directly with a verified, licensed tourist guide in ${currentCity} on WhatsApp for private haveli tours.`;
        action = {
          label: `Chat with Verified ${currentCity} Guide on WhatsApp`,
          url: `https://wa.me/919876543210?text=Namaste!%20I%20need%20a%20local%20guide%20in%20${currentCity}.`,
          isWhatsApp: true,
        };
      } else {
        aiReply = `Here is an optimized itinerary outline for ${currentCity}! I've scheduled the royal hill citadels in the morning, verified indoor museums at midday, and sunset viewpoints at dusk.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: aiReply,
          suggestedAction: action,
          quickChips: [
            `Plan 3-Day ${currentCity} Trip`,
            `Food in ${currentCity}`,
            `WhatsApp Guide`
          ]
        },
      ]);
      setLoading(false);
    }, 400);
  };

  const content = (
    <div className={`relative w-full rounded-3xl bg-white shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-slate-900 font-sans ${isInline ? "shadow-md h-[680px]" : "max-w-xl h-[85vh]"}`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-brand-600 via-jaipur-pink to-purple-600 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
            <Sparkles className="h-5 w-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-base font-extrabold leading-tight">AI Travel & Itinerary Planner</h3>
              <span className="rounded-full bg-emerald-400 text-emerald-950 text-[9px] font-extrabold px-2 py-0.5">
                OLLAMA POWERED
              </span>
            </div>
            <span className="text-[11px] text-white/80 font-medium">
              Conversational Itineraries · Live Budget Estimates · Verified Guide Desk
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetTrip}
            title="Start New Trip / Reset"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Captured Trip Profile Status Bar */}
      {(tripProfile.duration_days || tripProfile.budget_amount || tripProfile.food_preference || tripProfile.travelers_count) && (
        <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-200/80 flex items-center gap-2 overflow-x-auto text-[11px] font-semibold text-slate-700 shrink-0">
          <span className="text-[10px] uppercase font-extrabold text-slate-400">Trip Profile:</span>
          {tripProfile.destinations && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/10 text-amber-800 border border-amber-500/20 px-2 py-0.5">
              <MapPin className="h-3 w-3 text-amber-600" />
              {tripProfile.destinations.join(", ")}
            </span>
          )}
          {tripProfile.duration_days && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-blue-500/10 text-blue-800 border border-blue-500/20 px-2 py-0.5">
              <Calendar className="h-3 w-3 text-blue-600" />
              {tripProfile.duration_days} Days
            </span>
          )}
          {tripProfile.travelers_count && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-purple-500/10 text-purple-800 border border-purple-500/20 px-2 py-0.5">
              <Users className="h-3 w-3 text-purple-600" />
              {tripProfile.travelers_count} Travelers
            </span>
          )}
          {tripProfile.budget_amount && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 px-2 py-0.5">
              <DollarSign className="h-3 w-3 text-emerald-600" />
              ₹{tripProfile.budget_amount.toLocaleString("en-IN")}
            </span>
          )}
          {tripProfile.food_preference && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-rose-500/10 text-rose-800 border border-rose-500/20 px-2 py-0.5">
              <Utensils className="h-3 w-3 text-rose-600" />
              {tripProfile.food_preference}
            </span>
          )}
        </div>
      )}

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-white font-bold text-xs ${
                m.sender === "user"
                  ? "bg-slate-900"
                  : "bg-gradient-to-tr from-brand-600 to-jaipur-pink shadow-xs"
              }`}
            >
              {m.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>

            <div
              className={`rounded-2xl p-3.5 max-w-[88%] leading-relaxed ${
                m.sender === "user"
                  ? "bg-slate-900 text-white font-medium"
                  : "bg-slate-50 text-slate-800 border border-slate-200/80"
              }`}
            >
              <p className="whitespace-pre-line">{m.text}</p>

              {/* Verified Decision Factors */}
              {m.reasons && m.reasons.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-200/60 space-y-1">
                  {m.reasons.map((r, rIdx) => (
                    <div key={rIdx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* INLINE GENERATED ITINERARY ACCORDION CARD */}
              {m.itinerary && m.itinerary.days && m.itinerary.days.length > 0 && (
                <div className="mt-3.5 rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
                  <div className="p-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Compass className="h-4 w-4 text-amber-400" />
                      <span className="font-bold text-xs">
                        {m.itinerary.days.length}-Day Personalized Itinerary
                      </span>
                    </div>
                    {m.itinerary.tripSummary && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-bold">
                        Est. Cost: ₹{m.itinerary.tripSummary.estimatedCost.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>

                  <div className="divide-y divide-slate-100">
                    {m.itinerary.days.map((day) => {
                      const isExpanded = expandedDay === day.day;
                      return (
                        <div key={day.day} className="p-2.5">
                          <button
                            onClick={() => setExpandedDay(isExpanded ? null : day.day)}
                            className="w-full flex items-center justify-between text-left font-bold text-slate-900 py-1"
                          >
                            <span className="flex items-center gap-2 text-xs">
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-50 text-brand-700 text-[10px]">
                                {day.day}
                              </span>
                              <span>Day {day.day} — {day.city}</span>
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-slate-500 font-normal">
                                ₹{day.dayCost.toLocaleString("en-IN")}
                              </span>
                              {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                            </div>
                          </button>

                          {isExpanded && (
                            <div className="mt-2 space-y-2 pl-2 border-l-2 border-brand-200">
                              {day.activities.map((act, actIdx) => (
                                <div key={actIdx} className="bg-slate-50 rounded-xl p-2 text-[11px] space-y-0.5">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-900">{act.name}</span>
                                    <span className="text-emerald-700 font-bold">
                                      {act.cost === 0 ? "Free" : `₹${act.cost}`}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-slate-500 text-[10px]">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {act.startTime} - {act.endTime}
                                    </span>
                                    <span className="rounded bg-slate-200 px-1.5 py-0.2 uppercase text-[9px] font-semibold">
                                      {act.category}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* INLINE ITEMIZED BUDGET BREAKDOWN ACCORDION */}
              {m.budgetBreakdown && (
                <div className="mt-3 rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
                  <button
                    onClick={() => setShowBudgetDetails(!showBudgetDetails)}
                    className="w-full p-3 bg-slate-100 hover:bg-slate-200/80 transition-colors flex items-center justify-between font-bold text-xs text-slate-900"
                  >
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-emerald-600" />
                      <span>Itemized Budget Breakdown (Estimate)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-700 font-extrabold text-xs">
                        ₹{m.budgetBreakdown.estimated_total.toLocaleString("en-IN")}
                      </span>
                      {showBudgetDetails ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </div>
                  </button>

                  {showBudgetDetails && (
                    <div className="p-3 divide-y divide-slate-100 text-[11px] space-y-1">
                      <div className="flex justify-between py-1 text-slate-600">
                        <span className="flex items-center gap-1.5"><Car className="h-3 w-3 text-orange-500" /> Intercity Transport</span>
                        <span className="font-semibold text-slate-900">₹{m.budgetBreakdown.transportation.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between py-1 text-slate-600">
                        <span className="flex items-center gap-1.5"><Home className="h-3 w-3 text-indigo-500" /> Accommodation</span>
                        <span className="font-semibold text-slate-900">₹{m.budgetBreakdown.accommodation.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between py-1 text-slate-600">
                        <span className="flex items-center gap-1.5"><Utensils className="h-3 w-3 text-rose-500" /> Meals & Food</span>
                        <span className="font-semibold text-slate-900">₹{m.budgetBreakdown.food.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between py-1 text-slate-600">
                        <span className="flex items-center gap-1.5"><Ticket className="h-3 w-3 text-amber-500" /> Monument Entry & Activities</span>
                        <span className="font-semibold text-slate-900">₹{m.budgetBreakdown.activities_tickets.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between py-1 text-slate-600">
                        <span className="flex items-center gap-1.5"><Compass className="h-3 w-3 text-blue-500" /> Local Transit & Autos</span>
                        <span className="font-semibold text-slate-900">₹{m.budgetBreakdown.local_transportation.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between py-1 text-slate-600">
                        <span>Miscellaneous & Buffer (8%)</span>
                        <span className="font-semibold text-slate-900">₹{m.budgetBreakdown.miscellaneous.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between pt-2 font-bold text-xs text-slate-900 border-t border-slate-200">
                        <span>Estimated Total Trip Cost</span>
                        <span className="text-emerald-700">₹{m.budgetBreakdown.estimated_total.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Button (e.g. WhatsApp Guide) */}
              {m.suggestedAction && (
                <div className="mt-2.5 pt-2 border-t border-slate-200/60">
                  <a
                    href={m.suggestedAction.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 text-[11px] shadow-xs transition-colors"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>{m.suggestedAction.label}</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 italic pl-10">
            <Sparkles className="h-3.5 w-3.5 text-brand-600 animate-spin" />
            <span>Ollama Travel Engine is planning your itinerary & budget...</span>
          </div>
        )}
      </div>

      {/* Suggested Contextual Quick Chips */}
      {messages[messages.length - 1]?.quickChips && (
        <div className="p-2 border-t border-slate-100 bg-slate-50 flex flex-wrap gap-1.5 text-[11px]">
          {messages[messages.length - 1].quickChips?.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="rounded-xl bg-white border border-slate-200 px-2.5 py-1 text-slate-700 hover:border-brand-500 hover:text-brand-600 transition-colors font-medium text-left shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="p-3 border-t border-slate-200 bg-white flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          placeholder={`Describe your trip e.g. "3 days in ${currentCity} with wife, budget ₹15,000, vegetarian"...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 rounded-2xl bg-slate-100 border border-slate-200 px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white transition-colors shrink-0 shadow-sm"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );

  if (isInline) return content;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      {content}
    </div>
  );
};
