import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import CouponForm from "./CouponForm";
import DeactivateBtn from "./DeactivateBtn";

export default function AdminCouponsPage() {
  return (
    <Suspense fallback={<main className="flex-1 bg-slate-50 p-6 text-slate-500">Loading…</main>}>
      <AdminCoupons />
    </Suspense>
  );
}

async function AdminCoupons() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") redirect("/login");
  const coupons = await db.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <main className="flex-1 bg-slate-50 p-6">
      <h1 className="text-xl font-bold text-slate-900">Coupons</h1>
      <CouponForm />
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr><th className="p-3">Code</th><th className="p-3">Type</th><th className="p-3">Value</th><th className="p-3">Min. amount</th><th className="p-3">Active</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-t border-slate-100">
                <td className="p-3 font-mono text-xs font-semibold">{c.code}</td>
                <td className="p-3">{c.discountType}</td>
                <td className="p-3">{c.discountType === "PERCENT" ? `${c.value}%` : `₹${c.value}`}</td>
                <td className="p-3">₹{c.minAmount}</td>
                <td className="p-3">{c.active ? "Yes" : "No"}</td>
                <td className="p-3">{c.active && <DeactivateBtn code={c.code} />}</td>
              </tr>
            ))}
            {coupons.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-slate-500">No coupons yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </main>
  );
}
