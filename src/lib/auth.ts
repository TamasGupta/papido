import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (creds) => {
        const parsed = credentialsSchema.safeParse(creds);
        if (!parsed.success) return null;
        const user = await db.user.findUnique({
          where: { email: parsed.data.email },
        });
        if (!user || user.status !== "ACTIVE") return null;
        const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!ok) return null;
        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) (token as any).role = (user as any).role;
      return token;
    },
    session({ session, token }) {
      (session.user as any).id = token.sub;
      (session.user as any).role = (token as any).role;
      return session;
    },
  },
});
