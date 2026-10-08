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
    <main className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[420px] flex flex-col gap-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-14 h-14 rounded-2xl bg-primary-container text-surface-bright flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-[32px]">two_wheeler</span>
          </div>
          <h1 className="text-[30px] font-bold text-on-surface tracking-tight">papido</h1>
          <p className="text-[13px] text-secondary">Fast, safe &amp; reliable urban bike transit</p>
        </div>

        {/* Login Card */}
        <form onSubmit={onSubmit} className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline/20 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-[18px] font-bold text-on-surface">Sign in</h2>
            <p className="text-[13px] text-secondary">Enter your credentials to access your account</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-on-surface uppercase tracking-wider">Email Address</label>
            <input
              className="w-full rounded-lg border border-outline/30 bg-surface px-3.5 py-3 text-[14px] text-on-surface placeholder-outline focus:outline-none focus:border-primary transition-all shadow-inner"
              placeholder="name@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-on-surface uppercase tracking-wider">Password</label>
            <input
              className="w-full rounded-lg border border-outline/30 bg-surface px-3.5 py-3 text-[14px] text-on-surface placeholder-outline focus:outline-none focus:border-primary transition-all shadow-inner"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-error-container text-on-error-container text-[13px] font-medium">
              <span className="material-symbols-outlined text-[18px]">warning</span>
              <span>{error}</span>
            </div>
          )}

          <button
            disabled={loading}
            className="w-full h-12 rounded-lg bg-primary text-white font-semibold text-[16px] active:opacity-90 shadow-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          >
            <span>{loading ? "Signing in…" : "Sign In"}</span>
            {!loading && <span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
          </button>
        </form>

        {/* Footer links */}
        <div className="flex flex-col items-center gap-2 text-[13px] text-secondary">
          <p>
            Don&apos;t have an account?{" "}
            <Link className="font-semibold text-on-tertiary-container hover:underline" href="/register/passenger">
              Register as Passenger
            </Link>
          </p>
          <p>
            Are you a Captain?{" "}
            <Link className="font-semibold text-primary hover:underline" href="/register/rider">
              Register as Rider
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
