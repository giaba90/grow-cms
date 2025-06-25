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
          const { email, password } = await signInSchema.parseAsync(
            credentials
          );

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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // 
        // token.role = user.role;
        token.exp = Math.floor(Date.now() / 1000) + 60 * 60;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token?.id) {
        session.user.id = token.id as string;
      }
      session.expires = new Date(token.exp! * 1000) as Date & string;
      return session;
    },
  }
  ,
};
