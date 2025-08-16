import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: typeof window !== 'undefined' ? window.location.origin : process.env.NEXTAUTH_URL!
});

export const { signOut, signIn, signUp, useSession } = authClient;