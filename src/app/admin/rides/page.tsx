import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export default function AdminRidesPage() {
  return (
    <Suspense fallback={<div className="p-6 text-secondary">Loading rides telemetry…</div>}>
      <AdminRides />
    </Suspense>
  );
}

async function AdminRides() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") redirect("/login");

  const rides = await db.ride.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { passenger: { include: { user: true } }, rider: { include: { user: true } } },
  });

  const activeCount = rides.filter((r) =>
    ["SEARCHING", "RIDER_ASSIGNED", "RIDER_ARRIVING", "RIDER_ARRIVED", "RIDE_STARTED"].includes(r.status)
  ).length;
  const completedCount = rides.filter((r) => r.status === "RIDE_COMPLETED").length;
  const cancelledCount = rides.filter((r) => r.status.startsWith("CANCELLED")).length;

  function getStatusBadge(status: string) {
    switch (status) {
      case "RIDE_COMPLETED":
        return (
          <span className="px-2.5 py-1 rounded bg-surface-container text-on-surface text-[12px] font-semibold flex items-center gap-1 w-max">
            <span className="w-2 h-2 rounded-full bg-on-tertiary-container" />
            Completed
          </span>
        );
      case "SEARCHING":
      case "RIDER_ASSIGNED":
      case "RIDER_ARRIVING":
      case "RIDER_ARRIVED":
      case "RIDE_STARTED":
        return (
          <span className="px-2.5 py-1 rounded bg-surface-container-high text-on-surface text-[12px] font-semibold flex items-center gap-1 w-max">
            <span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-ping" />
            {status.replace(/_/g, " ")}
          </span>
        );
      default:
        if (status.startsWith("CANCELLED")) {
          return (
            <span className="px-2.5 py-1 rounded bg-error-container text-on-error-container text-[12px] font-semibold flex items-center gap-1 w-max">
              <span className="w-2 h-2 rounded-full bg-error" />
              {status.replace(/_/g, " ")}
            </span>
          );
        }
        return (
          <span className="px-2.5 py-1 rounded bg-surface-container text-secondary text-[12px] font-medium w-max">
            {status}
          </span>
        );
    }
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Sub-header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface text-[11px] font-bold uppercase tracking-wider">
              Telemetry Registry
            </span>
            <span className="text-[12px] text-secondary">• Live Feed</span>
          </div>
          <h1 className="text-[24px] font-bold text-on-surface tracking-tight mt-1">Trips &amp; Live Rides</h1>
          <p className="text-[14px] text-secondary">
            Real-time record of active, completed, and cancelled trips across Bengaluru.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="h-10 px-4 rounded bg-surface-container-lowest text-on-surface hover:bg-surface-container-low border border-outline/20 transition-colors flex items-center gap-2 shadow-sm text-[13px] font-semibold" type="button">
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export Logs</span>
          </button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline/20 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface">
            <span className="material-symbols-outlined text-[20px]">route</span>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-secondary font-semibold">Total Trips</p>
            <p className="text-[22px] font-bold text-on-surface">{rides.length}</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline/20 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">sensors</span>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-secondary font-semibold">Active Now</p>
            <p className="text-[22px] font-bold text-on-surface flex items-center gap-1.5">
              {activeCount}
              <span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse" />
            </p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline/20 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-tertiary-container">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-secondary font-semibold">Completed Today</p>
            <p className="text-[22px] font-bold text-on-surface">{completedCount}</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline/20 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-error-container text-on-error-container flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">cancel</span>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-on-error-container font-semibold">Cancelled</p>
            <p className="text-[22px] font-bold text-error">{cancelledCount}</p>
          </div>
        </div>
      </div>

      {/* Rides Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline/20 overflow-hidden">
        <div className="p-4 bg-surface-container-low/40 flex items-center justify-between border-b border-outline/20">
          <div className="flex items-center gap-2">
            <span className="text-[16px] font-bold text-on-surface">Recent Trip Records</span>
            <span className="px-2 py-0.5 rounded bg-surface-container text-secondary text-[11px] font-semibold">
              Showing top {rides.length}
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface text-secondary text-[11px] uppercase tracking-wider font-semibold border-b border-outline/20">
                <th className="py-3 px-4">Trip ID</th>
                <th className="py-3 px-4">Passenger</th>
                <th className="py-3 px-4">Captain</th>
                <th className="py-3 px-4">Pickup Spot</th>
                <th className="py-3 px-4">Fare Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created Time</th>
              </tr>
            </thead>
            <tbody className="text-[14px] text-on-surface divide-y divide-outline/10">
              {rides.map((r) => (
                <tr key={r.id} className="hover:bg-surface-container-low/60 transition-colors">
                  <td className="py-3 px-4 font-mono text-[12px] font-semibold text-secondary">
                    #{r.id.slice(-8).toUpperCase()}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-on-surface">{r.passenger.user.name}</p>
                    <p className="text-[11px] text-secondary">{r.passenger.user.email}</p>
                  </td>
                  <td className="py-3 px-4">
                    {r.rider ? (
                      <div>
                        <p className="font-semibold text-on-surface">{r.rider.user.name}</p>
                        <p className="text-[11px] text-secondary">{r.rider.user.phone ?? "Rider Partner"}</p>
                      </div>
                    ) : (
                      <span className="text-secondary text-[12px] italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3 px-4 max-w-[200px]">
                    <p className="truncate font-medium text-on-surface">{r.pickupAddress}</p>
                    <p className="truncate text-[11px] text-secondary">→ {r.destinationAddress}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-on-surface">₹{r.finalFare ?? r.estimatedFare ?? "—"}</span>
                    {r.estimatedDistance && (
                      <span className="block text-[11px] text-secondary">{r.estimatedDistance} km</span>
                    )}
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(r.status)}</td>
                  <td className="py-3 px-4 text-[12px] text-secondary">
                    {new Date(r.createdAt).toLocaleString("en-IN", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                </tr>
              ))}
              {rides.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-secondary text-[14px]">
                    No rides recorded in the database yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
