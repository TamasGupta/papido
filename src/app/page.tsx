"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Map = dynamic(() => import("@/components/maps/LeafletMap"), { ssr: false });

export default function PassengerHome() {
  const [pickup, setPickup] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [fareMsg, setFareMsg] = useState("");
  const [center, setCenter] = useState<[number, number]>([12.9716, 77.5946]);
  const [locStatus, setLocStatus] = useState("");

  // GPS on mount
  useEffect(() => {
    if (!navigator.geolocation || !window.isSecureContext) {
      setLocStatus("Location needs localhost or HTTPS.");
      return;
    }
    setLocStatus("Requesting location permission…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter([pos.coords.latitude, pos.coords.longitude]);
        setPickup("Current Location");
        setLocStatus("Location acquired.");
      },
      (err) =>
        setLocStatus(
          err.code === err.PERMISSION_DENIED
            ? "Location permission denied — enable it in browser site settings."
            : `Location error: ${err.message}`
        )
    );
  }, []);

  async function book() {
    setLoading(true);
    setFareMsg("");
    const res = await fetch("/api/rides", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pickupLat: center[0],
        pickupLng: center[1],
        pickupAddress: pickup || "Current Location",
        destinationLat: 12.9352,
        destinationLng: 77.6245,
        destinationAddress: destination || "Destination",
      }),
    });
    const data = await res.json();
    setLoading(false);
    setFareMsg(
      data.success
        ? `Ride requested · Estimated fare ₹${data.data?.estimatedFare} · PIN ${data.data?.pin}`
        : data.error?.message ?? "Could not book"
    );
  }

  return (
    <main className="flex flex-1 bg-slate-50 min-h-screen">
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/90 backdrop-blur-xl pt-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-14 px-margin flex items-center justify-between max-w-[420px] mx-auto w-full">
          <div className="flex items-center gap-2 min-w-0">
            <img
              alt="Papido Logo"
              className="h-8 w-auto object-contain flex-shrink-0"
              src="https://lh3.googleusercontent.com/aida/AEtjO1WIqpdr-Rsa-fUbDuJeYy907Gux0uJlH4kXzckPYmDpA15dSdib655FTKlJo6hcf8Lf8GIk-TjE_oGAOiEZZgiGrczU29hQuRwK9q3Gpl6a74mQBF4nHXnwh82-SICIhWLjK1xjqW3g0ySsdMmB55etm8xAXacgzWraNw5uTzarLANudWwGnBT1pEMsEiw22wTVk6-31aI8zSEdM7gQlcrXrGgnO4YfLpGOEYcagnljXA"
            />
            <div className="flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded-full min-w-0">
              <span className="material-symbols-outlined text-on-tertiary-container text-[16px]">location_on</span>
              <span className="font-label-sm text-label-sm text-on-surface truncate max-w-[110px]">Koramangala, BLR</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              aria-label="Passenger Profile"
              className="w-11 h-11 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors"
              type="button"
            >
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhBHHA8YsHOxxXEznscCdc7AwtBeMqBO-t3DDB1vjWtqN9Wk0PJ7RDFuRt3H4ggnkjqcAEmfhlYjS0nVeLMCDVyVZ6W2AYxHrtSy1RH6KkR9-10-cmvgbsO8Fp8pU06s4ORdjRBkaQExRqPy3AwVL0VdOclLWmkk8eWTH32qdql4NHWjn7wUkJ2CMb2bRKiyZ8qZwhUefSPtxb_yqtnNAZ4sXcMwtX4kMii6NYjPu-"
              />
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-20 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-600">Papido</p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
          Bike rides, exactly when you need them.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-600">
          Book a nearby rider in seconds. Transparent fares, live tracking, and cashless or cash payments.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={book}
            disabled={loading}
            className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            {loading ? "Booking…" : "Confirm Ride"}
          </button>
        </div>
        {fareMsg && <p className="text-sm text-slate-700 mt-2">{fareMsg}</p>}
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-6 pb-20 md:grid-cols-3">
        {[
          {
            icon: "two_wheeler",
            title: "Fast pickup",
            body: "Average rider arrival in under 5 minutes.",
          },
          { icon: "map_pin", title: "Live tracking", body: "Follow your rider in real time on the map." },
          { icon: "shield", title: "Safe by design", body: "Verified riders, PIN start, and emergency tools." },
        ].map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-xl border border-slate-200 bg-white p-6">
            <span className="material-symbols-outlined text-2xl block mb-2">{Icon}</span>
            <h3 className="font-semibold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-600">{body}</p>
          </div>
        ))}
      </section>
    </main>
  );
}