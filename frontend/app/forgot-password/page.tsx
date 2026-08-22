"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PasswordInput } from "@/components/PasswordInput";
import { api } from "@/lib/api";
import { KeyRound, ArrowLeft, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState<"request" | "reset" | "success">("request");
  const [devToken, setDevToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/forgot-password", { email });
      if (res.data.dev_reset_token) {
        setDevToken(res.data.dev_reset_token);
        setToken(res.data.dev_reset_token);
      }
      setStep("reset");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to initiate password reset.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/reset-password", { token, new_password: newPassword });
      setStep("success");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Invalid or expired token. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 glass-card p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-brand-600 shadow-lg shadow-brand-500/20 mb-2">
            <KeyRound className="h-6 w-6 text-jaipur-royal" />
          </div>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-jaipur-royal">
            {step === "success" ? "Password Reset" : "Reset Password"}
          </h2>
          <p className="text-sm text-sand-600">
            {step === "request" && "Enter your email address to receive reset instructions"}
            {step === "reset" && "Enter the verification token and choose your new password"}
            {step === "success" && "Your password has been successfully updated"}
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-danger-50 border border-danger-500/30 p-3.5 text-xs text-danger-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === "request" && (
          <form onSubmit={handleRequestReset} className="space-y-5">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-amber-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 hover:opacity-95 transition-all disabled:opacity-50"
            >
              {loading ? "Generating Link..." : "Send Reset Instructions"}
            </button>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            {devToken && (
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-300">
                <span className="font-semibold block">Dev Verification Token:</span>
                <code className="text-[11px] break-all">{devToken}</code>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-sand-600">Reset Token</label>
              <input
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste token here"
                className="w-full rounded-xl border border-sand-300 bg-white px-4 py-3 text-jaipur-royal placeholder-sand-500 transition-all focus:border-brand-500 focus:outline-none focus:ring-2"
              />
            </div>

            {/* Show/Hide password toggle */}
            <PasswordInput
              label="New Password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min 6 chars)"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all disabled:opacity-50"
            >
              {loading ? "Updating Password..." : "Update Password"}
            </button>
          </form>
        )}

        {step === "success" && (
          <div className="space-y-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <p className="text-sm text-sand-600">
              You can now sign in with your new password.
            </p>
            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center rounded-xl bg-brand-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 hover:bg-brand-500 transition-colors"
            >
              Back to Sign In
            </Link>
          </div>
        )}

        <div className="text-center pt-2">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-xs font-semibold text-sand-600 hover:text-jaipur-royal transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
