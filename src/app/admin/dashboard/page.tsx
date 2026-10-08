import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<main className="p-6 text-secondary font-medium">Loading command center…</main>}>
      <AdminDashboard />
    </Suspense>
  );
}

async function AdminDashboard() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") redirect("/login");

  const [passengers, riders, pendingVerification, onlineRiders, totalRides, completed, cancelled] =
    await Promise.all([
      db.user.count({ where: { role: "PASSENGER" } }),
      db.user.count({ where: { role: "RIDER" } }),
      db.riderProfile.count({ where: { status: "PENDING" } }),
      db.riderProfile.count({ where: { isOnline: true } }),
      db.ride.count(),
      db.ride.count({ where: { status: "RIDE_COMPLETED" } }),
      db.ride.count({ where: { status: { in: ["CANCELLED_BY_PASSENGER", "CANCELLED_BY_RIDER", "CANCELLED_BY_ADMIN"] } } }),
    ]);

  const kpis = [
    { label: "Total Passengers", value: passengers, icon: "group", color: "text-on-surface" },
    { label: "Total Rider Partners", value: riders, icon: "badge", color: "text-on-surface" },
    { label: "Captains Online Now", value: onlineRiders, icon: "two_wheeler", color: "text-on-tertiary-container", highlight: true },
    { label: "Pending KYC Verification", value: pendingVerification, icon: "verified_user", color: "text-amber-600", alert: true },
    { label: "Total Rides Requested", value: totalRides, icon: "route", color: "text-on-surface" },
    { label: "Completed Trips", value: completed, icon: "check_circle", color: "text-on-tertiary-container" },
    { label: "Cancelled Rides", value: cancelled, icon: "cancel", color: "text-error" },
  ];

  const quickModules = [
    { label: "Live Ops & Dispatch", desc: "Realtime BLR map mesh, active rides, manual override", href: "/admin/live", icon: "radar", badge: "REALTIME" },
    { label: "Fleet & Rider Partners", desc: "Manage captain accounts, KYC approvals, payouts", href: "/admin/riders", icon: "badge", badge: `${riders} Total` },
    { label: "Trips & Live Rides", desc: "Monitor ongoing trips, completion rates, dispute logs", href: "/admin/rides", icon: "route", badge: `${totalRides} Trips` },
    { label: "Surge & Pricing Engine", desc: "Configure base fares, dynamic surge multipliers, peak hours", href: "/admin/fare", icon: "trending_up", badge: "CONFIG" },
  ];

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Zone Context & Status Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline/20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface">
            <span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-ping" />
            <span className="text-[11px] uppercase tracking-wider font-semibold">Bengaluru Ops Command</span>
          </div>
          <span className="text-outline text-[12px]">|</span>
          <div className="flex items-center gap-1.5 text-on-surface">
            <span className="material-symbols-outlined text-[16px] text-outline">dns</span>
            <span className="text-[12px] font-medium">Core Nodes: BLR-HQ (Healthy)</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-surface-container text-on-surface text-[12px]">
            <span className="text-secondary">Dispatch Engine:</span>
            <span className="font-semibold text-on-tertiary-container">v4.2 ACTIVE</span>
          </div>
          <Link href="/admin/live" className="flex items-center gap-1 px-3 py-1.5 rounded bg-primary text-on-primary text-[12px] font-semibold hover:bg-inverse-surface transition-all">
            <span className="material-symbols-outlined text-[16px]">radar</span>
            <span>Open Live Ops</span>
          </Link>
        </div>
      </div>

      {/* Operations Overview Title */}
      <div>
        <h1 className="text-[24px] font-bold text-on-surface tracking-tight">Operations Overview</h1>
        <p className="text-[13px] text-secondary">Real-time system telemetry and key operational performance indicators.</p>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline/20 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-secondary">{kpi.label}</p>
                <p className={`text-[28px] font-bold mt-1 tracking-tight ${kpi.color}`}>{kpi.value}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface">
                <span className="material-symbols-outlined text-[20px]">{kpi.icon}</span>
              </div>
            </div>
            {kpi.alert && (
              <div className="mt-3 pt-2 border-t border-outline/10 flex items-center justify-between">
                <span className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">warning</span> Needs Review
                </span>
                <Link href="/admin/verification" className="text-[11px] text-primary font-semibold hover:underline">
                  Action →
                </Link>
              </div>
            )}
            {kpi.highlight && (
              <div className="mt-3 pt-2 border-t border-outline/10 flex items-center justify-between">
                <span className="text-[11px] text-on-tertiary-container font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container animate-pulse" /> Active Duty
                </span>
                <span className="text-[11px] text-secondary font-medium">BLR Metro</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Operational Modules Section */}
      <div className="flex flex-col gap-3 pt-2">
        <h2 className="text-[18px] font-bold text-on-surface">Operational Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickModules.map((mod) => (
            <Link
              key={mod.label}
              href={mod.href}
              className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline/20 hover:border-primary/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary-container text-surface-bright flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">{mod.icon}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface text-[11px] font-semibold">
                    {mod.badge}
                  </span>
                </div>
                <h3 className="text-[16px] font-bold text-on-surface group-hover:text-primary transition-colors">{mod.label}</h3>
                <p className="text-[13px] text-secondary mt-1">{mod.desc}</p>
              </div>
              <div className="mt-4 pt-2 border-t border-outline/10 flex items-center justify-end text-[12px] font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
                <span>Open Module →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
