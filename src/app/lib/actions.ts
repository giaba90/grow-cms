// app/lib/actions.ts
"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/app/prisma/client";
import { buildTaxonomyConnect, buildTaxonomyCreateMany } from "@/app/utils/utils";
import slugify from "slugify";
import { postSchema } from "./validation";

type ActionResponse<T = undefined> = {
    success: boolean;
    error?: string;
    data?: T;
};

// Server Action per creare una nuova tassonomia (già presente)
export async function createTaxonomy(data: TaxonomyData) {
    try {
        const apiUrl = process.env.NODE_ENV === 'development'
            ? "/api/dashboard/taxonomy"
            : `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/taxonomy`;

        const res = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            cache: 'no-store',
            body: JSON.stringify(data),
        });

        const json = await res.json();

        if (!res.ok) {
            return { error: json.error || "Unknown error during taxonomy creation." };
        }

        revalidatePath("/dashboard/taxonomy");
        return { success: true, data: json };
    } catch (err) {
        console.error("Error in createTaxonomy Server Action:", err);
        return { error: err instanceof Error ? err.message : "An unexpected error occurred." };
    }
}

// Server Action per eliminare una tassonomia (già presente)
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
            return { error: json.error || "Unknown error during taxonomy deletion." };
        }

        revalidatePath("/dashboard/taxonomy");
        return { success: true };
    } catch (err) {
        console.error("Error in deleteTaxonomy Server Action:", err);
        return { error: err instanceof Error ? err.message : "An unexpected error occurred during deletion." };
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
        console.error("Errore nella Server Action createPage:", err);
        return { success: false, error: err instanceof Error ? err.message : "Si è verificato un errore inaspettato durante la creazione." }; // Imposta success a false
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
        console.error("Errore nella Server Action updatePage:", err);
        return { success: false, error: err instanceof Error ? err.message : "Si è verificato un errore inaspettato durante l'aggiornamento." }; // Imposta success a false
    }
}

export async function createArticle(data: ArticleData): Promise<ActionResponse<ArticleData>> {
    try {
        const { title, content, status, featured, author_id, category, tag, url, description } = data;
        //zod validation
        const validationResult = postSchema.safeParse(data);
        if (!validationResult.success) {
            return { success: false, error: validationResult.error.errors.map(error => error.message).join(", ") };
        }

        const post = await prisma.post.create({
            data: {
                title,
                content,
                url: url || slugify(title, { lower: true, strict: true }),
                description: description || content.slice(0, 160),
                status,
                featured,
                author_id: author_id || undefined,
            },
        });
        // Connect taxonomies
        if ((category && category.length) || (tag && tag.length)) {
            await prisma.postTaxonomy.createMany({
                data: [
                    ...(category ? buildTaxonomyCreateMany(post.id, category) : []),
                    ...(tag ? buildTaxonomyCreateMany(post.id, tag) : []),
                ],
                skipDuplicates: true,
            });
        }
        revalidatePath("/dashboard/articles");
        return { success: true };
    } catch (err) {
        console.error("Error in createPost Server Action:", err);
        return { success: false, error: err instanceof Error ? err.message : "An unexpected error occurred." };
    }
}

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
        console.error("Error in updatePost Server Action:", err);
        return { success: false, error: err instanceof Error ? err.message : "An unexpected error occurred." };
    }
}