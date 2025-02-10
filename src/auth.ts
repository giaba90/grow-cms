import NextAuth from "next-auth";
import { ZodError } from "zod";
import Credentials from "next-auth/providers/credentials";
// Your own logic for dealing with plaintext password strings; be careful!
//import { saltAndHashPassword } from "@/utils/password";
import { signInSchema } from "./app/lib/validation";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/app/prisma/client";
import bcrypt from "bcryptjs";
// Funzione per ottenere l'utente dal database
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
      authorize: async (credentials, request): Promise<User | null> => {
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
