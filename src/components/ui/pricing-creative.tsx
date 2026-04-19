"use client"

import { motion } from "motion/react"
import { useState } from "react";
import { Check } from "lucide-react";
import { useStackApp, useUser } from "@stackframe/stack";

import { PLAN_DEFINITIONS } from "@/lib/billing/plans";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

export function PricingCreative() {
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
    <section className="relative flex flex-col items-center py-24 bg-zinc-950 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -tranzinc-x-1/2 -tranzinc-y-1/2 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[100px]" />
      </div>
      
      <div className="text-center mb-16 relative z-10 w-full px-4">
        <p className="text-sm uppercase tracking-widest text-pink-400 font-semibold mb-3">Pricing Plans</p>
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">Simple, predictable pricing</h2>
        <p className="text-lg text-zinc-300 max-w-2xl mx-auto">Choose the level of indexing execution your properties need. No hidden fees.</p>
      </div>

      <div className="flex flex-col items-center justify-center gap-8 lg:flex-row relative z-10">
        {plans.map((p, index) => {
          const Content = () => (
            <>
              {p.popular && (
                <motion.div
                  animate={{ y: [10, 6, 10] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="absolute -top-6 left-1/2 -tranzinc-x-1/2 rounded-full border border-black/20 bg-[#ff6fb1] px-5 py-1 text-xs font-extrabold text-[#1a1a1a] shadow"
                >
                  Popular
                </motion.div>
              )}
              <div className={`mb-2 text-lg font-bold ${p.popular ? 'text-black' : 'text-pink-400'}`}>{p.name}</div>
              <div className={`mb-4 text-4xl font-extrabold ${p.popular ? 'text-black' : 'text-white'}`}>
                ${p.priceMonthly}<span className="text-xl font-normal opacity-70">/mo</span>
              </div>
              {p.trialDays ? (
                <div className={`mb-4 text-sm font-bold ${p.popular ? 'text-pink-700' : 'text-pink-400'}`}>Includes {p.trialDays}-day free trial</div>
              ) : null}
              <div className={`mb-6 text-sm ${p.popular ? 'text-gray-800' : 'text-gray-300'}`}>{p.tagline}</div>
              
              <ul className={`mb-6 space-y-2 text-sm ${p.popular ? 'text-gray-900 text-base' : 'text-white/70'}`}>
                {getPlanFeatureLines(p).map((f, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className={`mr-2 mt-0.5 ${p.popular ? 'text-pink-600' : 'text-pink-400'}`}><Check className="w-4 h-4" /></span>
                    <span className="text-left">{f}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={() => void startCheckout(p.name)}
                disabled={loadingPlan === p.name}
                className={`w-full rounded-md py-2 font-bold transition mt-auto ${
                  p.popular 
                    ? 'bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50' 
                    : 'bg-pink-500 text-[#111] hover:bg-pink-400 disabled:opacity-50'
                }`}
              >
                {loadingPlan === p.name ? "Redirecting..." : p.ctaLabel}
              </button>
            </>
          );

          if (p.popular) {
            return (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: -20 }}
                transition={{ type: "spring", duration: 0.7, delay: index * 0.1 }}
                className="relative z-20 w-80 scale-110 rounded-3xl border-4 border-pink-400/50 bg-gradient-to-b from-[#ff6fb1] to-[#ff3a95] px-10 py-14 text-[#1a1a1a] shadow-xl transition-transform hover:scale-[1.12] flex flex-col"
              >
                <Content />
              </motion.div>
            );
          }

          // Non-popular cards
          const isFirst = index === 0;
          return (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 40, rotate: isFirst ? -6 : 6 }}
              animate={{ opacity: 1, y: 0, rotate: isFirst ? -6 : 6 }}
              transition={{ type: "spring", duration: 0.5, delay: index * 0.1 }}
              className="relative z-10 w-72 rounded-2xl border border-pink-400/30 bg-black/40 px-8 py-10 text-foreground shadow-[0_0_0_1px_rgba(255,105,180,.08)_inset] backdrop-blur-md transition-transform hover:scale-105 flex flex-col"
            >
              <Content />
            </motion.div>
          );
        })}
      </div>

      {checkoutError ? (
        <div className="mx-auto mt-16 max-w-2xl relative z-10">
          <Alert variant="destructive">
            <AlertDescription>{checkoutError}</AlertDescription>
          </Alert>
        </div>
      ) : null}
    </section>
  )
}
