import { TableCell, TableRow } from "./table";
import DeleteButton from "./DeleteButton";
import { EditButton } from "./editbutton";

export type TableData = ArticleData | PageData | TaxonomyData | UserData;

interface MyTableRowProps {
  data: TableData;
  type?: "articles" | "pages" | "taxonomy" | "users";
}

export default function MyTableRow({ data, type }: MyTableRowProps) {

  const renderRowContent = () => {
    if (type === "pages") {
      const page = data as PageData;
      return (
        <>
          <TableCell className="font-medium">{page.id}</TableCell>
          <TableCell>{page.title}</TableCell>
          <TableCell>{page.url}</TableCell>
          <TableCell>{page.status}</TableCell>
        </>
      );
    }

    if (type === "taxonomy") {
      const taxonomy = data as TaxonomyData;
      return (
        <>
          <TableCell className="font-medium">{taxonomy.id}</TableCell>
          <TableCell>{taxonomy.title}</TableCell>
          <TableCell>{taxonomy.type === "category" ? "Categoria" : "Tag"}</TableCell>
        </>
      );
    }

    if (type === "users") {
      const user = data as UserData;
      return (
        <>
          <TableCell className="font-medium">{user.id}</TableCell>
          <TableCell>{user.name}</TableCell>
          <TableCell>{user.email}</TableCell>
        </>
      );
    }

    // Default: articles
    const article = data as ArticleData;
    return (
      <>
        <TableCell className="font-medium">{article.id}</TableCell>
        <TableCell>{article.title}</TableCell>
        <TableCell>{new Date(article.created_at).toLocaleDateString()}</TableCell>
        <TableCell>{article.status}</TableCell>
      </>
    );
  };

  // Costruisci l'URL di modifica in base al tipo e all'ID
  const editUrl = `${type || "articles"}/${data.id}/edit/`;
  return (

    <TableRow>
      {renderRowContent()}
      <TableCell className="text-right">
        <EditButton url={editUrl}></EditButton>
        <DeleteButton itemId={data.id} itemType={type || "articles"} />
      </TableCell>
    </TableRow >
  );
}
