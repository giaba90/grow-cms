//dashboard/articles/create/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, Upload } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Progress } from "@/app/components/ui/progress";

export default function NewArticlePage() {
  const [uploadProgress, setUploadProgress] = useState(0);

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Nuovo articolo</h1>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Titolo</label>
          <div className="flex gap-4 items-center">
            <Input placeholder="Inserisci il titolo..." />
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
          <Textarea placeholder="Type here" className="min-h-[200px]" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Stato</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona stato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Bozza</SelectItem>
                <SelectItem value="published">Pubblicato</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tassonomia</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona tassonomia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="news">News</SelectItem>
                <SelectItem value="blog">Blog</SelectItem>
                <SelectItem value="tutorial">Tutorial</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
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

        <div className="flex justify-between pt-6">
          <Button variant="outline">Indietro</Button>
          <Button className="cursor-pointer mt-2 bg-black text-white" size="sm">
            Salva
          </Button>
        </div>
      </div>
    </div>
  );
}
