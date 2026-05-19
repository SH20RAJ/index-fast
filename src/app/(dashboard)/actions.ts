"use server";

import { and, count, desc, eq, gte, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { submissions, users, websites, websiteSources, cronJobs } from "@/lib/db/schema";

import { ensureUserRecord } from "@/lib/db/user-sync";
import { PLAN_DEFINITIONS, PlanDefinition, PlanId, getPlanDefinition, resolvePlanId } from "@/lib/billing/plans";
import { stackServerApp } from "@/stack";
import { processWebsiteIndexing, triggerSubmissions } from "@/lib/services/indexing-service";
import { crawlSitemap } from "@/lib/utils/sitemap-crawler";
import {
  getMonthlySubmissionUsageCount,
  getSubscriptionSnapshot,
  getWebsiteUsageCount,
} from "@/lib/services/subscription-service";
import { getDodoClient, getDodoProductId, getDodoReturnUrl, toAbsoluteUrl } from "@/lib/payments/dodo";
import type { ActionState } from "@/app/(dashboard)/action-state";

export interface DashboardSubmission {
  id: string;
  websiteId: string | null;
  websiteUrl: string | null;
  url: string;
  engine: "bing" | "indexnow" | "google" | "pingomatic" | "pingler" | "yandex" | "baidu" | "naver";
  status: "success" | "failed" | "pending";
  createdAt: Date | null;
}

export interface DashboardSiteSummary {
  id: string;
  name: string;
  domain: string;
  url: string;
  sitemapUrl: string | null;
  lastSyncAt: Date | null;
  indexNowVerified: boolean;
  bingApiKeyLastFour: string | null;
  autoIndexingEnabled: boolean;
  sourceCount: number;
}

export interface DashboardData {
  userId: string;
  email: string;
  planId: PlanId;
  plan: PlanDefinition;
  websitesCount: number;
  sites: DashboardSiteSummary[];
  usage: {
    websitesUsed: number;
    websitesLimit: number;
    submissionsUsed: number;
    submissionsLimit: number;
  };
}


export async function getAuthedUser() {
  console.log("[Dashboard] Calling Stack getUser()...");
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      console.warn("[Dashboard] Redirecting guest to sign-in.");
      redirect("/sign-in");
    }

    console.log(`[Dashboard] User ID: ${user.id}. Email: ${user.primaryEmail || "NONE"}`);
    
    // Perform silent DB sync (supported on pooler port 6543)
    try {
      await ensureUserRecord({ id: user.id, primaryEmail: user.primaryEmail });
    } catch (dbError) {
      console.error("[Dashboard] Background user sync failed (Non-fatal):", dbError);
    }
    
    return user;
  } catch (error) {
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) throw error;
    console.error("[Dashboard] Auth error in getAuthedUser:", error);
    throw error;
  }
}

function normalizeWebsiteUrl(raw: string) {
  const value = raw.trim();
  if (!value) {
    throw new Error("Website URL is required.");
  }

  const normalized = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const parsed = new URL(normalized);
    return parsed.origin;
  } catch {
    throw new Error("Please enter a valid website URL.");
  }
}

function normalizeOptionalUrl(raw: string | null) {
  if (!raw) {
    return null;
  }
  const value = raw.trim();
  if (!value) {
    return null;
  }

  try {
    return new URL(value).toString();
  } catch {
    throw new Error("Sitemap URL must be a valid URL.");
  }
}

function normalizeOptionalAbsoluteUrl(raw: string | null, fieldLabel: string) {
  if (!raw) {
    return null;
  }

  const value = raw.trim();
  if (!value) {
    return null;
  }

  try {
    return new URL(value).toString();
  } catch {
    throw new Error(`${fieldLabel} must be a valid URL.`);
  }
}

export async function updateAccountEmailAction(_: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const user = await getAuthedUser();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();

    if (!email || !email.includes("@")) {
      return { status: "error", message: "Please enter a valid email address." };
    }

    await db
      .update(users)
      .set({ email, updatedAt: new Date() })
      .where(eq(users.id, user.id));

    revalidatePath("/settings");
    revalidatePath("/dashboard");
    return { status: "success", message: "Account email updated." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to update email.",
    };
  }
}

