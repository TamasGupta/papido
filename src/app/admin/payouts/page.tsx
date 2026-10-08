import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import PayoutActions from "./PayoutActions";

export default function AdminPayoutsPage() {
  return (
    <Suspense fallback={<main className="flex-1 bg-slate-50 p-6 text-slate-500">Loading…</main>}>
      <AdminPayouts />
    </Suspense>
  );
}

async function AdminPayouts() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") redirect("/login");
  const payouts = await db.payout.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { rider: { include: { user: true } } },
  });
  return (
    <main className="flex-1 bg-slate-50 p-6">
      <h1 className="text-xl font-bold text-slate-900">Payouts</h1>
      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr><th className="p-3">Rider</th><th className="p-3">Amount</th><th className="p-3">Destination</th><th className="p-3">Status</th><th className="p-3">Created</th><th className="p-3">Actions</th></tr>
          </thead>
          <tbody>
            {payouts.map((p) => (
              <tr key={p.id} className="border-t border-slate-100">
                <td className="p-3">{p.rider.user.name}</td>
                <td className="p-3">₹{p.amount}</td>
                <td className="p-3">{p.destination ?? "—"}</td>
                <td className="p-3">{p.status}</td>
                <td className="p-3 text-slate-500">{p.createdAt.toLocaleString()}</td>
                <td className="p-3">{p.status === "REQUESTED" ? <PayoutActions payoutId={p.id} /> : "—"}</td>
              </tr>
            ))}
            {payouts.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-slate-500">No payout requests.</td></tr>}
          </tbody>
        </table>
      </div>
    </main>
  );
}
