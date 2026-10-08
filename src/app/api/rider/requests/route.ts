import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "RIDER")
    return fail("FORBIDDEN", "Rider only", 403);
  const rider = await db.riderProfile.findUnique({ where: { userId: (session.user as any).id } });
  if (!rider || rider.status !== "APPROVED" || !rider.isOnline)
    return fail("NOT_ELIGIBLE", "You must be approved and online", 403);
  const rides = await db.ride.findMany({
    where: { status: "SEARCHING", riderId: null },
    orderBy: { requestedAt: "asc" },
    take: 20,
  });
  return ok(rides);
}
