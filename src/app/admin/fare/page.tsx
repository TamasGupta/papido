import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import FareForm from "./FareForm";

export default function AdminFarePage() {
  return (
    <Suspense fallback={<div className="p-6 text-secondary">Loading fare engine…</div>}>
      <AdminFare />
    </Suspense>
  );
}

async function AdminFare() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") redirect("/login");

  const config = await db.fareConfig.findFirst();

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface text-[11px] font-bold uppercase tracking-wider">
              Dynamic Pricing Engine
            </span>
            <span className="text-[12px] text-secondary">• Config v2.4</span>
          </div>
          <h1 className="text-[24px] font-bold text-on-surface tracking-tight mt-1">Surge &amp; Pricing Engine</h1>
          <p className="text-[14px] text-secondary">
            Configure baseline fares, distance rates, platform commission, and active surge multipliers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 cols - Form */}
        <div className="lg:col-span-8">
          <FareForm initial={config} />
        </div>

        {/* Right 4 cols - Active Surge Overview */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-primary text-on-primary p-6 rounded-xl shadow-md flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-tertiary-fixed">trending_up</span>
                <span className="text-[16px] font-bold">Current Surge Multiplier</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold">
                {config?.surgeMultiplier ?? 1.0}x Active
              </span>
            </div>
            <p className="text-[13px] opacity-80">
              Surge is automatically added to the base calculation for peak hours and high-demand zones.
            </p>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline/20 flex flex-col gap-4">
            <h3 className="text-[16px] font-bold text-on-surface">Surge Zones Active</h3>
            <div className="space-y-3">
              {[
                { zone: "Koramangala 4th Block", surge: "1.8x", status: "High Demand" },
                { zone: "Indiranagar CMH Road", surge: "1.5x", status: "Moderate" },
                { zone: "HSR Layout Sector 2", surge: "1.3x", status: "Normal" },
              ].map((z) => (
                <div key={z.zone} className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low">
                  <div>
                    <p className="text-[13px] font-bold text-on-surface">{z.zone}</p>
                    <p className="text-[11px] text-secondary">{z.status}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-surface-container-highest text-on-surface font-bold text-[12px]">
                    {z.surge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
