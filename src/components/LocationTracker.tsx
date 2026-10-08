"use client";

import { useEffect, useState } from "react";

// Watches the rider's GPS and posts it to the backend every ~5 seconds
// while the rider is online. Mounted on the rider dashboard.
export default function LocationTracker({ enabled }: { enabled: boolean }) {
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    if (!enabled) {
      setStatus("");
      return;
    }
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("Geolocation is not supported in this browser.");
      return;
    }
    if (!window.isSecureContext) {
      setStatus("Location requires localhost or HTTPS.");
      return;
    }

    setStatus("Requesting location permission…");
    const send = (pos: GeolocationPosition) => {
      setStatus(`Location active (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`);
      fetch("/api/rider/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      }).catch(() => {});
    };
    const onError = (err: GeolocationPositionError) => {
      setStatus(
        err.code === err.PERMISSION_DENIED
          ? "Location permission denied — enable it in browser site settings."
          : `Location error: ${err.message}`
      );
    };

    navigator.geolocation.getCurrentPosition(send, onError, { enableHighAccuracy: true });
    const watchId = navigator.geolocation.watchPosition(send, onError, {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 10000,
    });
    return () => navigator.geolocation.clearWatch(watchId);
  }, [enabled]);

  return status ? <p className="text-sm text-slate-600">{status}</p> : null;
}
