

import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/app/prisma/client";
import bcrypt from "bcryptjs";
import { signInSchema } from "@/app/lib/validation";
import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role?: string | null;
  }
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
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt", maxAge: 60 * 60 },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { email, password } = await signInSchema.parseAsync(credentials);
        const user = await prisma.users.findUnique({
          where: { email },
          select: { id: true, email: true, password: true, role: true },
        });
        if (!user || !user.password) throw new Error("Invalid credentials");
        const isValid = bcrypt.compareSync(password, user.password);
        if (!isValid) throw new Error("Invalid credentials");

        return { id: String(user.id), email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token?.id) session.user.id = token.id as string;
      return session;
    },
  },
  pages: { signIn: "/login" },
};
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