//dashboard/articles/create/page.tsx
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import Tiptap from "@/app/components/ui/Tiptap";
import { toast } from "sonner";
import { useEdgeStore } from "src/app/lib/edgestore";
import PostStatusSelect from "@/app/components/ui/PostStatusSelect";
import CategorySelect from "@/app/components/ui/CategorySelect";
import TagSelect from "@/app/components/ui/TagSelect";

export default function NewArticlePage() {
  const router = useRouter();
  const [file, setFile] = useState<File>();
  const { edgestore } = useEdgeStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "draft" as "draft" | "published" | "archived",
    featured: false,
    author_id: 3, // TODO: Get this from the authenticated user
    category: "",
    tag: "",
  });

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

    try {
      const response = await fetch("/api/dashboard/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))} categories={[]} loading={false} error={null} />
              <div className="mt-4">
                <TagSelect
                  initialValue={formData.tag}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, tag: value }))} tags={[]} loading={false} error={null} />
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
