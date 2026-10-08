import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export default function AdminRidersPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 flex items-center justify-center text-on-surface-variant font-medium">
          Loading fleet roster…
        </div>
      }
    >
      <AdminRiders />
    </Suspense>
  );
}

async function AdminRiders() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN")
    redirect("/login");

  const riders = await db.riderProfile.findMany({
    include: { user: true, vehicle: true },
    orderBy: { user: { createdAt: "desc" } },
    take: 100,
  });

  const totalRiders = riders.length;
  const onlineNow = riders.filter((r) => r.isOnline).length;
  const pendingKYC = riders.filter((r) => r.status === "PENDING").length;
  const suspended = riders.filter((r) => r.status === "SUSPENDED").length;

  function getStatusBadge(r: (typeof riders)[0]) {
    if (r.status === "SUSPENDED") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-error-container text-on-error-container font-semibold text-[12px]">
          <span className="w-2 h-2 rounded-full bg-error" />
          Suspended
        </span>
      );
    }
    if (r.status === "PENDING") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container text-secondary text-[12px] font-medium">
          <span className="w-2 h-2 rounded-full bg-secondary" />
          Pending KYC
        </span>
      );
    }
    if (r.isOnline) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-lowest shadow-sm text-on-surface text-[12px] font-medium">
          <span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse" />
          Online &amp; Ready
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container text-secondary text-[12px] font-medium">
        <span className="w-2 h-2 rounded-full bg-secondary" />
        Offline
      </span>
    );
  }

  function getOnlineDot(r: (typeof riders)[0]) {
    if (r.status === "SUSPENDED")
      return "absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-error ring-2 ring-surface-container-lowest";
    if (r.isOnline)
      return "absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-on-tertiary-container ring-2 ring-surface-container-lowest";
    return "absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-secondary ring-2 ring-surface-container-lowest";
  }

  function getRowClass(r: (typeof riders)[0]) {
    if (r.status === "SUSPENDED")
      return "hover:bg-surface-container-low transition-colors cursor-pointer group bg-error-container/10";
    return "hover:bg-surface-container-low transition-colors cursor-pointer group";
  }

  return (
    <div className="p-6 flex flex-col gap-6">

      {/* Sub-header & Action Bar */}
      <div className="w-full bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline/20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-bold text-[11px] uppercase tracking-wider">
                Fleet Registry
              </span>
              <span className="text-[12px] text-on-surface-variant font-medium">
                • Live data
              </span>
            </div>
            <h1 className="text-[24px] font-bold text-on-surface tracking-tight mt-1">
              Fleet &amp; Rider Partners
            </h1>
            <p className="text-[14px] text-on-surface-variant">
              Manage registered rider-partners, document verification queue, and fleet operations.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="h-10 px-3 rounded bg-surface-container-lowest text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-1 border border-outline/20 shadow-sm text-[13px] font-semibold"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Export Roster</span>
            </button>
            <button
              className="h-10 px-4 rounded bg-primary text-on-primary hover:bg-inverse-surface transition-colors flex items-center gap-1 shadow-sm text-[13px] font-semibold"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>+ Onboard Rider</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 bg-surface-container-low/60 p-2 rounded-lg">
          <div className="flex items-center gap-3 px-3 py-2 bg-surface-container-lowest rounded-lg shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface">
              <span className="material-symbols-outlined text-[20px]">sports_motorsports</span>
            </div>
            <div>
              <div className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                Total Riders
              </div>
              <div className="text-[18px] text-on-surface font-bold flex items-center gap-1">
                {totalRiders.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 bg-surface-container-lowest rounded-lg shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">sensors</span>
            </div>
            <div>
              <div className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                Online Now
              </div>
              <div className="text-[18px] text-on-surface font-bold flex items-center gap-1">
                {onlineNow}
                <span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 bg-surface-container-lowest rounded-lg shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-error-container text-on-error-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">assignment_late</span>
            </div>
            <div>
              <div className="text-[11px] text-on-error-container uppercase tracking-wider font-bold">
                Pending KYC
              </div>
              <div className="text-[18px] text-error font-bold flex items-center gap-1">
                {pendingKYC}
                {pendingKYC > 0 && (
                  <span className="w-2 h-2 rounded-full bg-error animate-ping" />
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 bg-surface-container-lowest rounded-lg shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-surface-container text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">block</span>
            </div>
            <div>
              <div className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                Suspended
              </div>
              <div className="text-[18px] text-on-surface font-bold">
                {suspended}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline/20 overflow-hidden">
        <div className="px-4 py-3 bg-surface-container-low/40 flex items-center justify-between border-b border-outline/20">
          <div className="flex items-center gap-2">
            <span className="text-[16px] font-bold text-on-surface">
              Rider Directory &amp; Compliance
            </span>
            <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface text-[11px] font-semibold">
              {totalRiders.toLocaleString()} riders
            </span>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface text-on-surface-variant font-semibold text-[11px] uppercase tracking-wider border-b border-outline/20">
                <th className="py-3 px-4">Rider / Vehicle</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Rating</th>
                <th className="py-3 px-3">Rides</th>
                <th className="py-3 px-3">Today&apos;s Earnings</th>
                <th className="py-3 px-3">Joined</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[14px] text-on-surface divide-y divide-outline/10">
              {riders.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-on-surface-variant">
                    No riders registered yet.
                  </td>
                </tr>
              )}
              {riders.map((r) => {
                const initials = (r.user.name ?? "?")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);
                const joinedDate = new Date(r.user.createdAt).toLocaleDateString("en-IN", {
                  month: "short",
                  year: "numeric",
                });
                const vehicleLabel = r.vehicle
                  ? `${r.vehicle.manufacturer} ${r.vehicle.model}`
                  : "—";
                const vehiclePlate = r.vehicle?.registration ?? "—";

                return (
                  <tr key={r.id} className={getRowClass(r)}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface font-semibold text-[14px] shadow-sm select-none">
                            {initials}
                          </div>
                          <span className={getOnlineDot(r)} />
                        </div>
                        <div>
                          <div className="font-semibold text-on-surface flex items-center gap-1.5">
                            {r.user.name ?? "Unknown"}
                            {r.status === "SUSPENDED" && (
                              <span className="px-1.5 rounded bg-error-container text-on-error-container font-semibold text-[11px]">
                                HOLD
                              </span>
                            )}
                          </div>
                          <div className="text-[12px] text-on-surface-variant flex items-center gap-1 mt-0.5">
                            <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface font-bold tracking-wider text-[11px]">
                              {vehiclePlate}
                            </span>
                            <span>{vehicleLabel !== "—" ? vehicleLabel : "No vehicle"}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">{getStatusBadge(r)}</td>

                    <td className="py-3 px-3">
                      <span className="flex items-center gap-1 font-semibold text-on-surface text-[14px]">
                        <span
                          className="material-symbols-outlined text-[14px] text-primary"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        {r.ratingAvg.toFixed(1)}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-medium">
                      {((r as any).totalRides ?? 0).toLocaleString()}
                    </td>

                    <td className="py-3 px-3">
                      <div className={`font-bold ${r.status === "SUSPENDED" ? "text-error" : "text-on-surface"}`}>
                        {r.status === "SUSPENDED" ? "₹0.00 (Frozen)" : `₹${(((r as any).totalEarnings ?? 0) % 10000).toFixed(2)}`}
                      </div>
                    </td>

                    <td className="py-3 px-3 text-[12px] text-on-surface-variant">
                      {joinedDate}
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface" title="View Profile" type="button">
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
