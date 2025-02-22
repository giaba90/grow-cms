// api/dashobard/taxonomy/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/prisma/client";
import { ZodError } from "zod";
import { taxonomyDataSchema } from "@/app/lib/validation";

// GET api/dashboard/taxonomy
export async function GET(req: Request) {
  try {
    const taxonomies = await prisma.taxonomy.findMany();
    return NextResponse.json(taxonomies);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch taxonomies" },
      { status: 500 }
    );
  }
}

// POST api/dashboard/taxonomy
export async function POST(req: Request) {
  try {
    const data: TaxonomyData = await req.json();

    if (!taxonomyDataSchema.safeParse(data).success) {
      // Check if the data is valid according to the schema
      return NextResponse.json(
        // Return validation errors as a response
        { errors: taxonomyDataSchema.safeParse(data).error },
        { status: 400 }
      );
    }

    const { name, slug, type, description } = data;

    const taxonomy = await prisma.taxonomy.create({
      data: {
        name,
        slug,
        type,
        description,
      },
    });
    return NextResponse.json(taxonomy);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid taxonomy data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create taxonomy" },
      { status: 500 }
    );
  }
}
