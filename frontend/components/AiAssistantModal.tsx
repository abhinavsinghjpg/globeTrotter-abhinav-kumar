"use client";

import React, { useState } from "react";
import { Sparkles, Send, X, Bot, User, MessageCircle, MapPin } from "lucide-react";

interface AiAssistantModalProps {
  currentCity: string;
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  sender: "ai" | "user";
  text: string;
  suggestedAction?: { label: string; url?: string; isWhatsApp?: boolean };
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  currentCity,
  isOpen,
  onClose,
}) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "ai",
      text: `Namaste! I am your AI Virtual Tourist Guide for ${currentCity}. Ask me anything about forts, street food spots, best sunset viewpoints, or live closure updates!`,
    },
  ]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = (userText: string) => {
    if (!userText.trim()) return;

    const newMsgs = [...messages, { sender: "user" as const, text: userText }];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      let aiReply = "";
      let action: any = null;

      const lower = userText.toLowerCase();
      if (lower.includes("food") || lower.includes("kachori") || lower.includes("eat")) {
        aiReply = `In ${currentCity}, you must try the famous Pyaaz Kachori at Rawat Mishtan Bhandar (Station Rd) and authentic Royal Thali with Paneer Ghevar at LMB in Johari Bazaar!`;
      } else if (lower.includes("sunset") || lower.includes("view")) {
        aiReply = `The absolute best sunset in ${currentCity} is from Nahargarh Fort ramparts overlooking the Pink City. Arrive by 05:00 PM for golden hour!`;
      } else if (lower.includes("closed") || lower.includes("status")) {
        aiReply = `Most monuments in ${currentCity} (Hawa Mahal, Amer Fort, City Palace) are Open today. Note: Galta Ji upper mountain path has temporary maintenance work ongoing.`;
      } else if (lower.includes("guide") || lower.includes("whatsapp")) {
        aiReply = `I can connect you directly with a verified Rajasthan heritage tour guide on WhatsApp for live booking.`;
        action = {
          label: "Chat with Verified Guide on WhatsApp",
          url: "https://wa.me/919876543210?text=Namaste!%20I%20need%20a%20local%20guide%20in%20Jaipur.",
          isWhatsApp: true,
        };
      } else {
        aiReply = `For ${currentCity}, I recommend starting early at Amer Fort (08:30 AM), visiting Panna Meena Stepwell, trying street chaat at Johari Bazaar, and watching the sunset from Nahargarh!`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: aiReply,
          suggestedAction: action,
        },
      ]);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[550px] relative">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-brand-600 via-jaipur-pink to-purple-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
              <Sparkles className="h-5 w-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold">GlobeTrotter AI Tourist Guide</h3>
              <p className="text-[11px] text-white/80">Real-time intelligence for {currentCity}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-white/20 text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chat History Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.sender === "ai" && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-500/20 text-brand-400">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 leading-relaxed ${
                  m.sender === "user"
                    ? "bg-brand-600 text-white"
                    : "bg-slate-900 border border-slate-800 text-slate-200"
                }`}
              >
                <p>{m.text}</p>
                {m.suggestedAction && (
                  <a
                    href={m.suggestedAction.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2.5 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-md hover:bg-emerald-500 transition-all"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    {m.suggestedAction.label}
                  </a>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-[11px] pl-10">
              <span className="h-2 w-2 rounded-full bg-brand-500 animate-ping" />
              AI Guide is thinking...
            </div>
          )}
        </div>

        {/* Suggested Quick Prompts */}
        <div className="px-4 py-2 border-t border-slate-900 flex gap-1.5 overflow-x-auto text-[10px]">
          {[
            "Best street food near me",
            "Sunset viewpoint in Jaipur",
            "Are forts open today?",
            "Hire a local guide on WhatsApp",
          ].map((prompt, pIdx) => (
            <button
              key={pIdx}
              onClick={() => handleSend(prompt)}
              className="shrink-0 rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1 text-slate-300 hover:text-white hover:border-brand-500"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/50 flex items-center gap-2">
          <input
            type="text"
            placeholder={`Ask AI anything about ${currentCity}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
            className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
          <button
            onClick={() => handleSend(input)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-brand-600 to-jaipur-pink text-white hover:opacity-90 transition-all shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
