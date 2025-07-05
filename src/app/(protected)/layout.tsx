import { auth } from "@/auth/auth"; // Importa la tua istanza di better-auth
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

// Questo layout proteggerà tutte le route all'interno del gruppo (protected)
export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Ottieni l'oggetto ReadonlyHeaders dalla richiesta
    const requestHeaders = await headers();

    // Crea un nuovo oggetto Headers standard per la compatibilità con better-auth
    const compatibleHeaders = new Headers(requestHeaders);

    // Verifica la sessione dell'utente
    const session = await auth.api.getSession({
        headers: compatibleHeaders,
    });

    // Se l'utente non è autenticato, reindirizza alla pagina di login
    if (!session) {
        // Puoi aggiungere un parametro callbackUrl per reindirizzare l'utente
        // alla pagina originale dopo il login, se necessario.
        const loginUrl = new URL('/login', requestHeaders.get('x-url') || 'http://localhost:3000');
        // x-url è un header non standard che Next.js può aggiungere per l'URL originale
        // o puoi costruirlo in base a request.nextUrl.pathname nel middleware se lo riattivi
        // Per semplicità qui, usiamo un fallback.
        redirect(loginUrl.toString());
    }

    // Se la sessione esiste, renderizza i children (le pagine protette)
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Qui puoi aggiungere elementi comuni a tutte le pagine protette,
          come una sidebar di navigazione, un header, un footer, ecc. */}
            <main>
                {children} {/* Questo è dove verranno renderizzate le tue pagine protette */}
            </main>
        </div>
    );
}
