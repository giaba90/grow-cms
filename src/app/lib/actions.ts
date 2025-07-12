// app/lib/actions.ts
"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/app/prisma/client";
import { buildTaxonomyCreateMany } from "@/app/utils/utils";

type ActionResponse<T = undefined> = {
    success: boolean;
    error?: string;
    data?: T;
};

/**
 * Server Action per creare una nuova tassonomia
 * @param data I dati della tassonomia da creare
 * @returns Un oggetto con 'success: true' in caso di successo o 'error: string' in caso di fallimento.
 */
export async function createTaxonomy(data: TaxonomyData) {
    try {

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/taxonomy`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            cache: 'no-store',
            body: JSON.stringify(data),
        });

        const json = await res.json();

        if (!res.ok) {
            return { error: json.error || "Errore sconosciuto durante la creazione della tassonomia." };
        }

        revalidatePath("/dashboard/taxonomy");
        return { success: true, data: json };
    } catch (err) {
        console.error("Errore nell'azione del server createTaxonomy:", err);
        return { error: err instanceof Error ? err.message : "Si è verificato un errore imprevisto durante la creazione." };
    }
}

/** 
 * Server Action per eliminare una tassonomia
 * @param id ID della tassonomia da eliminare
 * @returns Un oggetto con 'success: true' in caso di successo o 'error: string' in caso di fallimento.
 */
export async function deleteTaxonomy(id: string | number) {
    try {
        const apiUrl = process.env.NODE_ENV === 'development'
            ? `/api/dashboard/taxonomy/${id}`
            : `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/taxonomy/${id}`;

        const res = await fetch(apiUrl, {
            method: "DELETE",
            cache: 'no-store',
        });

        if (!res.ok) {
            const json = await res.json();
            return { error: json.error || "Errore sconosciuto durante l'eliminazione della tassonomia." };
        }

        revalidatePath("/dashboard/taxonomy");
        return { success: true };
    } catch (err) {
        console.error("Errore nell'azione del server deleteTaxonomy:", err);
        return { error: err instanceof Error ? err.message : "Si è verificato un errore imprevisto durante l'eliminazione." };
    }
}

/**
 * Server Action per creare una nuova pagina.
 * @param data I dati della pagina da creare.
 * @returns Un oggetto con 'success: true' in caso di successo o 'error: string' in caso di fallimento.
 */
export async function createPage(data: PageData): Promise<ActionResponse<PageData>> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/pages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            cache: 'no-store',
            body: JSON.stringify(data),
        });

        const json = await res.json();

        if (!res.ok) {
            return { success: false, error: json.error || "Errore sconosciuto durante la creazione della pagina." }; // Imposta success a false
        }

        revalidatePath("/dashboard/pages");
        return { success: true, data: json as PageData }; // Assicurati che data sia di tipo PageData
    } catch (err) {
        console.error("Errore nell'azione del server createPage:", err);
        return { success: false, error: err instanceof Error ? err.message : "Si è verificato un errore imprevisto durante la creazione." }; // Imposta
    }
}

/**
 * Server Action per aggiornare una pagina esistente.
 * @param data I dati aggiornati della pagina.
 * @returns Un oggetto con 'success: true' in caso di successo o 'error: string' in caso di fallimento.
 */
export async function updatePage(data: PageData): Promise<ActionResponse<PageData>> {
    try {

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/pages/${data.id}`, {
            method: "PUT", // O "PATCH" a seconda della tua API
            headers: {
                "Content-Type": "application/json",
            },
            cache: 'no-store',
            body: JSON.stringify(data),
        });

        const json = await res.json();

        if (!res.ok) {
            return { success: false, error: json.error || "Errore sconosciuto durante l'aggiornamento della pagina." }; // Imposta success a false
        }

        revalidatePath("/dashboard/pages");
        revalidatePath(`/dashboard/pages/edit/${data.id}`);
        return { success: true, data: json as PageData }; // Assicurati che data sia di tipo PageData
    } catch (err) {
        console.error("Errore nell'azione del server updatePage:", err);
        return { success: false, error: err instanceof Error ? err.message : "Si è verificato un errore imprevisto durante l'aggiornamento." }; // Imposta success a false
    }
}

