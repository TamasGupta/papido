import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api";

const schema = z.object({
  baseFare: z.number().nonnegative(),
  perKm: z.number().nonnegative(),
  perMinute: z.number().nonnegative(),
  minFare: z.number().nonnegative(),
  platformFee: z.number().nonnegative(),
  cancellationFee: z.number().nonnegative(),
  commissionPct: z.number().min(0).max(100),
  surgeMultiplier: z.number().min(1).max(5),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") return fail("FORBIDDEN", "Admin only", 403);
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail("VALIDATION_ERROR", "Invalid fare config", 422);
  const existing = await db.fareConfig.findFirst();
  const config = existing
    ? await db.fareConfig.update({ where: { id: existing.id }, data: parsed.data })
    : await db.fareConfig.create({ data: { name: "default", ...parsed.data } });
  await db.auditLog.create({
    data: { adminId: (session.user as any).id, action: "UPDATED_FARE_CONFIG", target: config.id },
  });
  return ok(config, "Fare configuration updated");
}
