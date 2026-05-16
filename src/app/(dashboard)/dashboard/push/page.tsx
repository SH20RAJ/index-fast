import { desc, eq } from "drizzle-orm";
import { stackServerApp } from "@/stack";
import { db } from "@/lib/db";
import { websites } from "@/lib/db/schema";
import { redirect } from "next/navigation";
import PushIndexView from "./PushIndexView";

export const metadata = {
  title: "Push Indexing",
  description: "Send indexing signals to search engines for your URLs.",
};

export default async function PushPage() {
  const user = await stackServerApp.getUser();
  if (!user) {
    redirect("/handler/sign-in");
  }

  const sites = await db
    .select({
      id: websites.id,
      url: websites.url,
      sitemapUrl: websites.sitemapUrl,
      indexNowKey: websites.indexNowKey,
      bingApiKey: websites.bingApiKey,
    })
    .from(websites)
    .where(eq(websites.userId, user.id))
    .orderBy(desc(websites.createdAt));

  return <PushIndexView sites={sites} />;
}
