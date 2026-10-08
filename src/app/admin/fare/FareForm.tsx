"use client";

import { useState } from "react";

export default function FareForm({ initial }: { initial: any }) {
  const [form, setForm] = useState({
    baseFare: initial?.baseFare ?? 30,
    perKm: initial?.perKm ?? 8,
    perMinute: initial?.perMinute ?? 2,
    minFare: initial?.minFare ?? 40,
    platformFee: initial?.platformFee ?? 5,
    cancellationFee: initial?.cancellationFee ?? 20,
    commissionPct: initial?.commissionPct ?? 20,
    surgeMultiplier: initial?.surgeMultiplier ?? 1,
  });
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/fare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(Object.entries(form).map(([k, v]) => [k, Number(v)]))),
    });
    const data = await res.json();
    setMsg(data.success ? "Saved" : data.error?.message ?? "Failed");
  }

  const input = "w-full rounded-lg border border-slate-300 px-3 py-2";
  const fields: [string, string][] = [
    ["baseFare", "Base fare (₹)"],
    ["perKm", "Per km (₹)"],
    ["perMinute", "Per minute (₹)"],
    ["minFare", "Minimum fare (₹)"],
    ["platformFee", "Platform fee (₹)"],
    ["cancellationFee", "Cancellation fee (₹)"],
    ["commissionPct", "Commission (%)"],
    ["surgeMultiplier", "Surge multiplier (x)"],
  ];

  return (
    <form onSubmit={submit} className="mt-4 max-w-2xl rounded-xl border border-slate-200 bg-white p-6">
      <div className="grid grid-cols-2 gap-4">
        {fields.map(([k, label]) => (
          <label key={k} className="text-sm text-slate-600">
            {label}
            <input type="number" step="any" className={`${input} mt-1`} value={(form as any)[k]}
              onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
          </label>
        ))}
      </div>
      <button className="mt-6 rounded-lg bg-green-600 px-6 py-2.5 font-semibold text-white">Save configuration</button>
      {msg && <p className="mt-3 text-sm text-slate-600">{msg}</p>}
    </form>
  );
}
