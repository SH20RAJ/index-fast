import { Check } from "lucide-react";
import { PLAN_DEFINITIONS } from "@/lib/billing/plans";
import { CheckoutButton } from "@/components/landing/CheckoutButton";

const plans = Object.values(PLAN_DEFINITIONS);
const countFormatter = new Intl.NumberFormat("en-US");

const FAQS = [
  { q: "Can I cancel anytime?", a: "Yes, cancel from your billing dashboard with one click. No questions asked." },
  { q: "Is it safe for my site?", a: "We use official Google and Bing Indexing APIs only. No black-hat tactics." },
  { q: "Does it work with WordPress?", a: "Yes. It works with any platform that has a sitemap — WordPress, Shopify, custom builds, and more." },
  { q: "How fast will I see results?", a: "URLs are typically crawled within 4 to 24 hours after submission." },
];

function getPlanFeatures(plan: (typeof plans)[number]) {
  const limits = [
    `${countFormatter.format(plan.submissionLimitMonthly)} submissions / month`,
    `${countFormatter.format(plan.submissionLimitDaily)} submissions / day`,
    plan.cronLimit === 1 ? "1 automatic job" : `${countFormatter.format(plan.cronLimit)} automatic jobs`,
    plan.allowHourly ? "Hourly updates" : "Daily updates",
    plan.websiteLimit >= 1000
      ? "Many websites supported"
      : `Up to ${countFormatter.format(plan.websiteLimit)} websites`,
  ];
  const extras = plan.features.filter(
    (f) => !/(unlimited urls?|urls submissions?|cron job)/i.test(f),
  );
  return [...limits, ...extras];
}

export default function Pricing() {
  return (
    <section id="pricing" className="bg-background py-24">
      <div className="mx-auto w-full max-w-4xl px-6">

        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Pricing
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Simple plans for every stage. All plans use official search engine APIs.
          </p>
        </div>

        {/* Plans */}
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => {
            const features = getPlanFeatures(plan);
            const isRecommended = !!plan.popular;

            return (
              <div
                key={plan.name}
                className={[
                  "flex flex-col rounded-md border p-5",
                  isRecommended
                    ? "border-foreground/30"
                    : "border-border",
                ].join(" ")}
              >
                <p className="text-sm font-medium text-muted-foreground">
                  {plan.name}
                </p>

                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-2xl font-semibold tracking-tight text-foreground">
                    {plan.priceMonthly === 0 ? "Free" : `$${plan.priceMonthly}`}
                  </span>
                  {plan.priceMonthly > 0 && (
                    <span className="text-xs text-muted-foreground">/month</span>
                  )}
                </div>

                <p className="mt-1 text-xs text-muted-foreground">
                  {plan.tagline}
                </p>

                <ul className="mt-6 flex-1 space-y-2">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={2} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  <CheckoutButton
                    planName={plan.name}
                    ctaLabel={plan.ctaLabel}
                    isRecommended={isRecommended}
                  />
                  {plan.trialDays && (
                    <p className="mt-1.5 text-center text-xs text-muted-foreground">
                      {plan.trialDays}-day free trial
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-xl mx-auto">
          <h3 className="text-base font-medium text-foreground mb-6 text-center">
            FAQ
          </h3>
          <div className="space-y-5">
            {FAQS.map((faq, i) => (
              <div key={i}>
                <p className="text-sm font-medium text-foreground">{faq.q}</p>
                <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust footer */}
        <p className="mt-12 text-center text-xs text-muted-foreground">
          Secure checkout via Dodo Payments
        </p>

      </div>
    </section>
  );
}
