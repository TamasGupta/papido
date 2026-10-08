"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterRider() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, role: "RIDER" }),
    });
    const data = await res.json();
    setLoading(false);
    setMsg(data.success ? "Account created. Add your documents to get verified." : (data.error?.message ?? "Something went wrong"));
    if (data.success) setTimeout(() => (window.location.href = "/login"), 1200);
  }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <main className="flex flex-1 items-center justify-center bg-slate-50 p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8">
        <h1 className="text-2xl font-bold text-slate-900">Register as a rider</h1>
        <p className="mt-1 text-sm text-slate-500">Step 1 of 6 — Account details</p>
        {(["name", "email", "phone", "password"] as const).map((k) => (
          <input key={k} type={k === "password" ? "password" : k === "email" ? "email" : "text"} placeholder={k[0].toUpperCase() + k.slice(1)} className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2" value={form[k]} onChange={set(k)} required />
        ))}
        {msg && <p className="mt-3 text-sm text-slate-600">{msg}</p>}
        <button disabled={loading} className="mt-6 w-full rounded-lg bg-green-600 py-2.5 font-semibold text-white disabled:opacity-60">
          {loading ? "Creating…" : "Continue"}
        </button>
        <p className="mt-4 text-center text-sm text-slate-500">
          Already registered? <Link className="text-green-700" href="/login">Sign in</Link>
        </p>
      </form>
    </main>
  );
}
