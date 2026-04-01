import { and, eq, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { websites } from "@/lib/db/schema";
import { listSearchConsoleSites, listSearchConsoleSitemaps } from "@/lib/api/google";

function normalizeWebsiteOrigin(rawUrl: string) {
  if (rawUrl.startsWith("sc-domain:")) {
    return null;
  }

  const normalized = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
  try {
    return new URL(normalized).origin;
  } catch {
    return null;
  }
}

function inferDefaultSitemap(rawUrl: string) {
  if (rawUrl.startsWith("sc-domain:")) {
    return null;
  }

  const normalized = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
  try {
    const url = new URL(normalized);
    return `${url.origin}/sitemap.xml`;
  } catch {
    return null;
  }
}

export async function importGscSites(userId: string, accessToken: string, websiteLimit: number) {
  const gscSites = await listSearchConsoleSites(accessToken);
  if (!gscSites || gscSites.length === 0) {
    return {
      message: "No sites found in Google Search Console",
      importedCount: 0,
      skippedCount: 0,
      imported: [],
      skipped: [],
    };
  }

  // Get current website count
  const [{ total: currentCount }] = await db
    .select({ total: count() })
    .from(websites)
    .where(eq(websites.userId, userId));

  const availableSlots = Math.max(0, websiteLimit - (currentCount ?? 0));

  if (availableSlots === 0) {
    return {
      message: "Plan limit reached",
      importedCount: 0,
      skippedCount: gscSites.length,
      imported: [],
      skipped: gscSites.map((site) => ({
        url: site.siteUrl,
        reason: `Plan allows maximum ${websiteLimit} website(s). Remove some to import new ones.`,
      })),
    };
  }

  const imported: Array<{ id: string; url: string; sitemapUrl: string | null }> = [];
  const skipped: Array<{ url: string; reason: string }> = [];

  for (const site of gscSites) {
    // Stop importing once we hit the limit
    if (imported.length >= availableSlots) {
      skipped.push({
        url: site.siteUrl,
        reason: `Plan limit reached. ${availableSlots} site(s) imported; remaining skipped.`,
      });
      continue;
    }

    const websiteUrl = normalizeWebsiteOrigin(site.siteUrl);

    if (!websiteUrl) {
      skipped.push({
        url: site.siteUrl,
        reason: "Only URL-prefix properties are supported right now. Domain properties are skipped.",
      });
      continue;
    }

    const [existing] = await db
      .select({ id: websites.id })
      .from(websites)
      .where(and(eq(websites.userId, userId), eq(websites.url, websiteUrl)))
      .limit(1);

    if (existing) {
      skipped.push({ url: websiteUrl, reason: "Already imported" });
      continue;
    }

    const discoveredSitemaps = await listSearchConsoleSitemaps(accessToken, site.siteUrl);
    const sitemapUrl = discoveredSitemaps[0] ?? inferDefaultSitemap(site.siteUrl);

    const [created] = await db
      .insert(websites)
      .values({
        userId,
        url: websiteUrl,
        sitemapUrl,
        gscConnected: true,
        siteHealth: {
          gsc: {
            importedAt: new Date().toISOString(),
            permissionLevel: site.permissionLevel,
            sourceProperty: site.siteUrl,
            discoveredSitemaps,
          },
        },
        createdAt: new Date(),
      })
      .returning({ id: websites.id, url: websites.url, sitemapUrl: websites.sitemapUrl });

    imported.push(created);
  }

  return {
    message: imported.length > 0 ? `Imported ${imported.length} site(s) from Google Search Console.` : "No new sites were imported.",
    importedCount: imported.length,
    skippedCount: skipped.length,
    imported,
    skipped,
  };
}
