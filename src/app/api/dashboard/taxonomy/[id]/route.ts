// api/dashboard/taxonomy/[id]route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/prisma/client";
import { taxonomyDataSchema } from "@/app/lib/validation";

function getId(url: string) {
    const regex = /taxonomy\/(\d+)/;
    const match = url.match(regex);
    if (match && match.length > 0) {
        const id = parseInt(match[1], 10);
        if (isNaN(id)) {
            return null;
        } else {
            return id;
        }
    } else {
        return null;
    }
}

// GET api/dashboard/taxonomy/[id]
export async function GET(req: NextRequest) {
    const id = getId(req.url);
    if (!id) {
        return NextResponse.json(
            { error: "Bad request : Missing taxonomy ID" },
            { status: 400 }
        );
    }
    try {
        const taxonomy = await prisma.taxonomy.findUnique({
            where: { id: id },
        });

        if (!taxonomy) {
            return NextResponse.json(
                { error: "taxonomy not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(taxonomy);
    } catch {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// PUT api/dashboard/taxonomy/[id]
export async function PUT(req: NextRequest) {
    const id = getId(req.url);
    if (!id) {
        return NextResponse.json(
            { error: "Bad request : Missing taxonomy ID" },
            { status: 400 }
        );
    }

    try {
        const data: TaxonomyData = await req.json();
        // check zod schema
        const validationResult = taxonomyDataSchema.safeParse(data);
        if (!validationResult.success) {
            return NextResponse.json(
                { errors: validationResult.error.errors },
                { status: 400 }
            );
        }

        const { title, type, description } = data;

        const updatedtaxonomy = await prisma.taxonomy.update({
            where: { id: id },
            data: {
                title,

                type,
                description,
            },
        });

        return NextResponse.json(updatedtaxonomy);
    } catch {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
// DELETE api/dashboard/taxonomy/[id]
export async function DELETE(req: NextRequest) {
    const id = getId(req.url);
    if (!id) {
        return NextResponse.json(
            { error: "Bad request : Missing taxonomy ID" },
            { status: 400 }
        );
    }

    try {
        await prisma.taxonomy.delete({ where: { id: id } });
        return NextResponse.json({ message: "taxonomy deleted" });
    } catch {
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}