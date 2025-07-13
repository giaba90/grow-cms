import { TableCell, TableRow } from "./table";
import { formatDate } from "@/app/utils/utils";
import { StatusBadge } from "./StatusBadge";
import { RowActions } from "./RowActions";

interface MyTableRowProps {
  data: ArticleData | PageData | TaxonomyData | UserData;
  type: "articles" | "pages" | "taxonomy" | "users";
}

export default function MyTableRow({ data, type }: MyTableRowProps) {
  // --- RENDER: Pages ---
  if (type === "pages") {
    const page = data as PageData;
    return (
      <TableRow>
        <TableCell className="font-medium">{page.id}</TableCell>
        <TableCell>{page.title}</TableCell>
        <TableCell>
          <a
            href={`/pages/${page.url}`}
            className="text-blue-600 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            /pages/{page.url}
          </a>
        </TableCell>
        <TableCell>
          <StatusBadge status={page.status} />
        </TableCell>
        <TableCell>
          <RowActions url={`pages/${page.id}/edit`} type={type} id={data.id} />
        </TableCell>
      </TableRow>
    );
  }

  // --- RENDER: Taxonomy ---
  if (type === "taxonomy") {
    const taxonomy = data as TaxonomyData;
    return (
      <TableRow>
        <TableCell className="font-medium">{taxonomy.id}</TableCell>
        <TableCell>{taxonomy.title}</TableCell>
        <TableCell>
          <StatusBadge status={taxonomy.type} isTaxonomy />
        </TableCell>
        <TableCell>
          <RowActions url={`taxonomy/${taxonomy.id}/edit`} type={type} id={data.id} />
        </TableCell>
      </TableRow>
    );
  }

  // --- RENDER: Users ---
  if (type === "users") {
    const user = data as unknown as UserData;
    return (
      <TableRow>
        <TableCell>{user.id}</TableCell>
        <TableCell>{user.name}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>
          <RowActions url={`users/${user.id}/edit`} type={type} id={data.id} />
        </TableCell>
      </TableRow>
    );
  }

  // --- RENDER: Articles (default) ---
  const article = data as ArticleData;
  return (
    <TableRow>
      <TableCell className="font-medium">{article.id}</TableCell>
      <TableCell>{article.title}</TableCell>
      <TableCell>{formatDate(article.created_at)}</TableCell>
      <TableCell>
        <StatusBadge status={article.status} />
      </TableCell>
      <TableCell>
        <RowActions url={`articles/${article.id}/edit`} type="articles" id={data.id} />
      </TableCell>
    </TableRow>
  );
}




