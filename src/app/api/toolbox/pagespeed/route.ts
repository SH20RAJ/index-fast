import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function POST(request: Request) {
  try {
    const { url, strategy = "mobile" } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const pagespeedonline = google.pagespeedonline("v5");
    
    // Use API key if available, otherwise it runs with lower quotas
    const apiKey = process.env.GOOGLE_API_KEY;

    console.log(`[PAGESPEED] Analyzing ${url} with strategy ${strategy}...`);

    const response = await pagespeedonline.pagespeedapi.runpagespeed({
      url,
      strategy: strategy as "mobile" | "desktop",
      category: ["performance", "accessibility", "best-practices", "seo"],
      key: apiKey,
    });

    const result = response.data;

    // Simplify the large Lighthouse result for the frontend
    const lighthouseResult = result.lighthouseResult;
    const loadingExperience = result.loadingExperience;

    const simplified = {
      url: lighthouseResult?.finalUrl,
      fetchTime: lighthouseResult?.fetchTime,
      scores: {
        performance: (lighthouseResult?.categories?.performance?.score ?? 0) * 100,
        accessibility: (lighthouseResult?.categories?.accessibility?.score ?? 0) * 100,
        bestPractices: (lighthouseResult?.categories?.["best-practices"]?.score ?? 0) * 100,
        seo: (lighthouseResult?.categories?.seo?.score ?? 0) * 100,
      },
      metrics: {
        firstContentfulPaint: lighthouseResult?.audits?.["first-contentful-paint"]?.displayValue,
        largestContentfulPaint: lighthouseResult?.audits?.["largest-contentful-paint"]?.displayValue,
        cumulativeLayoutShift: lighthouseResult?.audits?.["cumulative-layout-shift"]?.displayValue,
        totalBlockingTime: lighthouseResult?.audits?.["total-blocking-time"]?.displayValue,
        speedIndex: lighthouseResult?.audits?.["speed-index"]?.displayValue,
        interactive: lighthouseResult?.audits?.interactive?.displayValue,
      },
      vitals: loadingExperience?.metrics,
      audits: Object.entries(lighthouseResult?.audits || {})
        .filter(([_, audit]: any) => audit.score !== null && audit.score < 0.9)
        .map(([id, audit]: any) => ({
          id,
          title: audit.title,
          description: audit.description,
          score: audit.score,
          displayValue: audit.displayValue,
        }))
        .slice(0, 10), // Limit to top 10 improvements
    };

    return NextResponse.json(simplified);
  } catch (error: any) {
    console.error("[PAGESPEED] Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to analyze pagespeed" },
      { status: 500 }
    );
  }
}
