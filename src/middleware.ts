import { withAuth } from "next-auth/middleware";
import { APP_PATHS } from "./app/lib/constants/paths";

const privateRoutes = Object.values(APP_PATHS.dashboard).map(String);
const authRoutes = Object.values(APP_PATHS.auth).map(String);

export default withAuth(
  function middleware(req) {
    const isLoggedIn = !!req.nextauth.token;
    const { pathname } = req.nextUrl;

    const isPrivateRoute = privateRoutes.includes(pathname);
    const isAuthRoute = authRoutes.includes(pathname);

    if (isLoggedIn && isAuthRoute) {
      return Response.redirect(
        new URL(APP_PATHS.dashboard.root, req.url)
      );
    }

    if (!isLoggedIn && isPrivateRoute) {
      return Response.redirect(
        new URL(APP_PATHS.auth.login, req.url)
      );
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // true se autenticato
    },
  }
);

// Matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
