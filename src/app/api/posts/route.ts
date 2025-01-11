import prisma from "../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import superjson from 'superjson';

// Define types
type PostData = {
  title: string;
  content: string;
  url?: string;
  description?: string;
  status?: string;
  featured?: boolean;
  author_id: number;
};

// Utility function to serialize post
const serializePost = (post: any) => {
  const { json } = superjson.serialize(post);
  return json;
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

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

    const postSerialized = serializePost(post);
    return NextResponse.json(postSerialized);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data: PostData = await req.json();
    const { title, content, url, description, status, featured, author_id } = data;

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

    const newPostSerialized = serializePost(newPost);
    return NextResponse.json(newPostSerialized, {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
