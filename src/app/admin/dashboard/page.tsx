import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<main className="flex-1 bg-slate-50 p-6 text-slate-500">Loading…</main>}>
      <AdminDashboard />
    </Suspense>
  );
}

async function AdminDashboard() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") redirect("/login");
  const [passengers, riders, pendingVerification, onlineRiders, totalRides, completed, cancelled] =
    await Promise.all([
      db.user.count({ where: { role: "PASSENGER" } }),
      db.user.count({ where: { role: "RIDER" } }),
      db.riderProfile.count({ where: { status: "PENDING" } }),
      db.riderProfile.count({ where: { isOnline: true } }),
      db.ride.count(),
      db.ride.count({ where: { status: "RIDE_COMPLETED" } }),
      db.ride.count({ where: { status: { in: ["CANCELLED_BY_PASSENGER", "CANCELLED_BY_RIDER", "CANCELLED_BY_ADMIN"] } } }),
    ]);

  const kpis = [
    ["Total Passengers", passengers],
    ["Total Riders", riders],
    ["Online Riders", onlineRiders],
    ["Total Rides", totalRides],
    ["Completed", completed],
    ["Cancelled", cancelled],
    ["Pending Verification", pendingVerification],
  ];

  return (
    <main className="flex flex-1 bg-slate-50">
      <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white p-6 md:block">
        <h2 className="text-lg font-bold text-slate-900">Papido Admin</h2>
        <nav className="mt-6 space-y-1 text-sm text-slate-600">
          {["Dashboard", "Live Rides", "Rides", "Passengers", "Riders", "Verification", "Payments", "Payouts", "Coupons", "Disputes", "Service Areas", "Fare Settings", "Reports", "Settings"].map((item) => (
            <p key={item} className="rounded-md px-3 py-2 hover:bg-slate-100 first:bg-green-50 first:text-green-700 first:font-semibold">{item}</p>
          ))}
        </nav>
      </aside>
      <section className="flex-1 p-6">
        <h1 className="text-xl font-bold text-slate-900">Operations overview</h1>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {kpis.map(([k, v]) => (
            <div key={k as string} className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs text-slate-500">{k}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{v}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
