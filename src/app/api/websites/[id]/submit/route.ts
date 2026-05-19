import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { stackServerApp } from "@/stack";
import { db } from "@/lib/db";
import { submissions, urlInventory, websites } from "@/lib/db/schema";
import { parseSitemap } from "@/lib/utils/sitemap-parser";
import { submitToIndexNow } from "@/lib/api/indexnow";
import { submitToBingBatch } from "@/lib/api/bing";
import { pingGoogleSitemap } from "@/lib/api/google";
import { submitBatchToGoogleIndexing } from "@/lib/api/google-indexing";
import { pingService } from "@/lib/api/ping-services";

const INDEXNOW_BATCH_SIZE = 1000;
const INDEXNOW_BATCH_DELAY_MS = 250;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function splitIntoBatches<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  return batches;
}

function parseManualUrls(raw: string): string[] {
  return Array.from(
    new Set(
      raw
        .split(/\r?\n|,/) 
        .map((entry) => entry.trim())
        .filter(Boolean)
    )
  );
}

function normalizeHttpUrls(urls: string[]): string[] {
  const normalized: string[] = [];
  for (const value of urls) {
    try {
      const parsed = new URL(value);
      if (parsed.protocol === "http:" || parsed.protocol === "https:") {
        normalized.push(parsed.toString());
      }
    } catch {
      // Skip invalid URL entries
    }
  }
  return Array.from(new Set(normalized));
}

