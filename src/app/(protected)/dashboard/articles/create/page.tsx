import { auth } from "@/auth/auth"; // Importa la tua istanza di better-auth
import { headers } from "next/headers"; // Per accedere alle intestazioni della richiesta
import { redirect } from "next/navigation"; // Per il reindirizzamento
import ArticleForm from "./ArticleForm";

export default async function CreateArticlePage() {
  // Ottieni l'oggetto ReadonlyHeaders dalla richiesta corrente
  const requestHeaders = headers();

  // Crea un nuovo oggetto Headers standard per la compatibilità con better-auth
  const compatibleHeaders = new Headers(await requestHeaders);

  // Verifica la sessione dell'utente. Se arriviamo qui, il layout l'ha già verificata,
  // ma la ri-verifica qui per ottenere i dati della sessione per questa pagina.
  const session = await auth.api.getSession({
    headers: compatibleHeaders,
  });

  // Se, per qualche motivo, la sessione non è presente (dovrebbe essere gestito dal layout),
  // reindirizza al login per maggiore robustezza.
  if (!session || !session.user || !session.user.id) {
    redirect('/login');
  }
  return (
    <ArticleForm
      userId={session.user.id}
      onSubmit={async (formValues) => {
        "use server";
        await fetch("/api/dashboard/articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formValues),
        });
      }}
    />
  );
}
