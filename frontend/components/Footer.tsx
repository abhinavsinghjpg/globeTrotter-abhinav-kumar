import React from "react";
import Link from "next/link";
import { Compass, MessageCircle, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Compass className="h-6 w-6 text-brand-500" />
              <span className="font-heading text-xl font-bold text-white">GlobeTrotter</span>
            </div>
            <p className="text-sm text-slate-400">
              India&apos;s Next-Gen Travel Intelligence Platform. Plan multi-city itineraries, discover hidden heritage spots, track budgets, and experience real-time location assistance.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Flagship Destinations</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/destinations/jaipur" className="hover:text-brand-400 transition-colors">
                  Jaipur (Pink City)
                </Link>
              </li>
              <li><span className="text-slate-500">Udaipur (City of Lakes - Coming Soon)</span></li>
              <li><span className="text-slate-500">Jodhpur (Blue City - Coming Soon)</span></li>
              <li><span className="text-slate-500">Goa & Kerala (Coming Soon)</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Intelligence & Assistance</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#planner" className="hover:text-white">AI Itinerary Engine</Link></li>
              <li><Link href="/#features" className="hover:text-white">Location-Aware Food Stalls</Link></li>
              <li><Link href="/#features" className="hover:text-white">Real-Time Place Closure Alerts</Link></li>
              <li><Link href="/#features" className="hover:text-white">Local Guides & Community</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Need Instant Help?</h4>
            <p className="text-xs text-slate-400 mb-3">
              Connect directly with our India travel concierge on WhatsApp for live trip assistance, guide bookings, or custom plans.
            </p>
            <a
              href="https://wa.me/919876543210?text=Namaste!%20I%20am%20exploring%20GlobeTrotter%20and%20need%20assistance."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600/20 border border-emerald-500/30 px-4 py-2 text-xs font-semibold text-emerald-400 hover:bg-emerald-600/30 transition-all"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp (+91 98765 43210)
            </a>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 GlobeTrotter Travel Intelligence Platform. Built for India.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> for Indian Travellers
          </p>
        </div>
      </div>
    </footer>
  );
};
