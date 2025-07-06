// app/lib/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers"; // Per accedere alle intestazioni lato server

export async function createTaxonomy(data: TaxonomyData) {
    try {

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/taxonomy`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            cache: 'no-store', // Assicurati che la cache sia disabilitata per le mutazioni
            body: JSON.stringify(data),
        });

        const json = await res.json();

        if (!res.ok) {
            return { error: json.error || "Errore sconosciuto durante la creazione della tassonomia." };
        }

        revalidatePath("/dashboard/taxonomy");

        // Restituisci un oggetto di successo
        return { success: true, data: json }; // Puoi anche restituire i dati creati se l'API li restituisce
    } catch (err) {
        console.error("Errore nella Server Action createTaxonomy:", err);
        return { error: err instanceof Error ? err.message : "Si è verificato un errore inaspettato." };
    }
}
