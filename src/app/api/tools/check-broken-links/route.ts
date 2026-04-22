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
      headers: { "User-Agent": "IndexFast-Broken-Link-Checker/1.0" }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const baseUrl = new URL(url);

    const links: string[] = [];
    $("a[href]").each((_, el) => {
      const href = $(el).attr("href");
      if (href) {
        try {
          const absoluteUrl = new URL(href, baseUrl.origin).toString();
          if (absoluteUrl.startsWith("http") && !links.includes(absoluteUrl)) {
            links.push(absoluteUrl);
          }
        } catch (e) {
          // Ignore invalid URLs
        }
      }
    });

    return NextResponse.json({
      url,
      links: links.slice(0, 50), // Limit for free tool performance
      totalFound: links.length
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || "Failed to check links" 
    }, { status: 500 });
  }
}
