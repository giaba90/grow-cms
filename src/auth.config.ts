import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/app/prisma/client";
import bcrypt from "bcryptjs";
import { ZodError } from "zod";
import { signInSchema } from "@/app/lib/validation";

async function getUserFromDb(email: string) {
  try {
    const user = await prisma.users.findUnique({
      where: { email },
      select: { id: true, email: true, password: true, role: true },
    });
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = await signInSchema.parseAsync(
            credentials
          );

          const user = await getUserFromDb(email);
          if (!user) throw new Error("Utente non trovato");
          if (!user.password) throw new Error("Password non valida");

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) throw new Error("Credenziali errate");

          return {
            id: user.id,
            email: user.email ?? "",
            role: user.role,
          };
        } catch (error) {
          if (error instanceof ZodError) return null;
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
  },
};
