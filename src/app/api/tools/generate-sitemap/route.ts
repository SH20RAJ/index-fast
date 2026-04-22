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
      headers: { "User-Agent": "IndexFast-Sitemap-Generator/1.0" }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch site: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const origin = new URL(url).origin;

    const links = new Set<string>();
    links.add(origin + "/");

    $("a[href]").each((_, el) => {
      const href = $(el).attr("href");
      if (!href) return;

      try {
        const absolute = new URL(href, origin).toString();
        const parsed = new URL(absolute);
        
        if (parsed.origin === origin) {
          // Strip hash and trailing slash for consistency
          const clean = absolute.split('#')[0].replace(/\/$/, "");
          if (clean.startsWith("http")) {
            links.add(clean + "/");
          }
        }
      } catch (e) {}
    });

    const finalUrls = Array.from(links).slice(0, 100); // Limit for free tool

    return NextResponse.json({
      url,
      urls: finalUrls,
      count: finalUrls.length
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || "Failed to generate sitemap" 
    }, { status: 500 });
  }
}
