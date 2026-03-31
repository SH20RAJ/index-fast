import "server-only";

import { eq } from "drizzle-orm";
import type { PlanId } from "@/lib/billing/plans";
import { db } from "@/lib/db";
import { userSubscriptions, users } from "@/lib/db/schema";

type WebhookPayload = {
  type: string;
  data: unknown;
};

interface DodoSubscriptionSnapshot {
  customerId: string | null;
  subscriptionId: string | null;
  planCode: PlanId;
  status: "inactive" | "trialing" | "active" | "past_due" | "canceled";
  stackUserId: string | null;
  email: string | null;
}

function getString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function resolvePlanId(raw: string | null): PlanId {
  if (raw === "agency") {
    return "agency";
  }
  if (raw === "pro") {
    return "pro";
  }
  return "free";
}

function resolvePlanFromProductId(productId: string | null): PlanId {
  if (!productId) {
    return "free";
  }
  if (productId === process.env.DODO_PRODUCT_ID_AGENCY) {
    return "agency";
  }
  if (productId === process.env.DODO_PRODUCT_ID_PRO) {
    return "pro";
  }
  return "free";
}

function mapEventToLifecycleStatus(eventType: string): DodoSubscriptionSnapshot["status"] {
  if (["subscription.active", "subscription.renewed", "subscription.plan_changed", "subscription.updated"].includes(eventType)) {
    return "active";
  }
  if (eventType === "subscription.on_hold" || eventType === "subscription.failed") {
    return "past_due";
  }
  if (eventType === "subscription.expired" || eventType === "subscription.cancelled") {
    return "canceled";
  }
  if (eventType === "payment.succeeded") {
    return "active";
  }
  return "inactive";
}

function extractSnapshot(payload: WebhookPayload): DodoSubscriptionSnapshot | null {
  const data = payload.data as Record<string, unknown>;
  const customer = (data.customer ?? null) as Record<string, unknown> | null;
  const metadata = (data.metadata ?? null) as Record<string, unknown> | null;
  const productId = getString(data.product_id) ?? getString((data as { product_cart?: Array<{ product_id?: string }> }).product_cart?.[0]?.product_id);

  const stackUserId =
    getString(metadata?.stackUserId) ??
    getString(metadata?.userId) ??
    null;

  const planCode = resolvePlanId(getString(metadata?.planId)) !== "free"
    ? resolvePlanId(getString(metadata?.planId))
    : resolvePlanFromProductId(productId);

  return {
    customerId: getString(customer?.customer_id),
    subscriptionId: getString(data.subscription_id) ?? getString(data.id),
    planCode,
    status: mapEventToLifecycleStatus(payload.type),
    stackUserId,
    email: getString(customer?.email),
  };
}

export async function applyDodoWebhookPayload(payload: WebhookPayload) {
  const snapshot = extractSnapshot(payload);
  if (!snapshot) {
    return;
  }

  let userId = snapshot.stackUserId;

  if (!userId && snapshot.customerId) {
    const [row] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.dodoCustomerId, snapshot.customerId))
      .limit(1);
    userId = row?.id ?? null;
  }

  if (!userId) {
    return;
  }

  await db
    .insert(users)
    .values({
      id: userId,
      email: snapshot.email ?? `${userId}@indexfast.local`,
      isPro: snapshot.planCode !== "free",
      dodoCustomerId: snapshot.customerId,
      dodoSubscriptionId: snapshot.subscriptionId,
      subscriptionStatus: snapshot.status,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: users.id,
      set: {
        email: snapshot.email ?? `${userId}@indexfast.local`,
        isPro: snapshot.planCode !== "free",
        dodoCustomerId: snapshot.customerId,
        dodoSubscriptionId: snapshot.subscriptionId,
        subscriptionStatus: snapshot.status,
        updatedAt: new Date(),
      },
    });

  await db
    .insert(userSubscriptions)
    .values({
      userId,
      planCode: snapshot.planCode,
      status: snapshot.status,
      provider: "dodo",
      providerCustomerId: snapshot.customerId,
      providerSubscriptionId: snapshot.subscriptionId,
      metadata: payload as unknown as Record<string, unknown>,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: userSubscriptions.userId,
      set: {
        planCode: snapshot.planCode,
        status: snapshot.status,
        provider: "dodo",
        providerCustomerId: snapshot.customerId,
        providerSubscriptionId: snapshot.subscriptionId,
        metadata: payload as unknown as Record<string, unknown>,
        updatedAt: new Date(),
      },
    });
}
