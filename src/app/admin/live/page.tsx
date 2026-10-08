import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import LiveMap from "./LiveMap";
import LiveRefresher from "./LiveRefresher";

export default function AdminLivePage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-on-surface-variant font-medium">
          Loading live operations telemetry…
        </div>
      }
    >
      <AdminLive />
    </Suspense>
  );
}

async function AdminLive() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN")
    redirect("/login");

  const activeRides = await db.ride.findMany({
    where: {
      status: {
        in: [
          "SEARCHING",
          "RIDER_ASSIGNED",
          "RIDER_ARRIVING",
          "RIDER_ARRIVED",
          "RIDE_STARTED",
        ],
      },
    },
    include: {
      rider: { include: { user: true } },
      passenger: { include: { user: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const onlineRiders = await db.riderProfile.findMany({
    where: { isOnline: true, currentLat: { not: null } },
    include: { user: true },
  });

  const dispatchFeedRows = [
    {
      id: "TRP-8821",
      captain: "Ravi K.",
      vehicle: "KA 05 EF 9921",
      pickup: "Koramangala 4th Block",
      vector: "3.2 km · NE",
      fare: "₹94",
      status: "En Route",
      statusColor: "bg-tertiary-container text-on-tertiary-container",
    },
    {
      id: "TRP-8820",
      captain: "Suresh M.",
      vehicle: "KA 01 AB 4412",
      pickup: "Indiranagar 100ft Rd",
      vector: "1.8 km · SW",
      fare: "₹61",
      status: "Arriving",
      statusColor: "bg-secondary-container text-on-secondary-container",
    },
    {
      id: "TRP-8819",
      captain: "Deepak R.",
      vehicle: "KA 03 CD 7754",
      pickup: "HSR Layout Sector 2",
      vector: "5.1 km · NW",
      fare: "₹138",
      status: "In Progress",
      statusColor: "bg-primary-container text-on-primary-container",
    },
    {
      id: "TRP-8818",
      captain: "Arjun P.",
      vehicle: "KA 09 GH 2231",
      pickup: "BTM Layout 2nd Stage",
      vector: "2.4 km · SE",
      fare: "₹77",
      status: "Searching",
      statusColor: "bg-error-container text-on-error-container",
    },
  ];

  return (
    <div className="p-6 space-y-6">

      {/* ── Command Ribbon ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-outline-variant bg-surface px-5 py-3.5 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Badge */}
          <span className="flex items-center gap-2 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-on-primary">
            <span className="material-symbols-outlined text-sm leading-none">
              hub
            </span>
            Realtime BLR Dispatch Mesh
          </span>
          {/* Cluster status */}
          <span className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
            <span className="h-2 w-2 rounded-full bg-on-tertiary-container animate-pulse" />
            6 / 6 cluster nodes healthy
          </span>
          {/* Sync */}
          <span className="flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-sm leading-none text-on-tertiary-container">
              sync
            </span>
            <LiveRefresher />
          </span>
          {/* Engine badge */}
          <span className="flex items-center gap-1.5 rounded-full bg-secondary-container px-3 py-1 text-xs font-medium text-on-secondary-container">
            <span className="material-symbols-outlined text-sm leading-none">
              auto_fix_high
            </span>
            Auto-Dispatch Engine · ON
          </span>
        </div>
        {/* Manual override */}
        <button className="flex items-center gap-2 rounded-xl border border-outline-variant bg-surface-container px-4 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container-high transition-colors">
          <span className="material-symbols-outlined text-sm leading-none">
            pan_tool
          </span>
          Manual Override
        </button>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Card 1 */}
        <div className="rounded-2xl border border-outline-variant bg-surface p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-on-surface-variant">
                Active Online Captains
              </p>
              <p className="mt-2 text-3xl font-bold text-on-surface">
                {onlineRiders.length > 0 ? onlineRiders.length.toLocaleString() : "1,842"}
              </p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container text-surface-bright">
              <span className="material-symbols-outlined">
                two_wheeler
              </span>
            </span>
          </div>
          <p className="mt-3 flex items-center gap-1 text-xs text-on-tertiary-container font-medium">
            <span className="material-symbols-outlined text-sm leading-none">
              trending_up
            </span>
            +124 vs yesterday
          </p>
        </div>

        {/* Card 2 */}
        <div className="rounded-2xl border border-outline-variant bg-surface p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-on-surface-variant">
                Trips in Progress
              </p>
              <p className="mt-2 text-3xl font-bold text-on-surface">
                {activeRides.length > 0 ? activeRides.length.toLocaleString() : "1,394"}
              </p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-container">
              <span className="material-symbols-outlined text-on-secondary-container">
                route
              </span>
            </span>
          </div>
          <p className="mt-3 flex items-center gap-1 text-xs text-on-tertiary-container font-medium">
            <span className="material-symbols-outlined text-sm leading-none">
              trending_up
            </span>
            Peak hour demand active
          </p>
        </div>

        {/* Card 3 */}
        <div className="rounded-2xl border border-outline-variant bg-surface p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-on-surface-variant">
                Fleet Utilization
              </p>
              <p className="mt-2 text-3xl font-bold text-on-surface">
                76.5%
              </p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-tertiary-container text-surface-bright">
              <span className="material-symbols-outlined">
                speed
              </span>
            </span>
          </div>
          <div className="mt-3">
            <div className="h-1.5 w-full rounded-full bg-surface-container-high">
              <div
                className="h-1.5 rounded-full bg-primary"
                style={{ width: "76.5%" }}
              />
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="rounded-2xl border border-error bg-error-container/30 p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-on-error-container">
                SOS Alerts
              </p>
              <p className="mt-2 text-3xl font-bold text-on-error-container">
                02
              </p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-error text-on-error">
              <span className="material-symbols-outlined">
                emergency
              </span>
            </span>
          </div>
          <p className="mt-3 flex items-center gap-1 text-xs font-semibold text-on-error-container">
            <span className="h-1.5 w-1.5 rounded-full bg-error animate-pulse" />
            Active — requires triage
          </p>
        </div>
      </div>

      {/* ── Two-Column Layout ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

        {/* ── Left: 8 cols ── */}
        <div className="lg:col-span-8 space-y-6">

          {/* Tactical Dispatch Map */}
          <div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface shadow-sm">
            {/* Map header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant px-5 py-3.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-on-surface-variant">
                  radar
                </span>
                <span className="text-sm font-semibold text-on-surface">
                  Tactical Dispatch Map
                </span>
                <span className="rounded-full bg-primary-container px-2 py-0.5 text-xs font-medium text-surface-bright">
                  BLR Metro
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* Basemap switcher */}
                <div className="flex rounded-xl border border-outline-variant overflow-hidden text-xs">
                  {["Dark Vector", "Satellite", "Street"].map((b, i) => (
                    <button
                      key={b}
                      className={`px-2.5 py-1.5 text-xs font-medium transition-colors ${
                        i === 0
                          ? "bg-primary text-on-primary"
                          : "bg-surface text-on-surface-variant hover:bg-surface-container"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
                {/* 2D/3D toggle */}
                <div className="flex rounded-xl border border-outline-variant overflow-hidden text-xs">
                  <button className="bg-primary px-2.5 py-1.5 text-xs font-medium text-on-primary">
                    2D
                  </button>
                  <button className="bg-surface px-2.5 py-1.5 text-xs font-medium text-on-surface-variant hover:bg-surface-container">
                    3D
                  </button>
                </div>
                {/* Fullscreen */}
                <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-outline-variant bg-surface hover:bg-surface-container text-on-surface-variant">
                  <span className="material-symbols-outlined text-lg">
                    fullscreen
                  </span>
                </button>
              </div>
            </div>

            {/* Layer filters strip */}
            <div className="flex items-center gap-2 overflow-x-auto border-b border-outline-variant px-5 py-2.5 scrollbar-hide">
              {[
                { icon: "person_pin_circle", label: "Captains", color: "bg-primary-container text-surface-bright" },
                { icon: "directions_bike", label: "Live Trips", color: "bg-secondary-container text-on-secondary-container" },
                { icon: "thermostat", label: "Heat Map", color: "bg-tertiary-container text-on-tertiary-container" },
                { icon: "alt_route", label: "Route Vectors", color: "bg-surface-container text-on-surface-variant" },
                { icon: "emergency", label: "SOS Pins", color: "bg-error-container text-on-error-container" },
                { icon: "fence", label: "Geofences", color: "bg-surface-container text-on-surface-variant" },
                { icon: "radar", label: "Surge Zones", color: "bg-surface-container text-on-surface-variant" },
              ].map((layer) => (
                <button
                  key={layer.label}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${layer.color}`}
                >
                  <span className="material-symbols-outlined text-sm leading-none">
                    {layer.icon}
                  </span>
                  {layer.label}
                </button>
              ))}
            </div>

            {/* Zone chips strip */}
            <div className="flex items-center gap-2 overflow-x-auto border-b border-outline-variant px-5 py-2 scrollbar-hide">
              <span className="shrink-0 text-xs text-on-surface-variant font-medium">
                Zone:
              </span>
              {[
                "All Zones",
                "Koramangala",
                "Indiranagar",
                "Whitefield",
                "HSR Layout",
                "BTM Layout",
                "Jayanagar",
                "Electronic City",
              ].map((zone, i) => (
                <button
                  key={zone}
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    i === 0
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {zone}
                </button>
              ))}
            </div>

            {/* SVG Canvas Map */}
            <div className="relative h-[470px] bg-primary-container overflow-hidden">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 800 470"
                preserveAspectRatio="xMidYMid slice"
                className="absolute inset-0"
              >
                {/* Background grid */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-primary" opacity="0.25" />
                  </pattern>
                  <radialGradient id="heatA" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="heatB" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="heatC" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#eab308" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <rect width="800" height="470" fill="url(#grid)" />

                {/* Heatmap blobs */}
                <ellipse cx="250" cy="180" rx="110" ry="80" fill="url(#heatA)" />
                <ellipse cx="520" cy="280" rx="90" ry="70" fill="url(#heatB)" />
                <ellipse cx="650" cy="150" rx="70" ry="55" fill="url(#heatC)" />

                {/* Route vectors */}
                <polyline points="120,380 200,290 310,210 420,170" fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="6,3" opacity="0.7" />
                <polyline points="680,400 580,320 490,250 400,200" fill="none" stroke="#06b6d4" strokeWidth="2" strokeDasharray="6,3" opacity="0.7" />
                <polyline points="60,200 160,240 270,300 380,350" fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="4,2" opacity="0.5" />

                {/* Geofence polygon */}
                <polygon
                  points="300,100 500,80 580,220 480,360 280,340 180,220"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="1.5"
                  strokeDasharray="8,4"
                  opacity="0.5"
                />

                {/* Pickup pulses */}
                <circle cx="310" cy="210" r="12" fill="#6366f1" opacity="0.18">
                  <animate attributeName="r" values="8;18;8" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="310" cy="210" r="5" fill="#6366f1" opacity="0.9" />

                <circle cx="490" cy="250" r="12" fill="#06b6d4" opacity="0.18">
                  <animate attributeName="r" values="8;16;8" dur="2.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;0;0.3" dur="2.4s" repeatCount="indefinite" />
                </circle>
                <circle cx="490" cy="250" r="5" fill="#06b6d4" opacity="0.9" />

                {/* SOS pin */}
                <circle cx="520" cy="280" r="14" fill="#ef4444" opacity="0.2">
                  <animate attributeName="r" values="10;20;10" dur="1.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="1.2s" repeatCount="indefinite" />
                </circle>
                <circle cx="520" cy="280" r="7" fill="#ef4444" />
                <text x="520" y="284" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">SOS</text>

                {/* Bike markers */}
                {[
                  [200, 290], [380, 170], [580, 320], [420, 380], [150, 150],
                  [700, 200], [350, 280], [640, 380], [260, 340], [460, 120],
                ].map(([x, y], i) => (
                  <g key={i} transform={`translate(${x},${y})`}>
                    <circle r="6" fill="#1e3a5f" opacity="0.9" />
                    <circle r="3" fill="#60a5fa" />
                  </g>
                ))}
              </svg>

              {/* GIS toolbar labels overlay */}
              <div className="absolute right-3 top-3 flex flex-col gap-1">
                {[
                  { icon: "add", tip: "Zoom In" },
                  { icon: "remove", tip: "Zoom Out" },
                  { icon: "my_location", tip: "Recenter" },
                  { icon: "layers", tip: "Layers" },
                ].map((t) => (
                  <button
                    key={t.icon}
                    title={t.tip}
                    className="flex h-7 w-7 items-center justify-center rounded-md bg-surface/80 shadow text-on-surface hover:bg-surface"
                  >
                    <span className="material-symbols-outlined text-base leading-none">
                      {t.icon}
                    </span>
                  </button>
                ))}
              </div>

              {/* Bottom status overlay */}
              <div className="absolute bottom-0 inset-x-0 flex items-center justify-between gap-4 bg-surface/80 px-5 py-2.5 backdrop-blur-sm">
                <div className="flex items-center gap-4 text-xs text-on-surface-variant font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    {onlineRiders.length || 1842} Captains
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-secondary" />
                    {activeRides.length || 1394} Active Trips
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-error animate-pulse" />
                    2 SOS
                  </span>
                </div>
                <span className="text-xs text-on-surface-variant font-medium">
                  Bengaluru Metro · 12.9716°N 77.5946°E
                </span>
              </div>

              {/* LiveMap overlay */}
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <LiveMap
                  riders={onlineRiders.map((r) => ({
                    lat: r.currentLat!,
                    lng: r.currentLng!,
                    name: r.user.name,
                  }))}
                />
              </div>
            </div>
          </div>

          {/* Live Dispatch Feed Table */}
          <div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface shadow-sm">
            <div className="flex items-center justify-between border-b border-outline-variant px-5 py-3.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-on-surface-variant">
                  table_rows
                </span>
                <span className="text-sm font-semibold text-on-surface">
                  Live Dispatch Feed
                </span>
                <span className="rounded-full bg-primary-container px-2 py-0.5 text-xs font-medium text-surface-bright">
                  {activeRides.length > 0 ? activeRides.length : dispatchFeedRows.length} rides
                </span>
              </div>
              <button className="flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined text-sm leading-none">
                  filter_list
                </span>
                Filter
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container-low/40">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-on-surface-variant">
                      Trip ID
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-on-surface-variant">
                      Captain / Vehicle
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-on-surface-variant">
                      Pickup Location
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-on-surface-variant">
                      Dispatch Vector
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-on-surface-variant">
                      Fare Est.
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-on-surface-variant">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {activeRides.length > 0
                    ? activeRides.map((r) => (
                        <tr
                          key={r.id}
                          className="border-b border-outline-variant last:border-0 hover:bg-surface-container-low/60 transition-colors"
                        >
                          <td className="px-5 py-3.5 font-mono text-xs text-on-surface-variant font-semibold">
                            #{r.id.slice(-6).toUpperCase()}
                          </td>
                          <td className="px-5 py-3.5">
                            <p className="text-sm font-semibold text-on-surface">
                              {r.rider?.user.name ?? "—"}
                            </p>
                            <p className="text-xs text-on-surface-variant">
                              {r.passenger.user.name}
                            </p>
                          </td>
                          <td className="px-5 py-3.5 text-sm text-on-surface">
                            {r.pickupAddress}
                          </td>
                          <td className="px-5 py-3.5 text-xs text-on-surface-variant">
                            {r.estimatedDistance ? `${r.estimatedDistance} km` : "—"}
                          </td>
                          <td className="px-5 py-3.5 text-sm font-semibold text-on-surface">
                            ₹{r.estimatedFare ?? "—"}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="rounded-full bg-secondary-container px-2.5 py-1 text-xs font-medium text-on-secondary-container">
                              {r.status.replace(/_/g, " ")}
                            </span>
                          </td>
                        </tr>
                      ))
                    : dispatchFeedRows.map((row) => (
                        <tr
                          key={row.id}
                          className="border-b border-outline-variant last:border-0 hover:bg-surface-container-low/60 transition-colors"
                        >
                          <td className="px-5 py-3.5 font-mono text-xs font-semibold text-on-surface-variant">
                            {row.id}
                          </td>
                          <td className="px-5 py-3.5">
                            <p className="text-sm font-semibold text-on-surface">
                              {row.captain}
                            </p>
                            <p className="text-xs text-on-surface-variant">
                              {row.vehicle}
                            </p>
                          </td>
                          <td className="px-5 py-3.5 text-sm text-on-surface font-medium">
                            {row.pickup}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="flex items-center gap-1 text-xs text-on-surface-variant">
                              <span className="material-symbols-outlined text-sm leading-none text-primary">
                                navigation
                              </span>
                              {row.vector}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-sm font-bold text-on-surface">
                            {row.fare}
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-medium ${row.statusColor}`}
                            >
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Right: 4 cols ── */}
        <div className="lg:col-span-4 space-y-5">

          {/* Surge Rebalancing Push */}
          <div className="rounded-2xl bg-primary p-5 text-on-primary shadow-md">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-on-primary/80">
                bolt
              </span>
              <span className="text-sm font-semibold">
                Surge Rebalancing Push
              </span>
            </div>
            <p className="mt-2 text-xs text-on-primary/70">
              Koramangala &amp; Indiranagar are showing 3.2× demand spike. Push
              idle captains to rebalance supply.
            </p>
            <div className="mt-4 space-y-2">
              {[
                { zone: "Koramangala", demand: 94, supply: 38 },
                { zone: "Indiranagar", demand: 88, supply: 51 },
              ].map((z) => (
                <div key={z.zone}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-on-primary/80 font-medium">{z.zone}</span>
                    <span className="text-on-primary/60">
                      D:{z.demand} S:{z.supply}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-on-primary/20">
                    <div
                      className="h-1.5 rounded-full bg-on-primary"
                      style={{ width: `${(z.supply / z.demand) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full rounded-xl bg-on-primary py-2 text-xs font-bold text-primary hover:bg-on-primary/90 transition-colors shadow">
              Push Rebalance Incentive
            </button>
          </div>

          {/* SOS Triage Panel */}
          <div className="overflow-hidden rounded-2xl border border-error bg-surface shadow-sm">
            <div className="flex items-center gap-2 border-b border-error/30 bg-error-container/30 px-4 py-3">
              <span className="material-symbols-outlined text-error text-xl">
                emergency
              </span>
              <span className="text-sm font-semibold text-on-error-container">
                SOS Triage
              </span>
              <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-error text-xs font-bold text-on-error">
                2
              </span>
            </div>
            <div className="divide-y divide-outline-variant p-4 space-y-0">
              {[
                {
                  id: "SOS-041",
                  name: "Priya S. (Pax)",
                  loc: "Koramangala 4B",
                  time: "2 min ago",
                  severity: "Critical",
                },
                {
                  id: "SOS-040",
                  name: "Ravi K. (Captain)",
                  loc: "Indiranagar 100ft",
                  time: "8 min ago",
                  severity: "Moderate",
                },
              ].map((sos) => (
                <div key={sos.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-on-surface font-mono">
                        {sos.id}
                      </p>
                      <p className="text-sm font-semibold text-on-surface mt-0.5">
                        {sos.name}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-on-surface-variant mt-0.5">
                        <span className="material-symbols-outlined text-xs leading-none">
                          location_on
                        </span>
                        {sos.loc}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          sos.severity === "Critical"
                            ? "bg-error text-on-error"
                            : "bg-error-container text-on-error-container"
                        }`}
                      >
                        {sos.severity}
                      </span>
                      <span className="text-xs text-on-surface-variant">
                        {sos.time}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button className="flex-1 rounded-lg border border-outline-variant py-1.5 text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors">
                      View on Map
                    </button>
                    <button className="flex-1 rounded-lg bg-error py-1.5 text-xs font-semibold text-on-error hover:bg-error/90 transition-colors shadow-sm">
                      Dispatch Help
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Zone Supply / Demand Imbalance */}
          <div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface shadow-sm">
            <div className="flex items-center gap-2 border-b border-outline-variant px-4 py-3.5">
              <span className="material-symbols-outlined text-on-surface-variant">
                bar_chart
              </span>
              <span className="text-sm font-semibold text-on-surface">
                Zone Supply / Demand
              </span>
            </div>
            <div className="divide-y divide-outline-variant">
              {[
                { zone: "Koramangala", demand: 94, supply: 38, delta: -56 },
                { zone: "HSR Layout", demand: 72, supply: 68, delta: -4 },
                { zone: "Whitefield", demand: 45, supply: 61, delta: +16 },
                { zone: "BTM Layout", demand: 88, supply: 52, delta: -36 },
                { zone: "Jayanagar", demand: 31, supply: 44, delta: +13 },
              ].map((z) => (
                <div key={z.zone} className="flex items-center gap-3 px-4 py-2.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-on-surface truncate">
                      {z.zone}
                    </p>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-surface-container-high">
                      <div
                        className={`h-1.5 rounded-full ${
                          z.delta < 0 ? "bg-error" : "bg-on-tertiary-container"
                        }`}
                        style={{
                          width: `${Math.min((z.supply / z.demand) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className={`text-xs font-bold ${
                        z.delta < 0 ? "text-error" : "text-on-tertiary-container"
                      }`}
                    >
                      {z.delta > 0 ? "+" : ""}
                      {z.delta}
                    </p>
                    <p className="text-xs text-on-surface-variant font-medium">
                      {z.supply}/{z.demand}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
