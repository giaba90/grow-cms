// src/auth/auth.ts
import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export const authConfig = {
    adapter: PrismaAdapter(prisma),
    session: {
        modelName: 'session',
        fields: {
            expiresAt: 'expiresAt',
            token: 'token',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
            ipAddress: 'ipAddress',
            userAgent: 'userAgent',
            userId: 'userId',
        },
        freshAge: 60 * 60, // esempio 1h
    },
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                })

                if (!user || !user.password) return null

                const valid = await bcrypt.compare(credentials.password, user.password)
                if (!valid) return null

                return user
            },
        }),
    ],
    callbacks: {
        async session({ session, user }: { session: any; user: any }) {
            if (session.user) {
                session.user.id = user.id
            }
            return session
        },
    },
}
