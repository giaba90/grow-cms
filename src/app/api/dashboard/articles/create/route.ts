import { serializePost } from "@/app/utils/utility";
import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";
/* eslint-disable @typescript-eslint/no-unused-vars */
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
