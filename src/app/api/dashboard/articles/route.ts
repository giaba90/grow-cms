import { NextResponse } from "next/server";
import prisma from "@/app/prisma/client";
import slugify from "slugify";

// GET /api/dashboard/articles
export async function GET() {
  try {
    const articles = await prisma.post.findMany({
      orderBy: {
        id: "asc",
      },
    });
    return NextResponse.json(articles);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

// POST /api/dashboard/articles
export async function POST(req: Request) {
  try {
    const data: PostData = await req.json();
    const { title, content, description, status, featured, author_id } = data;

    if (!title || !content || !author_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const url = slugify(title, { lower: true, strict: true });
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
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
