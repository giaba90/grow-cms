import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/prisma/client";
import { postSchema } from "@/app/lib/validation";

// Utilità per estrarre ID dalla URL
function getId(url: string): number | null {
  const regex = /articles\/(\d+)/;
  const match = url.match(regex);
  if (match?.[1]) {
    const id = parseInt(match[1], 10);
    return isNaN(id) ? null : id;
  }
  return null;
}

// GET /api/dashboard/articles/[id]
export async function GET(req: NextRequest) {
  const id = getId(req.url);
  if (!id) {
    return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        taxonomies: {
          include: { taxonomy: true },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(
      post,
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT /api/dashboard/articles/[id]
export async function PUT(req: NextRequest) {
  const id = getId(req.url);
  if (!id) {
    return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
  }

  let data: PostData;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const validation = postSchema.safeParse(data);
  if (!validation.success) {
    return NextResponse.json({ errors: validation.error.flatten() }, { status: 400 });
  }

  const {
    title,
    content,
    url,
    description,
    status,
    featured,
    author_id,
    category,
    tags,
  } = validation.data;

  try {
    // ✅ Aggiorna le tassonomie collegate
    await prisma.postTaxonomy.deleteMany({ where: { post_id: id } });

    const taxonomyData: { post_id: number; taxonomy_id: number }[] = [];

    if (category) {
      taxonomyData.push({ post_id: id, taxonomy_id: category });
    }
    if (tags?.length) {
      tags.forEach((tagId) => taxonomyData.push({ post_id: id, taxonomy_id: tagId }));
    }

    if (taxonomyData.length > 0) {
      await prisma.postTaxonomy.createMany({ data: taxonomyData });
    }

    // ✅ Aggiorna il post
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        url,
        description,
        status,
        featured,
        author_id,
      },
      include: {
        taxonomies: {
          include: { taxonomy: true },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Post updated successfully",
        post: updatedPost,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/dashboard/articles/[id]
export async function DELETE(req: NextRequest) {
  const id = getId(req.url);
  if (!id) {
    return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
  }

  try {
    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ message: "Post deleted" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
