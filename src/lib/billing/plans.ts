export type PlanId = "free" | "pro" | "agency";

export interface PlanDefinition {
  id: PlanId;
  name: string;
  tagline: string;
  priceMonthly: number;
  websiteLimit: number;
  submissionLimitDaily: number;
  submissionLimitMonthly: number;
  cronLimit: number;
  allowHourly: boolean;
  features: string[];
  ctaLabel: string;
  popular?: boolean;
  trialDays?: number;
}

export const PLAN_DEFINITIONS: Record<PlanId, PlanDefinition> = {
  free: {
    id: "free",
    name: "Free",
    tagline: "Perfect for secondary projects and validation.",
    priceMonthly: 0,
    websiteLimit: 2,
    submissionLimitDaily: 100,
    submissionLimitMonthly: 5000, // User requested 5k
    cronLimit: 1, // User requested 1 cron job total
    allowHourly: false,
    features: [
      "5k URLs submissions",
      "1 cron job total",
      "Google Search Console",
      "Basic stats",
      "Free tools access",
    ],
    ctaLabel: "Get Started",
  },
  pro: {
    id: "pro",
    name: "Pro",
    tagline: "For growth teams scaling traffic and AI reach.",
    priceMonthly: 49,
    trialDays: 7,
    websiteLimit: 120, // Effectively "Unlimited" (or used as numeric check)
    submissionLimitDaily: 50000,
    submissionLimitMonthly: 1000000, // Unlimited URLs interpreted as high limit
    cronLimit: 25,
    allowHourly: true,
    features: [
      "Unlimited URLs",
      "Auto sitemap sync",
      "Lighthouse testing",
      "AI visibility index GEO",
      "Universal pinging",
    ],
    ctaLabel: "Start Free Trial",
    popular: true,
  },
  agency: {
    id: "agency",
    name: "Agency",
    tagline: "For teams running multi-site portfolios at scale.",
    priceMonthly: 149,
    websiteLimit: 1000,
    submissionLimitDaily: 500000,
    submissionLimitMonthly: 10000000,
    cronLimit: 200,
    allowHourly: true,
    features: [
      "AI Analysis of ALL Pages",
      "Cursor prompt export",
      "White-label reports",
      "API access",
      "Priority support",
      "Multi-workspace",
    ],
    ctaLabel: "Contact Sales",
  },
};

export function getPlanDefinition(planId: PlanId): PlanDefinition {
  return PLAN_DEFINITIONS[planId];
}

export function resolvePlanId(subscriptionStatus: string | null, isPro: boolean | null): PlanId {
  if (subscriptionStatus === "agency") {
    return "agency";
  }
  if (isPro || subscriptionStatus === "active" || subscriptionStatus === "trialing") {
    return "pro";
  }
  return "free";
}
