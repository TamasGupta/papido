import { Suspense } from "react";
import { db } from "@/lib/db";
import VerifyActions from "./VerifyActions";

export default function AdminVerificationPage() {
  return (
    <Suspense fallback={<main className="flex-1 bg-slate-50 p-6 text-slate-500">Loading…</main>}>
      <AdminVerification />
    </Suspense>
  );
}

async function AdminVerification() {
  const riders = await db.riderProfile.findMany({
    where: { status: { in: ["PENDING", "UNDER_REVIEW"] } },
    include: { user: true, vehicle: true },
    orderBy: { user: { createdAt: "asc" } },
    take: 100,
  });

  const stats = await db.riderProfile.groupBy({ by: ["status"], _count: true });
  const count = (s: string) => stats.find((x) => x.status === s)?._count ?? 0;

  return (
    <main className="flex-1 bg-slate-50 p-6">
      <h1 className="text-xl font-bold text-slate-900">Rider verification</h1>
      <div className="mt-4 grid grid-cols-4 gap-4">
        {[["Pending", count("PENDING") + count("UNDER_REVIEW")], ["Approved", count("APPROVED")], ["Rejected", count("REJECTED")], ["Suspended", count("SUSPENDED")]].map(([k, v]) => (
          <div key={k as string} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-500">{k}</p>
            <p className="text-2xl font-bold">{v}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="p-3">Rider</th><th className="p-3">Phone</th><th className="p-3">Licence</th><th className="p-3">Vehicle</th><th className="p-3">Status</th><th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {riders.map((r) => (
              <tr key={r.id} className="border-t border-slate-100">
                <td className="p-3 font-medium">{r.user.name}</td>
                <td className="p-3">{r.user.phone}</td>
                <td className="p-3">{r.licenceNumber ?? "—"}</td>
                <td className="p-3">{r.vehicle ? `${r.vehicle.manufacturer} ${r.vehicle.model} · ${r.vehicle.registration}` : "—"}</td>
                <td className="p-3"><span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">{r.status}</span></td>
                <td className="p-3"><VerifyActions riderId={r.id} /></td>
              </tr>
            ))}
            {riders.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-slate-500">No riders awaiting verification.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
