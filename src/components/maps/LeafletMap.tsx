"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function LeafletMap({
  center,
  pickup,
  destination,
}: {
  center: [number, number];
  pickup?: [number, number];
  destination?: [number, number];
}) {
  return (
    <MapContainer center={center} zoom={13} className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pickup && (
        <Marker position={pickup} icon={icon}>
          <Popup>Pickup</Popup>
        </Marker>
      )}
      {destination && (
        <Marker position={destination} icon={icon}>
          <Popup>Destination</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
