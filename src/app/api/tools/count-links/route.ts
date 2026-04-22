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
      headers: { "User-Agent": "IndexFast-Link-Counter/1.0" }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const origin = new URL(url).origin;

    let internal = 0;
    let external = 0;
    let nofollow = 0;
    let total = 0;

    $("a[href]").each((_, el) => {
      const href = $(el).attr("href");
      const rel = $(el).attr("rel") || "";
      
      if (href) {
        total++;
        if (rel.includes("nofollow")) nofollow++;

        try {
          const absolute = new URL(href, origin).toString();
          if (new URL(absolute).origin === origin) {
            internal++;
          } else {
            external++;
          }
        } catch (e) {
          internal++; // Fallback for relative paths
        }
      }
    });

    return NextResponse.json({
      url,
      stats: {
        total,
        internal,
        external,
        nofollow,
        dofollow: total - nofollow
      }
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || "Failed to count links" 
    }, { status: 500 });
  }
}
