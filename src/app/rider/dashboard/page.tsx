"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function RiderDashboard() {
  const [online, setOnline] = useState<boolean | null>(null);
  const [msg, setMsg] = useState("");
  const [earnings, setEarnings] = useState<any>(null);
  const [period, setPeriod] = useState<string>("today");

  useEffect(() => {
    fetch("/api/rider/earnings?period=" + period)
      .then((r) => r.json())
      .then((d) => d.success && setEarnings(d.data));
  }, [period]);

  async function toggle() {
    const next = !online;
    const res = await fetch("/api/rider/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isOnline: next }),
    });
    const data = await res.json();
    if (data.success) setOnline(data.data?.isOnline);
    setMsg(data.message ?? data.error?.message ?? "");
  }

  function setActiveButton(e: HTMLButtonElement) {
    setPeriod(e.dataset.period ?? "today");
  }

  const displayEarnings =
    earnings?.total != null ? `₹${Number(earnings.total).toFixed(0)}` : "₹940";
  const displayRides = earnings?.rides ?? 6;
  const displayDuty = earnings?.dutyHours ?? "4.2h";
  const displayAcceptance = earnings?.acceptance ?? "96%";

  return (
    <div className="relative w-full max-w-[420px] mx-auto bg-[#f5f5f5] min-h-screen flex flex-col">
      {/* ── Fixed Header ── */}
      <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] z-50 bg-surface-container-lowest shadow-sm">
        <div className="flex items-center justify-between px-4 h-14">
          {/* Left: icon + title */}
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">two_wheeler</span>
            <div className="flex flex-col leading-tight">
              <span className="text-[16px] font-semibold text-on-surface">Papido Captain</span>
              <span className="text-[11px] text-secondary">Dashboard</span>
            </div>
          </div>
          {/* Right: online badge + avatar */}
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide ${
                online === false
                  ? "bg-surface-container text-secondary"
                  : "bg-on-tertiary-container/20 text-on-tertiary-container"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  online === false ? "bg-secondary" : "bg-on-tertiary-container animate-pulse"
                }`}
              />
              {online === false ? "Offline" : "Online"}
            </div>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Scrollable Body ── */}
      <main className="flex-1 flex flex-col gap-3 pt-[72px] pb-24 px-4 overflow-y-auto">

        {/* ── Driver Welcome Card ── */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary text-[28px]">person</span>
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[18px] font-bold text-on-surface">Rajesh Kumar</span>
                <div className="flex items-center gap-0.5 bg-amber-100 text-amber-700 rounded-full px-2 py-0.5">
                  <span className="material-symbols-outlined text-[12px]">star</span>
                  <span className="text-[12px] font-semibold">4.9</span>
                </div>
              </div>
              <span className="text-[12px] text-secondary">Hero Splendor • KA 01 EK 8842</span>
            </div>
            {/* Toggle */}
            <button
              id="duty-toggle-btn"
              onClick={toggle}
              className={`px-3 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-wide transition-colors ${
                online === false
                  ? "bg-surface-container text-secondary border border-outline"
                  : "bg-on-tertiary-container text-white"
              }`}
            >
              {online === false ? "Go Online" : online === true ? "Go Offline" : "Go Online"}
            </button>
          </div>
          {msg && <p className="mt-2 text-[12px] text-secondary">{msg}</p>}
        </div>

        {/* ── Accepting Rides Zone Banner ── */}
        {online !== false && (
          <div className="bg-on-tertiary-container rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm">
            <span className="material-symbols-outlined text-white text-[20px]">check_circle</span>
            <div>
              <p className="text-[14px] font-bold text-white">Accepting Rides</p>
              <p className="text-[11px] text-white/80">You're live and visible to passengers</p>
            </div>
          </div>
        )}

        {/* ── Today's Earnings Card ── */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-4">
          {/* Period tabs */}
          <div className="flex bg-surface-container rounded-lg p-0.5 mb-4">
            {[
              { label: "Today", value: "today" },
              { label: "This Week", value: "this-week" },
              { label: "This Month", value: "this-month" },
            ].map(({ label, value }) => (
              <button
                key={value}
                data-period={value}
                type="button"
                onClick={(e) => setActiveButton(e.currentTarget)}
                className={`flex-1 py-1.5 rounded-md text-[12px] font-semibold transition-colors ${
                  period === value
                    ? "bg-surface-container-lowest text-on-surface shadow-sm"
                    : "text-secondary"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Earnings headline */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-[12px] text-secondary mb-1">
                {period === "today" ? "Today's Earnings" : period === "this-week" ? "This Week's Earnings" : "This Month's Earnings"}
              </p>
              <span className="text-[30px] font-extrabold text-on-surface leading-none">
                {displayEarnings}
              </span>
            </div>
            <div className="flex items-center gap-1 bg-on-tertiary-container/10 text-on-tertiary-container rounded-full px-2.5 py-1">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span className="text-[11px] font-semibold">+14.2%</span>
            </div>
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-3 divide-x divide-outline/20 bg-surface-container rounded-lg">
            <div className="flex flex-col items-center py-2 px-1">
              <span className="text-[16px] font-bold text-on-surface">{displayRides}</span>
              <span className="text-[10px] text-secondary text-center">Rides Done</span>
            </div>
            <div className="flex flex-col items-center py-2 px-1">
              <span className="text-[16px] font-bold text-on-surface">{displayDuty}</span>
              <span className="text-[10px] text-secondary text-center">Duty Time</span>
            </div>
            <div className="flex flex-col items-center py-2 px-1">
              <span className="text-[16px] font-bold text-on-surface">{displayAcceptance}</span>
              <span className="text-[10px] text-secondary text-center">Acceptance</span>
            </div>
          </div>
        </div>

        {/* ── Surge Hotspots Card ── */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-amber-500 text-[18px]">bolt</span>
            <span className="text-[16px] font-bold text-on-surface">Surge Hotspots</span>
            <span className="ml-auto text-[11px] text-secondary">Live</span>
            <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
          </div>
          <div className="flex flex-col gap-2">
            {[
              { zone: "MG Road Junction", surge: "2.1×", color: "text-error" },
              { zone: "Koramangala 5th Block", surge: "1.8×", color: "text-amber-500" },
              { zone: "Indiranagar 100ft Rd", surge: "1.4×", color: "text-amber-400" },
            ].map(({ zone, surge, color }) => (
              <div key={zone} className="flex items-center justify-between bg-surface-container rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-secondary">location_on</span>
                  <span className="text-[13px] text-on-surface">{zone}</span>
                </div>
                <span className={`text-[14px] font-bold ${color}`}>{surge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Daily Milestone Target Card ── */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">emoji_events</span>
              <span className="text-[16px] font-bold text-on-surface">Daily Milestone</span>
            </div>
            <div className="flex items-center gap-1 bg-amber-100 text-amber-700 rounded-full px-2 py-0.5">
              <span className="material-symbols-outlined text-[12px]">workspace_premium</span>
              <span className="text-[11px] font-semibold">₹250 Bonus</span>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-end justify-between mb-1">
            <span className="text-[12px] text-secondary">Rides completed</span>
            <span className="text-[14px] font-bold text-on-surface">6 / 10</span>
          </div>
          <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden mb-3">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: "60%" }} />
          </div>

          {/* Tier indicators */}
          <div className="flex justify-between">
            {[
              { rides: 5, label: "Bronze", done: true },
              { rides: 8, label: "Silver", done: false },
              { rides: 10, label: "Gold", done: false },
            ].map(({ rides, label, done }) => (
              <div key={label} className="flex flex-col items-center gap-0.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    done ? "bg-primary" : "bg-surface-container"
                  }`}
                >
                  <span className={`material-symbols-outlined text-[14px] ${done ? "text-on-primary" : "text-secondary"}`}>
                    {done ? "check" : "radio_button_unchecked"}
                  </span>
                </div>
                <span className="text-[10px] text-secondary">{rides} rides</span>
                <span className="text-[10px] font-semibold text-on-surface">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Captain Readiness & Vehicle Checklist ── */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary text-[18px]">fact_check</span>
            <span className="text-[16px] font-bold text-on-surface">Captain Readiness</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: "directions_bike", label: "Vehicle OK", checked: true },
              { icon: "person_check", label: "ID Verified", checked: true },
              { icon: "helmet", label: "Helmet Ready", checked: true },
              { icon: "battery_charging_full", label: "Phone Charged", checked: false },
            ].map(({ icon, label, checked }) => (
              <div
                key={label}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                  checked ? "bg-on-tertiary-container/10" : "bg-surface-container"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[16px] ${
                    checked ? "text-on-tertiary-container" : "text-secondary"
                  }`}
                >
                  {icon}
                </span>
                <span className="text-[12px] text-on-surface">{label}</span>
                {checked && (
                  <span className="material-symbols-outlined text-on-tertiary-container text-[14px] ml-auto">
                    check_circle
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Recent Trips Today ── */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">history</span>
              <span className="text-[16px] font-bold text-on-surface">Recent Trips Today</span>
            </div>
            <button className="text-[12px] text-primary font-semibold">View All</button>
          </div>
          <div className="flex flex-col gap-2">
            {[
              {
                from: "Silk Board",
                to: "Koramangala",
                time: "10:32 AM",
                amount: "₹82",
                rating: 5,
              },
              {
                from: "HSR Layout",
                to: "BTM Layout",
                time: "09:14 AM",
                amount: "₹55",
                rating: 4,
              },
            ].map((trip, i) => (
              <div key={i} className="flex items-center gap-3 bg-surface-container rounded-lg px-3 py-2.5">
                <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-[16px]">two_wheeler</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-on-surface truncate">
                    {trip.from} → {trip.to}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[11px] text-secondary">{trip.time}</span>
                    <span className="text-[11px] text-secondary">•</span>
                    {Array.from({ length: trip.rating }).map((_, j) => (
                      <span key={j} className="material-symbols-outlined text-amber-400 text-[11px]">star</span>
                    ))}
                  </div>
                </div>
                <span className="text-[14px] font-bold text-on-surface shrink-0">{trip.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Emergency Hotline & Captain SOS ── */}
        <div className="bg-error rounded-xl shadow-sm p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-white text-[20px]">emergency</span>
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-bold text-on-error">Captain SOS</p>
            <p className="text-[11px] text-on-error/80">Emergency Hotline: 1800-XXX-XXXX</p>
          </div>
          <button className="bg-white text-error text-[12px] font-bold px-3 py-1.5 rounded-full">
            Call Now
          </button>
        </div>
      </main>

      {/* ── Bottom Navigation ── */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] bg-surface-container-lowest border-t border-outline/20 z-50">
        <div className="grid grid-cols-4 h-16">
          {[
            { icon: "dashboard", label: "Dashboard", href: "/rider/dashboard", active: true },
            { icon: "receipt_long", label: "Orders", href: "/rider/orders", active: false },
            { icon: "account_balance_wallet", label: "Earnings", href: "/rider/earnings", active: false },
            { icon: "person", label: "Profile", href: "/rider/profile", active: false },
          ].map(({ icon, label, href, active }) => (
            <Link
              key={label}
              href={href}
              className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
                active ? "text-primary" : "text-secondary"
              }`}
            >
              <span className={`material-symbols-outlined text-[22px] ${active ? "text-primary" : ""}`}>
                {icon}
              </span>
              <span className={`text-[10px] font-semibold ${active ? "text-primary" : ""}`}>{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}