# Better Auth Project Guidelines

Questo progetto utilizza **Better Auth** per tutta l'autenticazione e la gestione degli utenti. Better Auth è una soluzione agnostica al framework e self-hosted che consente il controllo completo sui flussi di autenticazione e mantiene i dati degli utenti all'interno del nostro database, evitando dipendenze da servizi di terze parti.

---

## Funzionalità di Autenticazione Principali

Better Auth fornisce supporto integrato per:
* **Email e Password** per l'autenticazione standard.
* **Provider Sociali** (es. Google, GitHub, Apple) per un accesso facilitato.

È estendibile tramite un sistema di plugin per funzionalità aggiuntive come nome utente, magic link e passkey.

---

## Configurazione Lato Server (`auth.ts`)

L'istanza principale del server Better Auth è configurata nel file `auth.ts` (o `src/lib/auth.ts`, ecc.) utilizzando la funzione `betterAuth()`.

**Opzioni di Configurazione Chiave:**
* `emailAndPassword: { enabled: true, autoSignIn: false }`: Abilita l'autenticazione via email e password e controlla il login automatico dopo la registrazione.
* `socialProviders: { github: { clientId: process.env.GITHUB_CLIENT_ID!, clientSecret: process.env.GITHUB_CLIENT_SECRET! } }`: Configura l'integrazione con i provider sociali.
* `database:`: Accetta istanze Kysely (SQLite, Postgres, MySQL) o adapter per ORM come Prisma, Drizzle e MongoDB.
* `plugins:`: Un array per abilitare funzionalità aggiuntive (es. `twoFactor()`).

```ts
// Esempio: lib/auth.ts
import { betterAuth } from "better-auth";
import { twoFactor } from "better-auth/plugins"; // Includere se usato nel progetto

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
        autoSignIn: false // Impostato a 'true' di default
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }
    },
    database: { /* ... configurazione del database ... */ },
    plugins: [
        twoFactor() // Se l'autenticazione a due fattori è abilitata
    ]
});