"use client";

import { useState } from "react";

export default function PayoutActions({ payoutId }: { payoutId: string }) {
  const [loading, setLoading] = useState(false);
  async function act(status: "COMPLETED" | "FAILED") {
    setLoading(true);
    await fetch(`/api/admin/payouts/${payoutId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    window.location.reload();
  }
  return (
    <div className="flex gap-2">
      <button disabled={loading} onClick={() => act("COMPLETED")} className="rounded-md bg-green-600 px-3 py-1 text-xs font-semibold text-white disabled:opacity-60">Approve</button>
      <button disabled={loading} onClick={() => act("FAILED")} className="rounded-md border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 disabled:opacity-60">Reject</button>
    </div>
  );
}
