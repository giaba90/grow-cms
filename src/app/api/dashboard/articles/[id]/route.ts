/* eslint-disable @typescript-eslint/no-unused-vars */
import { serializePost } from "@/app/utils/utility";
import prisma from "@/app/lib/prisma/client";
import { NextResponse } from "next/server";

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

    const postSerialized = serializePost(post);
    return NextResponse.json(postSerialized);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
