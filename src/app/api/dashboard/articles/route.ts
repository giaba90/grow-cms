import { NextResponse } from "next/server";
import prisma from "@/app/prisma/client";
import slugify from "slugify";
import { postSchema } from "@/app/lib/validation";
import { ZodError } from "zod";

// GET /api/dashboard/articles
export async function GET() {
  try {
    const articles = await prisma.post.findMany({
      orderBy: {
        id: "asc",
      },
    });
    return NextResponse.json(
      {
        message: `Fetched ${articles.length} articles`,
        articles: articles.map((article) => ({
          id: article.id,
          title: article.title,
          content: article.content,
          url: article.url,
          status: article.status,
          description: article.description,
          featured: article.featured,
          author_id: article.author_id,
          created_at: article.created_at,
        })),
      },
      { status: 200 }
    );
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
    // check zod schema
    const validationResult = postSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        { errors: validationResult.error.errors },
        { status: 400 }
      );
    }
    const { title, content, status, featured, author_id, content_taxonomy } = data;

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
        description: content.slice(0, 200),
        status,
        featured,
        author_id: Number(author_id),
        content_taxonomy: content_taxonomy && Array.isArray(content_taxonomy)
          ? {
            create: content_taxonomy.map((ct) => ({
              taxonomy_id: ct.taxonomy_id,
            })),
          }
          : undefined,
      },
      include: { content_taxonomy: true },
    });

    return NextResponse.json(newPost, {
      status: 201,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    // Return a 500 Internal Server Error if something went wrong
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
