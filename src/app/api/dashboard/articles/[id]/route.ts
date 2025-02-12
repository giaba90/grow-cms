import prisma from "@/app/prisma/client";
import { NextResponse } from "next/server";

// GET /api/dashboard/articles/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;

  if (!id) {
    return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id, 10) },
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
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;

  if (!id) {
    return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
  }

  try {
    const data = await request.json();
    const { title, content, url, description, status, featured, author_id } =
      data;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedPost = await prisma.post.update({
      where: { id: parseInt(id, 10) },
      data: {
        title,
        content,
        url,
        description,
        status,
        featured,
        author_id,
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
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;

  if (!id) {
    return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
  }

  try {
    await prisma.post.delete({ where: { id: parseInt(id, 10) } });
    return NextResponse.json({ message: "Post deleted" });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
