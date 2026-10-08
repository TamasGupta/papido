"use client";

export default function DeactivateBtn({ code }: { code: string }) {
  async function deactivate() {
    await fetch("/api/admin/coupons/deactivate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    window.location.reload();
  }
  return <button onClick={deactivate} className="rounded-md border border-slate-300 px-3 py-1 text-xs text-slate-700">Deactivate</button>;
}