/**
 * Server Action per creare un nuovo articolo.
 * @param data I dati dell'articolo da creare.
 * @returns Un oggetto con 'success: true' in caso di successo o 'error: string' in caso di fallimento.
 */
export async function createArticle(data: ArticleData): Promise<ActionResponse<ArticleData>> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/articles`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            cache: 'no-store',
            body: JSON.stringify(data),
        });

        const json = await res.json();

        if (!res.ok) {
            return { success: false, error: json.error || "Errore sconosciuto durante la creazione dell'articolo." };
        }

        revalidatePath("/dashboard/articles");
        return { success: true, data: json as ArticleData };
    } catch (err) {
        console.error("Errore nell'azione del server createArticle:", err);
        return { success: false, error: err instanceof Error ? err.message : "Si è verificato un errore imprevisto durante la creazione." };
    }
}

/**
 * Server Action per aggiornare un articolo esistente.
 * @param data I dati aggiornati dell'articolo.
 * @returns Un oggetto con 'success: true' in caso di successo o 'error: string' in caso di fallimento.
 */
export async function updateArticle(data: ArticleData): Promise<ActionResponse> {
    try {
        const { title, content, status, featured, author_id, category, tag, url, description, id } = data;
        if (!title || !content || !author_id) {
            return { success: false, error: "Missing required fields" };
        }
        // Remove old taxonomies
        await prisma.postTaxonomy.deleteMany({ where: { post_id: id } });
        // Add new taxonomies
        if ((category && category.length) || (tag && tag.length)) {
            await prisma.postTaxonomy.createMany({
                data: [
                    ...(category ? buildTaxonomyCreateMany(id!, category) : []),
                    ...(tag ? buildTaxonomyCreateMany(id!, tag) : []),
                ],
                skipDuplicates: true,
            });
        }
        await prisma.post.update({
            where: { id },
            data: {
                title,
                content,
                status,
                featured,
                author_id: String(author_id),
                url: url || undefined,
                description: description || undefined,
            },
        });
        revalidatePath("/dashboard/articles");
        return { success: true };
    } catch (err) {
        console.error("Errore nell'azione del server updateArticle:", err);
        return { success: false, error: err instanceof Error ? err.message : "Si è verificato un errore imprevisto durante l'aggiornamento." };
    }
}

/**
 * Server Action per creare un nuovo utente.
 * @param data I dati dell'utente da creare.
 * @returns Un oggetto con 'success: true' in caso di successo o 'error: string' in caso di fallimento.
 */
export async function createUser(data: UserData): Promise<ActionResponse<UserData>> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            cache: 'no-store',
            body: JSON.stringify(data),
        });

        const json = await res.json();

        if (!res.ok) {
            return { success: false, error: json.error || "Errore sconosciuto durante la creazione dell'utente." };
        }

        revalidatePath("/dashboard/users");
        return { success: true, data: json as UserData };
    } catch (err) {
        console.error("Errore nell'azione del server createUser:", err);
        return { success: false, error: err instanceof Error ? err.message : "Si è verificato un errore imprevisto durante la creazione." };
    }
}

/**
 * Server Action per aggiornare un utente esistente.
 * @param data I dati aggiornati dell'utente.
 * @returns Un oggetto con 'success: true' in caso di successo o 'error: string' in caso di fallimento.
 */
export async function updateUser(data: UserData): Promise<ActionResponse<UserData>> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/users/${data.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            cache: 'no-store',
            body: JSON.stringify(data),
        });

        const json = await res.json();
        console.log(json);
        if (!res.ok) {
            return { success: false, error: json.error || "Errore sconosciuto durante l'aggiornamento dell'utente." };
        }

        revalidatePath("/dashboard/users");
        revalidatePath(`/dashboard/users/edit/${data.id}`);
        return { success: true, data: json as UserData };
    } catch (err) {
        console.error("Errore nell'azione del server updateUser:", err);
        return { success: false, error: err instanceof Error ? err.message : "Si è verificato un errore imprevisto durante l'aggiornamento." };
    }
}