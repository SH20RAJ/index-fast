import { NextRequest, NextResponse } from "next/server";
import robotsParser from "robots-parser";

export async function POST(req: NextRequest) {
  try {
    let { url, robotsTxt, userAgent } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    if (!url.startsWith("http")) {
      url = `https://${url}`;
    }

    const parsedUrl = new URL(url);
    const origin = parsedUrl.origin;
    userAgent = userAgent || "*";

    if (!robotsTxt) {
      // Try to fetch robots.txt from the origin
      try {
        const robotsRes = await fetch(`${origin}/robots.txt`, {
          headers: { "User-Agent": "IndexFast-Robots-Tester/1.0" }
        });
        if (robotsRes.ok) {
          robotsTxt = await robotsRes.text();
        } else {
          robotsTxt = "User-agent: *\nAllow: /";
        }
      } catch (e) {
        robotsTxt = "User-agent: *\nAllow: /";
      }
    }

    const robots = robotsParser(`${origin}/robots.txt`, robotsTxt);
    const isAllowed = robots.isAllowed(url, userAgent);
    const isDisallowed = robots.isDisallowed(url, userAgent);
    const crawlDelay = robots.getCrawlDelay(userAgent);
    const sitemaps = robots.getSitemaps();

    return NextResponse.json({
      url,
      userAgent,
      allowed: isAllowed,
      disallowed: isDisallowed,
      crawlDelay,
      sitemaps,
      robotsTxt
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || "Failed to test robots.txt" 
    }, { status: 500 });
  }
}
