import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { stackServerApp } from "@/stack";
import { db } from "@/lib/db";
import { websites } from "@/lib/db/schema";
import { ensureUserRecord } from "@/lib/db/user-sync";
import SiteUrlManagerView from "./SiteUrlManagerView";

export const metadata = {
  title: "Site URLs",
  description: "Inspect sitemap URLs, URL inventory, and run manual submission workflows.",
};

function normalizeWebsiteOrigin(rawUrl: any) {
  if (!rawUrl || typeof rawUrl !== "string") return null;

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

interface SitesUrlPageProps {
  searchParams?: Promise<{ siteId?: string | string[]; url?: string | string[] }>;
}

export default async function SitesUrlPage({ searchParams }: SitesUrlPageProps) {
  const user = await stackServerApp.getUser();
  if (!user) {
    redirect("/handler/sign-in");
  }

  try {
    await ensureUserRecord({ id: user.id, primaryEmail: user.primaryEmail });
  } catch (err) {
    console.error("[SitesUrlPage] User sync failed:", err);
  }

  const sites = await db
    .select({ id: websites.id, url: websites.url, sitemapUrl: websites.sitemapUrl })
    .from(websites)
    .where(eq(websites.userId, user.id))
    .orderBy(desc(websites.createdAt));

  const resolvedParams = (await searchParams) ?? {};
  const siteIdParam = Array.isArray(resolvedParams.siteId) ? resolvedParams.siteId[0] : resolvedParams.siteId;
  const urlParam = Array.isArray(resolvedParams.url) ? resolvedParams.url[0] : resolvedParams.url;

  let selectedSiteId = siteIdParam && sites.some((site) => site.id === siteIdParam)
    ? siteIdParam
    : null;

  if (!selectedSiteId && urlParam) {
    const normalized = normalizeWebsiteOrigin(urlParam);
    if (normalized) {
      const match = sites.find(s => s.url === normalized);
      if (match) selectedSiteId = match.id;
    }
  }

  if (!selectedSiteId) {
    selectedSiteId = sites[0]?.id ?? null;
  }

  return <SiteUrlManagerView sites={sites} initialSiteId={selectedSiteId} />;
}