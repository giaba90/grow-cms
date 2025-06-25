"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import Tiptap from "@/app/components/ui/Tiptap";
import { toast } from "sonner";
import { useEdgeStore } from "src/app/lib/edgestore";
import PostStatusSelect from "@/app/components/ui/PostStatusSelect";
import CategorySelect from "@/app/components/ui/CategorySelect";
import TagSelect from "@/app/components/ui/TagSelect";
import { useSession } from "next-auth/react";

export default function NewArticlePage() {
  const router = useRouter();
  const [file, setFile] = useState<File>();
  const { edgestore } = useEdgeStore();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "draft" as "draft" | "published" | "archived",
    featured: false,
    category: "",
    tag: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [catLoading, setCatLoading] = useState(true);
  const [tagLoading, setTagLoading] = useState(true);
  const [catError, setCatError] = useState<string | null>(null);
  const [tagError, setTagError] = useState<string | null>(null);

  const handleStatusChange = (status: "draft" | "published" | "archived") => {
    setFormData((prev) => ({ ...prev, status }));
  };

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
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
        headers: {
          "Content-Type": "application/json",
        },
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
      toast.error(
        error instanceof Error ? error.message : "Errore durante la creazione dell'articolo"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCatLoading(true);
    setTagLoading(true);
    Promise.all([
      (async () => {
        try {
          const res = await fetch("/api/dashboard/taxonomy-type/category");
          if (!res.ok) throw new Error();
          setCategories(await res.json());
          setCatError(null);
        } catch {
          setCategories([]);
          setCatError("Errore nel caricamento delle categorie");
        } finally {
          setCatLoading(false);
        }
      })(),
      (async () => {
        try {
          const res = await fetch("/api/dashboard/taxonomy-type/tag");
          if (!res.ok) throw new Error();
          setTags(await res.json());
          setTagError(null);
        } catch {
          setTags([]);
          setTagError("Errore nel caricamento dei tag");
        } finally {
          setTagLoading(false);
        }
      })(),
    ]);
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold mb-6">Nuovo articolo</h1>
      <div className="flex w-full direction-row justify-between aligm-start flex-nowrap">
        {/* col 1 */}
        <div className="w-2/3">
          <div className="mb-6">
            <label className="text-sm font-medium">Titolo</label>
            <div className="flex gap-4 items-center">
              <Input
                className="bg-white"
                placeholder="Inserisci il titolo..."
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Contenuto</label>
            <Tiptap onChange={handleContentChange} />
          </div>

          <div className="flex justify-between pt-6">
            <Button
              type="button"
              className="cursor-pointer"
              variant="outline"
              onClick={() => router.back()}
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

        {/* col 2 */}
        <div className="w-1/3 ml-4">
          <div className="flex flex-col">
            <div className="mb-8">
              <PostStatusSelect
                initialStatus={formData.status}
                onChange={handleStatusChange}
              />
            </div>

            <div className="mb-8">
              <CategorySelect
                initialValue={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                categories={categories}
                loading={catLoading}
                error={catError}
              />
              <div className="mt-4">
                <TagSelect
                  initialValue={formData.tag}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, tag: value }))}
                  tags={tags}
                  loading={tagLoading}
                  error={tagError}
                />
              </div>
            </div>
          </div>

          <div className="">
            <label className="text-sm font-medium">Carica immagine</label>
            <div>
              <input
                type="file"
                onChange={(e) => {
                  setFile(e.target.files?.[0]);
                }}
              />
              {file && (
                <Button
                  type="button"
                  onClick={async () => {
                    if (file) {
                      const res = await edgestore.publicFiles.upload({
                        file,
                        onProgressChange: (progress) => {
                          console.log(progress);
                        },
                      });
                      console.log(res);
                      toast.success("Immagine caricata con successo!");
                    }
                  }}
                >
                  Carica
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
