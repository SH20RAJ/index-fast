export type PlanId = "free" | "pro" | "agency";

export interface PlanDefinition {
  id: PlanId;
  name: string;
  tagline: string;
  priceMonthly: number;
  websiteLimit: number;
  submissionLimitDaily: number;
  submissionLimitMonthly: number;
  syncLimitMonthly: number;
  includesPings: boolean;
  prioritySupport: boolean;
  includesTeamSeats: boolean;
  ctaLabel: string;
}

export const PLAN_DEFINITIONS: Record<PlanId, PlanDefinition> = {
  free: {
    id: "free",
    name: "Free",
    tagline: "For solo builders validating ideas",
    priceMonthly: 0,
    websiteLimit: 2,
    submissionLimitDaily: 100,
    submissionLimitMonthly: 1200,
    syncLimitMonthly: 40,
    includesPings: false,
    prioritySupport: false,
    includesTeamSeats: false,
    ctaLabel: "Current Starter Plan",
  },
  pro: {
    id: "pro",
    name: "Pro",
    tagline: "For consistent publishing and growth",
    priceMonthly: 29,
    websiteLimit: 12,
    submissionLimitDaily: 5000,
    submissionLimitMonthly: 25000,
    syncLimitMonthly: 300,
    includesPings: true,
    prioritySupport: false,
    includesTeamSeats: false,
    ctaLabel: "Upgrade to Pro",
  },
  agency: {
    id: "agency",
    name: "Agency",
    tagline: "For teams running multi-site portfolios",
    priceMonthly: 99,
    websiteLimit: 50,
    submissionLimitDaily: 30000,
    submissionLimitMonthly: 150000,
    syncLimitMonthly: 1200,
    includesPings: true,
    prioritySupport: true,
    includesTeamSeats: true,
    ctaLabel: "Scale with Agency",
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
