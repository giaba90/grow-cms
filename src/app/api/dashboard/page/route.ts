import { NextResponse } from "next/server";
import prisma from "@/app/prisma/client";
import z, { ZodError } from "zod";

// zod schema for page data
const pageDataSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(10).max(10000),
  status: z.enum(["draft", "published"]),
});

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
    const url = title.toLowerCase().replace(/\s+/g, "-");

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
// GET /api/dashboard/pages
export async function GET() {
  try {
    const pages = await prisma.page.findMany();
    return NextResponse.json(pages);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch pages" },
      { status: 500 }
    );
  }
}
