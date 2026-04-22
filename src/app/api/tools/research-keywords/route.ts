import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let { keyword } = await req.json();
    if (!keyword) {
      return NextResponse.json({ error: "Keyword is required" }, { status: 400 });
    }

    // Fetch from Google Autocomplete
    const response = await fetch(`https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(keyword)}`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch suggestions");
    }

    const data = await response.json();
    const suggestions = data[1] || [];

    const results = suggestions.map((s: string) => ({
      keyword: s,
      relevance: Math.floor(Math.random() * 30) + 70, // Mock relevance
      difficulty: Math.floor(Math.random() * 100), // Mock difficulty
      volume: Math.floor(Math.random() * 5000) + 100 // Mock volume
    }));

    return NextResponse.json({
      seed: keyword,
      results
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || "Failed to research keywords" 
    }, { status: 500 });
  }
}
