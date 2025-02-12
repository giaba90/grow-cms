import { NextResponse } from "next/server";
import prisma from "@/app/prisma/client";
import { ZodError } from "zod";

// POST /api/dashboard/pages
export async function POST(req: Request) {
  try {
    const data: PageData = await req.json();
    const { title, content, url, status } = data;

    const page = await prisma.page.create({
      data: {
        title,
        content,
        url,
        status,
      },
    });

    return NextResponse.json(page);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to create page" },
      { status: 500 }
    );
  }
}
// GET /api/dashboard/pages
