import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const admin = await db.user.upsert({
  where: { email: "admin@papido.local" },
  update: {},
  create: {
    name: "Super Admin",
    email: "admin@papido.local",
    phone: "9000000000",
    passwordHash: await bcrypt.hash("admin123", 10),
    role: "SUPER_ADMIN",
  },
});

await db.fareConfig.upsert({
  where: { id: "default" },
  update: {},
  create: { id: "default", name: "default" },
}).catch(() => db.fareConfig.create({ data: { name: "default" } }));

console.log("Seeded:", admin.email, "/ admin123");
await db.$disconnect();
