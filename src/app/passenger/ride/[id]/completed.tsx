"use client";

import { useState } from "react";

const COMPLIMENTS = [
  "Provided Helmet",
  "Smooth Ride",
  "Punctual",
  "Polite Rider",
];

export default function RideCompleted() {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);

  const toggleCompliment = (label: string) => {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label]
    );
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest">
      {/* ── Fixed Header ─────────────────────────────────────── */}
      <header className="sticky top-0 z-20 bg-surface-container-lowest border-b border-outline-variant">
        <div className="max-w-[420px] mx-auto flex items-center justify-between px-4 py-3">
          <button
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
            onClick={() => window.history.back()}
            aria-label="Go back"
          >
            <span className="material-symbols-outlined text-on-surface text-[22px]">
              arrow_back
            </span>
          </button>

          <div className="flex flex-col items-center leading-none">
            <span className="text-[15px] font-black tracking-tight text-on-surface">
              Papido
            </span>
            <span className="text-[11px] text-on-surface-variant font-medium mt-0.5">
              Ride Receipt Details
            </span>
          </div>

          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-on-primary text-sm font-bold select-none">
            A
          </div>
        </div>
      </header>

      {/* ── Scrollable Body ──────────────────────────────────── */}
      <main className="max-w-[420px] mx-auto px-4 pb-10 pt-5 space-y-4">

        {/* 1. Status Feedback Banner */}
        <div className="bg-tertiary-container rounded-2xl px-5 py-6 flex flex-col items-center text-center shadow-sm">
          <span className="material-symbols-outlined text-on-tertiary-container text-[48px] mb-2">
            check_circle
          </span>
          <p className="text-xs font-semibold tracking-widest text-on-tertiary-container uppercase mb-1">
            Trip Completed
          </p>
          <p className="text-[40px] font-black text-on-tertiary-container leading-none mb-2">
            ₹68.00
          </p>
          <div className="flex items-center gap-1.5 text-on-tertiary-container/80 text-[13px]">
            <span className="material-symbols-outlined text-[16px]">
              account_balance_wallet
            </span>
            <span>Auto-debited via UPI (Google Pay)</span>
          </div>
        </div>

        {/* 2. Route Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-on-surface text-[20px]">
              two_wheeler
            </span>
            <span className="text-[15px] font-bold text-on-surface">
              Ride Details
            </span>
            <span className="ml-auto bg-surface-container-low text-on-surface-variant text-[11px] font-semibold px-2.5 py-1 rounded-full">
              5.4 km • 16 mins
            </span>
          </div>

          {/* Vertical timeline */}
          <div className="flex gap-4 mt-4">
            <div className="flex flex-col items-center">
              {/* Green pickup dot */}
              <div className="w-3 h-3 rounded-full bg-[#1DB954] ring-2 ring-[#1DB954]/30 mt-0.5 shrink-0" />
              {/* Connector */}
              <div className="w-0.5 flex-1 bg-outline-variant my-1" />
              {/* Black drop dot */}
              <div className="w-3 h-3 rounded-full bg-on-surface ring-2 ring-on-surface/20 mb-0.5 shrink-0" />
            </div>

            <div className="flex flex-col justify-between flex-1 gap-3">
              <div>
                <p className="text-[11px] font-semibold text-[#1DB954] uppercase tracking-wider">
                  Pickup
                </p>
                <p className="text-[13px] font-semibold text-on-surface leading-snug">
                  Sony World Signal, Koramangala
                </p>
                <p className="text-[12px] text-on-surface-variant">08:42 AM</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                  Drop
                </p>
                <p className="text-[13px] font-semibold text-on-surface leading-snug">
                  Indiranagar Metro Station Gate 2
                </p>
                <p className="text-[12px] text-on-surface-variant">08:58 AM</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Fare Summary Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[15px] font-bold text-on-surface">
              Fare Summary
            </span>
            <span className="text-[11px] text-on-surface-variant font-mono">
              CRN #91820412
            </span>
          </div>

          <div className="space-y-2.5">
            {[
              { label: "Base Fare", value: "₹30.00" },
              { label: "Distance (5.4 km)", value: "₹43.20" },
              { label: "Duration (16 mins)", value: "₹16.00" },
              { label: "Insurance", value: "₹3.00" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between">
                <span className="text-[13px] text-on-surface-variant">
                  {label}
                </span>
                <span className="text-[13px] font-medium text-on-surface">
                  {value}
                </span>
              </div>
            ))}

            {/* Discount */}
            <div className="flex justify-between">
              <span className="text-[13px] text-[#1DB954] font-medium">
                Discount{" "}
                <span className="bg-[#E8F8EF] text-[#1DB954] text-[10px] px-1.5 py-0.5 rounded font-semibold">
                  PAPIDO50
                </span>
              </span>
              <span className="text-[13px] font-medium text-[#1DB954]">
                -₹24.20
              </span>
            </div>
          </div>

          <div className="border-t border-outline-variant my-4" />

          <div className="flex justify-between items-center">
            <span className="text-[15px] font-bold text-on-surface">
              Total
            </span>
            <span className="text-[18px] font-black text-on-surface">
              ₹68.00
            </span>
          </div>
        </div>

        {/* 4. Captain Rating Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          {/* Captain info */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center overflow-hidden shrink-0">
              <span className="material-symbols-outlined text-on-surface-variant text-[32px]">
                person
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold text-on-surface">
                Rajesh Kumar
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[14px] text-yellow-500">
                  star
                </span>
                <span className="text-[13px] font-semibold text-on-surface">
                  4.8
                </span>
              </div>
              <p className="text-[12px] text-on-surface-variant mt-0.5 truncate">
                Hero Splendor • KA 05 KM 8219
              </p>
            </div>
          </div>

          {/* Star rating */}
          <p className="text-[13px] font-semibold text-on-surface mb-2 text-center">
            Rate your ride
          </p>
          <div className="flex justify-center gap-2 mb-5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(star)}
                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                className="transition-transform active:scale-90"
              >
                <span
                  className={`material-symbols-outlined text-[36px] transition-colors ${
                    star <= (hovered || rating)
                      ? "text-yellow-400"
                      : "text-outline-variant"
                  }`}
                  style={{
                    fontVariationSettings:
                      star <= (hovered || rating)
                        ? "'FILL' 1"
                        : "'FILL' 0",
                  }}
                >
                  star
                </span>
              </button>
            ))}
          </div>

          {/* Compliment pills */}
          <p className="text-[13px] font-semibold text-on-surface mb-2 text-center">
            What did you like?
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {COMPLIMENTS.map((label) => {
              const active = selected.includes(label);
              return (
                <button
                  key={label}
                  onClick={() => toggleCompliment(label)}
                  className={`px-3.5 py-1.5 rounded-full border text-[12px] font-semibold transition-all ${
                    active
                      ? "bg-on-surface text-surface border-on-surface"
                      : "bg-transparent text-on-surface border-outline-variant hover:bg-surface-container"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Action CTAs */}
        <div className="space-y-3 pt-1">
          <button className="w-full border border-outline rounded-full py-3.5 text-[14px] font-semibold text-on-surface flex items-center justify-center gap-2 hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-[18px]">
              receipt_long
            </span>
            Email Tax Invoice
          </button>

          <button
            className="w-full bg-on-surface text-surface rounded-full py-3.5 text-[14px] font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity active:scale-[0.98]"
            onClick={() => (window.location.href = "/passenger/home")}
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            Done &amp; Return Home
          </button>
        </div>
      </main>
    </div>
  );
}