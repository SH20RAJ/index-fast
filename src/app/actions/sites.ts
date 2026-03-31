"use server";

import { db } from "@/db";
import { sites, users, siteUrls } from "@/db/schema/sites";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { parseSitemap } from "@/lib/sitemap";
import { submitToIndexNow } from "@/lib/indexnow";
import { submitToBingBatch } from "@/lib/bing";

interface ActionResult {
  success?: boolean;
  error?: string;
  message?: string;
  count?: number;
}

export async function addSite(formData: FormData, userId: string): Promise<ActionResult | void> {
  const url = formData.get("url") as string;
  const sitemapUrl = formData.get("sitemapUrl") as string;
  const bingApiKey = formData.get("bingApiKey") as string;
  const indexNowKey = formData.get("indexNowKey") as string;

  if (!url) {
    return { error: "Website URL is required" };
  }

  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!existingUser) {
      await db.insert(users).values({
        id: userId,
        email: "syncing@indexfast.net", // Placeholder
      });
    }

    await db.insert(sites).values({
      id: nanoid(),
      url: url.replace(/\/$/, ""),
      ownerId: userId,
      sitemapUrl,
      bingApiKey,
      indexNowKey: indexNowKey || nanoid(32),
      isActive: true,
    });

    revalidatePath("/dashboard");
  } catch (error: unknown) {
    console.error("Add Site Error:", error);
    // Properly handle postgres duplicate key error
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === "23505") {
      return { error: "This website has already been added." };
    }
    return { error: error instanceof Error ? error.message : "An unexpected error occurred while adding the site." };
  }

  redirect("/dashboard");
}

export async function syncSite(siteId: string): Promise<ActionResult> {
  try {
    const site = await db.query.sites.findFirst({
      where: eq(sites.id, siteId),
    });

    if (!site || !site.sitemapUrl) {
      return { error: "Sitemap URL not configured for this site." };
    }

    const urls = await parseSitemap(site.sitemapUrl);
    if (urls.length === 0) {
      return { message: "No URLs found in sitemap." };
    }

    const urlsToInsert = urls.slice(0, 1000).map((u) => ({
      id: nanoid(),
      siteId,
      url: u,
      status: "PENDING" as const,
    }));

    await db.insert(siteUrls).values(urlsToInsert).onConflictDoNothing();
    await db.update(sites).set({ lastSync: new Date() }).where(eq(sites.id, siteId));

    // Submit to IndexNow
    if (site.indexNowKey) {
      const host = new URL(site.url).host;
      await submitToIndexNow(host, site.indexNowKey, urls.slice(0, 50));
    }

    // Submit to Bing Batch API
    if (site.bingApiKey) {
      // Bing URL Batching (up to 500 URLs per day per site usually)
      await submitToBingBatch(site.url, urls.slice(0, 500), site.bingApiKey);
    }

    revalidatePath("/dashboard");
    return { success: true, count: urls.length };
  } catch (error: unknown) {
    console.error("Sync Error:", error);
    return { error: error instanceof Error ? error.message : "Unknown error during sync" };
  }
}
