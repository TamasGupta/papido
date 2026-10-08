"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const Map = dynamic(() => import("@/components/maps/LeafletMap"), { ssr: false });

export default function PassengerHome() {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [fareMsg, setFareMsg] = useState("");

  async function book() {
    setLoading(true);
    setFareMsg("");
    const res = await fetch("/api/rides", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pickupLat: 12.9716,
        pickupLng: 77.5946,
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
        ? `Ride requested · Estimated fare ₹${data.data.estimatedFare} · PIN ${data.data.pin}`
        : data.error?.message ?? "Could not book"
    );
  }

  return (
    <main className="flex flex-1 flex-col bg-slate-100 md:flex-row">
      <section className="flex w-full flex-col gap-4 bg-white p-6 md:max-w-md">
        <h1 className="text-xl font-bold text-slate-900">Where to?</h1>
        <input value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="Where should we pick you up?" className="rounded-lg border border-slate-300 px-3 py-2.5" />
        <input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Where are you going?" className="rounded-lg border border-slate-300 px-3 py-2.5" />
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
          {[["Bike", "~4 min", "Cheapest"], ["Bike Premium", "~3 min", "Top riders"], ["Scheduled", "Later", "Planned"]].map(([t, eta, d]) => (
            <button key={t} className="rounded-lg border border-slate-200 p-3 text-slate-800 hover:border-green-600 hover:bg-green-50">
              {t}
              <span className="block font-normal text-slate-500">{eta} · {d}</span>
            </button>
          ))}
        </div>
        <button onClick={book} disabled={loading} className="rounded-lg bg-green-600 py-3 font-semibold text-white disabled:opacity-60">
          {loading ? "Booking…" : "Confirm Ride"}
        </button>
        {fareMsg && <p className="text-sm text-slate-700">{fareMsg}</p>}
      </section>
      <section className="h-72 flex-1 md:h-auto">
        <Map center={[12.9716, 77.5946]} pickup={[12.9716, 77.5946]} destination={[12.9352, 77.6245]} />
      </section>
    </main>
  );
}
