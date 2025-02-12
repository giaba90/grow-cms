import NextAuth from "next-auth";
import { authOptions } from "./auth.config";
import { APP_PATHS } from "./app/lib/constants/paths";

const { auth } = NextAuth(authOptions);
const privateRoutes: string[] = Object.values(APP_PATHS.dashboard).map(String);
const authRoutes: string[] = Object.values(APP_PATHS.auth).map(String);
export default auth(async function middleware(req) {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;
  const isPrivateRoute = privateRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isPrivateRoute && (!isLoggedIn || isAuthRoute)) {
    return Response.redirect(new URL(APP_PATHS.auth.login, nextUrl));
  }

  if (isPrivateRoute && isLoggedIn) {
    return Response.redirect(new URL(APP_PATHS.dashboard.root, nextUrl));
  }
  console.log(nextUrl.pathname);
  if (isPrivateRoute && !isLoggedIn) {
    return Response.redirect(new URL(APP_PATHS.auth.login, nextUrl));
  }

  if (isAuthRoute && !isLoggedIn) return;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
