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
    <Suspense fallback={<main className="flex-1 bg-slate-50 p-6">Loading…</main>}>
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

  if (!ride) return <main className="flex-1 bg-slate-50 p-6">Loading…</main>;

  return (
    <main className="flex-1 bg-slate-50 p-6">
      <h1 className="text-xl font-bold text-slate-900">Your ride</h1>
      <div className="mt-4 max-w-md rounded-xl border border-slate-200 bg-white p-6">
        <p className="text-lg font-semibold text-emerald-700">{LABELS[ride.status] ?? ride.status}</p>
        <p className="mt-2 text-slate-600">{ride.pickupAddress} → {ride.destinationAddress}</p>
        <p className="mt-2 text-sm text-slate-600">Estimated ₹{ride.estimatedFare} · {ride.estimatedDistance} km</p>
        {["RIDER_ARRIVED", "RIDER_ASSIGNED", "RIDER_ARRIVING"].includes(ride.status) && (
          <p className="mt-4 rounded-lg bg-amber-50 p-3 text-center text-lg font-bold tracking-widest text-amber-800">
            PIN: {ride.pin}
          </p>
        )}
        {ride.status === "RIDE_COMPLETED" && (
          <p className="mt-4 text-lg font-bold">Total ₹{ride.finalFare ?? ride.estimatedFare}</p>
        )}
      </div>
    </main>
  );
}