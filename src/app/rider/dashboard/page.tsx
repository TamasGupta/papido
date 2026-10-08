export default function RiderDashboard() {
  return (
    <main className="flex-1 bg-slate-50 p-6">
      <h1 className="text-xl font-bold text-slate-900">Rider Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">See earnings, manage your online status and ride requests.</p>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          ["Today's Earnings", "₹1,250"],
          ["Completed Rides", "18"],
          ["Online Hours", "7h 25m"],
          ["Avg Rating", "4.8"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-500">{k}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{v}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
