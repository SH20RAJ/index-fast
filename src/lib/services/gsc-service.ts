import { db } from "@/lib/db";
import { websites } from "@/lib/db/schema";
import { listSearchConsoleSites } from "@/lib/api/google";

export async function importGscSites(userId: string, accessToken: string) {
  const gscSites = await listSearchConsoleSites(accessToken);
  if (!gscSites || gscSites.length === 0) {
    return { message: "No sites found in Google Search Console" };
  }

  // Map GSC sites to our website schema
  const sitesToImport = gscSites.map((site) => ({
    userId,
    url: site.siteUrl!,
    sitemapUrl: `${site.siteUrl!.endsWith("/") ? site.siteUrl : site.siteUrl + "/"}sitemap.xml`, // Default assumption
    isPro: false,
    createdAt: new Date(),
  }));

  // Batch insert new sites (avoiding duplicates by skipping if already exists for user?)
  // For MVP, we'll just insert and the user can delete.
  const result = await db.insert(websites).values(sitesToImport).returning();

  return {
    message: "GSC sites imported successfully",
    count: result.length,
    sites: result,
  };
}
