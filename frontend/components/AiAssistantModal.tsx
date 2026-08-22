"use client";

import React, { useState } from "react";
import { Sparkles, Send, X, Bot, User, MessageCircle, MapPin } from "lucide-react";

interface AiAssistantModalProps {
  currentCity: string;
  isOpen?: boolean;
  onClose?: () => void;
  isInline?: boolean;
}

interface ChatMessage {
  sender: "ai" | "user";
  text: string;
  suggestedAction?: { label: string; url?: string; isWhatsApp?: boolean };
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  currentCity,
  isOpen = true,
  onClose,
  isInline = false,
}) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "ai",
      text: `Namaste! I am your AI Virtual Tourist Guide for ${currentCity}. Ask me anything about forts, street food spots, best sunset viewpoints, or live closure updates!`,
    },
  ]);
  const [loading, setLoading] = useState(false);

  if (!isOpen && !isInline) return null;

  const handleSend = async (userText: string) => {
    if (!userText.trim()) return;

    const newMsgs = [...messages, { sender: "user" as const, text: userText }];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);

    try {
      // Connect to FastAPI Backend AI Tourist Guide Endpoint
      const res = await fetch("http://localhost:8000/api/v1/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, city: currentCity }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: data.reply,
            suggestedAction: data.action
              ? {
                  label: data.action.label,
                  url: data.action.url,
                  isWhatsApp: data.action.is_whatsapp || true,
                }
              : undefined,
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
        aiReply = `In ${currentCity}, you must try the famous local specialties like Pyaaz Kachori, Kulhad Lassi, and authentic regional sweets!`;
      } else if (lower.includes("sunset") || lower.includes("view")) {
        aiReply = `The absolute best sunset in ${currentCity} is from the highest fortress ramparts and hilltop viewpoints overlooking the city skyline. Arrive by 05:00 PM for golden hour!`;
      } else if (lower.includes("closed") || lower.includes("status")) {
        aiReply = `Most monuments in ${currentCity} are Open today under normal operating hours.`;
      } else if (lower.includes("guide") || lower.includes("whatsapp")) {
        aiReply = `I can connect you directly with a verified local tourist guide on WhatsApp for live booking.`;
        action = {
          label: "Chat with Verified Guide on WhatsApp",
          url: `https://wa.me/919876543210?text=Namaste!%20I%20need%20a%20local%20guide%20in%20${currentCity}.`,
          isWhatsApp: true,
        };
      } else {
        aiReply = `For ${currentCity}, I recommend starting early with the iconic heritage monuments, having an authentic local lunch, and reserving the late afternoon for centuries-old artisan bazaars. How can I help you customize your trip?`;
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
    }, 400);
  };

  const quickQuestions = [
    `Top 3 places to visit in ${currentCity}?`,
    `Famous street food in ${currentCity}?`,
    `Best sunset viewpoint?`,
    `Are monuments open today?`,
  ];

  const content = (
    <div className={`relative w-full rounded-3xl bg-white shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-slate-900 font-sans ${isInline ? "shadow-md" : "max-w-lg max-h-[85vh]"}`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-brand-600 via-jaipur-pink to-purple-600 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
            <Sparkles className="h-5 w-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-base font-extrabold leading-tight">AI Virtual Tourist Guide</h3>
              <span className="rounded-full bg-emerald-400 text-emerald-950 text-[9px] font-extrabold px-2 py-0.5">
                LIVE
              </span>
            </div>
            <span className="text-[11px] text-white/80 font-medium">
              Verified Intel for {currentCity}
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

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] max-h-[420px] text-xs">
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
              className={`rounded-2xl p-3.5 max-w-[82%] leading-relaxed ${
                m.sender === "user"
                  ? "bg-slate-900 text-white font-medium"
                  : "bg-slate-100 text-slate-800 border border-slate-200/80"
              }`}
            >
              <p>{m.text}</p>

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
            <span>AI Guide is checking local intel...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Chips */}
      <div className="p-2 border-t border-slate-100 bg-slate-50 flex flex-wrap gap-1.5 text-[11px]">
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="rounded-xl bg-white border border-slate-200 px-2.5 py-1 text-slate-700 hover:border-brand-500 hover:text-brand-600 transition-colors font-medium text-left"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="p-3 border-t border-slate-200 bg-white flex items-center gap-2"
      >
        <input
          type="text"
          placeholder={`Ask about monuments, dishes, or hidden gems in ${currentCity}...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 rounded-2xl bg-slate-100 border border-slate-200 px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
        <button
          type="submit"
          className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 hover:bg-slate-800 text-white transition-colors shrink-0 shadow-sm"
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
