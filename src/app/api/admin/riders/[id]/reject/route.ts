import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN")
    return fail("FORBIDDEN", "Admin only", 403);
  const { id } = await params;
  const { reason } = await req.json().catch(() => ({}));
  const rider = await db.riderProfile.update({ where: { id }, data: { status: "REJECTED" } });
  await db.auditLog.create({
    data: { adminId: (session.user as any).id, action: "REJECTED_RIDER", target: id, meta: { reason } },
  });
  return ok(rider, "Rider rejected");
}
