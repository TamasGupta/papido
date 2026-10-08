"use client";

import { useEffect } from "react";

// Watches the rider's GPS and posts it to the backend every ~5 seconds
// while the rider is online. Mounted on the rider dashboard.
export default function LocationTracker({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (!enabled || typeof navigator === "undefined" || !navigator.geolocation) return;

    const send = (pos: GeolocationPosition) => {
      fetch("/api/rider/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      }).catch(() => {});
    };

    // Immediate first fix, then watch
    navigator.geolocation.getCurrentPosition(send, () => {});
    const watchId = navigator.geolocation.watchPosition(send, () => {}, {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 10000,
    });
    return () => navigator.geolocation.clearWatch(watchId);
  }, [enabled]);

  return null;
}
