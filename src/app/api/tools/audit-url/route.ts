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
      headers: {
        "User-Agent": "IndexFast-Indexability-Checker/1.0",
      },
    });

    const status = response.status;
    const ok = response.ok;
    const html = await response.text();
    const $ = cheerio.load(html);

    // Robots meta
    const robots = $('meta[name="robots"]').attr("content") || "index, follow";
    const noindex = robots.toLowerCase().includes("noindex");

    // Canonical
    const canonical = $('link[rel="canonical"]').attr("href") || null;

    // X-Robots-Tag header
    const xRobots = response.headers.get("x-robots-tag");
    const headerNoindex = xRobots ? xRobots.toLowerCase().includes("noindex") : false;

    return NextResponse.json({
      url,
      status,
      ok,
      indexable: ok && !noindex && !headerNoindex,
      details: {
        robots,
        canonical,
        xRobots,
        noindex: noindex || headerNoindex,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || "Failed to audit URL" 
    }, { status: 500 });
  }
}
