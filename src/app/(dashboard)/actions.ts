"use server";

import { and, count, desc, eq, gte, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { submissions, users, websites } from "@/lib/db/schema";
import { ensureUserRecord } from "@/lib/db/user-sync";
import { PLAN_DEFINITIONS, PlanDefinition, PlanId, getPlanDefinition, resolvePlanId } from "@/lib/billing/plans";
import { stackServerApp } from "@/stack";
import { processWebsiteIndexing, triggerSubmissions } from "@/lib/services/indexing-service";
import { GSC_READONLY_SCOPE } from "@/lib/google/constants";
import { importGscSites } from "@/lib/services/gsc-service";
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
  engine: "bing" | "indexnow" | "google" | "pingomatic" | "pingler";
  status: "success" | "failed" | "pending";
  createdAt: Date | null;
}

export interface DashboardSiteSummary {
  id: string;
  url: string;
  lastSyncAt: Date | null;
  submissions: number;
}

export interface DashboardData {
  userId: string;
  email: string;
  planId: PlanId;
  plan: PlanDefinition;
  websitesCount: number;
  submissionsThisMonth: number;
  successfulThisMonth: number;
  recentSubmissions: DashboardSubmission[];
  topSites: DashboardSiteSummary[];
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

export async function addWebsiteAction(_: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const user = await getAuthedUser();
    const { plan } = await getSubscriptionSnapshot(user.id);
    const total = await getWebsiteUsageCount(user.id);

    if (total >= plan.websiteLimit) {
      return {
        status: "error",
        message: `Your ${plan.name} plan allows up to ${plan.websiteLimit} websites. Upgrade to add more.`,
      };
    }

    const websiteUrl = normalizeWebsiteUrl(String(formData.get("url") ?? ""));
    const sitemapUrl = normalizeOptionalUrl(formData.get("sitemapUrl")?.toString() ?? null);
    const indexNowKey = String(formData.get("indexNowKey") ?? "").trim() || null;
    const bingApiKey = String(formData.get("bingApiKey") ?? "").trim() || null;
    const indexNowKeyLocationUrl = normalizeOptionalAbsoluteUrl(
      formData.get("indexNowKeyLocationUrl")?.toString() ?? null,
      "IndexNow key location URL"
    );

    const siteHealth = indexNowKeyLocationUrl
      ? {
          indexing: {
            indexNow: {
              keyLocationUrl: indexNowKeyLocationUrl,
            },
          },
        }
      : null;

    await db.insert(websites).values({
      userId: user.id,
      url: websiteUrl,
      sitemapUrl,
      indexNowKey,
      bingApiKey,
      siteHealth,
    });

    revalidatePath("/sites");
    revalidatePath("/dashboard");
    return { status: "success", message: "Website added successfully." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to add website.",
    };
  }
}

export async function updateWebsiteIndexingKeysAction(_: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const user = await getAuthedUser();
    const websiteId = String(formData.get("websiteId") ?? "").trim();

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

    const indexNowKey = String(formData.get("indexNowKey") ?? "").trim() || null;
    const bingApiKey = String(formData.get("bingApiKey") ?? "").trim() || null;
    const indexNowKeyLocationUrl = normalizeOptionalAbsoluteUrl(
      formData.get("indexNowKeyLocationUrl")?.toString() ?? null,
      "IndexNow key location URL"
    );

    const currentSiteHealth = ((website.siteHealth as Record<string, unknown> | null) ?? {}) as Record<string, unknown>;
    const nextSiteHealth: Record<string, unknown> = { ...currentSiteHealth };
    const indexing =
      typeof nextSiteHealth.indexing === "object" && nextSiteHealth.indexing !== null
        ? { ...(nextSiteHealth.indexing as Record<string, unknown>) }
        : {};
    const indexNow =
      typeof indexing.indexNow === "object" && indexing.indexNow !== null
        ? { ...(indexing.indexNow as Record<string, unknown>) }
        : {};

    if (indexNowKeyLocationUrl) {
      indexNow.keyLocationUrl = indexNowKeyLocationUrl;
    } else {
      delete indexNow.keyLocationUrl;
    }

    if (Object.keys(indexNow).length > 0) {
      indexing.indexNow = indexNow;
    } else {
      delete indexing.indexNow;
    }

    if (Object.keys(indexing).length > 0) {
      nextSiteHealth.indexing = indexing;
    } else {
      delete nextSiteHealth.indexing;
    }

    await db
      .update(websites)
      .set({
        indexNowKey,
        bingApiKey,
        siteHealth: Object.keys(nextSiteHealth).length > 0 ? nextSiteHealth : null,
      })
      .where(eq(websites.id, websiteId));

    revalidatePath("/sites");
    revalidatePath("/dashboard");

    return { status: "success", message: "Indexing credentials updated." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to update indexing credentials.",
    };
  }
}

