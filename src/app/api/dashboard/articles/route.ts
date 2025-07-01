import { NextResponse } from "next/server";
import prisma from "@/app/prisma/client";
import slugify from "slugify";
import { postSchema } from "@/app/lib/validation";
import { ZodError } from "zod";



// GET /api/dashboard/articles
export async function GET() {
  try {
    const articles = await prisma.post.findMany({
      orderBy: { id: "asc" },
      include: {
        taxonomies: {
          include: { taxonomy: true },
        },
      },
    });

    return NextResponse.json(
      {
        message: `Fetched ${articles.length} articles`,
        articles
      },
      { status: 200 }
    );
  } catch (err) {
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

    // Validate with Zod
    const validationResult = postSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        { errors: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { title, content, status, featured, author_id, category, tag, url: customUrl,
      description, } = data;

    if (!title || !content || !author_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const url = customUrl || slugify(title, { lower: true, strict: true });
    const finalDescription = description || content.slice(0, 160);

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        url,
        description: finalDescription,
        status,
        featured,
        author_id,
      },
    });

    const taxonomyRelations: { post_id: number; taxonomy_id: number }[] = [];

    if (category) {
      if (Array.isArray(category)) {
        for (const catId of category) {
          taxonomyRelations.push({ post_id: newPost.id, taxonomy_id: catId });
        }
      } else {
        taxonomyRelations.push({ post_id: newPost.id, taxonomy_id: category });
      }
    }

    if (tag?.length) {
      for (const tagId of tag) {
        taxonomyRelations.push({ post_id: newPost.id, taxonomy_id: tagId });
      }
    }

    if (taxonomyRelations.length) {
      await prisma.postTaxonomy.createMany({
        data: taxonomyRelations,
        skipDuplicates: true,
      });
    }

    return NextResponse.json(
      { message: "Post created successfully", post: newPost },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