export async function updateSubscriptionPlanAction(_: ActionState, formData: FormData): Promise<ActionState> {
  let checkoutUrl: string | null = null;

  try {
    const user = await getAuthedUser();
    const plan = String(formData.get("plan") ?? "") as PlanId;

    if (!Object.keys(PLAN_DEFINITIONS).includes(plan)) {
      return { status: "error", message: "Invalid plan selected." };
    }

    if (plan === "pro" || plan === "agency") {
      const productId = getDodoProductId(plan);
      if (!productId) {
        return {
          status: "error",
          message: `Missing Dodo product id for ${plan}. Configure DODO_PRODUCT_ID_${plan.toUpperCase()}.`,
        };
      }

      const [userRow] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
      const email = userRow?.email ?? user.primaryEmail ?? `${user.id}@indexfast.local`;
      const client = getDodoClient();

      const checkout = await client.checkoutSessions.create({
        product_cart: [{ product_id: productId, quantity: 1 }],
        return_url: toAbsoluteUrl(getDodoReturnUrl()),
        customer: {
          email,
          name: email.split("@")[0] || "IndexFast User",
        },
        metadata: {
          stackUserId: user.id,
          planId: plan,
        },
      });

      if (!checkout.checkout_url) {
        return { status: "error", message: "Could not create Dodo checkout URL." };
      }

      checkoutUrl = checkout.checkout_url;
    } else {
      const status = "inactive";
      const isPro = false;

      await db
        .update(users)
        .set({
          isPro,
          subscriptionStatus: status,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id));

      revalidatePath("/settings");
      revalidatePath("/dashboard");
      revalidatePath("/sites");
      return { status: "success", message: `Plan updated to ${PLAN_DEFINITIONS[plan].name}.` };
    }
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to update subscription.",
    };
  }

  if (checkoutUrl) {
    redirect(checkoutUrl);
  }

  return { status: "error", message: "Could not start checkout." };
}

export async function openBillingPortalAction() {
  const user = await getAuthedUser();
  const [userRow] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);

  if (!userRow?.dodoCustomerId) {
    throw new Error("No Dodo customer linked yet. Upgrade once to activate billing portal.");
  }

  const client = getDodoClient();
  const portal = await client.customers.customerPortal.create(userRow.dodoCustomerId, {
    return_url: toAbsoluteUrl(getDodoReturnUrl()),
  });

  redirect(portal.link);
}

export async function createWebsiteAction(_: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const user = await getAuthedUser();
    const name = String(formData.get("name") ?? "").trim();
    const websiteUrl = normalizeWebsiteUrl(String(formData.get("url") ?? ""));
    const sitemapUrl = normalizeOptionalUrl(formData.get("sitemapUrl")?.toString() ?? null);

    if (!name) return { status: "error", message: "Website name is required." };

    const { plan } = await getSubscriptionSnapshot(user.id);
    const total = await getWebsiteUsageCount(user.id);

    if (total >= plan.websiteLimit) {
      return {
        status: "error",
        message: `Your ${plan.name} plan allows up to ${plan.websiteLimit} websites.`,
      };
    }

    // Prevent duplicate URLs for the same user
    const existingSite = await db.query.websites.findFirst({
      where: and(eq(websites.userId, user.id), eq(websites.url, websiteUrl)),
    });
    if (existingSite) {
      return { status: "error", message: "You have already added this website." };
    }

    const domain = new URL(websiteUrl).hostname;

    const [newSite] = await db.insert(websites).values({
      userId: user.id,
      name,
      domain,
      url: websiteUrl,
      sitemapUrl,
      indexNowVerified: false,
      autoIndexingEnabled: false,
    }).returning();

    revalidatePath("/dashboard");
    return { status: "success", message: "Website created.", data: newSite.id };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "Failed to create website." };
  }
}

export async function addWebsiteSourceAction(_: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const user = await getAuthedUser();
    const websiteId = String(formData.get("websiteId") ?? "");
    const url = String(formData.get("url") ?? "").trim();
    const type = String(formData.get("type") ?? "sitemap") as any;

    if (!websiteId || !url) return { status: "error", message: "Missing required fields." };

    await db.insert(websiteSources).values({
      websiteId,
      userId: user.id,
      url,
      type,
      enabled: true,
    });

    revalidatePath("/dashboard");
    return { status: "success", message: "Source added." };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "Failed to add source." };
  }
}

