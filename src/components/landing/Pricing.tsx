"use client";

import { useState } from "react";
import { Check, Info, HelpCircle, Calculator, TrendingUp, Sparkles, ShieldCheck } from "lucide-react";
import { useStackApp, useUser } from "@stackframe/stack";

import { PLAN_DEFINITIONS } from "@/lib/billing/plans";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const plans = Object.values(PLAN_DEFINITIONS);
const countFormatter = new Intl.NumberFormat("en-US");

const FAQS = [
  { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time from your billing dashboard with one click." },
  { q: "Is it safe for my site?", a: "100%. We use official Google & Bing Indexing APIs. No black-hat tactics involved." },
  { q: "Does it work with WordPress?", a: "Yes, it works with any platform (WordPress, Shopify, custom builds) that has a sitemap." },
  { q: "How fast will I see results?", a: "URLs are typically crawled within 4-24 hours after submission." }
];

function getPlanFeatureLines(plan: (typeof plans)[number]) {
  const limitLines = [
    `${countFormatter.format(plan.submissionLimitMonthly)} submissions / month`,
    `${countFormatter.format(plan.submissionLimitDaily)} submissions / day`,
    plan.cronLimit === 1 ? "1 automatic job" : `${countFormatter.format(plan.cronLimit)} automatic jobs`,
    plan.allowHourly ? "Hourly updates" : "Daily updates",
    plan.websiteLimit >= 1000
      ? "Many websites supported"
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
  const [avgVisitorValue, setAvgVisitorValue] = useState(1);

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
    <section id="pricing" className="bg-background py-20">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mb-16 space-y-4 text-center">
          <Badge variant="outline" className="rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-primary border-primary/20 bg-primary/5">
            Pricing
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight sm:text-6xl text-foreground">
            Simple, <span className="text-muted-foreground">honest pricing.</span>
          </h2>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Choose the plan that fits your growth. All plans include 100% white-hat safety via official search engine APIs.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((p) => (
            <Card key={p.name} className={cn(
              "relative overflow-hidden rounded-[2.5rem] transition-all duration-300 flex flex-col h-full",
              p.popular 
                ? "border-primary/30 bg-card shadow-2xl shadow-primary/5 scale-[1.02] z-10" 
                : "border-border/50 bg-card/50 hover:border-border"
            )}>
              {p.popular && (
                <div className="absolute top-0 right-0">
                   <div className="bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl">
                     Most Popular
                   </div>
                </div>
              )}
              
              <CardHeader className="p-8 pb-4">
                <div className="space-y-1">
                  <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">{p.name}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight">${p.priceMonthly}</span>
                    <span className="text-sm text-muted-foreground font-medium">/mo</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed min-h-[40px]">{p.tagline}</p>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col flex-1 p-8 pt-0 gap-8">
                <div className="space-y-3.5 flex-1">
                  {getPlanFeatureLines(p).map((f, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check className="h-2.5 w-2.5" strokeWidth={4} />
                      </div>
                      <span className="text-sm font-medium text-foreground/80">{f}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <Button
                    className={cn(
                      "w-full h-12 rounded-2xl font-bold transition-all active:scale-95",
                      p.popular ? "bg-primary hover:bg-primary/90 text-white" : "bg-muted/50 hover:bg-muted text-foreground border-none"
                    )}
                    onClick={() => void startCheckout(p.name)}
                    disabled={loadingPlan === p.name}
                  >
                    {loadingPlan === p.name ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Processing
                      </div>
                    ) : p.ctaLabel}
                  </Button>
                  {p.trialDays && (
                    <p className="text-center text-[10px] font-bold text-primary uppercase tracking-wider">
                      Includes {p.trialDays}-day free trial
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ROI Calculator */}
        <div className="mt-24 max-w-4xl mx-auto">
          <Card className="rounded-[2.5rem] border-primary/10 bg-primary/[0.02] overflow-hidden">
             <div className="grid md:grid-cols-[1fr_auto] gap-8 p-8 sm:p-12 items-center">
                <div className="space-y-6">
                   <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                     <Calculator className="h-3 w-3" />
                     ROI Calculator
                   </div>
                   <div className="space-y-3">
                      <h3 className="text-2xl font-bold">How much is faster indexing worth?</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        If 10% of your new pages bring in just 50 visitors each per month, and each visitor is worth $0.10:
                      </p>
                   </div>
                   <div className="p-6 rounded-2xl bg-background/50 border border-primary/5 space-y-4">
                      <p className="text-sm font-bold flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        With Pro ($49/mo), indexing 1,000 URLs could pay for itself in <span className="text-primary underline decoration-2 underline-offset-4">under 48 hours</span>.
                      </p>
                   </div>
                </div>
                <div className="bg-primary text-white p-8 rounded-[2rem] text-center space-y-2">
                   <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Estimated ROI</p>
                   <p className="text-5xl font-bold">12x</p>
                   <p className="text-[10px] font-medium opacity-60">minimum per cycle</p>
                </div>
             </div>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-32 max-w-3xl mx-auto space-y-12">
           <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold tracking-tight">Pricing FAQ</h3>
              <p className="text-sm text-muted-foreground">Everything you need to know about our plans.</p>
           </div>
           <div className="grid gap-6">
              {FAQS.map((faq, i) => (
                <div key={i} className="p-6 rounded-2xl bg-muted/20 border border-border/50 space-y-2">
                   <h4 className="text-sm font-bold flex items-center gap-2">
                     <HelpCircle className="h-3.5 w-3.5 text-primary" />
                     {faq.q}
                   </h4>
                   <p className="text-sm text-muted-foreground leading-relaxed pl-5.5">
                     {faq.a}
                   </p>
                </div>
              ))}
           </div>
        </div>

        {/* Safety Signal */}
        <div className="mt-20 flex flex-col items-center gap-4 text-center">
           <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
              <ShieldCheck className="h-4 w-4" />
              Secure Checkout via Dodo Payments
           </div>
           <div className="flex gap-4 opacity-40 grayscale filter">
              {/* Add payment logos here if available in assets */}
           </div>
        </div>

        {checkoutError ? (
          <div className="mx-auto mt-8 max-w-2xl">
            <Alert variant="destructive" className="rounded-2xl">
              <AlertDescription>{checkoutError}</AlertDescription>
            </Alert>
          </div>
        ) : null}
      </div>
    </section>
  );
}
