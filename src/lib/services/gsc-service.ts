import "server-only";
import { and, eq, count, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { websites, gscProperties } from "@/lib/db/schema";
import { listSearchConsoleSites, listSearchConsoleSitemaps } from "@/lib/api/google";

export function normalizeWebsiteOrigin(rawUrl: string) {
  if (!rawUrl) return null;
  
  if (rawUrl.startsWith("sc-domain:")) {
    const domain = rawUrl.slice("sc-domain:".length).trim();
    if (!domain) return null;
    return `https://${domain}`;
  }

  try {
    const normalized = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
    const url = new URL(normalized);
    return url.origin;
  } catch {
    return null;
  }
}

function inferDefaultSitemap(rawUrl: string) {
  const origin = normalizeWebsiteOrigin(rawUrl);
  if (!origin) return null;
  return `${origin}/sitemap.xml`;
}

/**
 * Syncs the user's GSC properties to the local database cache.
 */
export async function syncGscProperties(userId: string, accessToken: string) {
  console.log(`[GSC Sync] Syncing properties for user ${userId}...`);
  const allGscSites = await listSearchConsoleSites(accessToken);
  console.log(`[GSC Sync] Fetched ${allGscSites.length} sites from GSC API.`);

  // Get currently imported websites to mark alreadyImported
  const existingWebsites = await db
    .select({ url: websites.url })
    .from(websites)
    .where(eq(websites.userId, userId));
  
  const existingUrlSet = new Set(existingWebsites.map(w => w.url));

  // Upsert properties into gsc_properties
  for (const site of allGscSites) {
    const normalizedUrl = normalizeWebsiteOrigin(site.siteUrl);
    const alreadyImported = normalizedUrl ? existingUrlSet.has(normalizedUrl) : false;

    await db.insert(gscProperties).values({
      userId,
      siteUrl: site.siteUrl,
      permissionLevel: site.permissionLevel,
      alreadyImported,
      lastSyncedAt: new Date(),
    }).onConflictDoUpdate({
      target: [gscProperties.userId, gscProperties.siteUrl], // Note: Need unique index for this
      set: {
        permissionLevel: site.permissionLevel,
        alreadyImported,
        lastSyncedAt: new Date(),
      }
    });
  }

  return allGscSites;
}

/**
 * Core logic for importing selected GSC properties into the websites table.
 */
export async function importGscSites(
  userId: string,
  accessToken: string,
  websiteLimit: number,
  selectedPropertyUrls?: string[]
) {
  console.log(`[GSC Import] Starting import for user ${userId}. Limit: ${websiteLimit}.`);
  
  // 1. Fetch all available sites to ensure we have fresh metadata
  const allGscSites = await listSearchConsoleSites(accessToken);
  
  const selectedSet = new Set((selectedPropertyUrls ?? []).map(v => v.trim()).filter(Boolean));
  const gscSitesToProcess = selectedSet.size > 0
    ? allGscSites.filter(site => selectedSet.has(site.siteUrl))
    : allGscSites;

  console.log(`[GSC Import] Processing ${gscSitesToProcess.length} sites.`);

  if (gscSitesToProcess.length === 0) {
    return {
      message: "No properties found to import.",
      importedCount: 0,
      skippedCount: 0,
      imported: [],
      skipped: [],
    };
  }

  // 2. Check current usage
  const [{ total: currentCount }] = await db
    .select({ total: count() })
    .from(websites)
    .where(eq(websites.userId, userId));

  const availableSlots = Math.max(0, websiteLimit - (currentCount ?? 0));

  const imported: any[] = [];
  const skipped: any[] = [];

  for (const site of gscSitesToProcess) {
    if (imported.length >= availableSlots) {
      skipped.push({ url: site.siteUrl, reason: "Plan limit reached" });
      continue;
    }

    const websiteUrl = normalizeWebsiteOrigin(site.siteUrl);
    if (!websiteUrl) {
      skipped.push({ url: site.siteUrl, reason: "Invalid URL" });
      continue;
    }

    // Check if already exists
    const [existing] = await db
      .select()
      .from(websites)
      .where(and(eq(websites.userId, userId), eq(websites.url, websiteUrl)))
      .limit(1);

    if (existing) {
      skipped.push({ url: websiteUrl, reason: "Already imported" });
      continue;
    }

    // 3. Fetch sitemaps for the property
    const discoveredSitemaps = await listSearchConsoleSitemaps(accessToken, site.siteUrl);
    const sitemapUrl = discoveredSitemaps[0] ?? inferDefaultSitemap(site.siteUrl);

    // 4. Create the website
    const [created] = await db.insert(websites).values({
      userId,
      url: websiteUrl,
      sitemapUrl,
      gscConnected: true,
      siteHealth: {
        gsc: {
          importedAt: new Date().toISOString(),
          sourceProperty: site.siteUrl,
          permissionLevel: site.permissionLevel,
          discoveredSitemaps,
        }
      },
      createdAt: new Date(),
    }).returning();

    imported.push(created);
  }

  return {
    message: imported.length > 0 ? `Successfully imported ${imported.length} site(s).` : "No new sites were imported.",
    importedCount: imported.length,
    skippedCount: skipped.length,
    imported,
    skipped,
  };
}
