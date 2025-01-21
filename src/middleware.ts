import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./app/lib/session";
import { cookies } from "next/headers";
import { match } from "path-to-regexp";

// Configurazione centralizzata delle route
const routes = {
  protected: ["/dashboard"],
  public: ["/login", "/signup", "/"],
};

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isProtectedRoute = routes.protected.some((route) => match(route)(path));
  const isPublicRoute = routes.public.some((route) => match(route)(path));

  try {
    // Recupero e decrittazione del cookie di sessione
    const sessionCookie = (await cookies()).get("session")?.value;
    const session = sessionCookie ? await decrypt(sessionCookie) : null;

    if (isProtectedRoute && !session?.userId) {
      // Reindirizza alla pagina di login se l'utente non è autenticato
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    if (isPublicRoute && session?.userId && !path.startsWith("/dashboard")) {
      // Reindirizza alla dashboard se l'utente è già autenticato
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
  } catch (error) {
    console.error("Errore nel middleware:", error);
    return NextResponse.redirect(new URL("/error", req.nextUrl));
  }

  // Procedi con la richiesta
  return NextResponse.next();
}
