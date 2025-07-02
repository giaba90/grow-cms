import { notFound } from "next/navigation";
import { auth } from "@/auth"; // opzionale
import ArticleForm from "../../create/ArticleForm";
import prisma from "@/app/prisma/client";


export default async function EditArticlePage({ params }: { params: { id: string } }) {
    const articleId = Number(params.id);
    if (isNaN(articleId) || articleId <= 0) return notFound();

    const post = await prisma.post.findUnique({
        where: { id: articleId },
        include: {
            taxonomies: { include: { taxonomy: true } },
        },
    });

    if (!post) return notFound();

    const categories = post.taxonomies
        .filter((pt: { taxonomy: { type: string; }; }) => pt.taxonomy.type === "category")
        .map((pt: { taxonomy: { id: any; }; }) => pt.taxonomy.id);

    const tags = post.taxonomies
        .filter((pt: { taxonomy: { type: string; }; }) => pt.taxonomy.type === "tag")
        .map((pt: { taxonomy: { id: any; }; }) => pt.taxonomy.id);

    // opzionale:
    const session = await auth();
    const userId = session?.user?.id ?? "";

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-2xl font-bold mb-6">Modifica articolo</h1>
            <ArticleForm
                initialValues={{
                    title: post.title,
                    content: post.content,
                    status: post.status ?? undefined,
                    featured: post.featured ?? false,
                    url: post.url || "",
                    description: post.description || "",
                }}
                defaultSelectedCategories={categories}
                defaultSelectedTags={tags}
                submitLabel="Salva modifiche"
                onSubmit={async (formValues) => {
                    "use server";

                    await prisma.post.update({
                        where: { id: articleId },
                        data: {
                            title: formValues.title,
                            content: formValues.content,
                            status: formValues.status,
                            featured: formValues.featured,
                            url: formValues.url || null,
                            description: formValues.description || null,
                            taxonomies: {
                                set: [],
                                connect: [
                                    ...buildTaxonomyConnect(articleId, formValues.category || []),
                                    ...buildTaxonomyConnect(articleId, formValues.tags || []),
                                ],
                            },
                        },
                    });
                }}
                userId={userId}
            />
        </div>
    );
}

function buildTaxonomyConnect(postId: number, taxonomyIds: number[]) {
    return taxonomyIds.map((taxonomyId) => ({
        post_id_taxonomy_id: {
            post_id: postId,
            taxonomy_id: taxonomyId,
        },
    }));
}
