import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/app/prisma/client";
import bcrypt from "bcryptjs";
import { ZodError } from "zod";
import { signInSchema } from "@/app/lib/validation";

// Extend the Session type to include id on user
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
    };
  }
}

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

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // Durata della sessione (1 ora)
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = await signInSchema.parseAsync(credentials);

          const user = await getUserFromDb(email);
          if (!user) throw new Error("Utente non trovato");
          if (!user.password) throw new Error("Password non valida");

          const passwordsMatch = bcrypt.compareSync(password, user.password);
          if (!passwordsMatch) throw new Error("Credenziali errate");

          return {
            id: String(user.id),
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
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id;
        // token.role = user.role; // Se vuoi aggiungere il ruolo nel token
        token.exp = Math.floor(Date.now() / 1000) + 60 * 60;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token?.id) {
        session.user.id = token.id as string;
      }
      // session.expires deve essere stringa ISO, non Date oggetto
      session.expires = new Date(Number(token.exp) * 1000).toISOString();
      return session;
    },
  },
};
