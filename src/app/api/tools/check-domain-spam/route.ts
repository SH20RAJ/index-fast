import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let { domain } = await req.json();
    if (!domain) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 });
    }

    domain = domain.replace(/^https?:\/\//, '').split('/')[0];
    const tld = domain.split('.').pop()?.toLowerCase();

    // 1. Check Age (Proxy for trust)
    let ageInYears = 0;
    try {
      const rdapRes = await fetch(`https://rdap.org/domain/${domain}`, { headers: { "Accept": "application/rdap+json" } });
      if (rdapRes.ok) {
        const rdapData = await rdapRes.json();
        const regDate = rdapData.events?.find((e: any) => e.eventAction === 'registration')?.eventDate;
        if (regDate) {
          ageInYears = Math.floor((Date.now() - new Date(regDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
        }
      }
    } catch (e) {}

    // 2. TLD Risk Score
    const highRiskTlds = ["xyz", "top", "pw", "monster", "site", "online", "club", "shop"];
    const tldRisk = highRiskTlds.includes(tld || "") ? 30 : 5;

    // 3. Google Indexing Proxy
    const searchRes = await fetch(`https://www.google.com/search?q=site:${encodeURIComponent(domain)}`, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    const html = await searchRes.text();
    const isIndexed = html.includes("About") || html.includes("results");

    // 4. Calculate Mock Spam Score (0-100)
    let spamScore = tldRisk;
    if (ageInYears < 1) spamScore += 20;
    if (!isIndexed) spamScore += 40;
    
    // Normalize
    spamScore = Math.min(100, Math.max(1, spamScore));

    return NextResponse.json({
      domain,
      score: spamScore,
      riskLevel: spamScore < 20 ? "Low" : spamScore < 50 ? "Medium" : "High",
      factors: {
        tldRisk: tldRisk > 20 ? "Potentially high-risk TLD" : "Low-risk TLD",
        ageFactor: ageInYears < 1 ? "New domain (less than 1 year)" : "Established domain",
        indexFactor: isIndexed ? "Domain is indexed in Google" : "Domain not found in Google index"
      }
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || "Failed to check spam score" 
    }, { status: 500 });
  }
}
