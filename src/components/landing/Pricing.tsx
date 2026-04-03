"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useStackApp, useUser } from "@stackframe/stack";

import { PLAN_DEFINITIONS } from "@/lib/billing/plans";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const plans = Object.values(PLAN_DEFINITIONS);
const countFormatter = new Intl.NumberFormat("en-US");

function getPlanFeatureLines(plan: (typeof plans)[number]) {
  const limitLines = [
    `${countFormatter.format(plan.submissionLimitMonthly)} URL submissions/month`,
    `${countFormatter.format(plan.submissionLimitDaily)} URL submissions/day`,
    plan.cronLimit === 1 ? "1 cron job" : `${countFormatter.format(plan.cronLimit)} cron jobs`,
    plan.allowHourly ? "Hourly scheduling" : "Daily scheduling",
    plan.websiteLimit >= 1000
      ? "High-volume website support"
      : `Up to ${countFormatter.format(plan.websiteLimit)} websites`,
  ];

  const extraLines = plan.features.filter((feature) => !/(unlimited urls?|urls submissions?|cron job)/i.test(feature));
  return [...limitLines, ...extraLines];
}

export default function Pricing() {
  const stack = useStackApp();
  const user = useUser();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  async function startCheckout(planName: string) {
    if (planName === "Free") {
      if (user) {
        window.location.href = "/dashboard";
      } else {
        stack.redirectToSignUp();
      }
      return;
    }

    if (!user) {
      stack.redirectToSignUp();
      return;
    }

    const plan = planName === "Agency" ? "agency" : "pro";
    setLoadingPlan(planName);
    setCheckoutError(null);

    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = (await res.json()) as { checkoutUrl?: string; error?: string };
      if (!res.ok || !data.checkoutUrl) {
        throw new Error(data.error || "Unable to start checkout.");
      }

      window.location.href = data.checkoutUrl;
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Unable to start checkout.");
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <section id="pricing" className="border-b border-border/70 bg-card/30 py-14 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 space-y-3 text-center sm:mb-12">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] tracking-[0.14em] uppercase">
            Pricing Plans
          </Badge>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Simple, predictable pricing</h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Choose the level of indexing execution your properties need. No hidden fees.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((p) => (
            <Card key={p.name} className={p.popular ? "border-primary/60 bg-background" : "border-border/70 bg-background/90"}>
              <CardContent className="flex h-full flex-col gap-4 p-5 sm:p-6">
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold tracking-[0.14em] text-muted-foreground uppercase">{p.name}</p>
                    {p.popular ? <Badge>Popular</Badge> : null}
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-black tracking-tight">${p.priceMonthly}</span>
                    <span className="pb-1 text-sm text-muted-foreground">/mo</span>
                  </div>
                  {p.trialDays ? (
                    <p className="text-xs font-medium text-primary">Includes {p.trialDays}-day free trial</p>
                  ) : null}
                  <p className="text-sm text-muted-foreground">{p.tagline}</p>
                </div>

                <div className="flex-1 space-y-2">
                  {getPlanFeatureLines(p).map((f, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">{f}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full"
                  variant={p.popular ? "default" : "outline"}
                  onClick={() => void startCheckout(p.name)}
                  disabled={loadingPlan === p.name}
                >
                  {loadingPlan === p.name ? "Redirecting..." : p.ctaLabel}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {checkoutError ? (
          <div className="mx-auto mt-4 max-w-2xl">
            <Alert variant="destructive">
              <AlertDescription>{checkoutError}</AlertDescription>
            </Alert>
          </div>
        ) : null}
      </div>
    </section>
  );
}
