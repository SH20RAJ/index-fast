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
      headers: { "User-Agent": "Googlebot/2.1 (+http://www.google.com/bot.html)" }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Metadata
    const meta = {
      title: $("title").text().trim(),
      description: $('meta[name="description"]').attr("content") || "",
      h1: $("h1").map((_, el) => $(el).text().trim()).get(),
    };

    // Strip scripts, styles, etc.
    $("script, style, iframe, noscript").remove();

    // Get text content
    const textContent = $("body").text().replace(/\s+/g, " ").trim();
    
    // Extract links
    const links = $("a[href]").map((_, el) => ({
      text: $(el).text().trim(),
      href: $(el).attr("href")
    })).get().slice(0, 20);

    return NextResponse.json({
      url,
      meta,
      textContent: textContent.substring(0, 5000), // Limit for preview
      links,
      wordCount: textContent.split(/\s+/).length
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || "Failed to simulate spider" 
    }, { status: 500 });
  }
}
