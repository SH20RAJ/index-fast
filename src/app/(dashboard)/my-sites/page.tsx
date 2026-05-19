import { desc, eq } from "drizzle-orm";
import { stackServerApp } from "@/stack";
import { db } from "@/lib/db";
import { websites, websiteSources } from "@/lib/db/schema";
import { redirect } from "next/navigation";
import MySitesView from "./MySitesView";

export const metadata = {
  title: "My Sites",
  description: "Manage your connected websites and monitoring.",
};

export default async function MySitesPage() {
  const user = await stackServerApp.getUser();
  if (!user) {
    redirect("/handler/sign-in");
  }

  const sites = await db
    .select({
      id: websites.id,
      name: websites.name,
      domain: websites.domain,
      url: websites.url,
      sitemapUrl: websites.sitemapUrl,
      lastSyncAt: websites.lastSyncAt,
      indexNowVerified: websites.indexNowVerified,
      bingApiKeyLastFour: websites.bingApiKeyLastFour,
      autoIndexingEnabled: websites.autoIndexingEnabled,
    })
    .from(websites)
    .where(eq(websites.userId, user.id))
    .orderBy(desc(websites.createdAt));

  // Get source counts for each site
  const sitesWithCounts = await Promise.all(
    sites.map(async (site) => {
      const sources = await db
        .select()
        .from(websiteSources)
        .where(eq(websiteSources.websiteId, site.id));
      
      return {
        ...site,
        indexNowVerified: site.indexNowVerified ?? false,
        autoIndexingEnabled: site.autoIndexingEnabled ?? false,
        sourceCount: sources.length,
      };
    })
  );

  return <MySitesView initialSites={sitesWithCounts} />;
}
