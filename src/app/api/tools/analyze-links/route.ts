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
      headers: { "User-Agent": "IndexFast-Link-Analyzer/1.0" }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const origin = new URL(url).origin;

    const links: any[] = [];
    $("a[href]").each((_, el) => {
      const href = $(el).attr("href");
      const text = $(el).text().trim() || $(el).find('img').attr('alt') || "No anchor text";
      const rel = $(el).attr("rel") || "";
      const isNofollow = rel.includes("nofollow");

      if (href) {
        try {
          const absolute = new URL(href, origin).toString();
          const isInternal = new URL(absolute).origin === origin;
          
          links.push({
            href: absolute,
            text,
            isInternal,
            isNofollow,
            type: isInternal ? "Internal" : "External"
          });
        } catch (e) {}
      }
    });

    return NextResponse.json({
      url,
      links,
      stats: {
        total: links.length,
        internal: links.filter(l => l.isInternal).length,
        external: links.filter(l => !l.isInternal).length,
        nofollow: links.filter(l => l.isNofollow).length
      }
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || "Failed to analyze links" 
    }, { status: 500 });
  }
}
