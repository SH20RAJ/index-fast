import { NextResponse } from "next/server";
import { submitToIndexNow } from "@/lib/api/indexnow";
import { getPublicSitePaths } from "@/lib/public-site-paths";

const INDEXNOW_KEY = "74c28309a177441488a4ea77d823c277";
const BATCH_SIZE = 1000;

function chunk<T>(items: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
}

export async function POST() {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://indexfast.co";
    const parsedSite = new URL(siteUrl);
    const host = parsedSite.host;

    const paths = await getPublicSitePaths();
    const urls = paths.map((path) => `${siteUrl}${path}`);
    const batches = chunk(urls, BATCH_SIZE);

    let successBatches = 0;
    let failedBatches = 0;
    const failures: string[] = [];

    for (let i = 0; i < batches.length; i += 1) {
      const batch = batches[i];
      const result = await submitToIndexNow(
        host,
        INDEXNOW_KEY,
        batch,
        `${siteUrl}/${INDEXNOW_KEY}.txt`
      );

      if (result.success) {
        successBatches += 1;
      } else {
        failedBatches += 1;
        failures.push(`Batch ${i + 1}: ${result.error || "Unknown error"}`);
      }
    }

    return NextResponse.json({
      success: failedBatches === 0,
      totalUrls: urls.length,
      totalBatches: batches.length,
      successBatches,
      failedBatches,
      failures,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unexpected server error",
      },
      { status: 500 }
    );
  }
}
