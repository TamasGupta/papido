"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/maps/LeafletMap"), { ssr: false });

export default function LiveMap({ riders }: { riders: { lat: number; lng: number; name: string }[] }) {
  return (
    <div className="h-96 overflow-hidden rounded-xl border border-slate-200">
      <Map
        center={riders.length ? [riders[0].lat, riders[0].lng] : [12.9716, 77.5946]}
        markers={riders.map((r) => ({ position: [r.lat, r.lng], label: r.name }))}
      />
    </div>
  );
}
