// src/hooks/useTaxonomy.ts

import { useState, useEffect } from "react";

export function useTaxonomy() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [catLoading, setCatLoading] = useState(true);
    const [tagLoading, setTagLoading] = useState(true);
    const [catError, setCatError] = useState<string | null>(null);
    const [tagError, setTagError] = useState<string | null>(null);

    const fetchTaxonomy = async (
        endpoint: string,
        setter: (data: any[]) => void,
        setError: (error: string | null) => void,
        setLoading: (state: boolean) => void
    ) => {
        setLoading(true);
        try {
            const res = await fetch(endpoint);
            if (!res.ok) throw new Error();
            const data = await res.json();
            setter(data);
            setError(null);
        } catch {
            setter([]);
            setError("Errore nel caricamento");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTaxonomy("/api/dashboard/taxonomy-type/category", setCategories, setCatError, setCatLoading);
        fetchTaxonomy("/api/dashboard/taxonomy-type/tag", setTags, setTagError, setTagLoading);
    }, []);

    return {
        categories,
        tags,
        catLoading,
        tagLoading,
        catError,
        tagError,
    };
}