import { NextResponse } from "next/server";
import prisma from "@/app/prisma/client";
import { ZodError } from "zod";
import { pageDataSchema } from "@/app/lib/validation";
import slugify from "slugify";

// GET /api/dashboard/pages
export async function GET() {
  try {
    const pages = await prisma.page.findMany({
      orderBy: {
        id: "asc",
      },
    });
    return NextResponse.json(pages);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch pages" },
      { status: 500 }
    );
  }
}

// POST /api/dashboard/pages
export async function POST(req: Request) {
  try {
    const data: PageData = await req.json();

    if (!pageDataSchema.safeParse(data).success) {
      // Check if the data is valid according to the schema
      return NextResponse.json(
        // Return validation errors as a response
        { errors: pageDataSchema.safeParse(data).error },
        { status: 400 }
      );
    }
    const { title, content, status } = data;
    const url = slugify(title, { lower: true, strict: true });

    const page = await prisma.page.create({
      data: {
        title,
        content,
        url,
        status,
        description: content.slice(0, 200),
      },
    });
    // Return the created page as a response
    return NextResponse.json(page);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    // Return a 500 Internal Server Error if something went wrong
    return NextResponse.json(
      { error: "Failed to create page" },
      { status: 500 }
    );
  }
}
