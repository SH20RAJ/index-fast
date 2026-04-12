"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Globe, Send, CheckCircle2 } from "lucide-react";

export const CronTerminal = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const allLogs = useMemo(() => [
    "[CRON] Starting sitemap scan...",
    "[INFO] Fetching https://domain.com/sitemap.xml",
    "[SUCCESS] Sitemap loaded: 142 URLs",
    "[DIFF] Found 3 new URLs to index",
    "[QUEUE] Staging URLs for processing...",
    "[WORKER] Batched 3 URLs for Bing API",
    "[WORKER] Batched 3 URLs for IndexNow",
  ], []);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setLogs((prev) => [...prev.slice(-4), allLogs[i]]);
      i = (i + 1) % allLogs.length;
    }, 2000);
    return () => clearInterval(interval);
  }, [allLogs]);

  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-zinc-800 bg-black/90 p-4 font-mono text-[11px] text-emerald-500 shadow-2xl">
      {/* Scanning Line Effect */}
      <motion.div 
        animate={{ y: ["0%", "100%", "0%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute inset-x-0 h-[100px] bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent pointer-events-none z-10"
      />
      
      <div className="mb-2 flex items-center gap-2 border-b border-zinc-800 pb-2 relative z-20">
        <Terminal className="h-3 w-3 text-zinc-500" />
        <span className="text-zinc-500 uppercase tracking-widest text-[9px] font-bold">Automation Logs</span>
        <div className="ml-auto flex gap-1">
          <div className="h-2 w-2 rounded-full bg-zinc-800" />
          <div className="h-2 w-2 rounded-full bg-zinc-800" />
        </div>
      </div>
      <div className="space-y-1 relative z-20">
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
    <div className="flex h-48 w-full items-center justify-around gap-4 rounded-3xl border border-border/50 bg-card/30 p-8 backdrop-blur-xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
      
      <div className="flex flex-col items-center gap-2 relative z-10">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 shadow-inner"
        >
          <Globe className="h-7 w-7 text-zinc-500" />
        </motion.div>
        <span className="text-[9px] font-black tracking-widest text-zinc-400 uppercase">Primary Site</span>
      </div>

      <div className="relative flex-1 h-12 flex items-center justify-center">
        <div className="h-[1px] w-full bg-gradient-to-r from-zinc-200 via-primary/30 to-zinc-200 dark:from-zinc-800 dark:via-primary/30 dark:to-zinc-800" />
        
        {/* URL Data Packets */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ x: "-10%", opacity: 0 }}
            animate={{ 
              x: ["0%", "110%"],
              opacity: [0, 1, 1, 0],
              scale: [0.8, 1, 1, 0.8]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2.5, 
              delay: i * 0.8,
              ease: "easeInOut" 
            }}
            className="absolute h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_rgba(var(--primary),0.8)] flex items-center justify-center"
          >
             <div className="absolute -top-4 text-[7px] font-bold text-primary/60 whitespace-nowrap uppercase tracking-tighter">URL_{i+1}</div>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col gap-4 relative z-10">
        <motion.div 
          whileHover={{ x: 5 }}
          className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/90 px-4 py-2.5 shadow-xl"
        >
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-zinc-400 uppercase">Bing Search</span>
            <span className="text-[10px] font-bold">POST SUCCESS</span>
          </div>
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        </motion.div>
        
        <motion.div 
          whileHover={{ x: 5 }}
          className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/90 px-4 py-2.5 shadow-xl"
        >
          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-zinc-400 uppercase">IndexNow</span>
            <span className="text-[10px] font-bold">SIGNAL SENT</span>
          </div>
          <CheckCircle2 className="h-4 w-4 text-blue-500" />
        </motion.div>
      </div>
    </div>
  );
};

export const PingRadar = () => {
  const nodes = useMemo(() => [...Array(15)].map((_, i) => ({
    id: i,
    angle: Math.random() * 360,
    radius: 30 + Math.random() * 60,
    delay: Math.random() * 2,
    duration: 1.5 + Math.random(),
    size: 1 + Math.random() * 2
  })), []);

  return (
    <div className="relative flex aspect-square w-full max-w-[280px] items-center justify-center rounded-full border border-border/30 bg-card/10 backdrop-blur-sm group overflow-hidden">
      {/* Radar Sweep Line */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ originX: "50%", originY: "50%" }}
      >
        <div className="absolute top-0 left-1/2 h-1/2 w-[2px] bg-gradient-to-t from-transparent via-primary/50 to-primary origin-bottom" />
        <div className="absolute top-0 left-1/2 h-1/2 w-20 bg-primary/5 blur-2xl origin-bottom -rotate-12" />
      </motion.div>

      {/* Concentric Rings */}
      <div className="absolute inset-0 rounded-full border border-primary/5" />
      <div className="absolute inset-[20%] rounded-full border border-primary/10" />
      <div className="absolute inset-[40%] rounded-full border border-primary/15" />
      <div className="absolute inset-[60%] rounded-full border border-primary/20" />
      
      <div className="relative z-20 flex flex-col items-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="p-4 rounded-2xl bg-primary/10 border border-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.1)]"
        >
          <Send className="h-8 w-8 text-primary" />
        </motion.div>
        <span className="mt-4 text-[16px] font-black tracking-tighter uppercase">120+ Global</span>
        <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Pinging Hubs</span>
      </div>

      {/* Search Engine Nodes */}
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          className="absolute rounded-full bg-primary/40"
          style={{
            width: node.size,
            height: node.size,
            top: `calc(50% + ${Math.sin((node.angle * Math.PI) / 180) * node.radius}%)`,
            left: `calc(50% + ${Math.cos((node.angle * Math.PI) / 180) * node.radius}%)`,
          }}
          animate={{ 
            opacity: [0.2, 1, 0.2],
            boxShadow: ["0 0 0px #fff", "0 0 8px #fff", "0 0 0px #fff"]
          }}
          transition={{ 
            duration: node.duration, 
            repeat: Infinity, 
            delay: node.delay 
          }}
        />
      ))}
    </div>
  );
};
