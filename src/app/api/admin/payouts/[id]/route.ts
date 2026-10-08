import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api";

const schema = z.object({ status: z.enum(["COMPLETED", "FAILED", "PROCESSING"]) });

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") return fail("FORBIDDEN", "Admin only", 403);
  const { id } = await params;
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail("VALIDATION_ERROR", "Invalid status", 422);
  const payout = await db.payout.update({ where: { id }, data: { status: parsed.data.status } });
  await db.auditLog.create({
    data: { adminId: (session.user as any).id, action: `PAYOUT_${parsed.data.status}`, target: id },
  });
  return ok(payout, "Payout updated");
}