export async function importGscSitesAction(_: ActionState, _formData: FormData): Promise<ActionState> {
  try {
    const user = await getAuthedUser();

    const connectedAccounts = await user.listConnectedAccounts();
    const googleAccount = connectedAccounts.find((account) => account.provider === "google");

    if (!googleAccount) {
      return {
        status: "error",
        message: "No Google account is connected to this login. Sign in with Google first, then retry import.",
      };
    }

    const tokenResult = await googleAccount.getAccessToken({ scopes: [GSC_READONLY_SCOPE] });

    if (tokenResult.status !== "ok" || !tokenResult.data.accessToken) {
      return {
        status: "error",
        message:
          "Google Search Console access token is unavailable. Click Reconnect Google, approve Search Console permissions, then run import again.",
      };
    }

    // Get plan info to enforce website limit
    const { plan } = await getSubscriptionSnapshot(user.id);

    const result = await importGscSites(user.id, tokenResult.data.accessToken, plan.websiteLimit);

    revalidatePath("/sites");
    revalidatePath("/dashboard");

    return {
      status: "success",
      message: `${result.message} ${result.skippedCount > 0 ? `Skipped ${result.skippedCount} existing/unsupported site(s).` : ""}`.trim(),
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to import Search Console sites.",
    };
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
    revalidatePath("/sites");
    revalidatePath("/submissions");
    revalidatePath("/dashboard");

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

    revalidatePath("/sites");
    revalidatePath("/dashboard");
    revalidatePath("/submissions");
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

    console.log("[Dashboard] Fetching counts and submissions...");
    const [websiteResult, submissionsResult, successfulResult, recentSubmissions, topSitesRaw] = await Promise.all([
      db.select({ count: count() }).from(websites).where(eq(websites.userId, user.id)),
      db.select({ count: count() }).from(submissions)
        .innerJoin(websites, eq(submissions.websiteId, websites.id))
        .where(and(eq(websites.userId, user.id), gte(submissions.createdAt, monthStart))),
      db.select({ count: count() }).from(submissions)
        .innerJoin(websites, eq(submissions.websiteId, websites.id))
        .where(and(eq(websites.userId, user.id), gte(submissions.createdAt, monthStart), eq(submissions.status, "success"))),
      db.select({
        id: submissions.id,
        websiteId: websites.id,
        websiteUrl: websites.url,
        url: submissions.url,
        engine: submissions.engine,
        status: submissions.status,
        createdAt: submissions.createdAt,
      }).from(submissions)
        .innerJoin(websites, eq(submissions.websiteId, websites.id))
        .where(eq(websites.userId, user.id))
        .orderBy(desc(submissions.createdAt))
        .limit(8),
      db.select({
        id: websites.id,
        url: websites.url,
        lastSyncAt: websites.lastSyncAt,
        submissions: sql<number>`count(${submissions.id})`,
      }).from(websites)
        .leftJoin(submissions, eq(submissions.websiteId, websites.id))
        .where(eq(websites.userId, user.id))
        .groupBy(websites.id)
        .orderBy(desc(sql<number>`count(${submissions.id})`))
        .limit(5)
    ]);

    const websitesCount = websiteResult[0]?.count ?? 0;
    const submissionsThisMonth = submissionsResult[0]?.count ?? 0;
    const successfulThisMonth = successfulResult[0]?.count ?? 0;
    const topSites = topSitesRaw.map((site) => ({ ...site, submissions: Number(site.submissions || 0) }));

    return {
      userId: user.id,
      email: userRow?.email ?? user.primaryEmail ?? `${user.id}@indexfast.local`,
      planId,
      plan,
      websitesCount,
      submissionsThisMonth,
      successfulThisMonth,
      recentSubmissions,
      topSites,
      usage: {
        websitesUsed: websitesCount,
        websitesLimit: plan.websiteLimit,
        submissionsUsed: submissionsThisMonth,
        submissionsLimit: plan.submissionLimitMonthly,
      },
    };
  } catch (error) {
    console.error("[Dashboard] Critical data load failure:", error);
    // Return a safe fallback state instead of 500-ing
    const fallbackPlan = getPlanDefinition("free");
    return {
      userId: user.id,
      email: user.primaryEmail ?? "User",
      planId: "free",
      plan: fallbackPlan,
      websitesCount: 0,
      submissionsThisMonth: 0,
      successfulThisMonth: 0,
      recentSubmissions: [],
      topSites: [],
      usage: {
        websitesUsed: 0,
        websitesLimit: fallbackPlan.websiteLimit,
        submissionsUsed: 0,
        submissionsLimit: fallbackPlan.submissionLimitMonthly,
      },
    };
  }
}

