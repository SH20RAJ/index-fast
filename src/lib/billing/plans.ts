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
    websiteLimit: 10,
    submissionLimitDaily: 500,
    submissionLimitMonthly: 25000,
    cronLimit: 5,
    allowHourly: false,
    features: [
      "25,000 URL submissions",
      "5 automatic jobs",
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
    websiteLimit: 600,
    submissionLimitDaily: 250000,
    submissionLimitMonthly: 5000000,
    cronLimit: 125,
    allowHourly: true,
    features: [
      "5M URL submissions",
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
    websiteLimit: 5000,
    submissionLimitDaily: 2500000,
    submissionLimitMonthly: 50000000,
    cronLimit: 1000,
    allowHourly: true,
    features: [
      "50M URL submissions",
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