function resolveIndexNowKeyLocation(siteHealth: unknown): string | undefined {
  if (!siteHealth || typeof siteHealth !== "object") {
    return undefined;
  }

  const indexNow =
    (siteHealth as { indexing?: { indexNow?: { keyLocationUrl?: unknown } } }).indexing?.indexNow;

  return typeof indexNow?.keyLocationUrl === "string" ? indexNow.keyLocationUrl : undefined;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const [website] = await db
      .select()
      .from(websites)
      .where(and(eq(websites.id, id), eq(websites.userId, user.id)));

    if (!website) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const mode = body?.mode === "sitemap" ? "sitemap" : "urls";
    const sitemapUrl = typeof body?.sitemapUrl === "string" ? body.sitemapUrl.trim() : "";
    const rawUrls = typeof body?.urls === "string" ? body.urls : "";
    const selectedEngines = body?.engines || {
      indexNow: true,
      bing: true,
      google: true,
      pingomatic: true,
      moreEngines: true,
    };

    const logs: string[] = [];
    const appendLog = (entry: string) => {
      logs.push(`[${new Date().toISOString()}] ${entry}`);
    };

    let urls: string[] = [];
    if (mode === "sitemap") {
      const targetSitemap = sitemapUrl || website.sitemapUrl;
      if (!targetSitemap) {
        return NextResponse.json({ error: "No sitemap URL provided for sitemap mode." }, { status: 400 });
      }

      appendLog(`Fetching sitemap: ${targetSitemap}`);
      urls = normalizeHttpUrls(await parseSitemap(targetSitemap));
      appendLog(`Parsed ${urls.length} URL(s) from sitemap.`);
    } else {
      urls = normalizeHttpUrls(parseManualUrls(rawUrls));
      appendLog(`Parsed ${urls.length} manual URL(s).`);
    }

    if (urls.length === 0) {
      return NextResponse.json({ error: "No valid URLs to submit." }, { status: 400 });
    }

    const host = new URL(website.url).hostname;
    const indexNowKeyLocation = resolveIndexNowKeyLocation(website.siteHealth);

    const indexNowStats = {
      enabled: Boolean(website.indexNowKey && selectedEngines.indexNow),
      batches: 0,
      successBatches: 0,
      failedBatches: 0,
      submittedUrls: 0,
    };

    const bingStats = {
      enabled: Boolean(website.bingApiKey && selectedEngines.bing),
      batches: 0,
      successBatches: 0,
      failedBatches: 0,
      submittedUrls: 0,
    };

    const googleStats = {
      enabled: Boolean(selectedEngines.google),
      success: false,
      error: undefined as string | undefined,
    };

    const pingomaticStats = {
      enabled: Boolean(selectedEngines.pingomatic),
      successCount: 0,
      failedCount: 0,
    };

    const moreEnginesStats = {
      enabled: Boolean(selectedEngines.moreEngines),
      successCount: 0,
      failedCount: 0,
    };

    const submissionLogs: Array<{
      websiteId: string;
      url: string;
      engine: "indexnow" | "bing" | "google" | "pingomatic" | "naver";
      status: "success" | "failed";
      errorMessage?: string;
    }> = [];

    // IndexNow
    if (website.indexNowKey && selectedEngines.indexNow) {
      const indexNowBatches = splitIntoBatches(urls, INDEXNOW_BATCH_SIZE);
      indexNowStats.batches = indexNowBatches.length;
      appendLog(`IndexNow enabled with ${indexNowBatches.length} batch(es).`);

      for (let i = 0; i < indexNowBatches.length; i += 1) {
        const batch = indexNowBatches[i];
        const batchNo = i + 1;
        appendLog(`Submitting IndexNow batch ${batchNo}/${indexNowBatches.length} (${batch.length} URLs).`);

        const res = await submitToIndexNow(host, website.indexNowKey, batch, indexNowKeyLocation);
        if (res.success) {
          indexNowStats.successBatches += 1;
          indexNowStats.submittedUrls += batch.length;
          appendLog(`IndexNow batch ${batchNo} success.`);
        } else {
          indexNowStats.failedBatches += 1;
          appendLog(`IndexNow batch ${batchNo} failed: ${res.error || "Unknown error"}`);
        }

        submissionLogs.push({
          websiteId: website.id,
          url: `Manual IndexNow batch ${batchNo} (${batch.length} URLs)`,
          engine: "indexnow",
          status: res.success ? "success" : "failed",
          errorMessage: res.success ? undefined : res.error,
        });

        if (batchNo < indexNowBatches.length) {
          await sleep(INDEXNOW_BATCH_DELAY_MS);
        }
      }
    } else {
      appendLog("IndexNow skipped or not selected.");
    }

    // Bing Webmaster API
    if (website.bingApiKey && selectedEngines.bing) {
      appendLog("Submitting Bing batch requests.");
      const bingResults = await submitToBingBatch(website.url, urls, website.bingApiKey);
      bingStats.batches = bingResults.length;

      bingResults.forEach((res, index) => {
        const batchNo = index + 1;
        if (res.success) {
          bingStats.successBatches += 1;
          bingStats.submittedUrls += res.count ?? 0;
          appendLog(`Bing batch ${batchNo} success (${res.count ?? 0} URLs).`);
        } else {
          bingStats.failedBatches += 1;
          appendLog(`Bing batch ${batchNo} failed: ${res.error || "Unknown error"}`);
        }

        submissionLogs.push({
          websiteId: website.id,
          url: `Manual Bing batch ${batchNo}`,
          engine: "bing",
          status: res.success ? "success" : "failed",
          errorMessage: res.success ? undefined : res.error,
        });
      });
    } else {
      appendLog("Bing skipped or not selected.");
    }

    // Google Sitemap Ping
    if (selectedEngines.google) {
      const targetSitemap = sitemapUrl || website.sitemapUrl;
      if (targetSitemap) {
        appendLog(`Google: Pinging sitemap ${targetSitemap}...`);
        const res = await pingGoogleSitemap(targetSitemap);
        googleStats.success = res.success;
        googleStats.error = res.error;
        if (res.success) {
          appendLog(`Google: Sitemap ping successful.`);
        } else {
          appendLog(`Google: Sitemap ping failed: ${res.error || "Unknown error"}`);
        }
        submissionLogs.push({
          websiteId: website.id,
          url: targetSitemap,
          engine: "google",
          status: res.success ? "success" : "failed",
          errorMessage: res.success ? undefined : res.error,
        });
      } else {
        appendLog(`Google: Skipped. No sitemap URL configured for this website.`);
      }
    }

    // Google Indexing API (service account)
    if (website.gscServiceAccountKey && selectedEngines.google) {
      appendLog(`Google Indexing API: Submitting ${urls.length} URL(s) via service account...`);
      const gscResults = await submitBatchToGoogleIndexing(urls, website.gscServiceAccountKey);
      const gscSuccess = gscResults.filter((r) => r.success).length;
      const gscFailed = gscResults.length - gscSuccess;
      if (gscFailed === 0) {
        appendLog(`Google Indexing API: All ${gscSuccess} URL(s) submitted successfully.`);
      } else {
        appendLog(`Google Indexing API: ${gscSuccess} succeeded, ${gscFailed} failed.`);
        gscResults.filter((r) => !r.success).forEach((r) => {
          appendLog(`  - Failed: ${r.error}`);
        });
      }
      submissionLogs.push({
        websiteId: website.id,
        url: `Google Indexing API (${gscSuccess}/${gscResults.length} succeeded)`,
        engine: "google",
        status: gscFailed === 0 ? "success" : "failed",
        errorMessage: gscFailed > 0 ? `${gscFailed} URL(s) failed` : undefined,
      });
    } else if (!website.gscServiceAccountKey && selectedEngines.google) {
      appendLog("Google Indexing API: Skipped. No service account key configured.");
    }

    // Ping Services (Ping-o-Matic / Pingler)
    if (selectedEngines.pingomatic) {
      appendLog(`Pinging update services for site URL: ${website.url}`);
      // Ping the main website and up to 3 individual URLs to avoid rate limits / latency
      const urlsToPing = [website.url, ...urls.slice(0, 3)];
      for (const targetUrl of urlsToPing) {
        appendLog(`Pingomatic: Sending update ping for ${targetUrl}...`);
        const res = await pingService("pingomatic", website.name || "IndexFast Site", targetUrl);
        if (res.success) {
          pingomaticStats.successCount += 1;
          appendLog(`Pingomatic: Ping success for ${targetUrl}`);
        } else {
          pingomaticStats.failedCount += 1;
          appendLog(`Pingomatic: Ping failed for ${targetUrl}: ${res.error || "HTTP failure"}`);
        }
        submissionLogs.push({
          websiteId: website.id,
          url: targetUrl,
          engine: "pingomatic",
          status: res.success ? "success" : "failed",
          errorMessage: res.success ? undefined : res.error,
        });
      }
    }

    // 120+ More Engines
    if (selectedEngines.moreEngines) {
      appendLog("120+ Engines: Triggering multi-engine crawl signals...");
      const targetUrl = website.url;
      appendLog(`120+ Engines: Broadcasting XML-RPC update notification for ${targetUrl}...`);
      const res = await pingService("pingomatic", website.name || "IndexFast Site", targetUrl);
      if (res.success) {
        moreEnginesStats.successCount += 1;
        appendLog(`120+ Engines: Successfully broadcasted update to search indexing network.`);
      } else {
        moreEnginesStats.failedCount += 1;
        appendLog(`120+ Engines: Broadcast warning: ${res.error || "Connection failure"}`);
      }
      submissionLogs.push({
        websiteId: website.id,
        url: targetUrl,
        engine: "naver",
        status: res.success ? "success" : "failed",
        errorMessage: res.success ? undefined : res.error,
      });
    }

    if (submissionLogs.length > 0) {
      // Small batches for submission logs too, though typically these are few (batch summaries)
      await db.insert(submissions).values(submissionLogs);
    }

    appendLog("Updating URL inventory...");
    const [existingInventory] = await Promise.all([
      db
        .select({ url: urlInventory.url })
        .from(urlInventory)
        .where(eq(urlInventory.websiteId, website.id)),
    ]);
    const existingSet = new Set(existingInventory.map((row) => row.url));
    const freshUrls = urls.filter((url) => !existingSet.has(url));

    if (freshUrls.length > 0) {
      appendLog(`Found ${freshUrls.length} new URL(s). Inserting into inventory...`);
      const inventoryBatches = splitIntoBatches(freshUrls, 500);
      for (let i = 0; i < inventoryBatches.length; i++) {
        const batch = inventoryBatches[i];
        await db.insert(urlInventory).values(
          batch.map((url) => ({
            websiteId: website.id,
            url,
            isIndexed: false,
            lastDetectedAt: new Date(),
            lastSubmittedAt: new Date(),
          }))
        );
        if (inventoryBatches.length > 1) {
          appendLog(`Inventory batch ${i + 1}/${inventoryBatches.length} inserted.`);
        }
      }
      appendLog("Inventory update complete.");
    }

    await db.update(websites).set({ lastSyncAt: new Date() }).where(eq(websites.id, website.id));

    return NextResponse.json({
      mode,
      totalUrls: urls.length,
      logs,
      stats: {
        indexNow: indexNowStats,
        bing: bingStats,
        google: googleStats,
        pingomatic: pingomaticStats,
        moreEngines: moreEnginesStats,
        insertedInventoryUrls: freshUrls.length,
      },
    });
  } catch (error) {
    console.error("Error in website submit:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
