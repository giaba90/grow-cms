
// utils/taxonomy.ts

export function buildContentTaxonomy(
    categories: Category[],
    tags: Tag[],
    selectedCategory: string,
    selectedTag: string
) {
    const result = [];

    const category = categories.find((c) => c.slug === selectedCategory);
    if (category) result.push({ taxonomy_id: category.id });

    const tag = tags.find((t) => t.slug === selectedTag);
    if (tag) result.push({ taxonomy_id: tag.id });

    return result;
}