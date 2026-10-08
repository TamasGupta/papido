"use client";

import { useState } from "react";
import Link from "next/link";

type Period = "today" | "week" | "month";

export default function RiderRides() {
  const [activePeriod, setActivePeriod] = useState<Period>("week");

  // --- placeholder earnings data (wire to real API as needed) ---
  const earnings = {
    netTakeHome: 4850.0,
    changePercent: "+14.2%",
    tripsDone: 38,
    onlineHrs: 26.5,
    hourlyRate: 127,
    gross: 5420,
    commission: -542,
    surge: 650,
    targetBonus: 400,
    tolls: 120,
    tds: -198,
    availableBalance: 2140,
  };

  const trips = [
    {
      id: 1,
      destination: "Koramangala 5th Block",
      time: "Today, 09:14 AM",
      km: "4.2 km",
      fare: "₹142",
      net: "₹128",
    },
    {
      id: 2,
      destination: "Indiranagar 100ft Rd",
      time: "Today, 07:52 AM",
      km: "6.8 km",
      fare: "₹215",
      net: "₹194",
    },
    {
      id: 3,
      destination: "MG Road Metro Station",
      time: "Yesterday, 11:37 PM",
      km: "3.1 km",
      fare: "₹98",
      net: "₹88",
    },
  ];

  const periodLabel =
    activePeriod === "today"
      ? "10 Oct 2024"
      : activePeriod === "week"
      ? "14 Oct – 20 Oct 2024"
      : "Oct 2024";

  const cycleLabel =
    activePeriod === "today"
      ? "Daily Cycle"
      : activePeriod === "week"
      ? "Weekly Cycle"
      : "Monthly Cycle";

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-[420px] mx-auto flex flex-col min-h-screen bg-slate-100">

        {/* ── Fixed Header ── */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-orange-600" style={{ fontSize: 20 }}>
              two_wheeler
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-slate-800 leading-tight">Papido Captain</p>
            <p className="text-[11px] text-slate-500 leading-tight">Rider Earnings</p>
          </div>
          <span className="flex items-center gap-1 bg-green-50 text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-green-200">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
            Online
          </span>
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            RK
          </div>
        </header>

        {/* ── Scrollable Body ── */}
        <main className="flex-1 overflow-y-auto pb-20 px-4 pt-4 space-y-4">

          {/* Period Filter Tabs */}
          <div className="bg-slate-200 p-1 rounded-xl flex gap-1">
            {(["today", "week", "month"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setActivePeriod(p)}
                className={`flex-1 py-1.5 text-[12px] font-semibold rounded-lg transition-all ${
                  activePeriod === p
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                {p === "today" ? "Today" : p === "week" ? "This Week" : "This Month"}
              </button>
            ))}
          </div>

          {/* Date Range Label */}
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-slate-700">{periodLabel}</span>
            <span className="bg-blue-100 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
              {cycleLabel}
            </span>
          </div>

          {/* ── Hero Take-Home Earnings Card ── */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] text-slate-500 font-medium">Net Take-Home</span>
              <span className="flex items-center gap-0.5 bg-green-50 text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-green-200">
                <span className="material-symbols-outlined" style={{ fontSize: 12 }}>
                  trending_up
                </span>
                {earnings.changePercent} vs last wk
              </span>
            </div>

            <p className="text-[30px] font-bold text-slate-900 leading-tight">
              ₹{earnings.netTakeHome.toFixed(2)}{" "}
              <span className="text-[14px] font-semibold text-green-600">cleared</span>
            </p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2 mt-3 mb-3">
              <div className="bg-slate-50 rounded-lg p-2 text-center">
                <p className="text-[18px] font-bold text-slate-800">{earnings.tripsDone}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Trips Done</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2 text-center">
                <p className="text-[18px] font-bold text-slate-800">{earnings.onlineHrs}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Online Time</p>
                <p className="text-[9px] text-slate-400">hrs</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2 text-center">
                <p className="text-[18px] font-bold text-slate-800">₹{earnings.hourlyRate}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Hourly Rate</p>
                <p className="text-[9px] text-slate-400">/hr</p>
              </div>
            </div>

            {/* Weekly Sparkline */}
            <div className="w-full h-8">
              <svg
                viewBox="0 0 100 24"
                preserveAspectRatio="none"
                className="w-full h-full"
              >
                <defs>
                  <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polyline
                  points="0,18 16,14 32,20 48,11 64,8 80,4 96,9 100,7"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="80" cy="4" r="2" fill="#22c55e" />
              </svg>
            </div>
          </div>

          {/* ── Payout Status Card ── */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-600" style={{ fontSize: 18 }}>
                  account_balance
                </span>
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-800">Next Scheduled Payout</p>
                <p className="text-[11px] text-slate-500">Monday, Oct 21 · HDFC Bank ••••4092</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-500">Available Balance</p>
                <p className="text-[20px] font-bold text-slate-900">₹{earnings.availableBalance.toLocaleString()}</p>
              </div>
              <button className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-[12px] font-semibold px-4 py-2 rounded-xl transition-colors">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                  bolt
                </span>
                Instant Cashout
              </button>
            </div>
          </div>

          {/* ── Weekly Ledger Summary Card ── */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-slate-600" style={{ fontSize: 18 }}>
                receipt_long
              </span>
              <p className="text-[13px] font-semibold text-slate-800">Weekly Ledger Summary</p>
            </div>

            <div className="space-y-2">
              {[
                { label: "Gross Earnings", value: `₹${earnings.gross}`, color: "bg-green-500", sign: "" },
                { label: "Platform Commission (10%)", value: `−₹${Math.abs(earnings.commission)}`, color: "bg-red-400", sign: "-" },
                { label: "Surge Premium", value: `+₹${earnings.surge}`, color: "bg-green-500", sign: "+" },
                { label: "Weekly Target Bonus", value: `+₹${earnings.targetBonus}`, color: "bg-green-500", sign: "+" },
                { label: "Tolls Reimbursed", value: `+₹${earnings.tolls}`, color: "bg-green-500", sign: "+" },
                { label: "TDS Deducted (1%)", value: `−₹${Math.abs(earnings.tds)}`, color: "bg-red-400", sign: "-" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${row.color} flex-shrink-0`} />
                    <span className="text-slate-600">{row.label}</span>
                  </div>
                  <span
                    className={`font-semibold ${
                      row.sign === "-" ? "text-red-500" : row.sign === "+" ? "text-green-600" : "text-slate-800"
                    }`}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[13px] font-bold text-slate-800">Total Net</span>
              <span className="text-[16px] font-bold text-green-700">₹{earnings.netTakeHome.toFixed(2)}</span>
            </div>
          </div>

          {/* ── Incentive Streak Active Card ── */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-400 rounded-xl p-4 shadow-sm flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-white/40">
              <span className="material-symbols-outlined text-white" style={{ fontSize: 28 }}>
                emoji_events
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-white font-bold text-[14px]">Incentive Streak Active 🔥</p>
              </div>
              <p className="text-white/90 text-[11px]">
                Complete 5 more trips today to unlock ₹300 streak bonus!
              </p>
              <div className="mt-2 bg-white/20 rounded-full h-1.5 w-full">
                <div className="bg-white h-1.5 rounded-full" style={{ width: "60%" }} />
              </div>
              <p className="text-white/80 text-[10px] mt-1">33 / 38 trips · 5 remaining</p>
            </div>
          </div>

          {/* ── Recent Trip Records ── */}
          <div>
            <p className="text-[13px] font-bold text-slate-700 mb-2">Recent Trip Records</p>
            <div className="space-y-2">
              {trips.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-orange-500" style={{ fontSize: 16 }}>
                      place
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-slate-800 truncate">{trip.destination}</p>
                    <p className="text-[10px] text-slate-400">
                      {trip.time} · {trip.km}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[13px] font-bold text-green-700">{trip.net}</p>
                    <p className="text-[10px] text-slate-400 line-through">{trip.fare}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Fare Dispute Card ── */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-blue-600" style={{ fontSize: 20 }}>
                gavel
              </span>
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-blue-900">Have a fare dispute?</p>
              <p className="text-[11px] text-blue-600">
                Raise a ticket within 24 hrs of the trip for review.
              </p>
            </div>
            <span className="material-symbols-outlined text-blue-400" style={{ fontSize: 18 }}>
              chevron_right
            </span>
          </div>

        </main>

        {/* ── Bottom Navigation ── */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] bg-white border-t border-slate-200 flex z-20">
          {[
            { href: "/rider", icon: "dashboard", label: "Dashboard" },
            { href: "/rider/orders", icon: "receipt", label: "Orders" },
            { href: "/rider/rides", icon: "payments", label: "Earnings", active: true },
            { href: "/rider/profile", icon: "person", label: "Profile" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 ${
                item.active ? "text-orange-600" : "text-slate-400"
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
                {item.icon}
              </span>
              <span className={`text-[10px] font-semibold ${item.active ? "text-orange-600" : "text-slate-400"}`}>
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

      </div>
    </div>
  );
}
