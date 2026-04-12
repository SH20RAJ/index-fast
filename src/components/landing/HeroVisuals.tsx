"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const CumulativeCounter = ({ target = 1420903 }: { target?: number }) => {
  const [count, setCount] = useState(target - 100);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <motion.span 
        key={count}
        initial={{ opacity: 0.5, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-black tabular-nums tracking-tighter text-foreground sm:text-5xl"
      >
        {count.toLocaleString()}
      </motion.span>
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-1">
        URLs Indexed Globally
      </span>
    </div>
  );
};

const SAMPLE_URLS = [
  "blog/how-to-rank-fast",
  "products/seo-tool-v2",
  "guides/indexing-api",
  "case-studies/client-a",
  "blog/indexnow-explained",
  "tools/sitemap-checker",
];

export const LiveIndexingStream = () => {
  const [items, setItems] = useState(() => 
    SAMPLE_URLS.slice(0, 3).map((url, i) => ({ id: Math.random(), url, time: "Just now" }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const newUrl = SAMPLE_URLS[Math.floor(Math.random() * SAMPLE_URLS.length)];
      setItems((prev) => [
        { id: Math.random(), url: newUrl, time: "Just now" },
        ...prev.slice(0, 2),
      ]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-2 w-full max-w-[280px]">
      <div className="flex items-center gap-2 mb-1">
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Live Activity</span>
      </div>
      <div className="relative h-32 overflow-hidden mask-fade-bottom">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20, filter: "blur(4px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 20, filter: "blur(4px)" }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 py-2 border-b border-border/40 last:border-0"
            >
              <div className="h-7 w-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-border/50">
                <span className="text-[10px] font-bold">HT</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-medium truncate text-foreground/80">/{item.url}</span>
                <span className="text-[9px] text-muted-foreground">{item.time}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
