"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Globe, Send, CheckCircle2 } from "lucide-react";

export const CronTerminal = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const allLogs = [
    "[CRON] Starting sitemap scan...",
    "[INFO] Fetching https://domain.com/sitemap.xml",
    "[SUCCESS] Sitemap loaded: 142 URLs",
    "[DIFF] Found 3 new URLs to index",
    "[QUEUE] Staging URLs for processing...",
    "[WORKER] Batched 3 URLs for Bing API",
    "[WORKER] Batched 3 URLs for IndexNow",
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setLogs((prev) => [...prev.slice(-4), allLogs[i]]);
      i = (i + 1) % allLogs.length;
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-md overflow-hidden rounded-xl border border-zinc-800 bg-black/90 p-4 font-mono text-[11px] text-emerald-500 shadow-2xl">
      <div className="mb-2 flex items-center gap-2 border-b border-zinc-800 pb-2">
        <Terminal className="h-3 w-3 text-zinc-500" />
        <span className="text-zinc-500 uppercase tracking-widest text-[9px] font-bold">Automation Logs</span>
        <div className="ml-auto flex gap-1">
          <div className="h-2 w-2 rounded-full bg-zinc-800" />
          <div className="h-2 w-2 rounded-full bg-zinc-800" />
        </div>
      </div>
      <div className="space-y-1">
        <AnimatePresence mode="popLayout">
          {logs.map((log, i) => (
            <motion.div
              key={log + i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
              className="flex gap-2"
            >
              <span className="text-zinc-600 shrink-0">{i + 1}.</span>
              <span className="break-all">{log}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        <motion.span
          animate={{ opacity: [0, 1] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block h-4 w-1 bg-emerald-500"
        />
      </div>
    </div>
  );
};

export const ApiSubmission = () => {
  return (
    <div className="flex h-48 w-full items-center justify-around gap-4 rounded-2xl border border-border/50 bg-card/30 p-6 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 shadow-sm">
          <Globe className="h-6 w-6 text-zinc-500" />
        </div>
        <span className="text-[10px] font-bold text-zinc-400">YOUR SITE</span>
      </div>

      <div className="relative flex-1">
        <div className="h-[2px] w-full bg-zinc-200 dark:bg-zinc-800" />
        <motion.div
          animate={{ x: ["0%", "100%"], opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="absolute top-[-4px] h-[10px] w-4 rounded-full bg-primary blur-[2px]"
        />
      </div>

      <div className="flex flex-col gap-3">
        <motion.div 
          animate={{ y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="flex items-center gap-2 rounded-lg border border-border/50 bg-background/80 px-3 py-2 shadow-sm"
        >
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] font-bold">BING API</span>
          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
        </motion.div>
        <motion.div 
          animate={{ y: [0, 2, 0] }}
          transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
          className="flex items-center gap-2 rounded-lg border border-border/50 bg-background/80 px-3 py-2 shadow-sm"
        >
          <div className="h-2 w-2 rounded-full bg-blue-500" />
          <span className="text-[10px] font-bold">INDEXNOW</span>
          <CheckCircle2 className="h-3 w-3 text-blue-500" />
        </motion.div>
      </div>
    </div>
  );
};

export const PingRadar = () => {
  const nodes = React.useMemo(() => [...Array(12)].map((_, i) => ({
    delay: i * 0.2,
    top: `${20 + Math.random() * 60}%`,
    left: `${20 + Math.random() * 60}%`,
    duration: 1.5 + Math.random()
  })), []);

  return (
    <div className="relative flex aspect-square w-full max-w-[240px] items-center justify-center rounded-full border border-border/50 bg-card/20 group">
      <div className="absolute inset-0 rounded-full border border-primary/10 animate-ping opacity-20" />
      <div className="absolute inset-[20%] rounded-full border border-primary/20 animate-pulse opacity-30" />
      <div className="absolute inset-[40%] rounded-full border border-primary/30" />
      
      <div className="relative z-10 flex flex-col items-center">
        <Send className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-500" />
        <span className="mt-2 text-[14px] font-black tracking-tighter">PINGING 120+</span>
        <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Directories</span>
      </div>

      {/* Randomized nodes representing engines */}
      {nodes.map((node, i) => (
        <motion.div
          key={i}
          animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: node.duration, delay: node.delay }}
          className="absolute h-1 w-1 rounded-full bg-primary/30"
          style={{
            top: node.top,
            left: node.left,
          }}
        />
      ))}
    </div>
  );
};
