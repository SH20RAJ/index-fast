import crypto from "crypto";
import { and, count, desc, eq, gte, sql } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getPlanDefinition, resolvePlanId } from "@/lib/billing/plans";
import { db } from "@/lib/db";
import { cronJobs, submissions, urlInventory, users, websites } from "@/lib/db/schema";

export const ADMIN_COOKIE_NAME = "indexfast-admin-session";
const ADMIN_PASSCODE = "17092006";
const ADMIN_SESSION_SECRET = process.env.ADMIN_PANEL_SECRET ?? "indexfast-admin-panel-secret";

export interface AdminUnlockState {
  status: "idle" | "error";
  message: string;
}

export interface AdminDashboardData {
  totals: {
    users: number;
    freeUsers: number;
    proUsers: number;
    agencyUsers: number;
    websites: number;
    websitesWithSitemaps: number;
    websitesWithGsc: number;
    submissions: number;
    successfulSubmissions: number;
    failedSubmissions: number;
    pendingSubmissions: number;
    submissionsThisMonth: number;
    successfulThisMonth: number;
    urlsTracked: number;
    urlsIndexed: number;
    activeCronJobs: number;
    discoverabilityScore: number;
  };
  planMix: Array<{
    id: string;
    label: string;
    count: number;
    limit: number;
  }>;
  topSites: Array<{
    id: string;
    url: string;
    userEmail: string;
    submissions: number;
    successRate: number;
    gscConnected: boolean;
    lastSyncAt: string | null;
  }>;
  recentSubmissions: Array<{
    id: string;
    url: string;
    engine: string;
    status: string;
    websiteUrl: string;
    userEmail: string;
    createdAt: string | null;
  }>;
  recentSites: Array<{
    id: string;
    url: string;
    userEmail: string;
    gscConnected: boolean;
    sitemapUrl: string | null;
    createdAt: string | null;
    lastSyncAt: string | null;
  }>;
}

function createAdminSessionToken(passcode: string) {
  return crypto.createHash("sha256").update(`${ADMIN_SESSION_SECRET}:${passcode}`).digest("hex");
}

export function isAdminSessionAuthorized(token: string | undefined) {
  return token === createAdminSessionToken(ADMIN_PASSCODE);
}

export async function unlockAdminAction(_: AdminUnlockState, formData: FormData): Promise<AdminUnlockState> {
  "use server";

  const passcode = String(formData.get("passcode") ?? "").trim();

  if (passcode !== ADMIN_PASSCODE) {
    return {
      status: "error",
      message: "Invalid passcode.",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, createAdminSessionToken(passcode), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 12,
  });

  redirect("/admin");
}

export async function lockAdminAction() {
  "use server";

  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  redirect("/admin");
}

