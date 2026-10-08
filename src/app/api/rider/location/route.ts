import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api";

const schema = z.object({ lat: z.number(), lng: z.number() });

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "RIDER")
    return fail("FORBIDDEN", "Rider only", 403);
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail("VALIDATION_ERROR", "Invalid coords", 422);
  await db.riderProfile.update({
    where: { userId: (session.user as any).id },
    data: { currentLat: parsed.data.lat, currentLng: parsed.data.lng },
  });
  return ok({}, "Location updated");
}
