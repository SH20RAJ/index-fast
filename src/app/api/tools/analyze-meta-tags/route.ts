import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(req: NextRequest) {
  try {
    let { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    if (!url.startsWith("http")) {
      url = `https://${url}`;
    }

    const response = await fetch(url, {
      headers: { "User-Agent": "IndexFast-Meta-Analyzer/1.0" }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const tags = {
      title: $("title").text().trim(),
      description: $('meta[name="description"]').attr("content") || "",
      robots: $('meta[name="robots"]').attr("content") || "index, follow",
      ogTitle: $('meta[property="og:title"]').attr("content") || "",
      ogDescription: $('meta[property="og:description"]').attr("content") || "",
      ogImage: $('meta[property="og:image"]').attr("content") || "",
      canonical: $('link[rel="canonical"]').attr("href") || "",
    };

    const analysis = [
      {
        name: "Title Tag",
        value: tags.title,
        status: tags.title ? (tags.title.length > 60 ? "warning" : "success") : "error",
        message: tags.title 
          ? (tags.title.length > 60 ? "Title is too long (over 60 chars)" : "Title is optimized")
          : "Missing title tag"
      },
      {
        name: "Meta Description",
        value: tags.description,
        status: tags.description ? (tags.description.length > 160 ? "warning" : "success") : "error",
        message: tags.description 
          ? (tags.description.length > 160 ? "Description is too long" : "Description is set")
          : "Missing meta description"
      },
      {
        name: "Canonical URL",
        value: tags.canonical,
        status: tags.canonical ? "success" : "warning",
        message: tags.canonical ? "Canonical is correctly set" : "No canonical URL found"
      },
      {
        name: "Open Graph Title",
        value: tags.ogTitle,
        status: tags.ogTitle ? "success" : "warning",
        message: tags.ogTitle ? "OG Title is set" : "Missing OG title for social sharing"
      }
    ];

    return NextResponse.json({
      url,
      tags,
      analysis,
      score: analysis.filter(a => a.status === "success").length * 25
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || "Failed to analyze meta tags" 
    }, { status: 500 });
  }
}