export async function deleteWebsiteSourceAction(_: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const user = await getAuthedUser();
    const sourceId = String(formData.get("sourceId") ?? "");

    if (!sourceId) return { status: "error", message: "Missing source id." };

    await db.delete(websiteSources).where(and(eq(websiteSources.id, sourceId), eq(websiteSources.userId, user.id)));

    revalidatePath("/dashboard");
    return { status: "success", message: "Source removed." };
  } catch (error) {
    return { status: "error", message: "Failed to delete source." };
  }
}

export async function updateIndexNowSettingsAction(_: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const user = await getAuthedUser();
    const websiteId = String(formData.get("websiteId") ?? "");
    const indexNowKey = String(formData.get("indexNowKey") ?? "").trim();
    const indexNowKeyLocation = String(formData.get("indexNowKeyLocation") ?? "").trim();

    await db.update(websites).set({
      indexNowKey,
      indexNowKeyLocation,
      updatedAt: new Date(),
    }).where(and(eq(websites.id, websiteId), eq(websites.userId, user.id)));

    return { status: "success", message: "IndexNow settings saved." };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "Failed to save settings." };
  }
}

export async function verifyIndexNowKeyAction(_: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const user = await getAuthedUser();
    const websiteId = String(formData.get("websiteId") ?? "");

    const [website] = await db.select().from(websites).where(and(eq(websites.id, websiteId), eq(websites.userId, user.id)));
    if (!website || !website.indexNowKey || !website.indexNowKeyLocation) {
      return { status: "error", message: "IndexNow not configured." };
    }

    try {
      const resp = await fetch(website.indexNowKeyLocation);
      const body = await resp.text();
      if (body.includes(website.indexNowKey)) {
        await db.update(websites).set({ indexNowVerified: true }).where(eq(websites.id, websiteId));
        return { status: "success", message: "Key verified successfully!" };
      }
      return { status: "error", message: "Key not found at the specified URL." };
    } catch (e) {
      return { status: "error", message: "Could not fetch the key file. Check the URL." };
    }
  } catch (error) {
    return { status: "error", message: "Verification failed." };
  }
}

export async function updateBingApiKeyAction(_: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const user = await getAuthedUser();
    const websiteId = String(formData.get("websiteId") ?? "");
    const bingApiKey = String(formData.get("bingApiKey") ?? "").trim();

    if (!bingApiKey) {
      await db.update(websites).set({
        bingApiKey: null,
        bingApiKeyLastFour: null,
      }).where(and(eq(websites.id, websiteId), eq(websites.userId, user.id)));
      return { status: "success", message: "Bing API key removed." };
    }

    const lastFour = bingApiKey.slice(-4);
    await db.update(websites).set({
      bingApiKey, // Simple storage for now as requested
      bingApiKeyLastFour: lastFour,
    }).where(and(eq(websites.id, websiteId), eq(websites.userId, user.id)));

    return { status: "success", message: "Bing API key saved." };
  } catch (error) {
    return { status: "error", message: "Failed to save Bing API key." };
  }
}

export async function updateAutomationSettingsAction(_: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const user = await getAuthedUser();
    const websiteId = String(formData.get("websiteId") ?? "");
    const autoIndexingEnabled = formData.get("autoIndexingEnabled") === "on";
    const pingsEnabled = formData.get("pingsEnabled") === "on";

    await db.update(websites).set({
      autoIndexingEnabled,
      pingsEnabled,
      updatedAt: new Date(),
    }).where(and(eq(websites.id, websiteId), eq(websites.userId, user.id)));

    revalidatePath("/dashboard");
    return { status: "success", message: "Automation settings updated." };
  } catch (error) {
    return { status: "error", message: "Failed to update settings." };
  }
}

