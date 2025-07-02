// middleware.ts
import { withAuth } from "next-auth/middleware";
import { APP_PATHS } from "./app/lib/constants/paths";

const privateRoutes = Object.values(APP_PATHS.dashboard) as string[];
const authRoutes = Object.values(APP_PATHS.auth) as string[];

export default withAuth(
  function middleware(req) {
    const isLoggedIn = !!req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    const isPrivateRoute = privateRoutes.includes(pathname);
    const isAuthRoute = authRoutes.includes(pathname);

    // ✅ Se loggato e in pagina login/signup, vai alla dashboard
    if (isLoggedIn && isAuthRoute) {
      return Response.redirect(new URL(APP_PATHS.dashboard.root, req.url));
    }

    // ✅ Se non loggato e in pagina privata, vai al login
    if (!isLoggedIn && isPrivateRoute) {
      return Response.redirect(new URL(APP_PATHS.auth.login, req.url));
    }

    // ✅ Altrimenti prosegui normalmente
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
