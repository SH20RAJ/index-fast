import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      const response = await fetch(url, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'IndexFast-Sitemap-Checker/1.0',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      return NextResponse.json({
        status: response.status,
        ok: response.ok,
      });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      // If HEAD fails, try GET (some servers block HEAD)
      const getResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'IndexFast-Sitemap-Checker/1.0',
        },
        // Only get the first byte to save bandwidth
        // @ts-ignore
        headers: { Range: 'bytes=0-0' }
      });

      return NextResponse.json({
        status: getResponse.status,
        ok: getResponse.ok,
      });
    }
  } catch (error: any) {
    return NextResponse.json({ 
      status: 0, 
      ok: false, 
      error: error.message || "Failed to check URL" 
    });
  }
}
