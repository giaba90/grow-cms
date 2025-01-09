import prisma from "../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
  }

  const post = await prisma.post.findUnique({
    where: { id: parseInt(id, 10) },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  // Convert BigInt values to strings
  const postSerialized = {
    ...post,
    id: post.id.toString(),
  };

  return NextResponse.json(postSerialized);
}

export async function POST(req: Request) {
  const data = await req.json();
  const { title, content, url, description, status, featured, author_id } =
    data;

  if (!title || !content || !author_id) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const newPost = await prisma.post.create({
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

  return NextResponse.json(newPost, {
    status: 201,
  });
}
