import { db } from "@/lib/db";
import { websites, urlInventory, submissions, Website } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";
import { parseSitemap } from "@/lib/utils/sitemap-parser";
import { getUrlHash } from "@/lib/utils/hash";
import { submitToBingBatch } from "@/lib/api/bing";
import { submitToIndexNow } from "@/lib/api/indexnow";
import { pingAllUniversal } from "@/lib/api/ping-services";

export async function processWebsiteIndexing(websiteId: string) {
  const [website] = await db.select().from(websites).where(eq(websites.id, websiteId));
  if (!website || !website.sitemapUrl) {
    throw new Error("Website not found or sitemap URL missing");
  }

  // 1. Fetch and parse sitemap
  const currentUrls = await parseSitemap(website.sitemapUrl);
  if (currentUrls.length === 0) {
    return { message: "No URLs found in sitemap" };
  }

  // 2. Diff with existing inventory
  const existingUrls = await db
    .select({ url: urlInventory.url })
    .from(urlInventory)
    .where(eq(urlInventory.websiteId, websiteId));

  const existingUrlSet = new Set(existingUrls.map((u) => u.url));
  const newUrls = currentUrls.filter((url) => !existingUrlSet.has(url));

  if (newUrls.length === 0) {
    return { message: "No new URLs detected", count: 0 };
  }

  // 3. Store new URLs in inventory
  const newInventoryItems = newUrls.map((url) => ({
    websiteId,
    url,
    hash: getUrlHash(url),
    lastDetectedAt: new Date(),
  }));

  // Batch insert new URLs (using postgres-js syntax for batch insert)
  await db.insert(urlInventory).values(newInventoryItems);

  // 4. Trigger submissions
  const results = await triggerSubmissions(website, newUrls);

  // 5. Update last sync time
  await db.update(websites).set({ lastSyncAt: new Date() }).where(eq(websites.id, websiteId));

  return {
    message: "Indexing process completed",
    newUrlsCount: newUrls.length,
    results,
  };
}

async function triggerSubmissions(website: Website, urls: string[]) {
  const host = new URL(website.url).hostname;
  const submissionsToLog = [];

  // IndexNow
  if (website.indexNowKey) {
    const res = await submitToIndexNow(host, website.indexNowKey, urls);
    submissionsToLog.push({
      websiteId: website.id,
      url: urls.join(", "), // Log as batch for simplicity or individual? Let's do batch for now
      engine: "indexnow" as const,
      status: res.success ? ("success" as const) : ("failed" as const),
      errorMessage: res.error,
    });
  }

  // Bing
  if (website.bingApiKey) {
    const resList = await submitToBingBatch(website.url, urls, website.bingApiKey);
    resList.forEach((res, idx) => {
      submissionsToLog.push({
        websiteId: website.id,
        url: `Batch ${idx + 1}`,
        engine: "bing" as const,
        status: res.success ? ("success" as const) : ("failed" as const),
        errorMessage: res.error,
      });
    });
  }

  // Universal Pings (only for Pro users)
  if (website.isPro) {
    const pingResults = await pingAllUniversal("IndexFast User Site", website.url);
    pingResults.forEach((res) => {
      submissionsToLog.push({
        websiteId: website.id,
        url: website.url,
        engine: res.service as "pingomatic" | "pingler",
        status: res.success ? ("success" as const) : ("failed" as const),
        errorMessage: res.error,
      });
    });
  }

  // Log all submissions
  if (submissionsToLog.length > 0) {
    await db.insert(submissions).values(submissionsToLog);
  }

  return submissionsToLog;
}
