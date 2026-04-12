import { NextRequest, NextResponse } from "next/server";
import { parseSitemap } from "@/lib/sitemap";
import { stackServerApp } from "@/stack";

export async function POST(req: NextRequest) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "Sitemap URL is required" }, { status: 400 });
    }

    const urls = await parseSitemap(url);
    return NextResponse.json({ urls });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to parse sitemap" }, { status: 500 });
  }
}
