"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import Tiptap from "@/app/components/ui/Tiptap";
import PostStatusSelect from "@/app/components/ui/PostStatusSelect";
import { toast } from "sonner";
import { useEdgeStore } from "src/app/lib/edgestore";
import CategoryMultiSelect from "@/app/components/ui/CategoryMultiSelect";
import { set } from "zod";

interface ArticleFormData {
  title: string;
  content: string;
  status: "draft" | "published" | "archived";
  featured: boolean;
  url?: string; // URL personalizzato, se non fornito viene generato da slugify
  description?: string; // Descrizione del post, se non fornita viene generata
  category: string;
  tag: string;
}

export default function NewArticlePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { edgestore } = useEdgeStore();
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  // Definisci lo stato del form
  // Inizializza lo stato del form con i campi richiesti
  const [formData, setFormData] = useState<ArticleFormData>({
    title: "",
    content: "",
    status: "draft",
    featured: false,
    category: "",
    tag: "",
  });

  const [file, setFile] = useState<File>();
  const [isLoading, setIsLoading] = useState(false);

  // Usa il nuovo hook per taxonomy
  /*  const {
     categories,
     tags,
     catLoading,
     tagLoading,
     catError,
     tagError,
   } = useTaxonomy();
  */
  const updateForm = (field: keyof ArticleFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async () => {
    if (!file) return;
    const res = await edgestore.publicFiles.upload({
      file,
      onProgressChange: (progress) => console.log(progress),
    });
    console.log(res);
    toast.success("Immagine caricata con successo!");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.title || !formData.content) {
      toast.error("Il titolo e il contenuto sono obbligatori");
      setIsLoading(false);
      return;
    }

    const numericAuthorId = Number(session?.user?.id);
    if (!session || isNaN(numericAuthorId)) {
      toast.error("Utente non autenticato o ID non valido");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/dashboard/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          author_id: numericAuthorId,

        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Errore durante la creazione dell'articolo");
      }

      toast.success("Articolo creato con successo!");
      router.push("/dashboard/articles");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Errore durante la creazione dell'articolo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold mb-6">Nuovo articolo</h1>
      <div className="flex w-full flex-row justify-between items-start flex-nowrap">
        {/* colonna sinistra */}
        <div className="w-2/3">
          <div className="mb-6">
            <label className="text-sm font-medium">Titolo</label>
            <div className="flex gap-4 items-center">
              <Input
                className="bg-white"
                placeholder="Inserisci il titolo..."
                value={formData.title}
                onChange={(e) => updateForm("title", e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Contenuto</label>
            <Tiptap onChange={(value) => updateForm("content", value)} />
          </div>

          <div className="flex justify-between pt-6">
            <Button
              type="button"
              className="cursor-pointer mt-2 bg-gray-200 text-black"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Indietro
            </Button>
            <Button
              type="submit"
              className="cursor-pointer mt-2 bg-black text-white"
              disabled={isLoading}
            >
              {isLoading ? "Salvataggio..." : "Salva"}
            </Button>
          </div>
        </div>

        {/* colonna destra */}
        <div className="w-1/3 ml-4">
          <div className="flex flex-col">
            <div className="mb-8">
              <label className="text-sm font-medium">Articolo in evidenza</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => updateForm("featured", e.target.checked)}
                  className="mr-2"
                />
                <span>Mostra in evidenza</span>
              </div>
            </div>
            <div className="mb-8 mt-2">
              <PostStatusSelect
                initialStatus={formData.status}
                onChange={(value) => updateForm("status", value)}
              />
            </div>
            <div className="mb-8">
              <label className="text-sm font-medium">URL personalizzato</label>
              <Input
                className="bg-white"
                placeholder="Inserisci un URL personalizzato..."
                value={formData.url}
                onChange={(e) => updateForm("url", e.target.value)}
              />
            </div>

            <div className="mb-8">
              <label className="text-sm font-medium">Descrizione</label>
              <Input
                className="bg-white"
                placeholder="Inserisci una breve descrizione..."
                value={formData.description}
                onChange={(e) => updateForm("description", e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                (opzionale, ma consigliato per SEO)
              </p>

            </div>
            <div className="mb-8">
              <CategoryMultiSelect
                selected={selectedCategories}
                onChange={setSelectedCategories}
                disabled={isLoading}
                endpoint="/api/dashboard/taxonomy-type/category"
                label="Categorie"
              />
            </div>
            <div className="mb-8">
              <label className="text-sm font-medium">Tag</label>
              <CategoryMultiSelect
                selected={selectedTags}
                onChange={setSelectedTags}
                disabled={isLoading}
                endpoint="/api/dashboard/taxonomy-type/tag"
                label="Tag"
              />


              {/*   <div className="mb-8">
              <CategorySelect
                initialValue={formData.category}
                onValueChange={(value) => updateForm("category", value)}
                categories={categories}
                loading={catLoading}
                error={catError}
              />
              <div className="mb-8">
                <TagSelect
                  initialValue={formData.tag}
                  onValueChange={(value) => updateForm("tag", value)}
                  tags={tags}
                  loading={tagLoading}
                  error={tagError}
                />
              </div>
            </div> */}

              <div className="mb-8">
                <label className="text-sm font-medium">Carica immagine</label>
                <div>
                  <input type="file" onChange={(e) => setFile(e.target.files?.[0])} />
                  {file && (
                    <Button type="button" onClick={handleFileUpload}>
                      Carica
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form >
  );
}
