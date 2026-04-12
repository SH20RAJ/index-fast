import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let targetUrl = url;
    if (!targetUrl.startsWith("http")) {
      targetUrl = `https://${targetUrl}`;
    }

    const start = Date.now();
    try {
      const response = await axios.get(targetUrl, {
        timeout: 10000,
        validateStatus: () => true, // Catch all status codes
      });
      const duration = Date.now() - start;

      return NextResponse.json({
        url: targetUrl,
        status: response.status,
        statusText: response.statusText,
        responseTime: duration,
        headers: {
          server: response.headers["server"] || "Unknown",
          contentType: response.headers["content-type"] || "Unknown",
          cacheControl: response.headers["cache-control"] || "None",
        },
        online: response.status >= 200 && response.status < 400,
      });
    } catch (error: any) {
      const duration = Date.now() - start;
      return NextResponse.json({
        url: targetUrl,
        online: false,
        error: error.message,
        responseTime: duration,
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to check server status" }, { status: 500 });
  }
}
