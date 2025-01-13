import { NextResponse } from "next/server";

const articles = [
  { id: "1", title: "Article 1", content: "Content of Article 1" },
  { id: "2", title: "Article 2", content: "Content of Article 2" },
];

export async function GET() {
  return NextResponse.json(articles);
}
