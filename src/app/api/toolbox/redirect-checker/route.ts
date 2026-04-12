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

    const chain: any[] = [];
    let currentUrl = targetUrl;
    let redirects = 0;
    const maxRedirects = 10;

    while (redirects < maxRedirects) {
      try {
        const response = await axios.get(currentUrl, {
          maxRedirects: 0,
          validateStatus: (status) => status >= 200 && status < 400,
        });

        chain.push({
          url: currentUrl,
          status: response.status,
          statusText: response.statusText,
        });

        if (response.status >= 300 && response.status < 400 && response.headers.location) {
          const nextUrl = new URL(response.headers.location, currentUrl).toString();
          if (nextUrl === currentUrl) break; // Loop
          currentUrl = nextUrl;
          redirects++;
        } else {
          break;
        }
      } catch (error: any) {
        if (error.response) {
            chain.push({
                url: currentUrl,
                status: error.response.status,
                statusText: error.response.statusText,
            });
        } else {
            chain.push({
                url: currentUrl,
                status: "Error",
                statusText: error.message,
            });
        }
        break;
      }
    }

    return NextResponse.json({ chain, totalRedirects: redirects });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to trace redirects" }, { status: 500 });
  }
}
