"use client";

import Link from "next/link";
import { useUser } from "@stackframe/stack";
import { motion } from "framer-motion";
import { ArrowRight, Check, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import LandingProductPreview from "@/components/landing/LandingProductPreview";

const checklist = [
  "100% Safe: Uses official Google & Bing Indexing APIs",
  "Automated discovery for new pages and updates",
  "Beat competitors to search results within hours",
];

const stats = [
  { value: "4-24h", label: "Indexing Time" },
  { value: "100%", label: "White-Hat Safe" },
  { value: "10M+", label: "Pages Indexed" },
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
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary"
            >
              <Shield className="h-3 w-3" />
              Powered by official search engine APIs
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="text-balance text-4xl font-serif font-bold tracking-tight text-foreground sm:text-5xl lg:text-[4rem] lg:leading-[1.1]"
            >
              Get indexed on Google in <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent italic">24 hours</span> — not weeks.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="mx-auto mt-6 max-w-xl text-pretty text-base font-sans text-muted-foreground sm:text-lg lg:mx-0"
            >
              Stop waiting for search engines to find you. Automate your indexing, monitor your rankings, and see your new pages go live instantly.
            </motion.p>

            <motion.ul
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.14 }}
              className="mx-auto mt-8 max-w-xl space-y-3 text-left text-sm text-muted-foreground lg:mx-0"
            >
              {checklist.map((line) => (
                <li key={line} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-600">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="font-medium">{line}</span>
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
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <div className="flex flex-col items-start gap-2">
                  <Button asChild size="lg" className="h-12 rounded-xl px-8 text-base font-semibold shadow-lg shadow-primary/20 w-full sm:w-auto">
                    <Link href="/sign-up">
                      Start Indexing Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <p className="text-[10px] text-muted-foreground ml-1 font-medium italic">Start with 100 URLs free today.</p>
                </div>
              )}
              <Button asChild variant="outline" size="lg" className="h-12 rounded-xl border-border/80 px-8 text-base font-semibold">
                <Link href="/how-it-works">How it works</Link>
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
