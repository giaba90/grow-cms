import { Plus } from "lucide-react";
import { Button } from "@components/ui/button";
import Link from "next/link";

interface NewButtonProps {
  url: string;
  type?: "articles" | "pages" | "taxonomy" | "users";
}

const typeToPath: Record<NonNullable<NewButtonProps["type"]>, string> = {
  articles: "articles",
  pages: "pages",
  taxonomy: "taxonomy",
  users: "users",
};

export function NewButton({ url, type }: NewButtonProps) {
  const path = type ? typeToPath[type] : "articles";
  return (
    <Link href={`/dashboard/${path}/${url}`}>
      <Button className="cursor-pointer mt-2 bg-black text-white" size="sm">
        <Plus className="mr-2 h-4 w-4" />
        Nuovo
      </Button>
    </Link>
  );
}
