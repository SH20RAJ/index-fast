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
    tagline: "Perfect for small projects and testing.",
    priceMonthly: 0,
    websiteLimit: 2,
    submissionLimitDaily: 100,
    submissionLimitMonthly: 5000,
    cronLimit: 1,
    allowHourly: false,
    features: [
      "5,000 URL submissions",
      "1 automatic job",
      "Google Search Console",
      "Basic reports",
      "Access to free tools",
    ],
    ctaLabel: "Get Started",
  },
  pro: {
    id: "pro",
    name: "Pro",
    tagline: "For growing websites that want more traffic.",
    priceMonthly: 49,
    trialDays: 7,
    websiteLimit: 120,
    submissionLimitDaily: 50000,
    submissionLimitMonthly: 1000000,
    cronLimit: 25,
    allowHourly: true,
    features: [
      "Unlimited URL submissions",
      "Automatic sitemap sync",
      "SEO health reports",
      "AI search visibility",
      "Priority indexing",
    ],
    ctaLabel: "Start Free Trial",
    popular: true,
  },
  agency: {
    id: "agency",
    name: "Agency",
    tagline: "For teams managing many websites.",
    priceMonthly: 149,
    websiteLimit: 1000,
    submissionLimitDaily: 500000,
    submissionLimitMonthly: 10000000,
    cronLimit: 200,
    allowHourly: true,
    features: [
      "Full site analysis",
      "Advanced SEO exports",
      "Custom reports",
      "Full API access",
      "Priority support",
      "Multi-user access",
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
