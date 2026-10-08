"use client";

import { useEffect, useState } from "react";

export default function RiderDashboard() {
  const [online, setOnline] = useState<boolean | null>(null);
  const [msg, setMsg] = useState("");
  const [earnings, setEarnings] = useState<any>(null);

  useEffect(() => {
    fetch("/api/rider/earnings").then((r) => r.json()).then((d) => d.success && setEarnings(d.data));
  }, []);

  async function toggle() {
    const next = !online;
    const res = await fetch("/api/rider/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isOnline: next }),
    });
    const data = await res.json();
    if (data.success) setOnline(data.data.isOnline);
    setMsg(data.message ?? data.error?.message ?? "");
  }

  return (
    <main className="flex-1 bg-slate-50 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Rider Dashboard</h1>
        <button
          onClick={toggle}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold text-white ${online ? "bg-green-600" : "bg-slate-400"}`}
        >
          {online === null ? "Go Online" : online ? "Online — tap to go offline" : "Offline — tap to go online"}
        </button>
      </div>
      {msg && <p className="mt-2 text-sm text-slate-600">{msg}</p>}
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          ["Gross Earnings", `₹${earnings?.gross ?? 0}`],
          ["Commission", `₹${earnings?.commission ?? 0}`],
          ["Net Earnings", `₹${earnings?.net ?? 0}`],
          ["Completed Rides", earnings?.completedRides ?? 0],
        ].map(([k, v]) => (
          <div key={k as string} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-500">{k}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{v}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
