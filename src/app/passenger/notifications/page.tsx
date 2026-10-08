"use client";

import { useEffect, useState } from "react";

export default function PassengerNotifications() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((d) => d.success && setItems(d.data));
  }, []);

  async function markAll() {
    await fetch("/api/notifications", { method: "POST" });
    setItems((xs) => xs.map((x) => ({ ...x, read: true })));
  }

  return (
    <main className="flex-1 bg-slate-50 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Notifications</h1>
        <button onClick={markAll} className="text-sm text-green-700">Mark all read</button>
      </div>
      <div className="mt-4 space-y-2">
        {items.map((n) => (
          <div key={n.id} className={`rounded-lg border p-4 ${n.read ? "border-slate-200 bg-white" : "border-green-200 bg-green-50"}`}>
            <p className="font-semibold text-slate-900">{n.title}</p>
            <p className="text-sm text-slate-600">{n.body}</p>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-slate-500">No notifications yet.</p>}
      </div>
    </main>
  );
}
