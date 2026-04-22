import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    if (!url.startsWith("http")) {
      url = `https://${url}`;
    }

    const start = Date.now();
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'User-Agent': 'IndexFast-Status-Checker/1.0' },
      cache: 'no-store'
    });
    const duration = Date.now() - start;

    return NextResponse.json({
      url,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      responseTime: duration
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || "Failed to check server status",
      ok: false,
      status: 0
    }, { status: 500 });
  }
}
