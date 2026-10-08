"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) return setError("Invalid email or password");
    const me = await fetch("/api/auth/session").then((r) => r.json());
    const role = me?.user?.role;
    window.location.href =
      role === "SUPER_ADMIN" ? "/admin/dashboard" : role === "RIDER" ? "/rider/dashboard" : "/passenger/home";
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-slate-50 p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8">
        <h1 className="text-2xl font-bold text-slate-900">Sign in</h1>
        <p className="mt-1 text-sm text-slate-500">Welcome back to Papido.</p>
        <input className="mt-6 w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="mt-6 w-full rounded-lg bg-green-600 py-2.5 font-semibold text-white disabled:opacity-60">
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <p className="mt-4 text-center text-sm text-slate-500">
          New here? <Link className="text-green-700" href="/register/passenger">Create a passenger account</Link>
        </p>
      </form>
    </main>
  );
}
