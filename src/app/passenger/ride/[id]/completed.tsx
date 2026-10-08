"use client";

import { Shield, TrendingUp, Loader2, CheckCircle } from "lucide-react";

export default function RideCompleted() {
  return (
    <main className="flex-1 bg-slate-50 min-h-screen p-6">
      <div className="mx-auto max-w-2xl bg-white rounded-xl p-8 shadow-sm">
        <div className="text-emerald-500 text-6xl mb-4">✓</div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Ride Completed</h1>
        <p className="text-slate-500 mb-6">Thank you for riding with Papido.</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-slate-500">Base Fare</p>
            <p className="font-medium text-emerald-600">₹30</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Distance</p>
            <p className="font-medium text-emerald-600">₹55</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-slate-500">Time</p>
            <p className="font-medium text-emerald-600">₹20</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Platform Fee</p>
            <p className="font-medium text-emerald-600">₹5</p>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6 mt-6">
          <div className="flex justify-between font-semibold text-slate-700">
            <span>Total</span>
            <span>₹110</span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Fare calculated based on distance & time</p>
        </div>

        <button
          className="mt-6 w-full rounded-lg bg-emerald-600 py-3 font-semibold text-white"
          onClick={() => window.location.href = "/passenger/home"}
        >
          Rate Rider
        </button>
      </div>
    </main>
  );
}