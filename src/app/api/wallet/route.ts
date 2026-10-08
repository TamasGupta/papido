import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api";

export async function GET() {
  const session = await auth();
  if (!session?.user) return fail("UNAUTHORIZED", "Sign in required", 401);
  const userId = (session.user as any).id;
  const wallet = await db.wallet.findFirst({
    where: { OR: [{ passenger: { userId } }, { rider: { userId } }] },
    include: { transactions: { orderBy: { createdAt: "desc" }, take: 50 } },
  });
  if (!wallet) return fail("WALLET_NOT_FOUND", "Wallet missing", 404);
  return ok(wallet);
}
