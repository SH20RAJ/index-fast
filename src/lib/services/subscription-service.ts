import { and, count, eq, gte } from "drizzle-orm";
import { db } from "@/lib/db";
import { submissions, users, websites } from "@/lib/db/schema";
import { PlanDefinition, PlanId, getPlanDefinition, resolvePlanId } from "@/lib/billing/plans";

export interface SubscriptionSnapshot {
  planId: PlanId;
  plan: PlanDefinition;
  isPro: boolean;
  subscriptionStatus: string;
}

function getMonthStart(now = new Date()) {
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export async function getSubscriptionSnapshot(userId: string): Promise<SubscriptionSnapshot> {
  const [userRow] = await db.select().from(users).where(eq(users.id, userId));
  const planId = resolvePlanId(userRow?.subscriptionStatus ?? null, userRow?.isPro ?? false);
  const plan = getPlanDefinition(planId);

  return {
    planId,
    plan,
    isPro: userRow?.isPro ?? false,
    subscriptionStatus: userRow?.subscriptionStatus ?? "inactive",
  };
}

export async function getWebsiteUsageCount(userId: string): Promise<number> {
  const [{ total }] = await db
    .select({ total: count() })
    .from(websites)
    .where(eq(websites.userId, userId));

  return total;
}

export async function getMonthlySubmissionUsageCount(userId: string, now = new Date()): Promise<number> {
  const monthStart = getMonthStart(now);
  const [{ total }] = await db
    .select({ total: count() })
    .from(submissions)
    .innerJoin(websites, eq(submissions.websiteId, websites.id))
    .where(and(eq(websites.userId, userId), gte(submissions.createdAt, monthStart)));

  return total;
}
