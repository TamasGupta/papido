"use client";

import { Suspense, use, useEffect, useState } from "react";

export default function RiderRidePage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<main className="flex-1 bg-slate-50 p-6">Loading…</main>}>
      <RiderRideInner params={params} />
    </Suspense>
  );
}

function RiderRideInner({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [ride, setRide] = useState<any>(null);
  const [pin, setPin] = useState("");
  const [msg, setMsg] = useState("");

  async function load() {
    const res = await fetch(`/api/rides/${id}`);
    const data = await res.json();
    if (data.success) setRide(data.data);
  }
  useEffect(() => {
    load();
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
  }, [id]);

  async function act(action: string, extra?: object) {
    const res = await fetch(`/api/rides/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...extra }),
    });
    const data = await res.json();
    setMsg(data.success ? `Ride ${action} ✓` : data.error?.message ?? "Failed");
    load();
  }

  if (!ride) return <main className="flex-1 bg-slate-50 p-6">Loading…</main>;

  return (
    <main className="flex-1 bg-slate-50 p-6">
      <h1 className="text-xl font-bold text-slate-900">Ride #{ride.id.slice(-6)}</h1>
      <p className="mt-1 text-sm text-slate-500">Status: <span className="font-semibold text-slate-800">{ride.status}</span></p>
      <p className="mt-2 text-slate-700">{ride.pickupAddress} → {ride.destinationAddress}</p>

      <div className="mt-6 max-w-md space-y-3">
        {ride.status === "RIDER_ASSIGNED" && (
          <button onClick={() => act("arrive")} className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white">I've Arrived</button>
        )}
        {ride.status === "RIDER_ARRIVED" && (
          <div className="flex gap-2">
            <input value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Enter passenger PIN" className="flex-1 rounded-lg border border-slate-300 px-3 py-2" />
            <button onClick={() => act("start", { pin })} className="rounded-lg bg-green-600 px-4 font-semibold text-white">Start Ride</button>
          </div>
        )}
        {ride.status === "RIDE_STARTED" && (
          <button onClick={() => act("complete")} className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white">Complete Ride</button>
        )}
        {ride.status === "RIDE_COMPLETED" && (
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="font-semibold">Fare breakdown</p>
            <p className="text-sm text-slate-600">Distance charge etc. configured via fare settings.</p>
            <p className="mt-2 text-lg font-bold">Total ₹{ride.finalFare ?? ride.estimatedFare}</p>
          </div>
        )}
        {msg && <p className="text-sm text-slate-600">{msg}</p>}
      </div>
    </main>
  );
}