export async function saveCronJobAction(_: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const user = await getAuthedUser();
    const websiteId = String(formData.get("websiteId") ?? "");
    const engine = String(formData.get("engine") ?? "indexnow") as any;
    const frequency = String(formData.get("frequency") ?? "daily");
    const sourceMode = String(formData.get("sourceMode") ?? "inventory");
    const urlsVal = String(formData.get("urls") ?? "");
    const enabled = formData.get("enabled") !== "false"; // Default to true

    // Check if the user is a Pro user
    const [dbUser] = await db
      .select({ isPro: users.isPro })
      .from(users)
      .where(eq(users.id, user.id));
    const isPro = dbUser?.isPro ?? false;

    if (sourceMode === "inventory" && !isPro) {
      return { status: "error", message: "Auto-detecting new URLs is only available for Pro users." };
    }

    // Check if a cron job already exists for this engine
    const existing = await db.query.cronJobs.findFirst({
      where: and(eq(cronJobs.websiteId, websiteId), eq(cronJobs.engine, engine))
    });

    if (existing) {
      await db.update(cronJobs).set({
        frequency,
        sourceMode,
        urls: urlsVal,
        enabled,
        updatedAt: new Date(),
      }).where(eq(cronJobs.id, existing.id));
    } else {
      await db.insert(cronJobs).values({
        websiteId,
        engine,
        frequency,
        sourceMode,
        urls: urlsVal,
        enabled,
        nextRunAt: new Date(),
      });
    }

    revalidatePath(`/sites/${websiteId}`);
    revalidatePath("/dashboard/cron");
    return { status: "success", message: "Scheduler task saved successfully." };
  } catch (error) {
    console.error("Error in saveCronJobAction:", error);
    return { status: "error", message: "Failed to save scheduler settings." };
  }
}

export async function deleteCronJobAction(_: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const user = await getAuthedUser();
    const jobId = String(formData.get("jobId") ?? "");

    const websiteId = String(formData.get("websiteId") ?? "");

    await db.delete(cronJobs).where(eq(cronJobs.id, jobId));

    revalidatePath(`/sites/${websiteId}`);
    return { status: "success", message: "Auto-run task removed." };
  } catch (error) {
    return { status: "error", message: "Failed to remove auto-run task." };
  }
}

export async function runFirstSyncAction(_: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const user = await getAuthedUser();
    const websiteId = String(formData.get("websiteId") ?? "");

    // Using existing processWebsiteIndexing service
    const result = await processWebsiteIndexing(websiteId);
    
    await db.update(websites).set({ lastSyncAt: new Date() }).where(eq(websites.id, websiteId));

    revalidatePath("/dashboard");
    return { status: "success", message: "First sync completed successfully!" };
  } catch (error) {
    return { status: "error", message: "First sync failed." };
  }
}
export async function runWebsiteSyncAction(_: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const user = await getAuthedUser();
    const websiteId = String(formData.get("websiteId") ?? "");

    if (!websiteId) {
      return { status: "error", message: "Missing website id." };
    }

    const [website] = await db
      .select()
      .from(websites)
      .where(and(eq(websites.id, websiteId), eq(websites.userId, user.id)));

    if (!website) {
      return { status: "error", message: "Website not found." };
    }

    const { plan } = await getSubscriptionSnapshot(user.id);
    const submissionsUsedThisMonth = await getMonthlySubmissionUsageCount(user.id);

    if (submissionsUsedThisMonth >= plan.submissionLimitMonthly) {
      return {
        status: "error",
        message: `Monthly submission limit reached for ${plan.name}. Upgrade or wait for next cycle.`,
      };
    }

    const result = await processWebsiteIndexing(websiteId);
    revalidatePath("/dashboard");
    revalidatePath("/sites");

    if ("newUrlsCount" in result) {
      return { status: "success", message: `Sync complete: ${result.newUrlsCount} new URL(s) processed.` };
    }

    return { status: "success", message: String(result.message ?? "Sync complete.") };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Website sync failed.",
    };
  }
}

export async function deleteWebsiteAction(_: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const user = await getAuthedUser();
    const websiteId = String(formData.get("websiteId") ?? "");

    if (!websiteId) {
      return { status: "error", message: "Missing website id." };
    }

    await db
      .delete(websites)
      .where(and(eq(websites.id, websiteId), eq(websites.userId, user.id)));

    revalidatePath("/dashboard");
    revalidatePath("/sites");
    return { status: "success", message: "Website removed." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to delete website.",
    };
  }
}

