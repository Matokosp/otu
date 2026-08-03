import { NextResponse } from "next/server";
import { getBlogArticles } from "../../lib/shopify";

export async function GET() {
  try {
    const articles = await getBlogArticles();
    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Error fetching library articles:", error);
    return NextResponse.json({ articles: [] }, { status: 500 });
  }
}
