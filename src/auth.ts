import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import prisma from "@/app/lib/prisma/client";
import bcrypt from "bcrypt";

// Funzione per ottenere l'utente dal database
async function getUser(email: string) {
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

// Configurazione di NextAuth
export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validazione dei dati ricevuti
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          console.log("Invalid credentials format");
          return null;
        }

        const { email, password } = parsedCredentials.data;

        // Cerca l'utente nel database
        const user = await getUser(email);
        if (!user) {
          console.log("User not found");
          return null;
        }

        // Verifica della password
        if (!user.password) {
          console.log("Invalid password");
          return null;
        }
        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) {
          console.log("Invalid password");
          return null;
        }

        // Ritorna l'utente (senza password)
        return { id: user.id, email: user.email };
      },
    }),
  ],
  session: {
    strategy: "jwt", // Puoi configurare "database" se vuoi salvare la sessione nel DB
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email ?? "",
          emailVerified: null,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin", // Percorso personalizzato per il login
  },
});
