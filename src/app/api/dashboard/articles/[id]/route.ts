import prisma from "@/app/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { postSchema } from "@/app/lib/validation";
/**
 * Extracts the article ID from a given URL.
 *
 * @param url - The URL string to extract the article ID from.
 * @returns The extracted article ID as a number, or null if the ID is not found or is not a valid number.
 */
function getId(url: string) {
  const regex = /articles\/(\d+)/;
  const match = url.match(regex);
  if (match && match.length > 0) {
    const id = parseInt(match[1], 10);
    if (isNaN(id)) {
      return null;
    } else {
      return id;
    }
  } else {
    return null;
  }
}

// GET /api/dashboard/articles/[id]
export async function GET(req: NextRequest) {
  const id = getId(req.url);
  if (!id) {
    return NextResponse.json(
      { error: "Bad request : Missing post ID" },
      { status: 400 }
    );
  }
  try {
    const post = await prisma.post.findUnique({
      where: { id: id },
      include: {
        content_taxonomy: {
          include: {
            taxonomy: true, // opzionale, se vuoi accedere anche ai dettagli della tassonomia
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT /api/dashboard/articles/[id]
export async function PUT(req: NextRequest) {
  const id = getId(req.url);
  if (!id) {
    return NextResponse.json(
      { error: "Bad request : Missing post ID" },
      { status: 400 }
    );
  }

  try {
    const data: PostData = await req.json();
    // check zod schema
    const validationResult = postSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        { errors: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { title, content, url, description, status, featured, author_id, content_taxonomy } =
      data;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Aggiorna i taxonomy: elimina i vecchi e crea i nuovi
    await prisma.content_taxonomy.deleteMany({ where: { content_id: id } });
    let contentTaxonomyData = undefined;
    if (content_taxonomy && Array.isArray(content_taxonomy)) {
      contentTaxonomyData = {
        create: content_taxonomy.map((ct) => ({ taxonomy_id: ct.taxonomy_id })),
      };
    }

    const updatedPost = await prisma.post.update({
      where: { id: id },
      data: {
        title,
        content,
        url,
        description,
        status,
        featured,
        author_id,
        content_taxonomy: contentTaxonomyData,
      },
      include: {
        content_taxonomy: {
          include: {
            taxonomy: true,
          },
        },
      },
    });
    return NextResponse.json(updatedPost);
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/dashboard/articles/[id]
export async function DELETE(req: NextRequest) {
  const id = getId(req.url);
  if (!id) {
    return NextResponse.json(
      { error: "Bad request : Missing post ID" },
      { status: 400 }
    );
  }

  try {
    await prisma.post.delete({ where: { id: id } });
    return NextResponse.json({ message: "Post deleted" });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
