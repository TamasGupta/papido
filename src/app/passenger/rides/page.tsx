"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PassengerRides() {
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/rides");
        const data = await res.json();
        if (data.success) {
          setRides(data.data);
        }
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function getStatusBadge(status: string) {
    switch (status) {
      case "RIDE_COMPLETED":
        return (
          <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-on-tertiary-container text-[11px] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container" />
            Completed
          </span>
        );
      case "SEARCHING":
      case "RIDER_ASSIGNED":
      case "RIDER_ARRIVING":
      case "RIDER_ARRIVED":
      case "RIDE_STARTED":
        return (
          <span className="px-2.5 py-1 rounded-full bg-tertiary-container text-on-tertiary-container text-[11px] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container animate-ping" />
            Active
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full bg-error-container text-on-error-container text-[11px] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-error" />
            Cancelled
          </span>
        );
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans text-on-surface">
      {/* Fixed Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/90 backdrop-blur-xl border-b border-outline/20">
        <div className="h-16 px-4 flex items-center justify-between gap-2 max-w-[420px] mx-auto w-full">
          <div className="flex items-center gap-2">
            <Link href="/passenger/home" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-on-surface text-xl">arrow_back</span>
            </Link>
            <h1 className="font-bold text-[18px] text-on-surface tracking-tight">Your Activity</h1>
          </div>
          <Link href="/passenger/home" className="px-3 py-1.5 rounded-full bg-primary-container text-surface-bright text-[12px] font-semibold flex items-center gap-1 shadow-sm">
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Book New</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col w-full max-w-[420px] mx-auto pt-20 pb-24 px-4 bg-surface gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-on-surface">Trip History</h2>
          <span className="text-[12px] font-semibold text-secondary">{rides.length} Total Rides</span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="material-symbols-outlined animate-spin text-[32px] text-primary">progress_activity</span>
            <p className="text-[13px] font-medium text-secondary">Loading your trips…</p>
          </div>
        ) : rides.length > 0 ? (
          <div className="flex flex-col gap-3">
            {rides.map((ride) => (
              <Link
                key={ride.id}
                href={ride.status === "RIDE_COMPLETED" ? `/passenger/ride/${ride.id}` : `/passenger/ride/${ride.id}`}
                className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline/20 flex flex-col gap-3 hover:border-primary/40 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary-container text-surface-bright flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">two_wheeler</span>
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-on-surface leading-tight">Papido Bike</p>
                      <p className="text-[11px] font-semibold text-secondary">
                        {new Date(ride.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(ride.status)}
                </div>

                <div className="flex flex-col gap-2 bg-surface-container-low p-3 rounded-lg border border-outline/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-on-tertiary-container shrink-0" />
                    <p className="text-[13px] font-medium text-on-surface truncate">{ride.pickupAddress}</p>
                  </div>
                  <div className="w-0.5 h-2 bg-outline/30 ml-0.75" />
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-sm bg-error shrink-0" />
                    <p className="text-[13px] font-medium text-on-surface truncate">{ride.destinationAddress}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 text-[12px] font-medium text-secondary">
                    <span className="material-symbols-outlined text-[16px]">route</span>
                    <span>{ride.estimatedDistance} km</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[16px] font-bold text-on-surface">
                      ₹{ride.finalFare ?? ride.estimatedFare ?? "—"}
                    </span>
                    <span className="material-symbols-outlined text-[18px] text-secondary group-hover:translate-x-0.5 transition-transform">
                      chevron_right
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline/20 flex flex-col items-center justify-center text-center gap-3 my-6">
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px] text-secondary">history</span>
            </div>
            <h3 className="text-[18px] font-bold text-on-surface">No Rides Yet</h3>
            <p className="text-[13px] text-secondary max-w-[260px]">
              When you book and complete bike rides on Papido, your receipts and activity history will appear here.
            </p>
            <Link
              href="/passenger/home"
              className="mt-2 h-11 px-6 rounded-lg bg-on-tertiary-container text-surface-bright font-semibold text-[14px] flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Book First Ride</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 z-50 bg-surface/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.04)]">
        <div className="flex justify-around items-center h-16 max-w-[420px] mx-auto px-1">
          <Link className="flex flex-col items-center justify-center min-w-[64px] min-h-[44px] gap-0.5 text-on-surface-variant hover:text-on-surface transition-colors" href="/passenger/home">
            <span className="material-symbols-outlined text-[22px]">two_wheeler</span>
            <span className="text-[11px] font-semibold tracking-tight">Book Ride</span>
          </Link>
          <Link aria-current="page" className="flex flex-col items-center justify-center min-w-[64px] min-h-[44px] gap-0.5 transition-colors text-primary" href="/passenger/rides">
            <span className="material-symbols-outlined text-[22px]">history</span>
            <span className="text-[11px] font-semibold tracking-tight">Activity</span>
          </Link>
          <a className="flex flex-col items-center justify-center min-w-[64px] min-h-[44px] gap-0.5 text-on-surface-variant hover:text-on-surface transition-colors" href="#">
            <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
            <span className="text-[11px] font-semibold tracking-tight">Wallet</span>
          </a>
          <Link className="flex flex-col items-center justify-center min-w-[64px] min-h-[44px] gap-0.5 text-on-surface-variant hover:text-on-surface transition-colors" href="/login">
            <span className="material-symbols-outlined text-[22px]">person</span>
            <span className="text-[11px] font-semibold tracking-tight">Account</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
