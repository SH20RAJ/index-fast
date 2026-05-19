import { desc, eq } from "drizzle-orm";
import { stackServerApp } from "@/stack";
import { db } from "@/lib/db";
import { websites, cronJobs, users } from "@/lib/db/schema";
import { redirect } from "next/navigation";
import CronJobsView from "./CronJobsView";

export const metadata = {
  title: "Automation Scheduler — IndexFast",
  description: "Schedule automated indexing runs for your sitemaps, custom URL lists, or auto-detected changes.",
};

export default async function CronPage() {
  const user = await stackServerApp.getUser();
  if (!user) {
    redirect("/handler/sign-in");
  }

  // Get user details
  const [dbUser] = await db
    .select({ isPro: users.isPro })
    .from(users)
    .where(eq(users.id, user.id));

  const isPro = dbUser?.isPro ?? false;

  const sites = await db
    .select({
      id: websites.id,
      name: websites.name,
      url: websites.url,
      sitemapUrl: websites.sitemapUrl,
    })
    .from(websites)
    .where(eq(websites.userId, user.id))
    .orderBy(desc(websites.createdAt));

  // Get all cron jobs for the user's websites
  const jobs = await db
    .select({
      id: cronJobs.id,
      websiteId: cronJobs.websiteId,
      enabled: cronJobs.enabled,
      frequency: cronJobs.frequency,
      engine: cronJobs.engine,
      sourceMode: cronJobs.sourceMode,
      urls: cronJobs.urls,
      nextRunAt: cronJobs.nextRunAt,
      lastRunAt: cronJobs.lastRunAt,
      websiteUrl: websites.url,
      websiteName: websites.name,
    })
    .from(cronJobs)
    .innerJoin(websites, eq(cronJobs.websiteId, websites.id))
    .where(eq(websites.userId, user.id))
    .orderBy(desc(cronJobs.createdAt));

  return <CronJobsView sites={sites} initialCronJobs={jobs} isPro={isPro} />;
}
