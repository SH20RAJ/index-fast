"use client";

import Link from "next/link";
import { useUser } from "@stackframe/stack";
import { motion } from "framer-motion";
import { ArrowRight, Check, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import LandingProductPreview from "@/components/landing/LandingProductPreview";

const checklist = [
  "Index pages from your IDE (Cursor, Windsurf, Claude Code)",
  "No more manual Bing, Google, or Yandex Console visits",
  "Beat competitors to search results within minutes",
];

const stats = [
  { value: "4-24h", label: "Indexing Time" },
  { value: "100%", label: "API-Official" },
  { value: "5s", label: "IDE Response" },
];

export default function Hero() {
  const user = useUser();

  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-28">
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-16">
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary"
            >
              <Zap className="h-3 w-3" />
              Index while you code with IndexFast MCP
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="text-balance text-4xl font-serif font-bold tracking-tight text-foreground sm:text-5xl lg:text-[4rem] lg:leading-[1.1]"
            >
              Ship code. Prompt your IDE. <br className="hidden lg:block" />
              <span className="text-primary italic">Get indexed instantly.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="mx-auto mt-6 max-w-xl text-pretty text-base font-sans text-muted-foreground sm:text-lg lg:mx-0"
            >
              Stop opening Google Search Console. Just tell Cursor, Windsurf, or Claude to index your new pages using the IndexFast MCP server. We handle the Bing, Google, and IndexNow APIs automatically.
            </motion.p>

            <motion.ul
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.14 }}
              className="mx-auto mt-8 max-w-xl space-y-3 text-left text-sm text-muted-foreground lg:mx-0"
            >
              {checklist.map((line) => (
                <li key={line} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="font-medium text-foreground/80">{line}</span>
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
                <Button asChild size="lg" className="h-12 rounded-xl px-8 text-base font-semibold">
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <div className="flex flex-col items-start gap-2">
                  <Button asChild size="lg" className="h-12 rounded-xl px-8 text-base font-semibold w-full sm:w-auto">
                    <Link href="/sign-up">
                      Start Indexing Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <p className="text-[10px] text-muted-foreground ml-1 font-medium italic">Start with 500 URLs free today.</p>
                </div>
              )}
              <Button asChild variant="outline" size="lg" className="h-12 rounded-xl border-border px-8 text-base font-semibold">
                <Link href="/tools">Try free tools</Link>
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
