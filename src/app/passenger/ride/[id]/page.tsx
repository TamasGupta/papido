"use client";

import { Suspense, use, useEffect, useState } from "react";

const LABELS: Record<string, string> = {
  REQUESTED: "Requested",
  SEARCHING: "Searching for a rider…",
  RIDER_ASSIGNED: "Rider assigned",
  RIDER_ARRIVING: "Rider is on the way",
  RIDER_ARRIVED: "Rider has arrived",
  RIDE_STARTED: "Ride in progress",
  RIDE_COMPLETED: "Ride completed",
  PAYMENT_COMPLETED: "Payment completed",
  RATING_COMPLETED: "Thanks for riding!",
};

export default function PassengerRidePage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<main className="flex-1 bg-surface-container-lowest p-6">Loading…</main>}>
      <PassengerRideInner params={params} />
    </Suspense>
  );
}

function PassengerRideInner({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [ride, setRide] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/rides/${id}`);
      const data = await res.json();
      if (data.success) setRide(data.data);
    }
    load();
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
  }, [id]);

  if (!ride)
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-container-lowest">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined animate-spin text-4xl text-primary">
            progress_activity
          </span>
          <p className="text-on-surface-variant text-sm">Loading your ride…</p>
        </div>
      </div>
    );

  const showOtp = ["RIDER_ARRIVED", "RIDER_ASSIGNED", "RIDER_ARRIVING"].includes(ride.status);
  const pinDigits = (ride.pin ?? "----").toString().split("");

  if (ride.status === "RIDE_COMPLETED") {
    return (
      <div className="min-h-screen bg-surface-container-lowest">
        <div className="mx-auto max-w-[420px]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-10 pb-4">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container">
              <span className="material-symbols-outlined text-on-surface text-xl">arrow_back</span>
            </button>
            <span className="text-on-surface font-bold text-lg tracking-tight">Papido</span>
            <div className="h-10 w-10 rounded-full bg-tertiary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-tertiary-container text-xl">person</span>
            </div>
          </div>

          {/* Completion Card */}
          <div className="mx-4 mt-6 rounded-3xl bg-surface p-6 shadow-sm">
            <div className="flex flex-col items-center gap-3 pb-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-container">
                <span className="material-symbols-outlined text-primary text-4xl">check_circle</span>
              </div>
              <p className="text-on-surface text-2xl font-bold">Ride Completed!</p>
              <p className="text-on-surface-variant text-sm">Thank you for riding with Papido</p>
            </div>
            <div className="border-t border-outline-variant mt-2 pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-on-surface-variant text-sm">Route</span>
                <span className="text-on-surface text-sm font-medium text-right max-w-[200px]">
                  {ride.pickupAddress} → {ride.destinationAddress}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant text-sm">Distance</span>
                <span className="text-on-surface text-sm font-medium">{ride.estimatedDistance} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant text-sm">Total Fare</span>
                <span className="text-primary text-lg font-bold">₹{ride.finalFare ?? ride.estimatedFare}</span>
              </div>
            </div>
            <button className="mt-6 w-full rounded-2xl bg-primary py-3.5 text-white font-semibold text-base">
              Rate Your Ride
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-container-lowest flex flex-col">
      <div className="mx-auto w-full max-w-[420px] flex flex-col min-h-screen relative">

        {/* ── Fixed Header ── */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 pt-10 pb-3">
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-surface/80 backdrop-blur shadow-sm">
            <span className="material-symbols-outlined text-on-surface text-xl">arrow_back</span>
          </button>
          <div className="flex flex-col items-center">
            <span className="text-on-surface font-bold text-base tracking-tight leading-none">Papido</span>
            <span className="text-on-surface-variant text-[11px] mt-0.5">Live Trip Tracking</span>
          </div>
          <div className="h-10 w-10 rounded-full bg-tertiary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-on-tertiary-container text-xl">person</span>
          </div>
        </div>

        {/* ── Map Section ── */}
        <div className="relative h-72 bg-surface-container flex-shrink-0 overflow-hidden">
          {/* Road grid background */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-on-surface-variant"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Simulated road */}
          <div className="absolute left-1/4 top-0 bottom-0 w-12 bg-surface-container-highest opacity-60 rounded-full" />
          <div className="absolute top-1/3 left-0 right-0 h-10 bg-surface-container-highest opacity-60 rounded-full" />

          {/* ETA Floating Bubble */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10">
            <div className="flex items-center gap-1.5 bg-surface rounded-full px-3 py-1.5 shadow-md">
              <span className="material-symbols-outlined text-primary text-base">schedule</span>
              <span className="text-on-surface text-xs font-semibold">Arriving in 3 mins (0.8 km)</span>
            </div>
          </div>

          {/* Route SVG */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill="#6750A4" opacity="0.7" />
              </marker>
            </defs>
            {/* Dashed route path */}
            <path
              d="M 100 220 Q 130 180 150 140 Q 170 100 200 80"
              fill="none"
              stroke="#6750A4"
              strokeWidth="3"
              strokeDasharray="8 5"
              strokeLinecap="round"
              opacity="0.8"
              markerEnd="url(#arrowhead)"
            />
          </svg>

          {/* Rider Marker */}
          <div className="absolute left-[38%] top-[30%] flex flex-col items-center z-10">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary shadow-lg">
              <span className="material-symbols-outlined text-on-primary text-lg">two_wheeler</span>
            </div>
            <div className="mt-1 rounded-full bg-surface px-2 py-0.5 shadow text-[10px] font-semibold text-on-surface">
              Rajesh
            </div>
            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[5px] border-t-surface -mt-0" />
          </div>

          {/* Passenger Pickup Marker */}
          <div className="absolute left-[22%] top-[62%] flex flex-col items-center z-10">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-tertiary-container shadow-lg border-2 border-surface">
              <span className="material-symbols-outlined text-on-tertiary-container text-base">location_on</span>
            </div>
            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-tertiary-container" />
          </div>

          {/* Recenter Button */}
          <button className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-surface shadow-md">
            <span className="material-symbols-outlined text-on-surface text-xl">my_location</span>
          </button>
        </div>

        {/* ── Bottom Sheet ── */}
        <div className="relative -mt-4 z-10 flex-1 rounded-t-3xl bg-surface-container-lowest px-4 pb-8 pt-5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">

          {/* Drag handle */}
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-outline-variant" />

          {/* 1 ── Live Status Header Card */}
          <div className="rounded-2xl bg-surface p-4 shadow-sm mb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
                </span>
                <span className="text-on-surface font-semibold text-sm">
                  {LABELS[ride.status] ?? ride.status}
                </span>
              </div>
              <span className="rounded-full bg-secondary-container px-2.5 py-0.5 text-on-secondary-container text-xs font-semibold">
                On Time
              </span>
            </div>
            <p className="mt-2 text-on-surface-variant text-xs">
              ETA · Arriving in approximately <span className="font-semibold text-on-surface">3 minutes</span>
            </p>
            <div className="mt-2 flex items-center gap-1 text-on-surface-variant text-xs">
              <span className="material-symbols-outlined text-sm">route</span>
              <span>{ride.pickupAddress} → {ride.destinationAddress}</span>
            </div>
          </div>

          {/* 2 ── OTP Badge Card */}
          <div className="rounded-2xl bg-primary-container p-4 shadow-sm mb-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-on-primary-container text-lg">lock</span>
                <span className="text-on-primary-container font-semibold text-sm">Start Ride OTP</span>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-surface/40 px-2 py-0.5 text-on-primary-container text-xs font-medium">
                <span className="material-symbols-outlined text-xs">helmet</span>
                Helmet Ready
              </span>
            </div>

            {/* OTP Digit Boxes */}
            <div className="flex justify-center gap-3 mb-3">
              {showOtp
                ? pinDigits.map((digit: string, i: number) => (
                    <div
                      key={i}
                      className="flex h-14 w-12 items-center justify-center rounded-xl bg-surface shadow-sm"
                    >
                      <span className="text-on-surface text-2xl font-bold tracking-widest">{digit}</span>
                    </div>
                  ))
                : ["–", "–", "–", "–"].map((_, i) => (
                    <div
                      key={i}
                      className="flex h-14 w-12 items-center justify-center rounded-xl bg-surface/60 shadow-sm"
                    >
                      <span className="text-on-surface-variant text-2xl font-bold">–</span>
                    </div>
                  ))}
            </div>

            <div className="flex items-start gap-1.5 rounded-xl bg-surface/30 p-2.5">
              <span className="material-symbols-outlined text-on-primary-container text-base mt-0.5 flex-shrink-0">info</span>
              <p className="text-on-primary-container text-[11px] leading-relaxed">
                Share this OTP <span className="font-semibold">only when the rider arrives</span> at your location to start your ride.
              </p>
            </div>
          </div>

          {/* 3 ── Rider & Vehicle Details Card */}
          <div className="rounded-2xl bg-surface p-4 shadow-sm mb-3">
            <div className="flex items-center gap-3 mb-4">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary-container text-2xl font-bold text-on-secondary-container">
                  {(ride.rider?.user?.name ?? "C")[0].toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                  <span className="material-symbols-outlined text-on-primary text-xs">star</span>
                </div>
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-on-surface font-semibold text-base truncate">
                  {ride.rider?.user?.name ?? "Searching for Captain…"}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-yellow-500 text-sm">star</span>
                  <span className="text-on-surface text-sm font-medium">
                    {ride.rider?.ratingAvg ? ride.rider.ratingAvg.toFixed(1) : "4.9"}
                  </span>
                  <span className="text-on-surface-variant text-xs">
                    · {ride.rider?.vehicle?.registration ?? "Hero Splendor • KA 01 EK 8842"}
                  </span>
                </div>
              </div>
              {/* Call & Message */}
              <div className="flex gap-2">
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container">
                  <span className="material-symbols-outlined text-on-primary-container text-xl">call</span>
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-container">
                  <span className="material-symbols-outlined text-on-secondary-container text-xl">chat</span>
                </button>
              </div>
            </div>

            {/* Vehicle Info */}
            <div className="flex items-center justify-between rounded-xl bg-surface-container px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-on-surface-variant text-xl">two_wheeler</span>
                <div>
                  <p className="text-on-surface text-sm font-medium">Honda Activa 6G · Silver</p>
                  <p className="text-on-surface-variant text-xs">Bike Taxi</p>
                </div>
              </div>
              {/* Number Plate */}
              <div className="rounded-md border-2 border-on-surface/60 bg-surface px-2 py-1">
                <p className="text-on-surface text-xs font-bold tracking-widest font-mono">KA 01 EK 8842</p>
              </div>
            </div>

            {/* Fare Info */}
            <div className="flex items-center justify-between mt-3 px-1">
              <div className="flex items-center gap-1 text-on-surface-variant text-xs">
                <span className="material-symbols-outlined text-sm">route</span>
                <span>{ride.estimatedDistance} km</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-on-surface-variant text-xs">Est. fare</span>
                <span className="text-on-surface font-semibold text-sm">₹{ride.estimatedFare}</span>
              </div>
            </div>
          </div>

          {/* 4 ── Safety & Trip Actions Bar */}
          <div className="rounded-2xl bg-surface p-4 shadow-sm">
            <div className="flex gap-2 mb-3">
              <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-secondary-container py-3 text-on-secondary-container text-sm font-medium">
                <span className="material-symbols-outlined text-base">share_location</span>
                Share Trip
              </button>
              <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-error-container py-3 text-on-error-container text-sm font-medium">
                <span className="material-symbols-outlined text-base">sos</span>
                Emergency SOS
              </button>
            </div>
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-outline-variant py-3 text-error text-sm font-medium">
              <span className="material-symbols-outlined text-base">cancel</span>
              Cancel Ride
              <span className="ml-1 rounded-full bg-error-container px-2 py-0.5 text-on-error-container text-xs font-bold">
                4:58
              </span>
            </button>
          </div>
        </div>

        {/* ── Toast (hidden by default) ── */}
        <div className="pointer-events-none absolute bottom-24 left-4 right-4 z-30 opacity-0 transition-opacity duration-300">
          <div className="flex items-center gap-3 rounded-2xl bg-on-surface px-4 py-3 shadow-lg">
            <span className="material-symbols-outlined text-surface text-xl">check_circle</span>
            <p className="text-surface text-sm font-medium">Trip shared successfully</p>
          </div>
        </div>

      </div>
    </div>
  );
}