export async function refreshGscMetadataAction(_: ActionState, formData: FormData): Promise<ActionState> {
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

    const connectedAccounts = await user.listConnectedAccounts();
    const googleAccount = connectedAccounts.find((account) => account.provider === "google");

    if (!googleAccount) {
      return {
        status: "error",
        message: "No Google account connected. Connect Google first to refresh GSC metadata.",
      };
    }

    const tokenResult = await googleAccount.getAccessToken({ scopes: [GSC_READONLY_SCOPE] });

    if (tokenResult.status !== "ok" || !tokenResult.data.accessToken) {
      return {
        status: "error",
        message: "Could not retrieve Google access token. Reconnect your Google account.",
      };
    }

    // Use the GSC service to refresh metadata for this specific site
    const { listSearchConsoleSitemaps } = await import("@/lib/api/google");
    const discoveredSitemaps = await listSearchConsoleSitemaps(tokenResult.data.accessToken, website.url);
    const sitemapUrl = discoveredSitemaps[0] ?? website.sitemapUrl;

    // Update the website with refreshed GSC metadata
    const siteHealth = (website.siteHealth as any) || {};
    siteHealth.gsc = {
      ...siteHealth.gsc,
      refreshedAt: new Date().toISOString(),
      discoveredSitemaps,
    };

    await db
      .update(websites)
      .set({
        sitemapUrl: sitemapUrl || website.sitemapUrl,
        siteHealth,
        gscConnected: true,
      })
      .where(eq(websites.id, websiteId));

    revalidatePath("/sites");
    revalidatePath("/dashboard");

    return {
      status: "success",
      message: "GSC metadata refreshed successfully.",
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to refresh GSC metadata.",
    };
  }
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

    const siteHealth = (website.siteHealth as any) || {};

    return {
      status: "success",
      data: {
        sitemapUrl: website.sitemapUrl,
        discoveredSitemaps: siteHealth?.gsc?.discoveredSitemaps || [],
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

export async function getSiteInsightsAction(websiteId: string) {
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

    if (!website.gscConnected) {
      return { status: "error", message: "Connect Google Search Console first." };
    }

    const connectedAccounts = await user.listConnectedAccounts();
    const googleAccount = connectedAccounts.find((account) => account.provider === "google");

    if (!googleAccount) {
      return { status: "error", message: "Google account not connected." };
    }

    const tokenResult = await googleAccount.getAccessToken({ scopes: [GSC_READONLY_SCOPE] });

    if (tokenResult.status !== "ok" || !tokenResult.data.accessToken) {
      return { status: "error", message: "Google Search Console permissions required. Please re-authenticate." };
    }

    const { getSearchAnalytics } = await import("@/lib/api/google");
    const siteUrl = website.url;
    
    // Fallback: If site was a sc-domain it should technically be handled by normalizing early, 
    // but the original GSC siteUrl might be needed. Let's try website.url first.
    let rows;
    try {
      rows = await getSearchAnalytics(tokenResult.data.accessToken, siteUrl, 28);
    } catch (e: any) {
      // If the URL fails, sometimes GSC expects sc-domain
      const domainUrl = `sc-domain:${siteUrl.replace(/^https?:\/\//, '')}`;
      rows = await getSearchAnalytics(tokenResult.data.accessToken, domainUrl, 28);
    }

    return {
      status: "success",
      data: rows,
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to load insights.",
    };
  }
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
