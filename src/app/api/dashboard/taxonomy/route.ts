// api/dashobard/taxonomy/route.ts
import { NextResponse } from "next/server";
import prisma from "@/app/prisma/client";
import { ZodError } from "zod";
import { taxonomyDataSchema } from "@/app/lib/validation";

// GET api/dashboard/taxonomy
export async function GET(req: Request) {
  try {
    const taxonomies = await prisma.taxonomy.findMany(
      {
        orderBy: {
          id: "asc",
        },
      }
    );
    return NextResponse.json(
      {
        message: `Fetched ${taxonomies.length} taxonomies`,
        taxonomies
      },
      { status: 200 }
    );
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
    // check if name or type already exists
    const existingTaxonomy = await prisma.taxonomy.findFirst({
      where: {
        AND: [
          { name: name },
          { type: type },
        ],
      },
    });

    if (existingTaxonomy) {
      return NextResponse.json(
        { error: "Taxonomy with this name or type already exists" },
        { status: 409 }
      );
    }

    // Create a new taxonomy entry in the database
    const taxonomy = await prisma.taxonomy.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
        type,
        description,
      },
    });
    return NextResponse.json(
      {
        message: "Taxonomy created successfully",
        taxonomy
      },
      { status: 201 }
    );
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
