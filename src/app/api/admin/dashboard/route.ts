import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN")
    return fail("FORBIDDEN", "Admin only", 403);
  const [passengers, riders, pendingVerification, onlineRiders, totalRides, completed, cancelled] =
    await Promise.all([
      db.user.count({ where: { role: "PASSENGER" } }),
      db.user.count({ where: { role: "RIDER" } }),
      db.riderProfile.count({ where: { status: "PENDING" } }),
      db.riderProfile.count({ where: { isOnline: true } }),
      db.ride.count(),
      db.ride.count({ where: { status: "RIDE_COMPLETED" } }),
      db.ride.count({ where: { status: { in: ["CANCELLED_BY_PASSENGER", "CANCELLED_BY_RIDER", "CANCELLED_BY_ADMIN"] } } }),
    ]);
  return ok({ passengers, riders, pendingVerification, onlineRiders, totalRides, completed, cancelled });
}
