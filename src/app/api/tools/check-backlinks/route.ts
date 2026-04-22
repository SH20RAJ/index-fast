import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let { domain } = await req.json();
    if (!domain) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 });
    }

    domain = domain.replace(/^https?:\/\//, '').split('/')[0];

    // Simulating backlink data since free APIs are limited
    // In a real app, we'd use OpenPageRank or a similar free tier API
    const hash = domain.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const backlinks = (hash * 123) % 10000 + 50;
    const referringDomains = Math.floor(backlinks / (Math.random() * 5 + 2));

    return NextResponse.json({
      domain,
      totalBacklinks: backlinks.toLocaleString(),
      referringDomains: referringDomains.toLocaleString(),
      authorityScore: Math.min(100, Math.floor(referringDomains / 10)),
      type: hash % 2 === 0 ? "Organic" : "Viral"
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || "Failed to check backlinks" 
    }, { status: 500 });
  }
}
