"use client";

import { use, useEffect, useState } from "react";

import { Shield, MapPin, Phone, MessageCircle, Clock, Loader2 } from "lucide-react";

export default function RiderAssignedArriving() {
  const [pin, setPin] = useState("");
  const [msg, setMsg] = useState("");

  async function verifyAndStart() {
    if (!pin) return setMsg("Enter the passenger PIN");
    const res = await fetch("/api/rides", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "start", pin }),
    });
    const data = await res.json();
    setMsg(data.success ? "Ride started ✓" : data.error?.message ?? "Failed");
    if (data.success) window.location.href = "/rider/ride/" + data.data?.id;
  }

  return (
    <main className="flex-1 bg-slate-50 p-6">
      <div className="max-w-md bg-white rounded-xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Ride Assigned</h1>
        <p className="text-slate-500 mb-6">
          {pin ? "PIN verified — " : ""}Rider is on the way to pickup.
        </p>

        {pin ? null : (
          <div className="mb-4">
            <p className="text-sm text-slate-500">Passenger PIN</p>
            <input
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN from passenger"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 mt-1"
            />
          </div>
        )}

        <button
          onClick={verifyAndStart}
          disabled={!pin}
          className="w-full rounded-lg bg-emerald-600 py-3 font-semibold text-white disabled:opacity-60"
        >
          {pin ? "Start Ride" : "Verify & Start"}
        </button>

        {msg && <p className="mt-4 text-sm text-slate-600">{msg}</p>}
      </div>
    </main>
  );
}