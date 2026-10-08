"use client";

import { useEffect, useState } from "react";

export default function RiderDashboard() {
  const [online, setOnline] = useState<boolean | null>(null);
  const [msg, setMsg] = useState("");
  const [earnings, setEarnings] = useState<any>(null);
  const [period, setPeriod] = useState<string>("today");

  useEffect(() => {
    fetch("/api/rider/earnings?period=" + period).then((r) => r.json()).then((d) => d.success && setEarnings(d.data));
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

  return (
    <main className="flex-1 bg-slate-50 min-h-screen p-6">
      {/* Header matching screen design - captain name, online badge, profile */}
      <header className="fixed top-0 inset-x-0 z-50 bg-surface-container-lowest/80 backdrop-blur-xl pt-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 px-margin flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-primary text-[24px]">two_wheeler</span>
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-on-surface truncate">Papido Captain</span>
              <span className="font-label-sm text-label-sm text-secondary truncate">Rider Earnings</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              <span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse"></span>
              <span className="font-label-sm text-label-sm text-on-tertiary-container uppercase tracking-wider">Online</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>
      <main className="flex flex-col relative w-full pt-20 pb-24 bg-background min-h-screen">
        <div className="flex flex-col w-full px-margin py-6 gap-4">
          {/* Period filter tabs matching screen design */}
          <div className="flex bg-surface-container rounded-xl w-full">
            <button
              data-period="today"
              className={`flex-1 py-1.5 rounded-lg font-label-md text-label-md text-secondary hover:text-on-surface transition-colors ${period === "today" ? "bg-surface-container-lowest text-on-surface shadow-sm" : ""}`}
              onClick={(e) => setActiveButton(e.currentTarget)}
              type="button"
            >
              Today
            </button>
            <button
              data-period="this-week"
              className={`flex-1 py-1.5 rounded-lg font-subheading text-subheading bg-surface-container-lowest text-on-surface shadow-sm transition-colors ${period === "this-week" ? "bg-surface-container-lowest text-on-surface" : ""}`}
              onClick={(e) => setActiveButton(e.currentTarget)}
              type="button"
            >
              This Week
            </button>
            <button
              data-period="this-month"
              className={`flex-1 py-1.5 rounded-lg font-label-md text-label-md text-secondary hover:text-on-surface transition-colors ${period === "this-month" ? "bg-surface-container-lowest text-on-surface" : ""}`}
              onClick={(e) => setActiveButton(e.currentTarget)}
              type="button"
            >
              This Month
            </button>
          </div>
          {/* Earnings cards matching screen design */}
          <div className="flex flex-col bg-surface-container-lowest rounded-xl p-4 shadow-sm gap-4">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-secondary">Net Take-Home</span>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-on-surface">
                <span className="material-symbols-outlined text-on-tertiary-container text-[14px]">trending_up</span>
                <span className="font-label-sm text-label-sm text-on-tertiary-container">+14.2% vs last wk</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-display text-on-surface">???4,850.00</span>
              <span className="font-label-md text-label-md text-secondary">cleared</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2 bg-surface-container-low p-space-sm rounded-lg">
            <div className="flex flex-col items-center text-center">
              <span className="font-label-sm text-label-sm text-secondary">Trips Done</span>
              <span className="font-subheading text-subheading text-on-surface">38</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="font-label-sm text-label-sm text-secondary">Online Time</span>
              <span className="font-subheading text-subheading text-on-surface">26.5 hrs</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="font-label-sm text-label-sm text-secondary">Hourly Rate</span>
              <span className="font-subheading text-subheading text-on-surface">???127/hr</span>
            </div>
          </div>
          {/* Weekly activity sparkline */}
          <div className="flex flex-col gap-1.5 pt-1">
            <div className="flex justify-between items-center text-secondary font-label-sm text-label-sm">
              <span>Mon???Sun Activity</span>
              <span className="text-on-surface font-label-md text-label-md">Peak: ???940 (Sat)</span>
            </div>
            <svg className="w-full h-10 text-on-tertiary-container" preserveAspectRatio="none" viewBox="0 0 100 24">
              <polyline fill="none" points="0,18 16,14 32,20 48,11 64,8 80,4 96,9 100,7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"></polyline>
              <circle fill="current" className="text-primary" cx="80" cy="4" r="2.5"></circle>
            </svg>
          </div>
        </div>
      </main>
    </main>
  );
}