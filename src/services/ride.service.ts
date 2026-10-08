import { RideStatus } from "@prisma/client";
import { db } from "@/lib/db";

const TRANSITIONS: Record<RideStatus, RideStatus[]> = {
  REQUESTED: ["SEARCHING", "CANCELLED_BY_PASSENGER", "CANCELLED_BY_ADMIN"],
  SEARCHING: ["RIDER_ASSIGNED", "NO_RIDER_FOUND", "CANCELLED_BY_PASSENGER", "CANCELLED_BY_ADMIN"],
  RIDER_ASSIGNED: ["RIDER_ARRIVING", "RIDER_ARRIVED", "CANCELLED_BY_PASSENGER", "CANCELLED_BY_RIDER", "CANCELLED_BY_ADMIN"],
  RIDER_ARRIVING: ["RIDER_ARRIVED", "CANCELLED_BY_PASSENGER", "CANCELLED_BY_RIDER", "CANCELLED_BY_ADMIN"],
  RIDER_ARRIVED: ["RIDE_STARTED", "CANCELLED_BY_PASSENGER", "CANCELLED_BY_RIDER", "CANCELLED_BY_ADMIN"],
  RIDE_STARTED: ["RIDE_COMPLETED", "CANCELLED_BY_ADMIN", "DISPUTED"],
  RIDE_COMPLETED: ["PAYMENT_COMPLETED", "PAYMENT_FAILED", "DISPUTED"],
  PAYMENT_COMPLETED: ["RATING_COMPLETED", "DISPUTED"],
  RATING_COMPLETED: [],
  CANCELLED_BY_PASSENGER: [],
  CANCELLED_BY_RIDER: [],
  CANCELLED_BY_ADMIN: [],
  NO_RIDER_FOUND: [],
  PAYMENT_FAILED: ["DISPUTED"],
  DISPUTED: [],
};

export async function transition(
  rideId: string,
  to: RideStatus,
  meta?: Record<string, unknown>
) {
  const ride = await db.ride.findUnique({ where: { id: rideId } });
  if (!ride) throw new Error("RIDE_NOT_FOUND");
  if (!TRANSITIONS[ride.status].includes(to)) {
    throw new Error(`INVALID_TRANSITION: ${ride.status} -> ${to}`);
  }
  const updated = await db.ride.update({
    where: { id: rideId },
    data: {
      status: to,
      startedAt: to === "RIDE_STARTED" ? new Date() : ride.startedAt,
      completedAt: to === "RIDE_COMPLETED" ? new Date() : ride.completedAt,
    },
  });
  await db.rideEvent.create({
    data: { rideId, type: `status:${to}`, meta: meta as any },
  });

  // In-app notifications for both parties on meaningful changes
  const passenger = await db.passengerProfile.findUnique({
    where: { id: ride.passengerId },
  });
  const rider = ride.riderId
    ? await db.riderProfile.findUnique({ where: { id: ride.riderId } })
    : null;
  const messages: Record<string, [string, string]> = {
    RIDER_ASSIGNED: [passenger ? "Rider assigned" : "", "A rider is on the way to your pickup."],
    RIDER_ARRIVED: ["", "Your rider has arrived at the pickup point."],
    RIDE_STARTED: ["", "Your ride has started. Enjoy!"],
    RIDE_COMPLETED: ["", "Ride completed. Please review your fare."],
    CANCELLED_BY_RIDER: ["", "Your rider cancelled. We're finding another."],
    NO_RIDER_FOUND: ["", "No riders nearby right now. Try again shortly."],
  };
  const m = messages[to];
  if (m && passenger) {
    await db.notification.create({
      data: { userId: passenger.userId, title: m[0], body: m[1] },
    });
  }
  if (rider && to === "RIDER_ASSIGNED") {
    await db.notification.create({
      data: { userId: rider.userId, title: "New ride", body: "Head to the passenger pickup." },
    });
  }
  return updated;
}
