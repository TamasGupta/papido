import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN")
    return fail("FORBIDDEN", "Admin only", 403);
  const { id } = await params;
  const rider = await db.riderProfile.update({ where: { id }, data: { status: "APPROVED" } });
  await db.auditLog.create({
    data: { adminId: (session.user as any).id, action: "APPROVED_RIDER", target: id },
  });
  return ok(rider, "Rider approved");
}
