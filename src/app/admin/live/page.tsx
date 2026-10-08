import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import LiveMap from "./LiveMap";
import LiveRefresher from "./LiveRefresher";

export default function AdminLivePage() {
  return (
    <Suspense fallback={<main className="flex-1 bg-slate-50 p-6 text-slate-500">Loading…</main>}>
      <AdminLive />
    </Suspense>
  );
}

async function AdminLive() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") redirect("/login");
  const activeRides = await db.ride.findMany({
    where: { status: { in: ["SEARCHING", "RIDER_ASSIGNED", "RIDER_ARRIVING", "RIDER_ARRIVED", "RIDE_STARTED"] } },
    include: { rider: { include: { user: true } }, passenger: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
  });
  const onlineRiders = await db.riderProfile.findMany({
    where: { isOnline: true, currentLat: { not: null } },
    include: { user: true },
  });
  return (
    <main className="flex-1 bg-slate-50 p-6">
      <h1 className="text-xl font-bold text-slate-900">Live operations</h1>
      <LiveRefresher />
      <p className="mt-1 text-sm text-slate-500">{onlineRiders.length} riders online · {activeRides.length} active rides</p>
      <div className="mt-4">
        <LiveMap riders={onlineRiders.map((r) => ({ lat: r.currentLat!, lng: r.currentLng!, name: r.user.name }))} />
      </div>
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr><th className="p-3">ID</th><th className="p-3">Passenger</th><th className="p-3">Rider</th><th className="p-3">Status</th><th className="p-3">Created</th></tr>
          </thead>
          <tbody>
            {activeRides.map((r) => (
              <tr key={r.id} className="border-t border-slate-100">
                <td className="p-3 font-mono text-xs">#{r.id.slice(-6)}</td>
                <td className="p-3">{r.passenger.user.name}</td>
                <td className="p-3">{r.rider?.user.name ?? "—"}</td>
                <td className="p-3">{r.status}</td>
                <td className="p-3 text-slate-500">{r.createdAt.toLocaleString()}</td>
              </tr>
            ))}
            {activeRides.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-slate-500">No active rides.</td></tr>}
          </tbody>
        </table>
      </div>
    </main>
  );
}
