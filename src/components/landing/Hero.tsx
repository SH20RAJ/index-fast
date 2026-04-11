"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowRight, Clock3, Globe2, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/70 bg-background pt-20 pb-14 sm:pt-24 sm:pb-18">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,hsl(var(--primary)/0.14),transparent_35%),radial-gradient(circle_at_90%_0%,hsl(var(--primary)/0.1),transparent_38%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.35)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.35)_1px,transparent_1px)] bg-[size:34px_34px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto flex max-w-4xl flex-col items-center text-center"
        >
          <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em] border-primary/50 text-primary">
            Automated SEO Infrastructure
          </Badge>

          <h1 className="mt-5 text-4xl font-black tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Force search engines to notice you instantly.
          </h1>
          <p className="mt-3 text-2xl font-bold tracking-tight text-muted-foreground sm:text-3xl">
            Stop waiting weeks for Google to index your content.
          </p>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Automate your sitemap tracking. Submit your URLs directly to Bing & IndexNow APIs, and automatically ping 120+ global search directories the absolute moment you hit publish.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-14 rounded-2xl px-8 font-black text-sm uppercase tracking-wide bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_rgba(var(--primary),0.3)]">
              <Link href="/sign-up">
                Accelerate Indexing Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 rounded-2xl px-6 font-bold text-sm uppercase tracking-wide border-border/80 bg-background/50 backdrop-blur-sm">
              <Link href="/how-it-works">See The Process</Link>
            </Button>
          </div>

          <div className="mt-12 grid w-full max-w-4xl gap-4 sm:grid-cols-3">
            <div className="border-beam rounded-2xl border border-border/70 bg-card/70 p-5 text-left premium-card group">
              <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-blue-500">
                <Clock3 className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                Live Cron Jobs
              </p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">Detects sitemap changes instantly, grabbing new URLs every few minutes automatically.</p>
            </div>
            <div className="border-beam rounded-2xl border border-border/70 bg-card/70 p-5 text-left premium-card group">
              <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-emerald-500">
                <Globe2 className="h-4 w-4 group-hover:animate-pulse transition-transform duration-300" />
                120+ Search Pings
              </p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">Blast your digital presence across over 120 global aggregators and regional databases.</p>
            </div>
            <div className="border-beam rounded-2xl border border-border/70 bg-card/70 p-5 text-left premium-card group">
              <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-purple-500">
                <ShieldCheck className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform duration-300" />
                API Delivery
              </p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">Directly inject your content via Bing API and native IndexNow endpoints with guaranteed status.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
