import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { ok, fail } from "@/lib/api";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(6),
  role: z.enum(["PASSENGER", "RIDER"]),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return fail("VALIDATION_ERROR", "Invalid registration details", 422);
  const { name, email, phone, password, role } = parsed.data;
  const exists = await db.user.findFirst({ where: { OR: [{ email }, { phone }] } });
  if (exists) return fail("EMAIL_OR_PHONE_TAKEN", "Account already exists", 409);
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: {
      name,
      email,
      phone,
      passwordHash,
      role,
      ...(role === "PASSENGER"
        ? { passengerProfile: { create: { wallet: { create: {} } } } }
        : { riderProfile: { create: { status: "PENDING", wallet: { create: {} } } } }),
    },
  });
  return ok({ id: user.id }, "Account created", 201);
}
