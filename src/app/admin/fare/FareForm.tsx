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
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/admin/fare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(Object.entries(form).map(([k, v]) => [k, Number(v)]))),
    });
    const data = await res.json();
    setSaving(false);
    setMsg(data.success ? "Fare configuration updated successfully!" : data.error?.message ?? "Failed to save");
  }

  const fields: [string, string, string][] = [
    ["baseFare", "Base Fare (₹)", "Initial charge at ride start"],
    ["perKm", "Per Kilometer Rate (₹)", "Variable rate per km traveled"],
    ["perMinute", "Per Minute Rate (₹)", "Time charge per minute"],
    ["minFare", "Minimum Fare (₹)", "Floor price for short rides"],
    ["platformFee", "Platform Booking Fee (₹)", "Fixed booking charge"],
    ["cancellationFee", "Cancellation Fee (₹)", "Penalty after 2 min window"],
    ["commissionPct", "Platform Commission (%)", "Driver earnings deduction"],
    ["surgeMultiplier", "Surge Multiplier (x)", "Dynamic multiplier (1.0x - 4.0x)"],
  ];

  return (
    <form onSubmit={submit} className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline/20 flex flex-col gap-6">
      <div className="flex items-center justify-between pb-4 border-b border-outline/20">
        <div>
          <h2 className="text-[18px] font-bold text-on-surface">Base Pricing Matrix</h2>
          <p className="text-[13px] text-secondary">Set systemic fare parameters for all bike rides.</p>
        </div>
        <span className="px-2.5 py-1 rounded bg-surface-container-high text-on-surface text-[12px] font-bold uppercase">
          Live Rules
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(([k, label, help]) => (
          <div key={k} className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-on-surface uppercase tracking-wider">
              {label}
            </label>
            <input
              type="number"
              step="any"
              className="w-full rounded-lg border border-outline/30 bg-surface px-3 py-2 text-[14px] text-on-surface font-semibold focus:outline-none focus:border-primary transition-all shadow-inner"
              value={(form as any)[k]}
              onChange={(e) => setForm({ ...form, [k]: e.target.value })}
            />
            <p className="text-[11px] text-secondary">{help}</p>
          </div>
        ))}
      </div>

      {msg && (
        <div className={`px-4 py-3 rounded-lg text-[13px] font-semibold flex items-center gap-2 ${msg.includes("updated") ? "bg-tertiary-container/15 text-on-tertiary-container" : "bg-error-container text-on-error-container"}`}>
          <span className="material-symbols-outlined text-[18px]">{msg.includes("updated") ? "check_circle" : "warning"}</span>
          <span>{msg}</span>
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="h-11 px-6 rounded-lg bg-primary text-on-primary font-semibold text-[14px] hover:bg-inverse-surface transition-colors shadow-sm disabled:opacity-60 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">save</span>
          <span>{saving ? "Saving Configuration…" : "Save Configuration"}</span>
        </button>
      </div>
    </form>
  );
}
