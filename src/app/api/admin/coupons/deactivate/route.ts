import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") return fail("FORBIDDEN", "Admin only", 403);
  const { code } = await req.json().catch(() => ({}));
  const coupon = await db.coupon.update({ where: { code }, data: { active: false } });
  return ok(coupon, "Coupon deactivated");
}
