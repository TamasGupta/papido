"use client";

import { useEffect, useState } from "react";

export default function RiderRequests() {
  const [rides, setRides] = useState<any[]>([]);
  const [msg, setMsg] = useState("");

  async function load() {
    const res = await fetch("/api/rider/requests");
    const data = await res.json();
    setRides(data.success ? data.data : []);
    if (!data.success) setMsg(data.error?.message ?? "");
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);

  async function accept(id: string) {
    const res = await fetch(`/api/rides/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "accept" }),
    });
    const data = await res.json();
    if (data.success) window.location.href = `/rider/ride/${id}`;
    else setMsg(data.error?.message ?? "Could not accept");
  }

  return (
    <main className="flex-1 bg-slate-50 p-6">
      <h1 className="text-xl font-bold text-slate-900">Incoming requests</h1>
      {msg && <p className="mt-2 text-sm text-slate-500">{msg}</p>}
      <div className="mt-4 space-y-3">
        {rides.map((r) => (
          <div key={r.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="font-semibold text-slate-900">{r.pickupAddress}</p>
            <p className="text-sm text-slate-500">→ {r.destinationAddress}</p>
            <p className="mt-1 text-sm text-slate-600">
              {r.estimatedDistance} km · Est. ₹{r.estimatedFare}
            </p>
            <button onClick={() => accept(r.id)} className="mt-3 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white">
              Accept
            </button>
          </div>
        ))}
        {rides.length === 0 && <p className="text-sm text-slate-500">No open requests right now.</p>}
      </div>
    </main>
  );
}
