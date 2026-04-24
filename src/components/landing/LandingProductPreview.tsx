"use client";

import { motion, Variants, AnimatePresence } from "framer-motion";
import { CheckCircle2, Globe2, Radar, Zap, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

// Pool of URLs that will stream through the live feed
const URL_POOL = [
  { url: "/blog/shipping-fast-seo", engine: "IndexNow" },
  { url: "/products/winter-drop", engine: "Bing" },
  { url: "/changelog/v4-indexing", engine: "IndexNow" },
  { url: "/docs/getting-started", engine: "Google" },
  { url: "/pricing/enterprise", engine: "IndexNow" },
  { url: "/blog/seo-in-2025", engine: "Bing" },
  { url: "/products/summer-sale", engine: "IndexNow" },
  { url: "/about/team", engine: "Google" },
];

type FeedRow = {
  id: number;
  url: string;
  engine: string;
  status: "queued" | "indexed";
};

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: 0.15,
      ease: [0.16, 1, 0.3, 1],
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

const rowVariants: Variants = {
  enter: { opacity: 0, y: -20, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: 16, scale: 0.94, transition: { duration: 0.25, ease: [0.4, 0, 1, 1] } },
};

let counter = 0;

export default function LandingProductPreview({ className }: { className?: string }) {
  const [feed, setFeed] = useState<FeedRow[]>(() =>
    URL_POOL.slice(0, 3).map((r, i) => ({ ...r, id: i, status: "indexed" as const }))
  );

  useEffect(() => {
    const tick = () => {
      counter += 1;
      const template = URL_POOL[counter % URL_POOL.length];
      const newRow: FeedRow = { ...template, id: Date.now(), status: "queued" };

      // Insert new row at top, cap list at 4
      setFeed((prev) => [newRow, ...prev].slice(0, 4));

      // After 900ms, mark it as indexed
      setTimeout(() => {
        setFeed((prev) =>
          prev.map((r) => (r.id === newRow.id ? { ...r, status: "indexed" } : r))
        );
      }, 900);
    };

    const interval = setInterval(tick, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={cn("relative", className)}
    >
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-foreground">
              <Radar className="h-4 w-4" />
            </span>
            <span className="truncate">Submission workspace</span>
          </div>
          <span className="hidden shrink-0 rounded-full bg-secondary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground sm:inline">
            Live sync
          </span>
        </div>

        <div className="grid gap-4 p-4 sm:grid-cols-2 sm:gap-5 sm:p-5">
          <motion.div variants={itemVariants} className="rounded-xl border border-border bg-muted/30 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sitemap</p>
            <p className="mt-2 truncate font-mono text-xs text-foreground sm:text-sm">yoursite.com/sitemap.xml</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Globe2 className="h-3.5 w-3.5 text-primary" />
              <span>Last crawl · 2m ago</span>
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="rounded-xl border border-border bg-muted/30 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Queue</p>
            <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-foreground">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                24
              </motion.span>
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              New URLs detected today
            </p>
          </motion.div>
        </div>

        <div className="border-t border-border px-2 pb-3 sm:px-4">
          <motion.div variants={itemVariants} className="flex items-center justify-between px-2 py-2 sm:px-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Recent pushes
            </p>
            <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-border inline-block" />
              Live
            </span>
          </motion.div>

          <ul className="space-y-1 overflow-hidden" style={{ minHeight: "9rem" }}>
            <AnimatePresence initial={false} mode="popLayout">
              {feed.map((row) => (
                <motion.li
                  key={row.id}
                  variants={rowVariants}
                  initial="enter"
                  animate="visible"
                  exit="exit"
                  layout
                  className="flex items-center justify-between gap-2 rounded-lg px-2 py-2.5 text-xs sm:px-3 transition-colors"
                >
                  <span className="min-w-0 truncate font-mono text-[11px] text-muted-foreground sm:text-xs">
                    {row.url}
                  </span>
                  <span className="hidden shrink-0 text-[10px] font-semibold uppercase text-muted-foreground/60 sm:inline">
                    {row.engine}
                  </span>
                  <AnimatePresence mode="wait">
                    {row.status === "indexed" ? (
                      <motion.div
                        key="indexed"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-pink-500" aria-label="Indexed" />
                      </motion.div>
                    ) : (
                      <motion.span
                        key="queued"
                        initial={{ opacity: 0, x: 6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        transition={{ duration: 0.2 }}
                        className="shrink-0 inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-600"
                      >
                        <Clock className="h-2.5 w-2.5" />
                        Queued
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
