import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api";

export async function GET() {
  const session = await auth();
  if (!session?.user) return fail("UNAUTHORIZED", "Sign in required", 401);
  const notifications = await db.notification.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return ok(notifications);
}

export async function POST() {
  const session = await auth();
  if (!session?.user) return fail("UNAUTHORIZED", "Sign in required", 401);
  await db.notification.updateMany({
    where: { userId: (session.user as any).id, read: false },
    data: { read: true },
  });
  return ok({}, "Marked all as read");
}
