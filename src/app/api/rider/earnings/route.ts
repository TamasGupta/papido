import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api";

export async function GET() {
  const session = await auth();
  if (!session?.user) return fail("UNAUTHORIZED", "Sign in required", 401);
  const rider = await db.riderProfile.findUnique({
    where: { userId: (session.user as any).id },
  });
  if (!rider) return fail("FORBIDDEN", "Rider only", 403);
  const completed = await db.ride.count({ where: { riderId: rider.id, status: "RIDE_COMPLETED" } });
  const rides = await db.ride.findMany({
    where: { riderId: rider.id, status: "RIDE_COMPLETED" },
    select: { finalFare: true, estimatedFare: true },
  });
  const gross = rides.reduce((s, r) => s + (r.finalFare ?? r.estimatedFare ?? 0), 0);
  const commission = Math.round(gross * 0.2);
  return ok({ completedRides: completed, gross, commission, net: gross - commission });
}
