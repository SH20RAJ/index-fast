import { db } from "@/lib/db";
import { websites } from "@/lib/db/schema";
import { stackServerApp } from "@/stack";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import SiteJobsManagerView from "./SiteJobsManagerView";
import { ensureUserRecord } from "@/lib/db/user-sync";

export const metadata = {
  title: "Automation — IndexFast",
  description: "Schedule automated indexing jobs for your properties.",
};

interface JobsPageProps {
  searchParams?: Promise<{ siteId?: string }>;
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const user = await stackServerApp.getUser();
  if (!user) {
    redirect("/handler/sign-in");
  }

  // Ensure user exists in local DB
  await ensureUserRecord({ id: user.id, primaryEmail: user.primaryEmail });

  const sites = await db
    .select({ id: websites.id, url: websites.url, sitemapUrl: websites.sitemapUrl })
    .from(websites)
    .where(eq(websites.userId, user.id))
    .orderBy(desc(websites.createdAt));

  const params = await searchParams;
  const initialSiteId = params?.siteId || sites[0]?.id || null;

  return <SiteJobsManagerView sites={sites} initialSiteId={initialSiteId} />;
}
