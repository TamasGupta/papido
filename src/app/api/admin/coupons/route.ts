import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api";

const createSchema = z.object({
  code: z.string().min(3),
  discountType: z.enum(["FLAT", "PERCENT"]),
  value: z.number().positive(),
  maxDiscount: z.number().optional(),
  minAmount: z.number().default(0),
  validUntil: z.string().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") return fail("FORBIDDEN", "Admin only", 403);
  return ok(await db.coupon.findMany({ orderBy: { createdAt: "desc" } }));
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") return fail("FORBIDDEN", "Admin only", 403);
  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail("VALIDATION_ERROR", "Invalid coupon", 422);
  const coupon = await db.coupon.create({
    data: {
      ...parsed.data,
      validUntil: parsed.data.validUntil ? new Date(parsed.data.validUntil) : null,
    },
  });
  return ok(coupon, "Coupon created", 201);
}
