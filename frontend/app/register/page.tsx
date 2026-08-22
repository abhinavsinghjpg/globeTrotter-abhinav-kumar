"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { PasswordInput } from "@/components/PasswordInput";
import { Compass, Sparkles, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [ageGroup, setAgeGroup] = useState("26-45");
  const [travelStyle, setTravelStyle] = useState("solo");
  const [budgetLevel, setBudgetLevel] = useState("standard");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signUp({
        name: name || email.split("@")[0] || "Traveler",
        email,
        password,
        phone,
      });
      router.push("/");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-8 glass-card p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-jaipur-pink/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-jaipur-pink shadow-lg shadow-brand-500/20 mb-2">
            <Compass className="h-6 w-6 text-white" />
          </div>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-jaipur-royal">
            Join GlobeTrotter
          </h2>
          <p className="text-sm text-sand-600">
            Personalised travel planning tailored to your exact travel style
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${step === 1 ? 'bg-brand-500 text-white' : 'bg-sand-200 text-sand-600'}`}>
            1
          </div>
          <div className="h-0.5 w-12 bg-sand-200" />
          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${step === 2 ? 'bg-brand-500 text-white' : 'bg-sand-200 text-sand-600'}`}>
            2
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-danger-50 border border-danger-500/30 p-3.5 text-xs text-danger-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          {step === 1 ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-sand-600">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Abhinav Kumar"
                  className="w-full rounded-xl border border-sand-300 bg-white px-4 py-3 text-jaipur-royal placeholder-sand-500 transition-all focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-sand-600">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-sand-300 bg-white px-4 py-3 text-jaipur-royal placeholder-sand-500 transition-all focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-sand-600">WhatsApp / Mobile (Optional)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl border border-sand-300 bg-white px-4 py-3 text-jaipur-royal placeholder-sand-500 transition-all focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              {/* Show/Hide password toggle component */}
              <PasswordInput
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a secure password (min 6 chars)"
              />

              <button
                type="button"
                onClick={() => {
                  if (!name || !email || !password) {
                    setError("Please fill out all required fields.");
                    return;
                  }
                  setError("");
                  setStep(2);
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-jaipur-pink py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 hover:opacity-95 transition-all"
              >
                <span>Next: Customize Travel Style</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-sand-600">Your Age Group</label>
                <div className="grid grid-cols-3 gap-2">
                  {["16-26", "26-45", "45-old age"].map((grp) => (
                    <button
                      type="button"
                      key={grp}
                      onClick={() => setAgeGroup(grp)}
                      className={`rounded-xl border p-3 text-xs font-semibold transition-all ${ageGroup === grp ? 'border-brand-500 bg-brand-500/20 text-brand-700' : 'border-sand-200 bg-sand-50 text-sand-600 hover:border-sand-300'}`}
                    >
                      {grp} yrs
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-sand-600">Preferred Travel Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {["solo", "couple", "family", "group", "business", "adventure"].map((style) => (
                    <button
                      type="button"
                      key={style}
                      onClick={() => setTravelStyle(style)}
                      className={`rounded-xl border p-2.5 text-xs font-semibold capitalize transition-all ${travelStyle === style ? 'border-jaipur-pink bg-jaipur-pink/20 text-jaipur-pink' : 'border-sand-200 bg-sand-50 text-sand-600 hover:border-sand-300'}`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-sand-600">Budget Preference</label>
                <div className="grid grid-cols-3 gap-2">
                  {["budget", "standard", "luxury"].map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setBudgetLevel(lvl)}
                      className={`rounded-xl border p-2.5 text-xs font-semibold capitalize transition-all ${budgetLevel === lvl ? 'border-amber-500 bg-amber-500/20 text-amber-300' : 'border-sand-200 bg-sand-50 text-sand-600 hover:border-sand-300'}`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-xl border border-sand-300 py-3.5 text-sm font-medium text-sand-600 hover:bg-sand-200 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-2 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 via-jaipur-pink to-brand-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 hover:opacity-95 transition-all disabled:opacity-50"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </div>
            </div>
          )}
        </form>

        <p className="text-center text-xs text-sand-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-700 hover:text-brand-600">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
