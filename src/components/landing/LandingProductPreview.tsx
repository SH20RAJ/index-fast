"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Globe2, Radar, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const rows = [
  { url: "/blog/shipping-fast-seo", engine: "IndexNow", status: "ok" as const },
  { url: "/products/winter-drop", engine: "Bing", status: "ok" as const },
  { url: "/changelog/v4-indexing", engine: "IndexNow", status: "queue" as const },
];

export default function LandingProductPreview({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className={cn("relative", className)}
    >
      <div
        className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/20 via-transparent to-cyan-500/10 blur-2xl"
        aria-hidden
      />
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/90 shadow-2xl shadow-primary/5 ring-1 ring-black/[0.04] backdrop-blur-md dark:bg-card/50 dark:ring-white/[0.06]">
        <div className="flex items-center justify-between gap-3 border-b border-border/60 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Radar className="h-4 w-4" />
            </span>
            <span className="truncate">Submission workspace</span>
          </div>
          <span className="hidden shrink-0 rounded-full bg-pink-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400 sm:inline">
            Live sync
          </span>
        </div>

        <div className="grid gap-4 p-4 sm:grid-cols-2 sm:gap-5 sm:p-5">
          <div className="rounded-xl border border-border/60 bg-muted/30 p-4 dark:bg-muted/10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sitemap</p>
            <p className="mt-2 truncate font-mono text-xs text-foreground sm:text-sm">yoursite.com/sitemap.xml</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Globe2 className="h-3.5 w-3.5 text-primary" />
              <span>Last crawl · 2m ago</span>
            </div>
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/30 p-4 dark:bg-muted/10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Queue</p>
            <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-foreground">24</p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              New URLs detected today
            </p>
          </div>
        </div>

        <div className="border-t border-border/60 px-2 pb-3 sm:px-4">
          <p className="px-2 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground sm:px-0">
            Recent pushes
          </p>
          <ul className="space-y-1">
            {rows.map((row, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-2 rounded-lg px-2 py-2.5 text-xs hover:bg-muted/40 sm:px-3"
              >
                <span className="min-w-0 truncate font-mono text-[11px] text-muted-foreground sm:text-xs">{row.url}</span>
                <span className="hidden shrink-0 text-[10px] font-semibold uppercase text-muted-foreground/80 sm:inline">
                  {row.engine}
                </span>
                {row.status === "ok" ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-pink-500" aria-label="Delivered" />
                ) : (
                  <span className="shrink-0 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                    Queued
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
