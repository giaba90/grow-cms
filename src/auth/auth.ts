import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/app/prisma/client";
import bcrypt from "bcryptjs";

export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET,
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        disableSignUp: false,
        requireEmailVerification: false,
        minPasswordLength: 8,
        maxPasswordLength: 128,
        autoSignIn: false,
        password: {
            hash: async (password: string) => {
                const salt = await bcrypt.genSalt(10);
                return await bcrypt.hash(password, salt);
            },
            verify: async ({ hash, password }) => {
                return await bcrypt.compare(password, hash);
            }
        },
    },
    session: {
        modelName: "session",
        fields: {
            expiresAt: "expiresAt",
            token: "token",
            createdAt: "createdAt",
            updatedAt: "updatedAt",
            ipAddress: "ipAddress",
            userAgent: "userAgent",
            userId: "userId",
        },
        freshAge: 60 * 60,
    },
    advanced: {
        useSecureCookies: process.env.NODE_ENV === 'production',
        cookies: {
            session_token: {
                attributes: {
                    maxAge: 60 * 60 * 24 * 7,
                }
            },
            dont_remember: {
                attributes: {
                    maxAge: 60 * 60 * 24 * 30,
                }
            }
        }
    },
    plugins: [
        nextCookies(),
    ],
});