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
  const { action } = await req.json().catch(() => ({}));
  const map: Record<string, RideStatus> = {
    cancel: "CANCELLED_BY_PASSENGER",
    accept: "RIDER_ASSIGNED",
    arrive: "RIDER_ARRIVED",
    start: "RIDE_STARTED",
    complete: "RIDE_COMPLETED",
  };
  const to = map[action];
  if (!to) return fail("BAD_ACTION", "Unknown action", 400);
  try {
    const ride = await transition(id, to);
    return ok(ride, `Ride ${action} succeeded`);
  } catch (e: any) {
    return fail("TRANSITION_FAILED", e.message, 409);
  }
}
