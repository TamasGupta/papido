import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api";
import { estimateFare, distanceKm } from "@/lib/pricing/fare";

const createSchema = z.object({
  pickupLat: z.number(),
  pickupLng: z.number(),
  pickupAddress: z.string().min(3),
  destinationLat: z.number(),
  destinationLng: z.number(),
  destinationAddress: z.string().min(3),
  rideType: z.string().default("BIKE"),
  paymentMethod: z.enum(["UPI", "CARD", "WALLET", "CASH"]).default("CASH"),
  durationMin: z.number().default(20),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return fail("UNAUTHORIZED", "Sign in required", 401);
  const passenger = await db.passengerProfile.findUnique({
    where: { userId: (session.user as any).id },
  });
  if (!passenger) return fail("NO_PASSENGER_PROFILE", "Passenger profile missing", 403);
  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail("VALIDATION_ERROR", "Invalid ride details", 422);
  const d = parsed.data;
  const km = distanceKm(
    { lat: d.pickupLat, lng: d.pickupLng },
    { lat: d.destinationLat, lng: d.destinationLng }
  );
  const fareConfig = (await db.fareConfig.findFirst()) ?? {
    baseFare: 30, perKm: 8, perMinute: 2, minFare: 40, platformFee: 5, surgeMultiplier: 1,
  };
  const fare = estimateFare(km, d.durationMin, { ...fareConfig, discount: 0 });
  const ride = await db.ride.create({
    data: {
      passengerId: passenger.id,
      pickupLat: d.pickupLat,
      pickupLng: d.pickupLng,
      pickupAddress: d.pickupAddress,
      destinationLat: d.destinationLat,
      destinationLng: d.destinationLng,
      destinationAddress: d.destinationAddress,
      rideType: d.rideType,
      paymentMethod: d.paymentMethod,
      estimatedDistance: Math.round(km * 10) / 10,
      estimatedFare: fare,
      status: "SEARCHING",
      pin: String(Math.floor(1000 + Math.random() * 9000)),
      events: { create: { type: "status:SEARCHING" } },
    },
  });
  return ok(ride, "Ride created successfully", 201);
}

export async function GET() {
  const session = await auth();
  if (!session?.user) return fail("UNAUTHORIZED", "Sign in required", 401);
  const role = (session.user as any).role;
  const rides = await db.ride.findMany({
    where: role === "PASSENGER"
      ? { passenger: { userId: (session.user as any).id } }
      : role === "RIDER"
        ? { rider: { userId: (session.user as any).id } }
        : undefined,
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return ok(rides);
}
