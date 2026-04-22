import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let { domain } = await req.json();
    if (!domain) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 });
    }

    domain = domain.replace(/^https?:\/\//, '').split('/')[0];

    // 1. Get Domain Age
    let years = 0;
    try {
      const rdapRes = await fetch(`https://rdap.org/domain/${domain}`, { headers: { "Accept": "application/rdap+json" } });
      if (rdapRes.ok) {
        const rdapData = await rdapRes.json();
        const regDate = rdapData.events?.find((e: any) => e.eventAction === 'registration')?.eventDate;
        if (regDate) {
          years = Math.floor((Date.now() - new Date(regDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
        }
      }
    } catch (e) {}

    // 2. Check index status count (proxy for authority)
    const searchRes = await fetch(`https://www.google.com/search?q=site:${encodeURIComponent(domain)}`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" }
    });
    const html = await searchRes.text();
    const countMatch = html.match(/About ([\d,]+) results/);
    const resultsCount = countMatch ? parseInt(countMatch[1].replace(/,/g, '')) : 0;

    // 3. Calculate Mock Authority Score (0-100)
    // Age weight (max 40): 4 pts per year up to 10 years
    const ageScore = Math.min(40, years * 4);
    // Index weight (max 60): log based results count
    const indexScore = Math.min(60, resultsCount > 0 ? Math.floor(Math.log10(resultsCount) * 10) : 0);
    
    const authorityScore = ageScore + indexScore;

    return NextResponse.json({
      domain,
      score: authorityScore,
      age: years,
      indexedPages: resultsCount.toLocaleString(),
      rating: authorityScore < 20 ? "New" : authorityScore < 50 ? "Established" : authorityScore < 80 ? "Strong" : "High Authority"
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || "Failed to check authority" 
    }, { status: 500 });
  }
}
