/* import NextAuth from "next-auth";

import { ZodError } from "zod";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./app/lib/validation";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/app/prisma/client";
import bcrypt from "bcryptjs";
async function getUserFromDb(email: string) {
  try {
    const user = await prisma.users.findUnique({
      where: { email },
      select: { id: true, email: true, password: true },
    });
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}

export const { handlers, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials): Promise<User | null> => {
        try {
          let user = null;

          const { email, password } = await signInSchema.parseAsync(
            credentials
          );

          user = await getUserFromDb(email);
          if (!user) {
            console.log("User not found");
            return null;
          }

          if (!user.password) {
            console.log("Invalid password");
            return null;
          }
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) {
            console.log("Password mismatch");
            return null;
          }

          return {
            id: user.id,
            email: user.email ?? "",
            role: "ADMIN",
          };
        } catch (error) {
          if (error instanceof ZodError) {
            return null;
          }
          throw error;
        }
      },
    }),
  ],
});
 */
import NextAuth from "next-auth";
import { ZodError } from "zod";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "@/app/lib/validation";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/app/prisma/client";
import bcrypt from "bcryptjs";

// Definizione del tipo dell'utente
interface UserInterface {
  id: string;
  email: string;
  password?: string;
  role?: string;
  name?: string;
}

// Funzione per ottenere l'utente dal database
async function getUserFromDb(email: string): Promise<UserInterface | null> {
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

// Configurazione di NextAuth
export const { handlers, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials): Promise<UserInterface | null> => {
        try {
          // Parsing dei dati in ingresso tramite Zod
          const { email, password } = await signInSchema.parseAsync(
            credentials
          );

          // Recupera l'utente dal database
          const user = await getUserFromDb(email);

          if (!user) throw new Error("Utente non trovato");
          if (!user.password) throw new Error("Password non valida");

          // Confronto della password
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) throw new Error("Credenziali errate");

          // Restituzione dell'utente
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
    // Callback per la sessione
    async session({ session, token }) {
      if (session.user) {
        // Aggiungi 'role' alla sessione
        session.user.role = token.role;
      }
      return session;
    },

    // Callback per il JWT
    async jwt({ token, user }) {
      if (user) {
        // Aggiungi 'role' al token
        token.role = user.role;
      }
      return token;
    },
  },
});
