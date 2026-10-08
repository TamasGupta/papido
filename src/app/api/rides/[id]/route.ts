import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api";
import { transition } from "@/services/ride.service";
import { RideStatus } from "@prisma/client";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return fail("UNAUTHORIZED", "Sign in required", 401);
  const { id } = await params;
  const ride = await db.ride.findUnique({
    where: { id },
    include: { events: { orderBy: { createdAt: "asc" } } },
  });
  if (!ride) return fail("RIDE_NOT_FOUND", "Ride could not be found", 404);
  return ok(ride);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return fail("UNAUTHORIZED", "Sign in required", 401);
  const { id } = await params;
  const { action, pin } = await req.json().catch(() => ({}));
  const map: Record<string, RideStatus> = {
    cancel: "CANCELLED_BY_PASSENGER",
    accept: "RIDER_ASSIGNED",
    arrive: "RIDER_ARRIVED",
    start: "RIDE_STARTED",
    complete: "RIDE_COMPLETED",
  };
  const to = map[action];
  if (!to) return fail("BAD_ACTION", "Unknown action", 400);

  const ride = await db.ride.findUnique({ where: { id } });
  if (!ride) return fail("RIDE_NOT_FOUND", "Ride not found", 404);

  if (action === "accept") {
    if ((session.user as any).role !== "RIDER") return fail("FORBIDDEN", "Rider only", 403);
    const rider = await db.riderProfile.findUnique({ where: { userId: (session.user as any).id } });
    if (!rider || rider.status !== "APPROVED") return fail("NOT_ELIGIBLE", "Rider not verified", 403);
    await db.ride.update({ where: { id }, data: { riderId: rider.id } });
  }
  if (action === "start" && pin !== ride.pin) {
    return fail("BAD_PIN", "Incorrect ride PIN", 403);
  }
  if (action === "complete") {
    await db.ride.update({
      where: { id },
      data: { finalFare: ride.finalFare ?? ride.estimatedFare, actualDistance: ride.actualDistance ?? ride.estimatedDistance },
    });
  }
  try {
    const updated = await transition(id, to);
    return ok(updated, `Ride ${action} succeeded`);
  } catch (e: any) {
    return fail("TRANSITION_FAILED", e.message, 409);
  }
}
