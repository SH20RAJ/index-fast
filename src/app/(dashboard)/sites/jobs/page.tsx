import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { stackServerApp } from "@/stack";
import { db } from "@/lib/db";
import { websites } from "@/lib/db/schema";
import { ensureUserRecord } from "@/lib/db/user-sync";
import SiteJobsManagerView from "./SiteJobsManagerView";

export const metadata = {
  title: "Site Jobs",
  description: "Create and manage automated submission schedules for each website.",
};

interface SitesJobsPageProps {
  searchParams?: Promise<{ siteId?: string }>;
}

export default async function SitesJobsPage({ searchParams }: SitesJobsPageProps) {
  const user = await stackServerApp.getUser();
  if (!user) {
    redirect("/handler/sign-in");
  }

  await ensureUserRecord({ id: user.id, primaryEmail: user.primaryEmail });

  const sites = await db
    .select({ id: websites.id, url: websites.url, sitemapUrl: websites.sitemapUrl })
    .from(websites)
    .where(eq(websites.userId, user.id))
    .orderBy(desc(websites.createdAt));

  const params = (await searchParams) ?? {};
  const selectedSiteId = params.siteId && sites.some((site) => site.id === params.siteId)
    ? params.siteId
    : sites[0]?.id ?? null;

  return <SiteJobsManagerView sites={sites} initialSiteId={selectedSiteId} />;
}
