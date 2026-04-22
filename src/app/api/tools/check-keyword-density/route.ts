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
      headers: { "User-Agent": "IndexFast-Keyword-Analyzer/1.0" }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Strip scripts, styles, etc.
    $("script, style, iframe, noscript, nav, footer").remove();

    const text = $("body").text().toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
    const words = text.split(" ").filter(w => w.length > 2);
    const totalWords = words.length;

    const stopWords = ["the", "and", "for", "with", "that", "this", "from", "are", "was", "were"];
    const filteredWords = words.filter(w => !stopWords.includes(w));

    const density: Record<string, number> = {};
    filteredWords.forEach(w => {
      density[w] = (density[w] || 0) + 1;
    });

    const sortedKeywords = Object.entries(density)
      .map(([word, count]) => ({
        word,
        count,
        density: (count / totalWords) * 100
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    return NextResponse.json({
      url,
      totalWords,
      keywords: sortedKeywords
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || "Failed to check density" 
    }, { status: 500 });
  }
}
