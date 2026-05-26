import { and, asc, desc, eq, lte, inArray, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { cronJobs, submissions, urlInventory, websites } from "@/lib/db/schema";
import { parseSitemap } from "@/lib/utils/sitemap-parser";
import { submitToBingBatch } from "@/lib/api/bing";
import { submitToIndexNow } from "@/lib/api/indexnow";
import { pingGoogleSitemap } from "@/lib/api/google";
import { pingService } from "@/lib/api/ping-services";

const INDEXNOW_BATCH_SIZE = 1000;
const INVENTORY_SOURCE_LIMIT = 1000;
const CLAIM_HOLD_MS = 5 * 60 * 1000;

type SupportedEngine = "indexnow" | "bing" | "google" | "pingomatic" | "pingler" | "yandex" | "baidu" | "naver";

function splitIntoBatches<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  return batches;
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
      // Ignore invalid URL entries
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

function calculateNextRunFromFrequency(frequency: string, from = new Date()): Date {
  switch (frequency) {
    case "hourly":
      return new Date(from.getTime() + 60 * 60 * 1000);
    case "daily":
      return new Date(from.getTime() + 24 * 60 * 60 * 1000);
    case "weekly":
      return new Date(from.getTime() + 7 * 24 * 60 * 60 * 1000);
    case "monthly":
      return new Date(from.getTime() + 30 * 24 * 60 * 60 * 1000);
    default:
      return new Date(from.getTime() + 24 * 60 * 60 * 1000);
  }
}

async function getUrlsForSource(
  websiteId: string,
  sourceMode: string,
  sitemapUrl: string | null,
  customUrls: string | null
) {
  if (sourceMode === "urls") {
    if (!customUrls) return [];
    return normalizeHttpUrls(
      customUrls
        .split(/\r?\n|,/)
        .map((entry) => entry.trim())
        .filter(Boolean)
    );
  }

  if (sourceMode === "inventory") {
    const rows = await db
      .select({ url: urlInventory.url })
      .from(urlInventory)
      .where(eq(urlInventory.websiteId, websiteId))
      .orderBy(
        sql`${urlInventory.lastSubmittedAt} ASC NULLS FIRST`,
        desc(urlInventory.lastDetectedAt)
      )
      .limit(INVENTORY_SOURCE_LIMIT);
    return normalizeHttpUrls(rows.map((row) => row.url));
  }

  if (!sitemapUrl) {
    return [];
  }

  const urls = await parseSitemap(sitemapUrl);
  return normalizeHttpUrls(urls);
}

export async function processDueCronJobs(maxJobs = 20) {
  const now = new Date();
  const dueRows = await db
    .select({
      jobId: cronJobs.id,
      websiteId: cronJobs.websiteId,
      enabled: cronJobs.enabled,
      frequency: cronJobs.frequency,
      sourceMode: cronJobs.sourceMode,
      urls: cronJobs.urls,
      engine: cronJobs.engine,
      nextRunAt: cronJobs.nextRunAt,
      websiteUrl: websites.url,
      sitemapUrl: websites.sitemapUrl,
      indexNowKey: websites.indexNowKey,
      bingApiKey: websites.bingApiKey,
      siteHealth: websites.siteHealth,
    })
    .from(cronJobs)
    .innerJoin(websites, eq(cronJobs.websiteId, websites.id))
    .where(and(eq(cronJobs.enabled, true), lte(cronJobs.nextRunAt, now)))
    .orderBy(asc(cronJobs.nextRunAt))
    .limit(maxJobs);

  let processed = 0;
  let skipped = 0;
  let failed = 0;

  await Promise.all(
    dueRows.map(async (row) => {
      if (!row.nextRunAt) {
        skipped += 1;
        return;
      }

      // Claim the job to avoid duplicate runs in concurrent workers.
      const claimUntil = new Date(Date.now() + CLAIM_HOLD_MS);
      const claim = await db
        .update(cronJobs)
        .set({ nextRunAt: claimUntil, updatedAt: now })
        .where(
          and(
            eq(cronJobs.id, row.jobId),
            eq(cronJobs.enabled, true),
            eq(cronJobs.nextRunAt, row.nextRunAt)
          )
        )
        .returning({ id: cronJobs.id });

      if (claim.length === 0) {
        skipped += 1;
        return;
      }

      try {
        const urls = await getUrlsForSource(row.websiteId, row.sourceMode, row.sitemapUrl, row.urls);

        if (urls.length === 0) {
          throw new Error("No eligible URLs found for this cron source.");
        }

        const engine = row.engine as SupportedEngine;
        const submissionRows: Array<{
          websiteId: string;
          url: string;
          engine: SupportedEngine;
          status: "success" | "failed";
          errorMessage?: string;
        }> = [];

        if (engine === "indexnow") {
          if (!row.indexNowKey) {
            throw new Error("IndexNow key not configured for this website.");
          }

          const host = new URL(row.websiteUrl).hostname;
          const indexNowKeyLocation = resolveIndexNowKeyLocation(row.siteHealth);
          const batches = splitIntoBatches(urls, INDEXNOW_BATCH_SIZE);

          for (let i = 0; i < batches.length; i += 1) {
            const batch = batches[i];
            const res = await submitToIndexNow(host, row.indexNowKey, batch, indexNowKeyLocation);
            submissionRows.push({
              websiteId: row.websiteId,
              url: `Cron IndexNow batch ${i + 1} (${batch.length} URLs)`,
              engine,
              status: res.success ? "success" : "failed",
              errorMessage: res.success ? undefined : res.error,
            });
          }
        } else if (engine === "bing") {
          if (!row.bingApiKey) {
            throw new Error("Bing API key not configured for this website.");
          }

          const results = await submitToBingBatch(row.websiteUrl, urls, row.bingApiKey);
          results.forEach((res, idx) => {
            submissionRows.push({
              websiteId: row.websiteId,
              url: `Cron Bing batch ${idx + 1}`,
              engine,
              status: res.success ? "success" : "failed",
              errorMessage: res.success ? undefined : res.error,
            });
          });
        } else if (engine === "google") {
          if (!row.sitemapUrl) {
            throw new Error("Google indexing requires a sitemap URL for automated pings.");
          }

          const res = await pingGoogleSitemap(row.sitemapUrl);
          submissionRows.push({
            websiteId: row.websiteId,
            url: `Cron Google Sitemap Ping`,
            engine,
            status: res.success ? "success" : "failed",
            errorMessage: res.success ? undefined : res.error,
          });
        } else if (engine === "pingomatic") {
          const urlsToPing = [row.websiteUrl, ...urls.slice(0, 3)];
          let pingOk = true;
          for (const targetUrl of urlsToPing) {
            const pingResult = await pingService("pingomatic", "IndexFast Automated Site", targetUrl);
            if (!pingResult?.success) pingOk = false;
          }
          submissionRows.push({
            websiteId: row.websiteId,
            url: `Cron Ping-o-matic broadcast for ${urlsToPing.length} URLs`,
            engine,
            status: pingOk ? ("success" as const) : ("failed" as const),
          });
        } else {
          throw new Error(`Engine ${engine} is not supported for automated cron jobs yet.`);
        }

        if (submissionRows.length > 0) {
          await db.insert(submissions).values(submissionRows);
        }

        // Update URL inventory if source was inventory to mark as submitted
        if (row.sourceMode === "inventory" && urls.length > 0) {
          // URLs are unique, update lastSubmittedAt for these URLs
          const batches = splitIntoBatches(urls, 100);
          for (const batch of batches) {
            await db
              .update(urlInventory)
              .set({ lastSubmittedAt: new Date() })
              .where(
                and(
                  eq(urlInventory.websiteId, row.websiteId),
                  inArray(urlInventory.url, batch)
                )
              );
          }
        }

        await db
          .update(websites)
          .set({ lastSyncAt: new Date() })
          .where(eq(websites.id, row.websiteId));

        await db
          .update(cronJobs)
          .set({
            lastRunAt: new Date(),
            nextRunAt: calculateNextRunFromFrequency(row.frequency),
            updatedAt: new Date(),
          })
          .where(eq(cronJobs.id, row.jobId));

        processed += 1;
      } catch (error) {
        failed += 1;

        const message = error instanceof Error ? error.message : "Unknown cron execution error";

        await db.insert(submissions).values({
          websiteId: row.websiteId,
          url: `Cron job ${row.jobId}`,
          engine: row.engine as SupportedEngine,
          status: "failed",
          errorMessage: message,
        });

        await db
          .update(cronJobs)
          .set({
            lastRunAt: new Date(),
            nextRunAt: calculateNextRunFromFrequency(row.frequency),
            updatedAt: new Date(),
          })
          .where(eq(cronJobs.id, row.jobId));
      }
    })
  );

  return {
    scanned: dueRows.length,
    processed,
    skipped,
    failed,
    timestamp: new Date().toISOString(),
  };
}