export async function loadDashboardData(): Promise<DashboardData> {
  console.log("[Dashboard] Loading dashboard data...");
  const user = await getAuthedUser();
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  try {
    console.log(`[Dashboard] Fetching user row for ${user.id}...`);
    const [userRow] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
    const planId = resolvePlanId(userRow?.subscriptionStatus ?? null, userRow?.isPro ?? false);
    const plan = getPlanDefinition(planId);

    console.log("[Dashboard] Fetching websites and usage...");
    const [websitesRaw, submissionsResult] = await Promise.all([
      db.select({
        id: websites.id,
        name: websites.name,
        domain: websites.domain,
        url: websites.url,
        sitemapUrl: websites.sitemapUrl,
        lastSyncAt: websites.lastSyncAt,
        indexNowVerified: websites.indexNowVerified,
        bingApiKeyLastFour: websites.bingApiKeyLastFour,
        autoIndexingEnabled: websites.autoIndexingEnabled,
        sourceCount: sql<number>`(SELECT count(*) FROM ${websiteSources} WHERE ${websiteSources.websiteId} = ${websites.id})`,
      }).from(websites).where(eq(websites.userId, user.id)),
      db.select({ count: count() }).from(submissions)
        .innerJoin(websites, eq(submissions.websiteId, websites.id))
        .where(and(eq(websites.userId, user.id), gte(submissions.createdAt, monthStart))),
    ]);

    const websitesCount = websitesRaw.length;
    const submissionsThisMonth = submissionsResult[0]?.count ?? 0;
    
    const sites: DashboardSiteSummary[] = websitesRaw.map(site => ({
      ...site,
      indexNowVerified: site.indexNowVerified ?? false,
      autoIndexingEnabled: site.autoIndexingEnabled ?? false,
      sourceCount: Number(site.sourceCount || 0)
    }));

    return {
      userId: user.id,
      email: userRow?.email ?? user.primaryEmail ?? `${user.id}@indexfast.local`,
      planId,
      plan,
      websitesCount,
      sites,
      usage: {
        websitesUsed: websitesCount,
        websitesLimit: plan.websiteLimit,
        submissionsUsed: submissionsThisMonth,
        submissionsLimit: plan.submissionLimitMonthly,
      },
    };
  } catch (error) {
    console.error("[Dashboard] Critical data load failure:", error);
    const fallbackPlan = getPlanDefinition("free");
    return {
      userId: user.id,
      email: user.primaryEmail ?? "User",
      planId: "free",
      plan: fallbackPlan,
      websitesCount: 0,
      sites: [],
      usage: {
        websitesUsed: 0,
        websitesLimit: fallbackPlan.websiteLimit,
        submissionsUsed: 0,
        submissionsLimit: fallbackPlan.submissionLimitMonthly,
      },
    };
  }
}


export async function refreshGscMetadataAction(_: ActionState, _formData: FormData): Promise<ActionState> {
  return {
    status: "error",
    message: "GSC metadata refresh is deprecated. Focus on SEO features first.",
  };
}

export async function getSitemapStatsAction(websiteId: string) {
  try {
    const user = await getAuthedUser();

    if (!websiteId) {
      return { status: "error", message: "Missing website id." };
    }

    const [website] = await db
      .select()
      .from(websites)
      .where(and(eq(websites.id, websiteId), eq(websites.userId, user.id)));

    if (!website) {
      return { status: "error", message: "Website not found." };
    }

    const [{ discovered }] = await db
      .select({ discovered: count() })
      .from(submissions)
      .where(eq(submissions.websiteId, websiteId));

    const siteHealth = (website.siteHealth as Record<string, unknown> | null) || {};

    return {
      status: "success",
      data: {
        sitemapUrl: website.sitemapUrl,
        discoveredSitemaps: [] as string[],
        totalFetched: discovered || 0,
      }
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to load sitemap stats.",
    };
  }
}

