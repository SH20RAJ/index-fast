import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { stackServerApp } from "@/stack";
import { db } from "@/lib/db";
import { submissions, urlInventory, websites } from "@/lib/db/schema";
import { parseSitemap } from "@/lib/utils/sitemap-parser";
import { submitToIndexNow } from "@/lib/api/indexnow";
import { submitToBingBatch } from "@/lib/api/bing";

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
    enabled: Boolean(website.indexNowKey),
    batches: 0,
    successBatches: 0,
    failedBatches: 0,
    submittedUrls: 0,
  };

  const bingStats = {
    enabled: Boolean(website.bingApiKey),
    batches: 0,
    successBatches: 0,
    failedBatches: 0,
    submittedUrls: 0,
  };

  const submissionLogs: Array<{
    websiteId: string;
    url: string;
    engine: "indexnow" | "bing";
    status: "success" | "failed";
    errorMessage?: string;
  }> = [];

  if (website.indexNowKey) {
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
    appendLog("IndexNow skipped: key not configured.");
  }

  if (website.bingApiKey) {
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
    appendLog("Bing skipped: API key not configured.");
  }

  if (submissionLogs.length > 0) {
    await db.insert(submissions).values(submissionLogs);
  }

  const [existingInventory] = await Promise.all([
    db
      .select({ url: urlInventory.url })
      .from(urlInventory)
      .where(eq(urlInventory.websiteId, website.id)),
  ]);
  const existingSet = new Set(existingInventory.map((row) => row.url));
  const freshUrls = urls.filter((url) => !existingSet.has(url));

  if (freshUrls.length > 0) {
    await db.insert(urlInventory).values(
      freshUrls.map((url) => ({
        websiteId: website.id,
        url,
        isIndexed: false,
        lastDetectedAt: new Date(),
        lastSubmittedAt: new Date(),
      }))
    );
  }

  await db.update(websites).set({ lastSyncAt: new Date() }).where(eq(websites.id, website.id));

  return NextResponse.json({
    mode,
    totalUrls: urls.length,
    logs,
    stats: {
      indexNow: indexNowStats,
      bing: bingStats,
      insertedInventoryUrls: freshUrls.length,
    },
  });
}
