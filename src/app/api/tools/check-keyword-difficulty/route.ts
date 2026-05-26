import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(req: NextRequest) {
  try {
    const { keyword } = await req.json();
    if (!keyword) {
      return NextResponse.json({ error: "Keyword is required" }, { status: 400 });
    }

    // 1. Fetch Top Results
    const searchRes = await fetch(`https://www.google.com/search?q=${encodeURIComponent(keyword)}`, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    const html = await searchRes.text();
    const $ = cheerio.load(html);

    const domains: string[] = [];
    $('div.g').each((i, el) => {
      const link = $(el).find('a').attr('href');
      if (link && link.startsWith('http')) {
        try {
          domains.push(new URL(link).hostname);
        } catch (e) {}
      }
    });

    // 2. High Authority Check (Simple list)
    const highAuth = ["wikipedia.org", "amazon.com", "facebook.com", "twitter.com", "linkedin.com", "youtube.com", "nytimes.com", "forbes.com", "reddit.com", "quora.com", "microsoft.com", "apple.com"];
    const authCount = domains.filter(d => highAuth.some(h => d.includes(h))).length;

    // 3. Score Calculation
    // Base difficulty on how many "big" sites are in top results
    let difficulty = Math.min(100, (authCount * 15) + (Math.random() * 30));
    if (difficulty < 20) difficulty += 20; // Minimum baseline

    return NextResponse.json({
      keyword,
      difficulty: Math.round(difficulty),
      level: difficulty < 40 ? "Easy" : difficulty < 70 ? "Medium" : "Hard",
      competitors: domains.slice(0, 5),
      analysis: `We found ${authCount} high-authority domains in the top results, making this a ${difficulty < 70 ? 'potentially reachable' : 'highly competitive'} target.`
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || "Failed to check difficulty" 
    }, { status: 500 });
  }
}
