import { NextRequest, NextResponse } from "next/server";
import robotsParser from "robots-parser";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { robotsTxtUrl, robotsTxtContent, urls, userAgent = "*" } = await req.json();

    let content = robotsTxtContent;

    if (robotsTxtUrl && !content) {
      const response = await axios.get(robotsTxtUrl);
      content = response.data;
    }

    if (!content) {
      return NextResponse.json({ error: "No robots.txt content provided" }, { status: 400 });
    }

    const robots = robotsParser(robotsTxtUrl || "https://example.com/robots.txt", content);
    
    const results = urls.map((url: string) => ({
      url,
      allowed: robots.isAllowed(url, userAgent),
      reason: robots.isAllowed(url, userAgent) ? "Allowed" : "Disallowed",
    }));

    return NextResponse.json({ results, robotsTxt: content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to test robots.txt" }, { status: 500 });
  }
}
