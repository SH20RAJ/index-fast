"use client";

import { motion, type Variants } from "framer-motion";
import { Globe2, Zap, BarChart3, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const steps = [
  {
    num: "01",
    icon: Globe2,
    color: "text-sky-500",
    bg: "bg-sky-500/10",
    ring: "ring-sky-500/20",
    badge: "Connect",
    title: "Connect your site",
    desc: "Link your sitemap or paste any URL. IndexFast auto-discovers every page that needs indexing — new posts, product pages, and updates.",
    detail: "Works with Wordpress, Shopify, Next.js, and any platform",
  },
  {
    num: "02",
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    ring: "ring-amber-500/20",
    badge: "Submit",
    title: "We push indexing signals",
    desc: "We bypass the slow crawl queue by sending high-priority indexing signals directly to Google, Bing, and 120+ engines via official APIs.",
    detail: "Avg. 4–24h to first appearance in search results",
  },
  {
    num: "03",
    icon: BarChart3,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    ring: "ring-emerald-500/20",
    badge: "Monitor",
    title: "Track every result",
    desc: "Get a real-time log of every submission. See exactly which pages are indexed, which need attention, and what's driving your traffic growth.",
    detail: "Live feed · Status badges · Engine breakdown",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden py-24 sm:py-32">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent" />
        <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-border/60 to-transparent" />
        <div className="absolute left-1/2 bottom-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-border/60 to-transparent" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-16 text-center space-y-4"
        >
          <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
            How it works
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl font-serif font-bold tracking-tight text-foreground sm:text-5xl">
            From publish to ranked —<br />
            <span className="text-muted-foreground italic">in three steps</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="mx-auto max-w-xl text-base text-muted-foreground">
            No manual work, no waiting weeks. IndexFast automates the entire path from content creation to search visibility.
          </motion.p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="relative grid gap-6 md:grid-cols-3 md:gap-8"
        >
          {/* Connector line — desktop only */}
          <div className="pointer-events-none absolute top-[2.75rem] left-0 right-0 hidden md:block" aria-hidden>
            <div className="relative mx-auto flex items-center justify-between px-[calc(100%/6)]">
              {[0, 1].map((i) => (
                <motion.div
                  key={i}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.3 + i * 0.2, ease: [0.22, 1, 0.36, 1] }}
                  style={{ originX: 0 }}
                  className="h-px flex-1 bg-gradient-to-r from-border/60 via-primary/30 to-border/60 mx-4"
                />
              ))}
            </div>
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              variants={fadeUp}
              className="group relative flex flex-col gap-6 rounded-3xl border border-border/60 bg-card/60 p-7 shadow-sm backdrop-blur-sm hover:border-primary/25 hover:shadow-md transition-all duration-300"
            >
              {/* Step number watermark */}
              <span className="pointer-events-none absolute right-5 top-4 text-7xl font-black tracking-tighter text-muted/[0.07] select-none leading-none">
                {step.num}
              </span>

              {/* Icon */}
              <div className={cn(
                "relative flex h-11 w-11 items-center justify-center rounded-2xl ring-1 shrink-0 transition-transform duration-300 group-hover:scale-110",
                step.bg, step.ring
              )}>
                <step.icon className={cn("h-5 w-5", step.color)} strokeWidth={1.75} />
              </div>

              <div className="space-y-3 relative z-10">
                <p className={cn("text-[10px] font-bold uppercase tracking-[0.2em]", step.color)}>
                  {step.badge}
                </p>
                <h3 className="text-xl font-bold tracking-tight text-foreground leading-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* Detail footer */}
              <div className="relative z-10 mt-auto pt-4 border-t border-border/40">
                <p className="text-[11px] font-medium text-muted-foreground/60 italic">
                  {step.detail}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 flex justify-center"
        >
          <Link
            href="/sign-up"
            className="group inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-sm hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
          >
            Get started for free
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all duration-200" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
