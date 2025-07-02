// auth.ts
import NextAuth from "next-auth";
import { authOptions } from "./auth.config";

const authHandler = NextAuth(authOptions);

export const handlers = {
    GET: authHandler,
    POST: authHandler,
};
export { authHandler as auth };