import { Suspense } from "react";
import { db } from "@/lib/db";

export default function AdminRidesPage() {
  return (
    <Suspense fallback={<main className="flex-1 bg-slate-50 p-6 text-slate-500">Loading…</main>}>
      <AdminRides />
    </Suspense>
  );
}

async function AdminRides() {
  const rides = await db.ride.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { passenger: { include: { user: true } }, rider: { include: { user: true } } },
  });
  return (
    <main className="flex-1 bg-slate-50 p-6">
      <h1 className="text-xl font-bold text-slate-900">Rides</h1>
      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr><th className="p-3">ID</th><th className="p-3">Passenger</th><th className="p-3">Rider</th><th className="p-3">Pickup</th><th className="p-3">Fare</th><th className="p-3">Status</th><th className="p-3">Created</th></tr>
          </thead>
          <tbody>
            {rides.map((r) => (
              <tr key={r.id} className="border-t border-slate-100">
                <td className="p-3 font-mono text-xs">#{r.id.slice(-6)}</td>
                <td className="p-3">{r.passenger.user.name}</td>
                <td className="p-3">{r.rider?.user.name ?? "—"}</td>
                <td className="p-3 max-w-48 truncate">{r.pickupAddress}</td>
                <td className="p-3">₹{r.finalFare ?? r.estimatedFare ?? "—"}</td>
                <td className="p-3">{r.status}</td>
                <td className="p-3 text-slate-500">{r.createdAt.toLocaleString()}</td>
              </tr>
            ))}
            {rides.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-slate-500">No rides yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </main>
  );
}
