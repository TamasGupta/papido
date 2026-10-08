"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function RiderRequests() {
  const [rides, setRides] = useState<any[]>([]);
  const [riderInfo, setRiderInfo] = useState<any>(null);
  const [msg, setMsg] = useState("");
  const [countdown, setCountdown] = useState(12);
  const [accepting, setAccepting] = useState(false);

  // ── existing API logic ──────────────────────────────────────────────────────
  async function load() {
    const res = await fetch("/api/rider/requests");
    const data = await res.json();
    if (data.success) {
      setRides(data.data.rides);
      setRiderInfo(data.data.rider);
      setMsg("");
    } else {
      setRides([]);
      setMsg(data.error?.message ?? "");
    }
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);

  async function accept(id: string) {
    if (accepting) return;
    setAccepting(true);
    const res = await fetch(`/api/rides/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "accept" }),
    });
    const data = await res.json();
    if (data.success) window.location.href = `/rider/ride/${id}`;
    else {
      setMsg(data.error?.message ?? "Could not accept");
      setAccepting(false);
    }
  }
  // ───────────────────────────────────────────────────────────────────────────

  // Countdown timer – resets whenever rides list changes
  useEffect(() => {
    setCountdown(12);
  }, [rides.length > 0 ? rides[0]?.id : null]);

  useEffect(() => {
    if (rides.length === 0) return;
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [rides.length > 0 ? rides[0]?.id : null]);

  // SVG ring values
  const RADIUS = 22;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const progress = (countdown / 12) * CIRCUMFERENCE;

  const ride = rides.length > 0 ? rides[0] : null;

  return (
    <div className="relative min-h-screen bg-surface max-w-[420px] mx-auto overflow-hidden">
      {/* ── Fixed Header ───────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] z-30 flex items-center gap-3 px-4 py-3 bg-surface/90 backdrop-blur-md border-b border-outline-variant">
        <Link href="/rider/home" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors">
          <span className="material-symbols-outlined text-on-surface text-xl">arrow_back</span>
        </Link>

        <div className="flex-1">
          <h1 className="text-base font-semibold text-on-surface leading-tight">Incoming Request</h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
            <span className="text-xs text-on-surface-variant">
              {riderInfo ? (riderInfo.isOnline ? "Online" : "Offline") : "Loading…"}
            </span>
          </div>
        </div>

        {/* SOS */}
        <button className="px-3 py-1.5 rounded-full bg-error text-on-error text-xs font-bold tracking-wide shadow">
          SOS
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-tertiary-container flex items-center justify-center shadow">
          <span className="material-symbols-outlined text-on-tertiary-container text-lg">person</span>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16" />

      {ride ? (
        <>
          {/* ── Map Section ────────────────────────────────────────────────── */}
          <section className="relative h-72 bg-surface-container overflow-hidden">
            {/* Fake map grid */}
            <svg
              className="absolute inset-0 w-full h-full opacity-20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" className="text-outline" />
            </svg>

            {/* Route polyline decoration */}
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <polyline
                points="60,220 120,160 200,130 280,100 340,60"
                fill="none"
                stroke="#22c55e"
                strokeWidth="3"
                strokeDasharray="6 4"
                strokeLinecap="round"
              />
              <circle cx="60" cy="220" r="6" fill="#22c55e" />
              <rect x="334" y="54" width="12" height="12" fill="#1e293b" rx="2" />
            </svg>

            {/* 'New Ride Opportunity' badge */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-tertiary-container shadow-lg">
                <span className="material-symbols-outlined text-on-tertiary-container text-sm">bolt</span>
                <span className="text-xs font-semibold text-on-tertiary-container tracking-wide">
                  New Ride Opportunity
                </span>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="absolute top-14 right-4 z-10 flex flex-col items-center">
              <div className="relative w-14 h-14">
                <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                  {/* Track */}
                  <circle
                    cx="28"
                    cy="28"
                    r={RADIUS}
                    fill="none"
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="4"
                  />
                  {/* Progress */}
                  <circle
                    cx="28"
                    cy="28"
                    r={RADIUS}
                    fill="none"
                    stroke={countdown > 4 ? "#22c55e" : "#ef4444"}
                    strokeWidth="4"
                    strokeDasharray={`${progress} ${CIRCUMFERENCE}`}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dasharray 0.9s linear, stroke 0.3s" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-lg font-bold leading-none ${countdown > 4 ? "text-green-400" : "text-red-400"}`}>
                    {countdown}
                  </span>
                  <span className="text-[9px] text-white/70 leading-none mt-0.5">sec</span>
                </div>
              </div>
            </div>

            {/* Bottom distance badges */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 z-10 px-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-lowest/90 backdrop-blur-sm shadow">
                <span className="material-symbols-outlined text-tertiary text-base">my_location</span>
                <div>
                  <p className="text-[10px] text-on-surface-variant leading-none">Pickup</p>
                  <p className="text-xs font-semibold text-on-surface leading-tight">
                    {ride.pickupDistance ? `${ride.pickupDistance} km` : "0.8 km"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-lowest/90 backdrop-blur-sm shadow">
                <span className="material-symbols-outlined text-primary text-base">route</span>
                <div>
                  <p className="text-[10px] text-on-surface-variant leading-none">Total</p>
                  <p className="text-xs font-semibold text-on-surface leading-tight">
                    {ride.estimatedDistance ? `${ride.estimatedDistance} km` : "5.2 km"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ── Bottom Sheet ───────────────────────────────────────────────── */}
          <div className="relative px-4 -mt-3 z-20 space-y-3 pb-6">

            {/* Error message */}
            {msg && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-error-container">
                <span className="material-symbols-outlined text-on-error-container text-sm">warning</span>
                <p className="text-sm text-on-error-container">{msg}</p>
              </div>
            )}

            {/* ── Card 1: Fare & Earnings ─────────────────────────────────── */}
            <div className="rounded-2xl bg-surface-container-lowest shadow-sm overflow-hidden">
              {/* Green header band */}
              <div className="flex items-center justify-between px-4 py-3 bg-tertiary-container">
                <div>
                  <p className="text-[10px] font-medium text-on-tertiary-container/70 uppercase tracking-widest">
                    Estimated Net Payout
                  </p>
                  <p className="text-2xl font-bold text-on-tertiary-container leading-tight">
                    ₹{ride.estimatedFare ? Number(ride.estimatedFare).toFixed(2) : "72.00"}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="px-2 py-0.5 rounded-full bg-on-tertiary-container/15 text-on-tertiary-container text-xs font-medium">
                    Cash / UPI
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-error text-on-error text-xs font-semibold">
                    +₹10 Surge
                  </span>
                </div>
              </div>
              {/* Breakdown */}
              <div className="px-4 py-3 flex items-center justify-between border-t border-outline-variant/40">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-on-surface-variant text-base">receipt_long</span>
                  <span className="text-xs text-on-surface-variant">Base Fare</span>
                </div>
                <span className="text-xs font-medium text-on-surface">
                  ₹{ride.estimatedFare ? (Number(ride.estimatedFare) - 10).toFixed(2) : "62.00"}
                </span>
              </div>
            </div>

            {/* ── Card 2: Trip Waypoints ──────────────────────────────────── */}
            <div className="rounded-2xl bg-surface-container-lowest shadow-sm px-4 py-4">
              <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-3">
                Trip Route
              </p>
              <div className="flex gap-3">
                {/* Connector */}
                <div className="flex flex-col items-center gap-0">
                  <div className="w-3 h-3 rounded-full bg-tertiary border-2 border-surface-container-lowest shadow" />
                  <div className="w-0.5 flex-1 bg-outline-variant my-1" style={{ minHeight: 28 }} />
                  <div className="w-3 h-3 rounded-sm bg-on-surface shadow" />
                </div>
                {/* Labels */}
                <div className="flex-1 flex flex-col gap-4">
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Pickup</p>
                    <p className="text-sm font-medium text-on-surface leading-snug">
                      {ride.pickupAddress ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Drop-off</p>
                    <p className="text-sm font-medium text-on-surface leading-snug">
                      {ride.destinationAddress ?? "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Card 3: Passenger Profile ───────────────────────────────── */}
            <div className="rounded-2xl bg-surface-container-lowest shadow-sm px-4 py-4">
              <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-3">
                Passenger
              </p>
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center shadow">
                  <span className="material-symbols-outlined text-on-secondary-container text-2xl">person</span>
                  {/* Online dot */}
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-tertiary border-2 border-surface-container-lowest" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-on-surface">
                      {ride.passengerName ?? "Aarav Sharma"}
                    </p>
                    <span className="material-symbols-outlined text-primary text-sm">verified</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-amber-400 text-sm">star</span>
                    <span className="text-xs font-medium text-on-surface">4.8</span>
                    <span className="text-xs text-on-surface-variant">· 142 trips</span>
                  </div>
                </div>
                {/* Safety badges */}
                <div className="flex flex-col gap-1 items-end">
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-xs">luggage</span> Luggage
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-xs">safety_check</span> Verified
                  </span>
                </div>
              </div>
            </div>

            {/* ── Action Buttons ──────────────────────────────────────────── */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => accept(ride.id)}
                disabled={countdown === 0 || accepting}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-on-tertiary-container text-white font-bold text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-opacity active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-xl">check_circle</span>
                {accepting ? "Accepting…" : `Accept Ride (${countdown}s)`}
              </button>

              <button
                onClick={() => { /* pass / decline – no existing handler */ }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-error text-error font-semibold text-sm transition-colors hover:bg-error-container active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-base">close</span>
                Pass this ride
              </button>
            </div>
          </div>
        </>
      ) : (
        /* ── Empty State ─────────────────────────────────────────────────── */
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-6 pb-10">
          <div className="w-full rounded-3xl bg-surface-container-lowest shadow-sm p-8 flex flex-col items-center text-center gap-4">
            {/* Illustration */}
            <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 44 }}>
                electric_bike
              </span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-on-surface">No Incoming Requests</h2>
              <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
                You're all set! Requests appear here when you are{" "}
                <span className="font-semibold text-tertiary">approved</span>,{" "}
                <span className="font-semibold text-tertiary">online</span>, and a passenger has booked a
                ride that is{" "}
                <span className="font-semibold text-tertiary">searching</span> for a rider.
              </p>
            </div>

            {msg && (
              <div className="w-full flex items-start gap-2 px-3 py-2 rounded-xl bg-error-container">
                <span className="material-symbols-outlined text-on-error-container text-sm mt-0.5">info</span>
                <p className="text-xs text-on-error-container text-left">{msg}</p>
              </div>
            )}

            <div className="w-full border-t border-outline-variant pt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${riderInfo?.isOnline ? "bg-tertiary animate-pulse" : "bg-outline"}`} />
                <span className="text-xs text-on-surface-variant">
                  {riderInfo ? (riderInfo.isOnline ? "You're Online" : "You're Offline") : "Checking status…"}
                </span>
              </div>
              <span className="text-xs text-on-surface-variant">Auto-refreshing</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
