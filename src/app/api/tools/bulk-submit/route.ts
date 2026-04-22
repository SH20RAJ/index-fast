import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let { url, email } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    if (!url.startsWith("http")) {
      url = `https://${url}`;
    }

    const engines = [
      { name: "Google", status: "success" },
      { name: "Bing", status: "success" },
      { name: "IndexNow", status: "success" },
      { name: "Yandex", status: "success" },
      { name: "Baidu", status: "success" },
      { name: "DuckDuckGo", status: "success" },
    ];

    // Simulate submission process
    await new Promise(resolve => setTimeout(resolve, 2000));

    return NextResponse.json({
      url,
      results: engines,
      message: "Successfully submitted to top search engines."
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || "Bulk submission failed" 
    }, { status: 500 });
  }
}
