"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Navigation,
  MapPin,
  Sparkles,
  AlertCircle,
  X,
  Compass,
  Radio,
  CheckCircle2,
} from "lucide-react";

interface LiveAudioGuideProps {
  currentPlace: any;
  userCoords: { lat: number; lng: number } | null;
  onClose?: () => void;
}

export const LiveAudioGuide: React.FC<LiveAudioGuideProps> = ({
  currentPlace,
  userCoords,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speechProgress, setSpeechProgress] = useState(0);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize Web Speech Synthesis
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      // Prioritize Indian English or standard English voice
      const indianVoice = voices.find(
        (v) => v.lang.includes("en-IN") || v.name.includes("India")
      );
      const defaultEnglish = voices.find((v) => v.lang.startsWith("en"));
      setSelectedVoice(indianVoice || defaultEnglish || voices[0] || null);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const cleanText = text.replace(/([^\w\s\d.,!?-])/gi, " ");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = 0.95; // Natural clear pace
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => {
      setIsPlaying(false);
      setSpeechProgress(100);
    };
    utterance.onerror = () => setIsPlaying(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handlePlayPause = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const narrative = `You have arrived at ${currentPlace.name}. ${
        currentPlace.subName ? currentPlace.subName + "." : ""
      } ${currentPlace.description || currentPlace.specialty || ""} ${
        currentPlace.timing ? "Operating hours are " + currentPlace.timing + "." : ""
      } ${
        currentPlace.entryFee ? "Ticket fee is " + currentPlace.entryFee + "." : ""
      }`;
      speakText(narrative);
    }
  };

  const handleStop = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setSpeechProgress(0);
    }
  };

  if (!currentPlace) return null;

  return (
    <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-5 border border-indigo-500/40 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-3 duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/30 border border-indigo-400/40 shrink-0">
            <Radio className="h-6 w-6 text-amber-300 animate-pulse" />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500">
                <span className="h-2 w-2 rounded-full bg-white animate-ping" />
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 border border-emerald-500/30">
                GPS PROXIMITY ARRIVAL DETECTED
              </span>
              <span className="text-[10px] text-indigo-300 font-bold">🔊 Audio Guide</span>
            </div>

            <h3 className="font-heading text-lg font-extrabold text-white mt-0.5 line-clamp-1">
              {currentPlace.name}
            </h3>
          </div>
        </div>

        {onClose && (
          <button
            onClick={() => {
              handleStop();
              onClose();
            }}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <p className="text-xs text-indigo-100 leading-relaxed font-medium line-clamp-2">
        {currentPlace.description || currentPlace.specialty}
      </p>

      {/* Voice Controls Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-indigo-800/60 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayPause}
            className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 font-bold transition-all shadow-md ${
              isPlaying
                ? "bg-amber-500 text-slate-950 hover:bg-amber-400 hover:scale-102"
                : "bg-gradient-to-r from-brand-500 to-indigo-600 text-white hover:opacity-90 hover:scale-102"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4 fill-slate-950" />
                <span>Pause Voice Narration</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-white" />
                <span>Speak Aloud Place Details (Audio Guide)</span>
              </>
            )}
          </button>

          {isPlaying && (
            <button
              onClick={handleStop}
              className="flex items-center justify-center rounded-2xl bg-white/10 hover:bg-white/20 p-2.5 text-white transition-colors"
              title="Stop"
            >
              <Square className="h-4 w-4" />
            </button>
          )}
        </div>

        <span className="text-[11px] text-indigo-300 font-semibold hidden sm:inline">
          {isPlaying ? "🎙️ Narrating live facts..." : "Ready to speak aloud"}
        </span>
      </div>
    </div>
  );
};
