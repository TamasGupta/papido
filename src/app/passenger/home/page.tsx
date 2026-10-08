"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Map = dynamic(() => import("@/components/maps/LeafletMap"), { ssr: false });

export default function PassengerHome() {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [fareMsg, setFareMsg] = useState("");
  const [center, setCenter] = useState<[number, number]>([12.9716, 77.5946]);
  const [locStatus, setLocStatus] = useState("Locating you…");
  const [selectedTier, setSelectedTier] = useState("bike");

  const tiers = [
    { id: "bike", label: "Bike", desc: "Fastest & Affordable", price: "₹59", icon: "two_wheeler" },
    { id: "premium", label: "Premium", desc: "Top captains", price: "₹84", icon: "sports_motorsports" },
    { id: "scheduled", label: "Later", desc: "Book ahead", price: "₹69", icon: "schedule" },
  ];

  const quickChips = [
    { label: "Home (HSR Layout)", icon: "home" },
    { label: "Work (Embassy GolfLinks)", icon: "business" },
    { label: "Indiranagar 100ft Rd", icon: "history" },
  ];

  useEffect(() => {
    if (!navigator.geolocation || !window.isSecureContext) {
      setLocStatus("Location needs localhost or HTTPS.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter([pos.coords.latitude, pos.coords.longitude]);
        setPickup((p) => p || "Current Location");
        setLocStatus("Showing your current location.");
      },
      (err) =>
        setLocStatus(
          err.code === err.PERMISSION_DENIED
            ? "Location permission denied — enable it in browser site settings."
            : `Location error: ${err.message}`
        )
    );
  }, []);

  async function book() {
    setLoading(true);
    setFareMsg("");
    const res = await fetch("/api/rides", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pickupLat: 12.9716,
        pickupLng: 77.5946,
        pickupAddress: pickup || "Current Location",
        destinationLat: 12.9352,
        destinationLng: 77.6245,
        destinationAddress: destination || "Destination",
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      window.location.href = `/passenger/ride/${data.data.id}`;
    } else {
      setFareMsg(data.error?.message ?? "Could not book");
    }
  }

  return (
    <>
      {/* Fixed Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 px-4 flex items-center justify-between gap-2 max-w-[420px] mx-auto w-full">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-bold text-lg text-on-surface tracking-tight">papido</span>
            <div className="flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded-full min-w-0">
              <span className="material-symbols-outlined text-on-tertiary-container text-[16px] flex-shrink-0">location_on</span>
              <span className="text-[11px] font-semibold text-on-surface truncate max-w-[110px]">Koramangala, BLR</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <a href="/login" aria-label="Passenger Profile" className="w-11 h-11 rounded-full flex items-center justify-center hover:bg-surface-container-low transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-[18px]">person</span>
              </div>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col w-full max-w-[420px] mx-auto pt-16 pb-20 bg-surface min-h-screen">
        <div className="flex flex-col w-full relative">
          {/* Map Canvas */}
          <div className="relative w-full h-[340px] overflow-hidden bg-surface-container-high">
            <div className="w-full h-full relative">
              <Map key={center.join(",")} center={center} pickup={center} destination={[12.9352, 77.6245]} />
            </div>
            {/* Map Overlay */}
            <div className="absolute inset-0 bg-surface/10 pointer-events-none" />
            {/* Nearby Riders */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-[28%] left-[22%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 animate-pulse">
                <div className="bg-primary text-on-primary p-1.5 rounded-full shadow-sm flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px]">two_wheeler</span>
                </div>
                <span className="bg-surface-container-lowest text-on-surface text-[11px] font-semibold px-1.5 py-0.5 rounded shadow-sm">2 min</span>
              </div>
              <div className="absolute top-[42%] right-[20%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5">
                <div className="bg-primary text-on-primary p-1.5 rounded-full shadow-sm flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px]">two_wheeler</span>
                </div>
                <span className="bg-surface-container-lowest text-on-surface text-[11px] font-semibold px-1.5 py-0.5 rounded shadow-sm">1 min</span>
              </div>
              <div className="absolute top-[68%] left-[30%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5">
                <div className="bg-primary text-on-primary p-1.5 rounded-full shadow-sm flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px]">two_wheeler</span>
                </div>
                <span className="bg-surface-container-lowest text-on-surface text-[11px] font-semibold px-1.5 py-0.5 rounded shadow-sm">3 min</span>
              </div>
              {/* Pickup Beacon */}
              <div className="absolute top-[52%] left-[54%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="bg-primary-container text-surface-bright px-2.5 py-1 rounded shadow-md flex items-center gap-1.5 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-ping" />
                  <span className="text-[11px] font-semibold tracking-tight text-surface-bright">Sony World Signal, 80ft Rd</span>
                </div>
                <div className="relative flex items-center justify-center">
                  <span className="w-8 h-8 rounded-full bg-on-tertiary-container/20 absolute animate-ping" />
                  <div className="w-5 h-5 rounded-full bg-on-tertiary-container flex items-center justify-center shadow">
                    <span className="w-2 h-2 rounded-full bg-surface-container-lowest" />
                  </div>
                </div>
              </div>
            </div>
            {/* Map Controls */}
            <div className="absolute right-4 top-4 flex flex-col gap-2">
              <button aria-label="Recenter GPS Location" className="w-10 h-10 rounded-lg bg-surface-container-lowest text-on-surface flex items-center justify-center shadow-sm active:bg-surface-container-low transition-colors" type="button">
                <span className="material-symbols-outlined text-[20px]">my_location</span>
              </button>
              <button aria-label="Toggle Traffic Layer" className="w-10 h-10 rounded-lg bg-surface-container-lowest text-on-surface flex items-center justify-center shadow-sm active:bg-surface-container-low transition-colors" type="button">
                <span className="material-symbols-outlined text-[20px]">layers</span>
              </button>
            </div>
            {/* Status text */}
            <div className="absolute left-4 bottom-4 bg-surface-container-lowest/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-on-tertiary-container">bolt</span>
              <p className="text-[11px] font-semibold text-on-surface">{locStatus}</p>
            </div>
          </div>

          {/* Bottom Booking Sheet */}
          <div className="flex flex-col bg-surface-container-lowest rounded-t-xl -mt-3 shadow-md px-4 pt-3 pb-4 relative z-10">
            {/* Drag Pill */}
            <div className="w-10 h-1 rounded-full bg-surface-container-highest mx-auto mb-3" />

            {/* Waypoint Inputs */}
            <div className="bg-surface-container-low rounded-lg p-2 mb-3 flex flex-col gap-2 relative">
              {/* Pickup */}
              <div className="flex items-center gap-2 bg-surface-container-lowest rounded px-3 py-2.5 shadow-sm">
                <div className="flex flex-col items-center justify-center w-5">
                  <span className="w-2.5 h-2.5 rounded-full bg-on-tertiary-container" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-secondary uppercase tracking-wider">Pickup Spot</p>
                  <input
                    className="w-full bg-transparent text-[16px] font-semibold text-on-surface truncate focus:outline-none cursor-default"
                    readOnly
                    type="text"
                    value={pickup || "Sony World Signal, 100 Feet Rd"}
                  />
                </div>
                <button aria-label="Edit Pickup Location" className="text-secondary hover:text-on-surface p-1" type="button">
                  <span className="material-symbols-outlined text-[18px]">edit_location_alt</span>
                </button>
              </div>
              {/* Connector */}
              <div className="absolute left-[22px] top-[38px] bottom-[38px] w-0.5 bg-surface-container-highest pointer-events-none" />
              {/* Drop */}
              <div className="flex items-center gap-2 bg-surface-container-lowest rounded px-3 py-2.5 shadow-sm">
                <div className="flex flex-col items-center justify-center w-5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-error" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-secondary uppercase tracking-wider">Where to?</p>
                  <input
                    className="w-full bg-transparent text-[15px] text-on-surface placeholder:text-outline focus:outline-none"
                    placeholder="Search destination, metro, tech park..."
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>
                <button aria-label="Use Map Picker" className="text-secondary hover:text-on-surface p-1" type="button">
                  <span className="material-symbols-outlined text-[18px]">map</span>
                </button>
              </div>
            </div>

            {/* Quick Location Chips */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 mb-3 no-scrollbar">
              {quickChips.map((chip) => (
                <button
                  key={chip.label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-container-low text-on-surface hover:bg-surface-container transition-colors flex-shrink-0"
                  type="button"
                  onClick={() => setDestination(chip.label)}
                >
                  <span className="material-symbols-outlined text-[16px] text-secondary">{chip.icon}</span>
                  <span className="text-[12px] font-semibold">{chip.label}</span>
                </button>
              ))}
            </div>

            {/* Vehicle Tier Selection */}
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-[16px] font-semibold text-on-surface">Choose Vehicle Tier</h2>
              <span className="text-[11px] font-semibold text-on-tertiary-container bg-surface-container-low px-2 py-0.5 rounded">Guaranteed Fares</span>
            </div>
            <div aria-label="Select Ride Type" className="grid grid-cols-3 gap-1 mb-3" role="radiogroup">
              {tiers.map((tier) => (
                <button
                  key={tier.id}
                  aria-checked={selectedTier === tier.id}
                  role="radio"
                  type="button"
                  className={`flex flex-col items-start p-2.5 rounded-lg text-left shadow-sm transition-all relative overflow-hidden ${
                    selectedTier === tier.id
                      ? "bg-surface-container-low"
                      : "bg-surface-container-lowest"
                  }`}
                  onClick={() => setSelectedTier(tier.id)}
                >
                  {selectedTier === tier.id && (
                    <div className="absolute top-1.5 right-1.5">
                      <span className="material-symbols-outlined text-[18px] text-on-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                  )}
                  <div className={`w-8 h-8 rounded flex items-center justify-center mb-1.5 ${selectedTier === tier.id ? "bg-primary-container text-white" : "bg-surface-container text-on-surface"}`}>
                    <span className="material-symbols-outlined text-[20px]">{tier.icon}</span>
                  </div>
                  <p className="text-[16px] font-semibold text-on-surface leading-tight">{tier.label}</p>
                  <p className="text-[11px] font-semibold text-secondary truncate w-full">{tier.desc}</p>
                  <p className="text-[18px] font-bold text-on-surface mt-2">{tier.price}</p>
                </button>
              ))}
            </div>

            {/* Safety Banner */}
            <div className="bg-surface-container-low rounded-lg p-2 mb-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center flex-shrink-0 text-on-tertiary-container shadow-sm">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-on-surface">Helmets sanitized daily</p>
                <p className="text-[11px] font-semibold text-secondary truncate">Trip insured up to ₹5,00,000 under Papido Shield</p>
              </div>
              <span className="material-symbols-outlined text-[16px] text-secondary">chevron_right</span>
            </div>

            {/* Payment Switcher */}
            <div className="flex items-center justify-between px-1 mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-on-surface">account_balance_wallet</span>
                <span className="text-[12px] font-semibold text-on-surface">Papido Cash • ₹340</span>
              </div>
              <button className="text-[11px] font-semibold text-on-surface hover:underline" type="button">Change</button>
            </div>

            {/* Error Message */}
            {fareMsg && <p className="text-sm text-error mb-2 px-1">{fareMsg}</p>}

            {/* Book Button */}
            <button
              className="w-full h-12 rounded-lg bg-on-tertiary-container text-white flex items-center justify-center gap-2 text-[16px] font-semibold shadow-sm active:opacity-95 transition-all disabled:opacity-60"
              type="button"
              disabled={loading}
              onClick={book}
            >
              <span>{loading ? "Finding…" : "Find Bike Taxi"}</span>
              {!loading && <span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 z-50 bg-surface/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.04)]">
        <div className="flex justify-around items-center h-16 max-w-[420px] mx-auto px-1">
          <a aria-current="page" className="flex flex-col items-center justify-center min-w-[64px] min-h-[44px] gap-0.5 transition-colors text-primary" href="/passenger/home">
            <span className="material-symbols-outlined text-[22px]">two_wheeler</span>
            <span className="text-[11px] font-semibold tracking-tight">Book Ride</span>
          </a>
          <a className="flex flex-col items-center justify-center min-w-[64px] min-h-[44px] gap-0.5 text-on-surface-variant hover:text-on-surface transition-colors" href="/passenger/rides">
            <span className="material-symbols-outlined text-[22px]">history</span>
            <span className="text-[11px] font-semibold tracking-tight">Activity</span>
          </a>
          <a className="flex flex-col items-center justify-center min-w-[64px] min-h-[44px] gap-0.5 text-on-surface-variant hover:text-on-surface transition-colors" href="#">
            <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
            <span className="text-[11px] font-semibold tracking-tight">Wallet</span>
          </a>
          <a className="flex flex-col items-center justify-center min-w-[64px] min-h-[44px] gap-0.5 text-on-surface-variant hover:text-on-surface transition-colors" href="/login">
            <span className="material-symbols-outlined text-[22px]">person</span>
            <span className="text-[11px] font-semibold tracking-tight">Account</span>
          </a>
        </div>
      </nav>
    </>
  );
}
