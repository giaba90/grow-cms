import { PenSquare } from "lucide-react";
import { Button } from "@components/ui/button";
import Link from "next/link";

interface EditButtonProps {
  url: string;
}

export function EditButton({ url }: EditButtonProps) {
  return (
    <Link href={`/dashboard/${url}`}>
      <Button variant="ghost" size="icon">
        <PenSquare className="h-4 w-4" />
        <span className="sr-only">Edit</span>
      </Button>
    </Link>
  );
}
