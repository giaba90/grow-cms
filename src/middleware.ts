import NextAuth from "next-auth";
import { authOptions } from "./auth.config";
import { APP_PATHS } from "./app/lib/constants/paths";

const { auth } = NextAuth(authOptions);
const privateRoutes: string[] = Object.values(APP_PATHS.dashboard).map(String); // Private routes
const authRoutes: string[] = Object.values(APP_PATHS.auth).map(String); // Auth routes
// Middleware to protect private routes
export default auth(async function middleware(req) {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;
  const isPrivateRoute = privateRoutes.includes(nextUrl.pathname); // Check if the current URL is a private route
  const isAuthRoute = authRoutes.includes(nextUrl.pathname); // Check if the current URL is a auth route

  if (isLoggedIn && isAuthRoute) {
    return Response.redirect(new URL(APP_PATHS.dashboard.root, nextUrl));
  }

  if (!isLoggedIn && isAuthRoute) return;

  /* If the user is not logged in and is trying to access a private route, redirect the user to the login page. */
  if (!isLoggedIn && isPrivateRoute) {
    return Response.redirect(new URL(APP_PATHS.auth.login, nextUrl));
  }
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
