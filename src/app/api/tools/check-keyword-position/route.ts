import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(req: NextRequest) {
  try {
    let { url, keyword } = await req.json();
    if (!url || !keyword) {
      return NextResponse.json({ error: "URL and Keyword are required" }, { status: 400 });
    }

    const domain = url.replace(/^https?:\/\//, '').replace(/\/$/, '').toLowerCase();

    // 1. Fetch Google Search Results
    const searchRes = await fetch(`https://www.google.com/search?q=${encodeURIComponent(keyword)}&num=50`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" }
    });
    const html = await searchRes.text();
    const $ = cheerio.load(html);

    let position = -1;
    const results: any[] = [];

    // 2. Parse results
    $('div.g').each((i, el) => {
      const link = $(el).find('a').attr('href');
      if (link && link.startsWith('http')) {
        results.push(link);
        if (link.toLowerCase().includes(domain) && position === -1) {
          position = results.length;
        }
      }
    });

    return NextResponse.json({
      keyword,
      domain,
      position: position > 0 ? position : "50+",
      topResults: results.slice(0, 5)
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || "Position check failed" 
    }, { status: 500 });
  }
}
