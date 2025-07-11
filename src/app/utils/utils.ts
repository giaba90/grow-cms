import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
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
export function buildTaxonomyConnect(postId: number, taxonomyIds: number[]) {
  return taxonomyIds.map((taxonomyId) => ({
    post_id_taxonomy_id: {
      post_id: postId,
      taxonomy_id: taxonomyId,
    },
  }));
}
export function buildTaxonomyCreateMany(postId: number, taxonomyIds: number[]) {
  return taxonomyIds.map((taxonomyId) => ({
    post_id: postId,
    taxonomy_id: taxonomyId,
  }));
}
