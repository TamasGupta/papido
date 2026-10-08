import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export default function AdminDisputesPage() {
  return (
    <Suspense fallback={<main className="flex-1 bg-slate-50 p-6 text-slate-500">Loading…</main>}>
      <AdminDisputes />
    </Suspense>
  );
}

async function AdminDisputes() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") redirect("/login");
  const disputes = await db.dispute.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return (
    <main className="flex-1 bg-slate-50 p-6">
      <h1 className="text-xl font-bold text-slate-900">Disputes</h1>
      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr><th className="p-3">Ride</th><th className="p-3">Category</th><th className="p-3">Description</th><th className="p-3">Status</th><th className="p-3">Created</th></tr>
          </thead>
          <tbody>
            {disputes.map((d) => (
              <tr key={d.id} className="border-t border-slate-100">
                <td className="p-3 font-mono text-xs">{d.rideId ? `#${d.rideId.slice(-6)}` : "—"}</td>
                <td className="p-3">{d.category}</td>
                <td className="p-3 max-w-64 truncate">{d.description}</td>
                <td className="p-3">{d.status}</td>
                <td className="p-3 text-slate-500">{d.createdAt.toLocaleString()}</td>
              </tr>
            ))}
            {disputes.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-slate-500">No disputes.</td></tr>}
          </tbody>
        </table>
      </div>
    </main>
  );
}
