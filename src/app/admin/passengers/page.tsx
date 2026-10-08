import { Suspense } from "react";
import { db } from "@/lib/db";

export default function AdminPassengersPage() {
  return (
    <Suspense fallback={<main className="flex-1 bg-slate-50 p-6 text-slate-500">Loading…</main>}>
      <AdminPassengers />
    </Suspense>
  );
}

async function AdminPassengers() {
  const passengers = await db.user.findMany({
    where: { role: "PASSENGER" },
    include: { passengerProfile: { include: { rides: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return (
    <main className="flex-1 bg-slate-50 p-6">
      <h1 className="text-xl font-bold text-slate-900">Passengers</h1>
      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Phone</th><th className="p-3">Rides</th><th className="p-3">Status</th><th className="p-3">Joined</th></tr>
          </thead>
          <tbody>
            {passengers.map((u) => (
              <tr key={u.id} className="border-t border-slate-100">
                <td className="p-3 font-medium">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.phone}</td>
                <td className="p-3">{u.passengerProfile?.rides.length ?? 0}</td>
                <td className="p-3">{u.status}</td>
                <td className="p-3 text-slate-500">{u.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
            {passengers.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-slate-500">No passengers yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </main>
  );
}
