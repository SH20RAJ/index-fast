import "server-only";

import DodoPayments from "dodopayments";
import type { PlanId } from "@/lib/billing/plans";

type DodoEnvironment = "test_mode" | "live_mode";

const isProduction = process.env.NODE_ENV === "production";

const ENV_TO_API_KEY: Record<DodoEnvironment, string | undefined> = {
  test_mode: process.env.DODO_PAYMENTS_API_KEY_TEST,
  live_mode: process.env.DODO_PAYMENTS_API_KEY_LIVE,
};

const ENV_TO_WEBHOOK_SECRET: Record<DodoEnvironment, string | undefined> = {
  test_mode: process.env.DODO_WEBHOOK_SECRET_TEST,
  live_mode: process.env.DODO_WEBHOOK_SECRET_LIVE,
};

const PRODUCT_ID_BY_PLAN_AND_ENV: Record<DodoEnvironment, Partial<Record<PlanId, string | undefined>>> = {
  test_mode: {
    pro: process.env.DODO_PRODUCT_ID_PRO_TEST,
    agency: process.env.DODO_PRODUCT_ID_AGENCY_TEST,
  },
  live_mode: {
    pro: process.env.DODO_PRODUCT_ID_PRO_LIVE,
    agency: process.env.DODO_PRODUCT_ID_AGENCY_LIVE,
  },
};

const PRODUCT_ID_BY_PLAN_FALLBACK: Partial<Record<PlanId, string | undefined>> = {
  pro: process.env.DODO_PRODUCT_ID_PRO,
  agency: process.env.DODO_PRODUCT_ID_AGENCY,
};

function normalizeEnvironment(): DodoEnvironment {
  return isProduction ? "live_mode" : "test_mode";
}

export function getDodoEnvironment(): DodoEnvironment {
  return normalizeEnvironment();
}

export function getDodoApiKey(): string {
  const env = normalizeEnvironment();
  const key = process.env.DODO_PAYMENTS_API_KEY ?? ENV_TO_API_KEY[env];
  if (!key) {
    throw new Error(`Missing Dodo API key for ${env} (NODE_ENV=${process.env.NODE_ENV ?? "undefined"}).`);
  }
  return key;
}

export function getDodoWebhookSecret(): string {
  const env = normalizeEnvironment();
  const secret = process.env.DODO_WEBHOOK_SECRET ?? ENV_TO_WEBHOOK_SECRET[env];
  if (!secret) {
    throw new Error(`Missing Dodo webhook secret for ${env} (NODE_ENV=${process.env.NODE_ENV ?? "undefined"}).`);
  }
  return secret;
}

export function getDodoReturnUrl(): string {
  return process.env.DODO_PAYMENTS_RETURN_URL ?? "/dashboard";
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export function toAbsoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }
  return new URL(pathOrUrl, getSiteUrl()).toString();
}

export function getDodoProductId(planId: PlanId): string | null {
  const env = normalizeEnvironment();
  return PRODUCT_ID_BY_PLAN_AND_ENV[env][planId] ?? PRODUCT_ID_BY_PLAN_FALLBACK[planId] ?? null;
}

export function getDodoClient() {
  return new DodoPayments({
    bearerToken: getDodoApiKey(),
    environment: getDodoEnvironment(),
  });
}