export async function loadAdminDashboardData(): Promise<AdminDashboardData> {
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const [
    userCount,
    websiteCount,
    submissionCount,
    successCount,
    failedCount,
    pendingCount,
    websitesWithSitemaps,
    websitesWithGsc,
    trackedUrls,
    indexedUrls,
    activeCronJobs,
    discoverabilityScore,
    submissionsThisMonth,
    successfulThisMonth,
    recentUsers,
    recentSubmissions,
    recentSites,
    topSites,
  ] = await Promise.all([
    db.select({ total: count() }).from(users),
    db.select({ total: count() }).from(websites),
    db.select({ total: count() }).from(submissions),
    db.select({ total: count() }).from(submissions).where(eq(submissions.status, "success")),
    db.select({ total: count() }).from(submissions).where(eq(submissions.status, "failed")),
    db.select({ total: count() }).from(submissions).where(eq(submissions.status, "pending")),
    db.select({ total: count() }).from(websites).where(sql`${websites.sitemapUrl} is not null`),
    db.select({ total: count() }).from(websites).where(eq(websites.gscConnected, true)),
    db.select({ total: count() }).from(urlInventory),
    db.select({ total: count() }).from(urlInventory).where(eq(urlInventory.isIndexed, true)),
    db.select({ total: count() }).from(cronJobs).where(eq(cronJobs.enabled, true)),
    db.select({ average: sql<number>`coalesce(round(avg(${urlInventory.discoverabilityScore}), 0), 0)` }).from(urlInventory),
    db.select({ total: count() })
      .from(submissions)
      .where(gte(submissions.createdAt, monthStart)),
    db.select({ total: count() })
      .from(submissions)
      .where(and(gte(submissions.createdAt, monthStart), eq(submissions.status, "success"))),
    db.select({
      id: users.id,
      email: users.email,
      subscriptionStatus: users.subscriptionStatus,
      isPro: users.isPro,
    }).from(users)
      .orderBy(desc(users.createdAt))
      .limit(25),
    db.select({
      id: submissions.id,
      url: submissions.url,
      engine: submissions.engine,
      status: submissions.status,
      createdAt: submissions.createdAt,
      websiteUrl: websites.url,
      userEmail: users.email,
    }).from(submissions)
      .leftJoin(websites, eq(submissions.websiteId, websites.id))
      .leftJoin(users, eq(websites.userId, users.id))
      .orderBy(desc(submissions.createdAt))
      .limit(10),
    db.select({
      id: websites.id,
      url: websites.url,
      sitemapUrl: websites.sitemapUrl,
      gscConnected: websites.gscConnected,
      lastSyncAt: websites.lastSyncAt,
      createdAt: websites.createdAt,
      userEmail: users.email,
    }).from(websites)
      .leftJoin(users, eq(websites.userId, users.id))
      .orderBy(desc(websites.createdAt))
      .limit(8),
    db.select({
      id: websites.id,
      url: websites.url,
      gscConnected: websites.gscConnected,
      lastSyncAt: websites.lastSyncAt,
      userEmail: users.email,
      submissions: sql<number>`count(${submissions.id})`,
      successRate: sql<number>`coalesce(
        round(
          100.0 * sum(case when ${submissions.status} = 'success' then 1 else 0 end)
          / nullif(count(${submissions.id}), 0)
        ),
        0
      )`,
    }).from(websites)
      .leftJoin(users, eq(websites.userId, users.id))
      .leftJoin(submissions, eq(submissions.websiteId, websites.id))
      .groupBy(websites.id, users.email)
      .orderBy(desc(sql<number>`count(${submissions.id})`))
      .limit(6),
  ]);

  const planCounts = recentUsers.reduce(
    (accumulator, user) => {
      const planId = resolvePlanId(user.subscriptionStatus ?? null, user.isPro ?? false);
      accumulator[planId] = (accumulator[planId] ?? 0) + 1;
      return accumulator;
    },
    { free: 0, pro: 0, agency: 0 } as Record<"free" | "pro" | "agency", number>
  );

  const planMix = ["free", "pro", "agency"].map((planId) => {
    const plan = getPlanDefinition(planId as "free" | "pro" | "agency");
    return {
      id: planId,
      label: plan.name,
      count: planCounts[planId as "free" | "pro" | "agency"],
      limit: plan.websiteLimit,
    };
  });

  return {
    totals: {
      users: userCount[0]?.total ?? 0,
      freeUsers: planCounts.free,
      proUsers: planCounts.pro,
      agencyUsers: planCounts.agency,
      websites: websiteCount[0]?.total ?? 0,
      websitesWithSitemaps: websitesWithSitemaps[0]?.total ?? 0,
      websitesWithGsc: websitesWithGsc[0]?.total ?? 0,
      submissions: submissionCount[0]?.total ?? 0,
      successfulSubmissions: successCount[0]?.total ?? 0,
      failedSubmissions: failedCount[0]?.total ?? 0,
      pendingSubmissions: pendingCount[0]?.total ?? 0,
      submissionsThisMonth: submissionsThisMonth[0]?.total ?? 0,
      successfulThisMonth: successfulThisMonth[0]?.total ?? 0,
      urlsTracked: trackedUrls[0]?.total ?? 0,
      urlsIndexed: indexedUrls[0]?.total ?? 0,
      activeCronJobs: activeCronJobs[0]?.total ?? 0,
      discoverabilityScore: Number(discoverabilityScore[0]?.average ?? 0),
    },
    planMix,
    topSites: topSites.map((site) => ({
      id: site.id,
      url: site.url,
      userEmail: site.userEmail ?? "Unknown",
      submissions: Number(site.submissions ?? 0),
      successRate: Number(site.successRate ?? 0),
      gscConnected: Boolean(site.gscConnected),
      lastSyncAt: site.lastSyncAt ? site.lastSyncAt.toISOString() : null,
    })),
    recentSubmissions: recentSubmissions.map((submission) => ({
      id: submission.id,
      url: submission.url,
      engine: submission.engine,
      status: submission.status,
      websiteUrl: submission.websiteUrl ?? "Unknown site",
      userEmail: submission.userEmail ?? "Unknown user",
      createdAt: submission.createdAt ? submission.createdAt.toISOString() : null,
    })),
    recentSites: recentSites.map((site) => ({
      id: site.id,
      url: site.url,
      userEmail: site.userEmail ?? "Unknown user",
      gscConnected: Boolean(site.gscConnected),
      sitemapUrl: site.sitemapUrl,
      createdAt: site.createdAt ? site.createdAt.toISOString() : null,
      lastSyncAt: site.lastSyncAt ? site.lastSyncAt.toISOString() : null,
    })),
  };
}