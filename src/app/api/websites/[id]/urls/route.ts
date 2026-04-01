import { and, desc, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { stackServerApp } from "@/stack";
import { db } from "@/lib/db";
import { submissions, urlInventory, websites } from "@/lib/db/schema";
import { parseSitemap } from "@/lib/utils/sitemap-parser";

function extractDiscoveredSitemaps(siteHealth: unknown): string[] {
  if (!siteHealth || typeof siteHealth !== "object") {
    return [];
  }

  const gsc = (siteHealth as { gsc?: { discoveredSitemaps?: unknown } }).gsc;
  if (!gsc || !Array.isArray(gsc.discoveredSitemaps)) {
    return [];
  }

  return gsc.discoveredSitemaps.filter((entry): entry is string => typeof entry === "string" && entry.length > 0);
}

export async function GET(
  _request: Request,
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

  const [inventoryRows, latestSubmissions, statsRows] = await Promise.all([
    db
      .select({
        id: urlInventory.id,
        url: urlInventory.url,
        isIndexed: urlInventory.isIndexed,
        lastDetectedAt: urlInventory.lastDetectedAt,
        lastSubmittedAt: urlInventory.lastSubmittedAt,
      })
      .from(urlInventory)
      .where(eq(urlInventory.websiteId, website.id))
      .orderBy(desc(urlInventory.lastDetectedAt))
      .limit(400),
    db
      .select({
        id: submissions.id,
        engine: submissions.engine,
        status: submissions.status,
        url: submissions.url,
        createdAt: submissions.createdAt,
      })
      .from(submissions)
      .where(eq(submissions.websiteId, website.id))
      .orderBy(desc(submissions.createdAt))
      .limit(20),
    db
      .select({
        engine: submissions.engine,
        total: sql<number>`count(*)`,
        success: sql<number>`sum(case when ${submissions.status} = 'success' then 1 else 0 end)`,
        failed: sql<number>`sum(case when ${submissions.status} = 'failed' then 1 else 0 end)`,
      })
      .from(submissions)
      .where(eq(submissions.websiteId, website.id))
      .groupBy(submissions.engine),
  ]);

  const discoveredSitemaps = extractDiscoveredSitemaps(website.siteHealth);
  const sitemapCandidates = Array.from(new Set([website.sitemapUrl, ...discoveredSitemaps].filter(Boolean))) as string[];

  let sitemapPreview: { count: number; urls: string[]; error?: string } = { count: 0, urls: [] };
  if (sitemapCandidates.length > 0) {
    try {
      const parsed = await parseSitemap(sitemapCandidates[0]);
      sitemapPreview = {
        count: parsed.length,
        urls: parsed.slice(0, 120),
      };
    } catch (error) {
      sitemapPreview = {
        count: 0,
        urls: [],
        error: error instanceof Error ? error.message : "Failed to parse sitemap",
      };
    }
  }

  return NextResponse.json({
    website: {
      id: website.id,
      url: website.url,
      sitemapUrl: website.sitemapUrl,
      indexNowKey: website.indexNowKey,
      bingApiKey: website.bingApiKey,
      lastSyncAt: website.lastSyncAt,
    },
    sitemaps: {
      primary: website.sitemapUrl,
      discovered: discoveredSitemaps,
      candidates: sitemapCandidates,
    },
    inventory: {
      total: inventoryRows.length,
      urls: inventoryRows,
    },
    recentSubmissions: latestSubmissions,
    stats: statsRows.map((row) => ({
      engine: row.engine,
      total: Number(row.total || 0),
      success: Number(row.success || 0),
      failed: Number(row.failed || 0),
    })),
    sitemapPreview,
  });
}
