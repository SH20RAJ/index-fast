"use client";

import Link from "next/link";
import { useUser } from "@stackframe/stack";
import { motion } from "framer-motion";
import { ArrowRight, Check, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import LandingProductPreview from "@/components/landing/LandingProductPreview";

const checklist = [
  "Automatic indexing for Google & Bing",
  "Sitemap monitoring for new pages",
  "Perfect for blogs, stores, and large sites",
];

const stats = [
  { value: "< 60s", label: "Speed to index" },
  { value: "120+", label: "Indexing nodes" },
  { value: "10K+", label: "URLs submitted" },
];

export default function Hero() {
  const user = useUser();

  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[min(520px,70vw)] w-[min(900px,120%)] -translate-x-1/2 rounded-full bg-primary/[0.12] blur-3xl dark:bg-primary/20" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklab,var(--primary)_8%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--primary)_8%,transparent)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)] dark:opacity-25" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-16">
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              IndexNow · Bing · sitemap automation
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]"
            >
              Get new URLs indexed{" "}
              <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">before your competitors do</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="mx-auto mt-5 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg lg:mx-0"
            >
              Connect your sitemap once. IndexFast detects fresh URLs and pushes them to search engines on a schedule you control—so launches, drops, and blog posts show up in results faster.
            </motion.p>

            <motion.ul
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.14 }}
              className="mx-auto mt-8 max-w-xl space-y-2.5 text-left text-sm text-muted-foreground lg:mx-0"
            >
              {checklist.map((line) => (
                <li key={line} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18 }}
              className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap lg:justify-start"
            >
              {user ? (
                <Button asChild size="lg" className="h-12 rounded-xl px-8 text-base font-semibold shadow-lg shadow-primary/20">
                  <Link href="/dashboard">
                    Open dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="h-12 rounded-xl px-8 text-base font-semibold shadow-lg shadow-primary/20">
                  <Link href="/sign-up">
                    Start free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline" size="lg" className="h-12 rounded-xl border-border/80 px-8 text-base font-semibold">
                <Link href="/how-it-works">How it works</Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="h-12 rounded-xl px-6 text-base font-medium text-muted-foreground hover:text-foreground">
                <Link href="/pricing">View pricing</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.28 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-muted-foreground lg:justify-start"
            >
              <span className="inline-flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-primary" />
                No card to explore
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                Live in a few minutes
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.32 }}
              className="mx-auto mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-border/60 pt-10 lg:mx-0 lg:max-w-none"
            >
              {stats.map((s) => (
                <div key={s.label} className="text-center lg:text-left">
                  <p className="text-xl font-semibold tabular-nums tracking-tight text-foreground sm:text-2xl">{s.value}</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[11px]">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <LandingProductPreview className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-none" />
        </div>
      </div>
    </section>
  );
}
