export interface FareConfigInput {
  baseFare: number;
  perKm: number;
  perMinute: number;
  minFare: number;
  platformFee: number;
  surgeMultiplier: number;
  discount?: number;
}

export function estimateFare(
  distanceKm: number,
  durationMin: number,
  cfg: FareConfigInput
): number {
  const raw =
    cfg.baseFare +
    distanceKm * cfg.perKm +
    durationMin * cfg.perMinute +
    cfg.platformFee;
  const surged = raw * cfg.surgeMultiplier;
  const discounted = Math.max(0, surged - (cfg.discount ?? 0));
  return Math.max(cfg.minFare, Math.round(discounted));
}

/** Haversine distance in km */
export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
