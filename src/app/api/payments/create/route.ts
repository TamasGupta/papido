import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api";
import { z } from "zod";

const schema = z.object({
  rideId: z.string(),
  method: z.enum(["UPI", "CARD", "WALLET", "CASH"]),
});

// Never trust the client for success — create a PENDING payment; a real
// integration would verify via webhook before marking SUCCESS.
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return fail("UNAUTHORIZED", "Sign in required", 401);
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail("VALIDATION_ERROR", "Invalid payment details", 422);
  const ride = await db.ride.findUnique({ where: { id: parsed.data.rideId } });
  if (!ride) return fail("RIDE_NOT_FOUND", "Ride not found", 404);
  const payment = await db.payment.upsert({
    where: { rideId: ride.id },
    update: { method: parsed.data.method, status: "PENDING" },
    create: { rideId: ride.id, amount: ride.finalFare ?? ride.estimatedFare ?? 0, method: parsed.data.method, status: "PENDING" },
  });
  return ok(payment, "Payment initiated", 201);
}
