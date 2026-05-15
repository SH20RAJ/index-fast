import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { stackServerApp } from "@/stack";
import { db } from "@/lib/db";
import { websites } from "@/lib/db/schema";
import { ensureUserRecord } from "@/lib/db/user-sync";
import SiteUrlManagerView from "../url/SiteUrlManagerView";

export const metadata = {
  title: "Site URLs",
  description: "Inspect sitemap URLs, URL inventory, and run manual submission workflows.",
};

interface SitePageProps {
  params: Promise<{ id: string }>;
}

export default async function SitePage({ params }: SitePageProps) {
  const user = await stackServerApp.getUser();
  if (!user) {
    redirect("/handler/sign-in");
  }

  const { id } = await params;

  try {
    await ensureUserRecord({ id: user.id, primaryEmail: user.primaryEmail });
  } catch (err) {
    console.error("[SitePage] User sync failed:", err);
  }

  const sites = await db
    .select({ id: websites.id, url: websites.url, sitemapUrl: websites.sitemapUrl })
    .from(websites)
    .where(eq(websites.userId, user.id))
    .orderBy(desc(websites.createdAt));

  const siteExists = sites.some((site) => site.id === id);

  if (!siteExists && sites.length > 0) {
    redirect(`/sites/${sites[0].id}`);
  }

  if (sites.length === 0) {
    redirect("/dashboard");
  }

  return <SiteUrlManagerView sites={sites} initialSiteId={id} />;
}
