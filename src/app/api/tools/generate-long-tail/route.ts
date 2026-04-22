import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let { keyword } = await req.json();
    if (!keyword) {
      return NextResponse.json({ error: "Keyword is required" }, { status: 400 });
    }

    // Fetch multiple variations from Google Autocomplete
    const variations = [
      `${keyword} a`, `${keyword} how`, `${keyword} why`, `${keyword} best`, `${keyword} for`
    ];
    
    const allSuggestions = new Set<string>();
    
    for (const v of variations) {
      try {
        const res = await fetch(`https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(v)}`);
        const data = await res.json();
        (data[1] || []).forEach((s: string) => {
          if (s.split(' ').length >= 3) {
            allSuggestions.add(s);
          }
        });
      } catch (e) {}
    }

    const results = Array.from(allSuggestions).slice(0, 20).map(s => ({
      keyword: s,
      words: s.split(' ').length,
      intent: s.includes('how') || s.includes('why') ? 'Informational' : 'Commercial'
    }));

    return NextResponse.json({
      seed: keyword,
      results
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || "Failed to generate keywords" 
    }, { status: 500 });
  }
}
