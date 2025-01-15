import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const articles = await prisma.post.findMany();
    return NextResponse.json(articles);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
