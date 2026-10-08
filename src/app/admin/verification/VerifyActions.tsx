"use client";

import { useState } from "react";

export default function VerifyActions({ riderId }: { riderId: string }) {
  const [loading, setLoading] = useState(false);

  async function act(action: "approve" | "reject") {
    setLoading(true);
    await fetch(`/api/admin/riders/${riderId}/${action}`, { method: "POST" });
    window.location.reload();
  }

  return (
    <div className="flex gap-2">
      <button disabled={loading} onClick={() => act("approve")} className="rounded-md bg-green-600 px-3 py-1 text-xs font-semibold text-white disabled:opacity-60">Approve</button>
      <button disabled={loading} onClick={() => act("reject")} className="rounded-md border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 disabled:opacity-60">Reject</button>
    </div>
  );
}
