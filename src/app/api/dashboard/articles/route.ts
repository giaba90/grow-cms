/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma/client";
import { serializePost } from "@/app/utils/utility";

// GET /api/dashboard/articles
export async function GET() {
  try {
    const articles = await prisma.post.findMany({
      orderBy: {
        id: "asc",
      },
    });
    return NextResponse.json(articles);
  } catch (error) {
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

    const newPostSerialized = serializePost(newPost);
    return NextResponse.json(newPostSerialized, {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
