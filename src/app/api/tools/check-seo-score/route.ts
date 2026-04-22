import { NextRequest, NextResponse } from "next/server";
import { auditWebsite } from "@/lib/services/audit-service";

export async function POST(req: NextRequest) {
  try {
    let { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    if (!url.startsWith("http")) {
      url = `https://${url}`;
    }

    const { score, issues } = await auditWebsite(url);

    return NextResponse.json({
      url,
      score,
      issues
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || "Failed to check SEO score" 
    }, { status: 500 });
  }
}
