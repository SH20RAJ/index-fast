"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowRight, Clock3, Globe2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { CumulativeCounter, LiveIndexingStream } from "./HeroVisuals";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/70 bg-background pt-20 pb-14 sm:pt-24 sm:pb-18">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,hsl(var(--primary)/0.14),transparent_35%),radial-gradient(circle_at_90%_0%,hsl(var(--primary)/0.1),transparent_38%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.35)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.35)_1px,transparent_1px)] bg-[size:34px_34px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_300px] gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-start text-left"
          >
            <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em] border-primary/50 text-primary">
              Production-Grade Indexing
            </Badge>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-foreground sm:text-6xl lg:text-7xl leading-[1.1]">
              Force search engines <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-primary/80">to notice you now.</span>
            </h1>
            
            <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-muted-foreground sm:text-xl">
              Every hour your content stays unindexed is <span className="text-foreground font-bold underline decoration-primary/30">revenue lost</span>. 
              IndexFast automates sitemap tracking and directly injects your URLs into Bing & IndexNow APIs for instant visibility.
            </p>

            <div className="mt-10 flex flex-col items-center justify-start gap-4 sm:flex-row w-full lg:w-auto">
              <Button asChild size="lg" className="h-14 w-full sm:w-auto rounded-2xl px-8 font-black text-sm uppercase tracking-wide bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_rgba(var(--primary),0.3)] group">
                <Link href="/sign-up">
                  Accelerate Indexing Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 w-full sm:w-auto rounded-2xl px-6 font-bold text-sm uppercase tracking-wide border-border/80 bg-background/50 backdrop-blur-sm">
                <Link href="/how-it-works">See The Infrastructure</Link>
              </Button>
            </div>

            <div className="mt-12 flex flex-wrap gap-8 items-center border-t border-border/50 pt-8 w-full">
              <CumulativeCounter />
              <div className="hidden sm:block h-8 w-[1px] bg-border/50" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight">120+</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Directories Pinged</span>
              </div>
            </div>
          </motion.div>

          {/* Side Visual - Live Activity */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex flex-col gap-6"
          >
            <div className="p-6 rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl">
              <LiveIndexingStream />
            </div>
            <div className="px-6 py-4 rounded-2xl border border-border/30 bg-emerald-500/5 flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                System Status: Operational
              </span>
            </div>
          </motion.div>
        </div>

        {/* Feature Grid */}
        <div className="mt-20 grid w-full gap-4 sm:grid-cols-3">
          <div className="border-beam rounded-2xl border border-border/70 bg-card/70 p-6 text-left premium-card group relative isolate overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
            <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-blue-500">
              <Clock3 className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
              Live Cron Jobs
            </p>
            <p className="mt-2 text-sm font-medium text-muted-foreground">Detects sitemap changes instantly, grabbing new URLs every few minutes automatically.</p>
          </div>
          <div className="border-beam rounded-2xl border border-border/70 bg-card/70 p-6 text-left premium-card group relative isolate overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
            <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-emerald-500">
              <Globe2 className="h-4 w-4 group-hover:animate-pulse transition-transform duration-300" />
              120+ Search Pings
            </p>
            <p className="mt-2 text-sm font-medium text-muted-foreground">Blast your digital presence across over 120 global aggregators and regional databases.</p>
          </div>
          <div className="border-beam rounded-2xl border border-border/70 bg-card/70 p-6 text-left premium-card group relative isolate overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
            <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-purple-500">
              <ShieldCheck className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform duration-300" />
              API Delivery
            </p>
            <p className="mt-2 text-sm font-medium text-muted-foreground">Directly inject your content via Bing API and native IndexNow endpoints with guaranteed status.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