export async function getSiteInsightsAction(_websiteId: string) {
  return {
    status: "error",
    message: "GSC insights are deprecated. Focus on SEO features first.",
  };
}
export async function fetchSitemapDetailsAction(url: string) {
  try {
    const details = await crawlSitemap(url);
    return { status: "success", data: details };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "Failed to crawl sitemap." };
  }
}

export async function bulkPingAction(websiteId: string, urls: string[]) {
  try {
    const user = await getAuthedUser();
    const [website] = await db.select().from(websites).where(eq(websites.id, websiteId));
    
    if (!website) return { status: "error", message: "Website not found." };
    
    // 1. Unified Submissions (Bing/IndexNow/Universal)
    // We pass isPro = true for manual bulk pings to give users the full power
    const results = await triggerSubmissions(website, urls, true);
    
    // 2. Wayback Machine Pings (Independent of the main triggerSubmissions for now)
    const waybackResults = await Promise.all(urls.map(async (url) => {
      try {
        const res = await fetch(`https://web.archive.org/save/${url}`, { method: "GET" });
        return { url, success: res.ok, engine: "wayback" as const };
      } catch (e) {
        return { url, success: false, engine: "wayback" as const };
      }
    }));
    
    return { 
      status: "success", 
      data: {
        submissions: results,
        wayback: waybackResults
      }
    };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "Bulk ping failed." };
  }
}

export async function getReaderContent(url: string): Promise<{ status: "success" | "error"; data?: string; message?: string }> {
  const user = await stackServerApp.getUser();
  if (!user) {
    return { status: "error", message: "Unauthorized" };
  }

  if (!url || !url.startsWith("http")) {
    return { status: "error", message: "Please provide a valid URL." };
  }

  try {
    const response = await fetch(`https://r.jina.ai/${url}`, {
      headers: {
        "Authorization": "Bearer jina_7b8e95c236c54cbc90939f5e161ea353CTnN_BZr3bVYU3dx294P2A7HRsiQ",
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { status: "error", message: errorData.message || `Jina API error: ${response.statusText}` };
    }

    const data = await response.json();
    // Jina JSON response usually has 'data' object with 'content'
    const markdown = data.data?.content || data.content || "No content found.";

    return { status: "success", data: markdown };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "An unexpected error occurred." };
  }
}

export async function getUserApiKey(): Promise<{ status: "success" | "error"; data?: string; message?: string }> {
  const user = await stackServerApp.getUser();
  if (!user) return { status: "error", message: "Unauthorized" };

  try {
    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, user.id),
    });

    if (dbUser?.apiKey) {
      return { status: "success", data: dbUser.apiKey };
    }

    // Generate first key if not exists
    const newKey = `idx_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;
    await db.update(users).set({ apiKey: newKey }).where(eq(users.id, user.id));
    
    return { status: "success", data: newKey };
  } catch (error) {
    return { status: "error", message: "Failed to retrieve API key" };
  }
}

export async function updateWebsiteSitemapAction(_: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const user = await getAuthedUser();
    const websiteId = String(formData.get("websiteId") ?? "").trim();
    const sitemapUrl = normalizeOptionalUrl(formData.get("sitemapUrl")?.toString() ?? null);

    if (!websiteId) {
      return { status: "error", message: "Missing website id." };
    }

    await db
      .update(websites)
      .set({ sitemapUrl, updatedAt: new Date() })
      .where(and(eq(websites.id, websiteId), eq(websites.userId, user.id)));

    revalidatePath("/sites");
    revalidatePath("/dashboard");
    revalidatePath(`/sites/${websiteId}`);

    return { status: "success", message: "Sitemap URL updated." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to update sitemap.",
    };
  }
}

export async function rotateApiKeyAction(): Promise<{ status: "success" | "error"; data?: string; message?: string }> {
  const user = await stackServerApp.getUser();
  if (!user) return { status: "error", message: "Unauthorized" };

  try {
    const newKey = `idx_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;
    await db.update(users).set({ apiKey: newKey }).where(eq(users.id, user.id));
    
    revalidatePath("/dashboard/api");
    return { status: "success", data: newKey, message: "API Key rotated successfully." };
  } catch (error) {
    return { status: "error", message: "Failed to rotate API key" };
  }
}
