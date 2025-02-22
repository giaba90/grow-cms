import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/app/prisma/client";
import bcrypt from "bcryptjs";
import { ZodError } from "zod";
import { signInSchema } from "@/app/lib/validation";

/**
 * Retrieves a user from the database based on the provided email.
 *
 * @param {string} email - The email of the user to retrieve.
 * @returns {Promise<{ id: string, email: string, password: string, role: string } | null>}
 * A promise that resolves to the user object if found, or null if not found or an error occurs.
 */
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

/**
 * Configuration options for NextAuth.
 *
 * @type {NextAuthConfig}
 *
 * @property {PrismaAdapter} adapter - The Prisma adapter for NextAuth.
 * @property {Object} session - Session configuration.
 * @property {string} session.strategy - The session strategy, set to "jwt".
 * @property {Array} providers - List of authentication providers.
 *
 * @property {Object} providers.Credentials - Credentials provider configuration.
 * @property {Object} providers.Credentials.credentials - Credentials fields.
 * @property {Object} providers.Credentials.credentials.email - Email field configuration.
 * @property {string} providers.Credentials.credentials.email.label - Label for the email field.
 * @property {string} providers.Credentials.credentials.email.type - Type of the email field.
 * @property {Object} providers.Credentials.credentials.password - Password field configuration.
 * @property {string} providers.Credentials.credentials.password.label - Label for the password field.
 * @property {string} providers.Credentials.credentials.password.type - Type of the password field.
 * @property {Function} providers.Credentials.authorize - Function to authorize user credentials.
 *
 * @property {Object} callbacks - Callback functions for NextAuth.
 * @property {Function} callbacks.session - Callback to handle session.
 * @property {Function} callbacks.jwt - Callback to handle JWT.
 */
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

          const passwordsMatch = await bcrypt.compareSync(
            password,
            user.password
          );
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
