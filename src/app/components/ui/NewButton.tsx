import { Plus } from "lucide-react";
import { Button } from "@components/ui/button";
import Link from "next/link";

interface NewButtonProps {
  url: string;
  type: "articles" | "pages" | "taxonomy" | "users";
}



export default function NewButton({ url, type }: NewButtonProps) {

  return (
    <Link href={`/dashboard/${type}/${url}`}>
      <Button className="cursor-pointer mt-2 bg-black text-white" size="sm">
        <Plus className="mr-2 h-4 w-4" />
        Nuovo
      </Button>
    </Link>
  );
}
