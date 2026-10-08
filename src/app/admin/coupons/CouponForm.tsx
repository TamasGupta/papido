"use client";

import { useState } from "react";

export default function CouponForm() {
  const [form, setForm] = useState({ code: "", discountType: "FLAT", value: "", minAmount: "0" });
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: form.code.toUpperCase(),
        discountType: form.discountType,
        value: Number(form.value),
        minAmount: Number(form.minAmount),
      }),
    });
    const data = await res.json();
    setMsg(data.success ? "Coupon created" : data.error?.message ?? "Failed");
    if (data.success) setTimeout(() => window.location.reload(), 800);
  }

  return (
    <form onSubmit={submit} className="mt-4 flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <input required placeholder="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
        <option value="FLAT">Flat ₹</option>
        <option value="PERCENT">Percent %</option>
      </select>
      <input required type="number" placeholder="Value" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className="w-28 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      <input type="number" placeholder="Min amount" value={form.minAmount} onChange={(e) => setForm({ ...form, minAmount: e.target.value })} className="w-32 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
      <button className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white">Create</button>
      {msg && <span className="text-sm text-slate-600">{msg}</span>}
    </form>
  );
}
