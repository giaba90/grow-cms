import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formatta una data in formato italiano
 * @param dateString La data da formattare
 * @returns La data formattata
 */
export function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("it-IT", options);
}

/**
 * Costruisce un array di oggetti per la creazione di molti-a-molti tra post e taxonomy
 * @param postId ID del post
 * @param taxonomyIds Array di ID delle taxonomy da collegare al post
 * @returns Array di oggetti per la creazione di molti-a-molti tra post e taxonomy
 */
export function buildTaxonomyCreateMany(postId: number, taxonomyIds: number[]) {
  return taxonomyIds.map((taxonomyId) => ({
    post_id: postId,
    taxonomy_id: taxonomyId,
  }));
}

/**
 * Recupera i dati di un articolo
 * @param id ID dell'articolo da recuperare
 * @returns I dati dell'articolo
 */
export async function getArticleData(id: number) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/articles/${id}`,
      {
        next: { revalidate: 0 } // Assicura che i dati siano sempre freschi
      }
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch articles: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch articles:", error);
  };
}

/**
 * Recupera i dati di una pagina
 * @param id ID della pagina da recuperare
 * @returns I dati della pagina
 */
export async function getPageData(id: string) {

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/pages/${id}`,
      {
        next: { revalidate: 0 } // Assicura che i dati siano sempre freschi
      }
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch pages: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch pages:", error);
  }

}

/**
 * Recupera i dati di un utente
 * @param id ID dell'utente da recuperare
 * @returns I dati dell'utente
 */
export async function getUserData(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/users/${id}`,
      {
        next: { revalidate: 0 } // Assicura che i dati siano sempre freschi
      }
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch users: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }
}


// Helper function to extract categories and tags from taxonomies
export function extractTaxonomies(taxonomies: any[] = []): { categories: number[]; tags: number[]; } {
  const categories: number[] = [];
  const tags: number[] = [];

  taxonomies.forEach((taxonomyRelation) => {
    if (taxonomyRelation.taxonomy) {
      const { id, type } = taxonomyRelation.taxonomy;
      if (type === 'category') {
        categories.push(id);
      } else if (type === 'tag') {
        tags.push(id);
      }
    }
  });

  return { categories, tags };
}

