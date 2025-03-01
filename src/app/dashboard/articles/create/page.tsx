//dashboard/articles/create/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, Upload } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import Tiptap from "@/app/components/ui/Tiptap";
import { Progress } from "@/app/components/ui/progress";

export default function NewArticlePage() {
  const [uploadProgress, setUploadProgress] = useState(0);

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">Nuovo articolo</h1>
      <div className="flex w-full direction-row justify-between aligm-start flex-nowrap">
        {/* col 1 */}
        <div className="w-2/3">
          <div className="mb-6">
            <label className="text-sm font-medium">Titolo</label>
            <div className="flex gap-4 items-cente">
              <Input
                className="bg-white"
                placeholder="Inserisci il titolo..."
              />
              <Link
                href="/dashboard/post/preview/110"
                className="flex items-center text-sm text-blue-600 hover:underline"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Anteprima
              </Link>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Contenuto</label>
            <Tiptap />
          </div>

          {/* button functional */}
          <div className="flex justify-between pt-6">
            <Button className="cursor-pointer" variant="outline">
              Indietro
            </Button>
            <Button
              className="cursor-pointer mt-2 bg-black text-white"
              size="sm"
            >
              Salva
            </Button>
          </div>
        </div>
        {/* col 2 */}
        <div className="w-1/3 ml-4">
          <div className="flex flex-col">
            <div className="mb-6">
              <label className="text-sm font-medium">Stato</label>
              <select className="w-full border bg-white p-2">
                <option value="draft">Bozza</option>
                <option value="published">Pubblicato</option>
                <option value="archived">Archiviato</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="text-sm font-medium">Tassonomia</label>
              <select className="w-full border bg-white p-2">
                <option value="category">Categoria</option>
                <option value="tag">Tag</option>
              </select>
            </div>
          </div>

          <div className="">
            <label className="text-sm font-medium">Carica immagine</label>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">
                Trascina un file qui o clicca per selezionare
              </p>
            </div>
            <div className="space-y-2">
              <Progress value={uploadProgress} />
              <div className="flex justify-between text-sm">
                <span>progress.jpg</span>
                <Link href="#" className="text-blue-600 hover:underline">
                  Gestisci
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
