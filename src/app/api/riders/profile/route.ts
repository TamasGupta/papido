import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api";

const schema = z.object({
  dob: z.string(),
  gender: z.string(),
  address: z.string().min(3),
  licenceNumber: z.string().min(3),
  licenceExpiry: z.string(),
  registration: z.string().min(3),
  model: z.string(),
  manufacturer: z.string(),
  color: z.string(),
  bankHolder: z.string(),
  bankAccount: z.string(),
  ifsc: z.string(),
  upiId: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "RIDER")
    return fail("FORBIDDEN", "Rider only", 403);
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail("VALIDATION_ERROR", "All fields required", 422);
  const d = parsed.data;
  const rider = await db.riderProfile.update({
    where: { userId: (session.user as any).id },
    data: {
      dob: new Date(d.dob),
      gender: d.gender,
      address: d.address,
      licenceNumber: d.licenceNumber,
      licenceExpiry: new Date(d.licenceExpiry),
      bankHolder: d.bankHolder,
      bankAccount: d.bankAccount,
      ifsc: d.ifsc,
      upiId: d.upiId,
      status: "UNDER_REVIEW",
      vehicle: {
        upsert: {
          create: { registration: d.registration, model: d.model, manufacturer: d.manufacturer, color: d.color },
          update: { registration: d.registration, model: d.model, manufacturer: d.manufacturer, color: d.color },
        },
      },
    },
  });
  return ok(rider, "Profile submitted for verification");
}
