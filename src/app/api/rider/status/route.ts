import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api";

const schema = z.object({
  isOnline: z.boolean(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "RIDER")
    return fail("FORBIDDEN", "Rider only", 403);
  const rider = await db.riderProfile.findUnique({ where: { userId: (session.user as any).id } });
  if (!rider) return fail("NO_PROFILE", "Complete onboarding first", 403);
  if (rider.status !== "APPROVED") return fail("NOT_VERIFIED", "Account not approved yet", 403);
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail("VALIDATION_ERROR", "Invalid payload", 422);
  const updated = await db.riderProfile.update({
    where: { id: rider.id },
    data: { isOnline: parsed.data.isOnline, currentLat: parsed.data.lat, currentLng: parsed.data.lng },
  });
  return ok({ isOnline: updated.isOnline }, parsed.data.isOnline ? "You are online" : "You are offline");
}
