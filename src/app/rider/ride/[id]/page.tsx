"use client";

import { use, useEffect, useState } from "react";

export default function RiderActivRide({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // ── existing state ──────────────────────────────────────────────────────────
  const [pin, setPin] = useState("");
  const [msg, setMsg] = useState("");

  // ── extended state for the rich UI ─────────────────────────────────────────
  const [ride, setRide] = useState<{
    id?: string;
    status?: string;
    pin?: string;
    estimatedDistance?: number;
    estimatedFare?: number;
    pickup?: string;
    drop?: string;
    passengerName?: string;
    passengerRating?: number;
    passengerPhone?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const [actionLoading, setActionLoading] = useState(false);

  // ── fetch ride details ──────────────────────────────────────────────────────
  useEffect(() => {
    async function fetchRide() {
      try {
        const res = await fetch(`/api/rides/${id}`);
        const data = await res.json();
        if (data.success) {
          setRide(data.data);
          // Pre-fill OTP digits if pin is known (for display)
          if (data.data?.pin) {
            const digits = String(data.data.pin).padStart(4, "0").split("");
            setOtpDigits(digits);
          }
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchRide();
  }, [id]);

  // ── existing verify & start logic (preserved) ──────────────────────────────
  async function verifyAndStart() {
    const enteredPin = otpDigits.join("");
    if (!enteredPin || enteredPin.length < 4)
      return setMsg("Enter the passenger OTP");
    setActionLoading(true);
    const res = await fetch("/api/rides", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "start", pin: enteredPin }),
    });
    const data = await res.json();
    setMsg(data.success ? "Ride started ✓" : (data.error?.message ?? "Failed"));
    if (data.success) window.location.href = "/rider/ride/" + (data.data?.id ?? id);
    setActionLoading(false);
  }

  // ── arrived at pickup ───────────────────────────────────────────────────────
  async function markArrived() {
    setActionLoading(true);
    const res = await fetch(`/api/rides/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "arrive" }),
    });
    const data = await res.json();
    if (data.success) {
      setRide((prev) => prev ? { ...prev, status: "RIDER_ARRIVED" } : prev);
      setMsg("Marked as arrived");
    } else {
      setMsg(data.error?.message ?? "Failed");
    }
    setActionLoading(false);
  }

  // ── cancel ride ─────────────────────────────────────────────────────────────
  async function cancelRide() {
    if (!confirm("Cancel this ride?")) return;
    setActionLoading(true);
    const res = await fetch(`/api/rides/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "cancel" }),
    });
    const data = await res.json();
    if (data.success) {
      window.location.href = "/rider/dashboard";
    } else {
      setMsg(data.error?.message ?? "Cancellation failed");
    }
    setActionLoading(false);
  }

  // ── helper: status label ────────────────────────────────────────────────────
  function statusLabel() {
    switch (ride?.status) {
      case "RIDER_ARRIVING":
        return "Navigating to pickup";
      case "RIDER_ARRIVED":
        return "At pickup — enter OTP";
      case "RIDE_STARTED":
        return "Ride in progress";
      case "RIDE_COMPLETED":
        return "Ride completed";
      default:
        return "En route to Indiranagar Metro";
    }
  }

  // ── handle otp digit input ──────────────────────────────────────────────────
  function handleOtpChange(index: number, value: string) {
    const digit = value.replace(/\D/, "").slice(-1);
    const next = [...otpDigits];
    next[index] = digit;
    setOtpDigits(next);
    if (digit && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      (nextInput as HTMLInputElement)?.focus();
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      (prev as HTMLInputElement)?.focus();
    }
  }

  // ── completed receipt view ──────────────────────────────────────────────────
  if (ride?.status === "RIDE_COMPLETED") {
    return (
      <div className="min-h-screen bg-surface-container-lowest flex flex-col max-w-[420px] mx-auto">
        {/* Header */}
        <div className="bg-primary px-4 pt-12 pb-6 text-on-primary">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => (window.location.href = "/rider/dashboard")}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20">
              <span className="material-symbols-outlined text-lg">arrow_back</span>
            </button>
            <div>
              <p className="font-bold text-base">Papido Captain</p>
              <p className="text-xs opacity-80">Ride Completed</p>
            </div>
          </div>
          <div className="text-center">
            <span className="material-symbols-outlined text-5xl mb-2">check_circle</span>
            <p className="text-3xl font-bold">₹{ride.estimatedFare ?? "—"}</p>
            <p className="text-sm opacity-80 mt-1">Fare earned</p>
          </div>
        </div>

        <div className="px-4 py-4 space-y-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-on-surface-variant font-medium mb-3">TRIP SUMMARY</p>
            <div className="space-y-2 text-sm">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-primary text-base mt-0.5">radio_button_checked</span>
                <p className="text-on-surface">{ride.pickup ?? "Pickup location"}</p>
              </div>
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-error text-base mt-0.5">location_on</span>
                <p className="text-on-surface">{ride.drop ?? "Drop location"}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-outline-variant flex justify-between text-sm">
              <span className="text-on-surface-variant">Distance</span>
              <span className="font-semibold">{ride.estimatedDistance ?? "—"} km</span>
            </div>
          </div>

          <button onClick={() => (window.location.href = "/rider/dashboard")}
            className="w-full bg-primary text-on-primary rounded-2xl py-4 font-semibold text-base">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ── main ride navigation UI ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-surface-container-lowest flex flex-col max-w-[420px] mx-auto relative overflow-hidden">

      {/* ── Fixed Header ─────────────────────────────────────────────────────── */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] z-30 bg-surface/95 backdrop-blur-sm border-b border-outline-variant px-4 pt-10 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => (window.location.href = "/rider/dashboard")}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-surface-container">
              <span className="material-symbols-outlined text-on-surface text-xl">arrow_back</span>
            </button>
            <div>
              <p className="font-bold text-on-surface text-sm leading-tight">Papido Captain</p>
              <p className="text-xs text-on-surface-variant">Active Ride</p>
            </div>
          </div>
          {/* SOS Button */}
          <button className="flex items-center gap-1.5 bg-error text-on-error rounded-full px-3 py-1.5 text-xs font-bold shadow-lg">
            <span className="material-symbols-outlined text-sm">sos</span>
            SOS
          </button>
        </div>
      </div>

      {/* ── Spacer for fixed header ───────────────────────────────────────────── */}
      <div className="h-[80px]" />

      {/* ── Map Section ──────────────────────────────────────────────────────── */}
      <div className="relative h-72 bg-primary-container overflow-hidden mx-0">
        {/* Simulated navigation map background */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 420 288" preserveAspectRatio="xMidYMid slice">
          {/* Road grid */}
          <rect width="420" height="288" fill="#d8e8d0" />
          <rect x="0" y="80" width="420" height="36" fill="#e8f0e4" />
          <rect x="0" y="170" width="420" height="28" fill="#e8f0e4" />
          <rect x="100" y="0" width="40" height="288" fill="#e8f0e4" />
          <rect x="280" y="0" width="36" height="288" fill="#e8f0e4" />
          {/* Road markings */}
          <line x1="0" y1="98" x2="420" y2="98" stroke="#c8d8c4" strokeWidth="1" strokeDasharray="20,10" />
          <line x1="120" y1="0" x2="120" y2="288" stroke="#c8d8c4" strokeWidth="1" strokeDasharray="20,10" />
          {/* Route path */}
          <path
            d="M 60 240 Q 120 200 120 160 Q 120 120 180 100 Q 240 80 300 80 Q 360 80 380 60"
            fill="none"
            stroke="#1a73e8"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Route glow */}
          <path
            d="M 60 240 Q 120 200 120 160 Q 120 120 180 100 Q 240 80 300 80 Q 360 80 380 60"
            fill="none"
            stroke="#60a5fa"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.3"
          />
          {/* Drop pin */}
          <circle cx="380" cy="60" r="10" fill="#dc2626" />
          <circle cx="380" cy="60" r="5" fill="white" />
          {/* Rider / You are here marker */}
          <circle cx="60" cy="240" r="14" fill="#1a73e8" opacity="0.2" />
          <circle cx="60" cy="240" r="9" fill="#1a73e8" />
          <circle cx="60" cy="240" r="4" fill="white" />
          {/* Direction arrow on route */}
          <polygon points="195,94 205,100 195,106" fill="#1a73e8" />
          <polygon points="265,77 275,83 265,89" fill="#1a73e8" />
        </svg>

        {/* Speed indicator */}
        <div className="absolute bottom-4 left-4 bg-white rounded-xl px-3 py-2 shadow-md flex items-center gap-1.5">
          <span className="material-symbols-outlined text-primary text-base">speed</span>
          <span className="font-bold text-on-surface text-sm">34</span>
          <span className="text-on-surface-variant text-xs">km/h</span>
        </div>

        {/* ETA bubble */}
        <div className="absolute bottom-4 right-4 bg-primary text-on-primary rounded-xl px-3 py-2 shadow-lg flex items-center gap-1.5">
          <span className="material-symbols-outlined text-base">schedule</span>
          <span className="text-xs font-semibold">Arriving in 8 mins</span>
        </div>

        {/* Drop label */}
        <div className="absolute top-3 right-3 bg-error/90 text-on-error rounded-lg px-2 py-1 text-xs font-medium shadow">
          Drop
        </div>

        {/* You are here label */}
        <div className="absolute bottom-20 left-8 bg-white/90 rounded-lg px-2 py-0.5 text-xs text-primary font-medium shadow">
          You
        </div>
      </div>

      {/* ── Bottom Content ────────────────────────────────────────────────────── */}
      <div className="px-4 -mt-4 z-10 pb-6 space-y-3">

        {/* Live Navigation Status card */}
        <div className="bg-white rounded-2xl px-4 py-3 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-tertiary animate-pulse" />
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-tertiary opacity-30 scale-150 animate-ping" />
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-medium">LIVE NAVIGATION</p>
              <p className="text-sm font-semibold text-on-surface">{statusLabel()}</p>
            </div>
          </div>
          <span className="bg-tertiary-container text-on-tertiary-container text-xs font-semibold px-2.5 py-1 rounded-full">
            {ride?.status === "RIDER_ARRIVED" ? "Arrived" : "On Track"}
          </span>
        </div>

        {/* OTP Verification card */}
        <div className="bg-primary-container rounded-2xl px-4 py-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-on-primary-container/70 font-medium">TRIP OTP</p>
              <p className="text-sm font-semibold text-on-primary-container">Verify to start ride</p>
            </div>
            <span className="material-symbols-outlined text-on-primary-container/60">lock</span>
          </div>
          <div className="flex gap-2 justify-center mb-3">
            {otpDigits.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                className="w-12 h-12 text-center text-xl font-bold rounded-xl border-2 border-primary/30 bg-white text-primary focus:border-primary focus:outline-none"
              />
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-on-primary-container/70">
            <span className="material-symbols-outlined text-sm">info</span>
            <p className="text-xs">Ask the passenger for the 4-digit OTP</p>
          </div>
        </div>

        {/* Passenger Details card */}
        <div className="bg-white rounded-2xl px-4 py-4 shadow-sm">
          <p className="text-xs text-on-surface-variant font-medium mb-3">PASSENGER</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-11 h-11 rounded-full bg-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-secondary-container text-xl">person</span>
              </div>
              <div>
                <p className="font-semibold text-on-surface text-sm">
                  {ride?.passengerName ?? "Aarav Sharma"}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-yellow-500 text-sm">star</span>
                  <span className="text-xs text-on-surface-variant font-medium">
                    {ride?.passengerRating ?? "4.8"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <a
                href={ride?.passengerPhone ? `tel:${ride.passengerPhone}` : "#"}
                className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-primary text-lg">call</span>
              </a>
              <button className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-secondary-container text-lg">chat</span>
              </button>
            </div>
          </div>
        </div>

        {/* Trip Summary card */}
        <div className="bg-white rounded-2xl px-4 py-4 shadow-sm">
          <p className="text-xs text-on-surface-variant font-medium mb-3">TRIP DETAILS</p>
          <div className="space-y-2.5">
            <div className="flex gap-3 items-start">
              <span className="material-symbols-outlined text-primary text-base mt-0.5 shrink-0">radio_button_checked</span>
              <div>
                <p className="text-[10px] text-on-surface-variant">PICKUP</p>
                <p className="text-sm text-on-surface leading-snug">
                  {ride?.pickup ?? "MG Road, Bengaluru"}
                </p>
              </div>
            </div>
            <div className="ml-[13px] h-6 border-l-2 border-dashed border-outline-variant" />
            <div className="flex gap-3 items-start">
              <span className="material-symbols-outlined text-error text-base mt-0.5 shrink-0">location_on</span>
              <div>
                <p className="text-[10px] text-on-surface-variant">DROP</p>
                <p className="text-sm text-on-surface leading-snug">
                  {ride?.drop ?? "Indiranagar Metro, Bengaluru"}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-outline-variant grid grid-cols-2 gap-2">
            <div className="text-center">
              <p className="text-xs text-on-surface-variant">Distance</p>
              <p className="font-bold text-on-surface text-sm">
                {ride?.estimatedDistance ?? "—"} km
              </p>
            </div>
            <div className="text-center border-l border-outline-variant">
              <p className="text-xs text-on-surface-variant">Fare</p>
              <p className="font-bold text-primary text-sm">
                ₹{ride?.estimatedFare ?? "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Error / success message */}
        {msg && (
          <div className={`rounded-xl px-4 py-3 text-sm font-medium ${
            msg.includes("✓")
              ? "bg-tertiary-container text-on-tertiary-container"
              : "bg-error-container text-on-error-container"
          }`}>
            {msg}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          {/* Primary: context-aware action */}
          {ride?.status === "RIDER_ARRIVED" ? (
            <button
              onClick={verifyAndStart}
              disabled={actionLoading || otpDigits.join("").length < 4}
              className="w-full bg-primary text-white rounded-2xl py-4 font-semibold text-base shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {actionLoading ? (
                <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-lg">verified</span>
              )}
              Verify OTP &amp; Start Ride
            </button>
          ) : (
            <button
              onClick={markArrived}
              disabled={actionLoading || loading}
              className="w-full bg-primary text-white rounded-2xl py-4 font-semibold text-base shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {actionLoading ? (
                <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined text-lg">location_on</span>
              )}
              Arrived at Pickup
            </button>
          )}

          {/* Secondary: Cancel */}
          <button
            onClick={cancelRide}
            disabled={actionLoading}
            className="w-full bg-transparent border border-outline text-on-surface-variant rounded-2xl py-3.5 font-medium text-sm disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-base">cancel</span>
            Cancel Ride
          </button>
        </div>
      </div>
    </div>
  );
}