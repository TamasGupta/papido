import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export default function AdminRidersPage() {
  return (
    <Suspense fallback={<main className="flex-1 bg-slate-50 p-6 text-slate-500">Loading…</main>}>
      <AdminRiders />
    </Suspense>
  );
}

async function AdminRiders() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") redirect("/login");
  const riders = await db.riderProfile.findMany({
    include: { user: true, vehicle: true },
    orderBy: { user: { createdAt: "desc" } },
    take: 100,
  });
  return (
    <main className="flex-1 bg-slate-50 p-6">
      <h1 className="text-xl font-bold text-slate-900">Riders</h1>
      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr><th className="p-3">Name</th><th className="p-3">Phone</th><th className="p-3">Vehicle</th><th className="p-3">Status</th><th className="p-3">Online</th><th className="p-3">Rating</th></tr>
          </thead>
          <tbody>
            {riders.map((r) => (
              <tr key={r.id} className="border-t border-slate-100">
                <td className="p-3 font-medium">{r.user.name}</td>
                <td className="p-3">{r.user.phone}</td>
                <td className="p-3">{r.vehicle ? `${r.vehicle.manufacturer} ${r.vehicle.model}` : "—"}</td>
                <td className="p-3">{r.status}</td>
                <td className="p-3">{r.isOnline ? "Yes" : "No"}</td>
                <td className="p-3">{r.ratingAvg.toFixed(1)}</td>
              </tr>
            ))}
            {riders.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-slate-500">No riders yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </main>
  );
}
