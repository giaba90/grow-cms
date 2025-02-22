/**
 * This module sets up authentication using NextAuth.
 *
 * It imports the NextAuth function from the "next-auth" package and the authentication options from the "auth.config" module.
 *
 * @module auth
 *
 * @see {@link https://next-auth.js.org/|NextAuth Documentation}
 *
 * @example
 * ```typescript
 * import { handlers, auth } from './auth';
 *
 * // Use handlers and auth as needed
 * ```
 *
 * @exports handlers - The handlers provided by NextAuth.
 * @exports auth - The authentication instance provided by NextAuth.
 */
import NextAuth from "next-auth";
import { authOptions } from "./auth.config";

export const { handlers, auth } = NextAuth(authOptions);
