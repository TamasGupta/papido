import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export default function AdminPaymentsPage() {
  return (
    <Suspense fallback={<main className="flex-1 bg-slate-50 p-6 text-slate-500">Loading…</main>}>
      <AdminPayments />
    </Suspense>
  );
}

async function AdminPayments() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") redirect("/login");
  const payments = await db.payment.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { ride: { include: { passenger: { include: { user: true } } } } },
  });
  return (
    <main className="flex-1 bg-slate-50 p-6">
      <h1 className="text-xl font-bold text-slate-900">Payments</h1>
      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr><th className="p-3">Ride</th><th className="p-3">Passenger</th><th className="p-3">Amount</th><th className="p-3">Method</th><th className="p-3">Status</th><th className="p-3">Created</th></tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-t border-slate-100">
                <td className="p-3 font-mono text-xs">#{p.rideId.slice(-6)}</td>
                <td className="p-3">{p.ride.passenger.user.name}</td>
                <td className="p-3">₹{p.amount}</td>
                <td className="p-3">{p.method}</td>
                <td className="p-3"><span className={`rounded-full px-2 py-0.5 text-xs ${p.status === "SUCCESS" ? "bg-green-100 text-green-800" : p.status === "FAILED" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}`}>{p.status}</span></td>
                <td className="p-3 text-slate-500">{p.createdAt.toLocaleString()}</td>
              </tr>
            ))}
            {payments.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-slate-500">No payments yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </main>
  );
}
