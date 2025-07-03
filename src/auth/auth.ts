import { betterAuth } from "better-auth";
import prisma from "@/app/prisma/client";
//import { prismaAdapter } from "./prismaAdapter";
import { prismaAdapter } from "better-auth/adapters/prisma";
import bcrypt from "bcryptjs";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: {
        enabled: true,
        disableSignUp: false,
        requireEmailVerification: false,
        minPasswordLength: 8,
        maxPasswordLength: 128,
        autoSignIn: true,
        password: {
            hash: async (password: string) => {
                const salt = await bcrypt.genSalt(10);
                return await bcrypt.hash(password, salt);
            },
            verify: async ({ hash, password }) => {
                return await bcrypt.compare(password, hash);
            },
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
});
