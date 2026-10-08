"use client";

import { useState } from "react";

export default function RiderOnboarding() {
  const [form, setForm] = useState({
    dob: "",
    gender: "",
    address: "",
    licenceNumber: "",
    licenceExpiry: "",
    registration: "",
    model: "",
    manufacturer: "",
    color: "",
    bankHolder: "",
    bankAccount: "",
    ifsc: "",
    upiId: "",
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/riders/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    setMsg(data.success ? "Submitted for verification." : data.error?.message ?? "Failed");
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const input = "w-full rounded-lg border border-slate-300 px-3 py-2";

  return (
    <main className="flex-1 bg-slate-50 p-6">
      <form onSubmit={onSubmit} className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-8">
        <h1 className="text-xl font-bold text-slate-900">Complete your rider profile</h1>
        <p className="mt-1 text-sm text-slate-500">You cannot accept rides until an admin approves your account.</p>

        <h2 className="mt-6 font-semibold text-slate-800">Personal</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <input type="date" className={input} value={form.dob} onChange={set("dob")} required />
          <select className={input} value={form.gender} onChange={set("gender")} required>
            <option value="">Gender</option>
            <option>Male</option><option>Female</option><option>Other</option>
          </select>
          <input className={`${input} col-span-2`} placeholder="Address" value={form.address} onChange={set("address")} required />
        </div>

        <h2 className="mt-6 font-semibold text-slate-800">Driving licence</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <input className={input} placeholder="Licence number" value={form.licenceNumber} onChange={set("licenceNumber")} required />
          <input type="date" className={input} placeholder="Expiry" value={form.licenceExpiry} onChange={set("licenceExpiry")} required />
        </div>

        <h2 className="mt-6 font-semibold text-slate-800">Vehicle</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <input className={input} placeholder="Registration no." value={form.registration} onChange={set("registration")} required />
          <input className={input} placeholder="Model" value={form.model} onChange={set("model")} required />
          <input className={input} placeholder="Manufacturer" value={form.manufacturer} onChange={set("manufacturer")} required />
          <input className={input} placeholder="Color" value={form.color} onChange={set("color")} required />
        </div>

        <h2 className="mt-6 font-semibold text-slate-800">Payout details</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <input className={input} placeholder="Account holder" value={form.bankHolder} onChange={set("bankHolder")} required />
          <input className={input} placeholder="Account number" value={form.bankAccount} onChange={set("bankAccount")} required />
          <input className={input} placeholder="IFSC" value={form.ifsc} onChange={set("ifsc")} required />
          <input className={input} placeholder="UPI ID" value={form.upiId} onChange={set("upiId")} />
        </div>

        {msg && <p className="mt-4 text-sm text-slate-700">{msg}</p>}
        <button disabled={loading} className="mt-6 w-full rounded-lg bg-green-600 py-2.5 font-semibold text-white disabled:opacity-60">
          {loading ? "Submitting…" : "Submit for verification"}
        </button>
      </form>
    </main>
  );
}
