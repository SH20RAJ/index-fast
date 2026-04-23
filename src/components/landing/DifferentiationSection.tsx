"use client";

import { motion, type Variants, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Zap, Shield, BarChart3, Clock,
  Bot, Terminal, Check, ChevronRight, Copy, Sparkles, ArrowRight
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Shared animation variants                                                 */
/* -------------------------------------------------------------------------- */
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

/* -------------------------------------------------------------------------- */
/*  Edge feature cards                                                        */
/* -------------------------------------------------------------------------- */
const edgeItems = [
  {
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    title: "Pure Indexing Speed",
    description: "Bypass the slow crawl queue. Signals hit Google and Bing APIs in milliseconds — your content ranked before competitors even refresh.",
  },
  {
    icon: Clock,
    color: "text-sky-500",
    bg: "bg-sky-500/10",
    title: "10× Faster than Manual",
    description: "Stop pasting URLs into Search Console. IndexFast submits thousands of pages automatically while you focus on building.",
  },
  {
    icon: BarChart3,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    title: "Bulk & Automation",
    description: "Programmatic SEO. Ecommerce catalogs. News feeds. We handle unlimited URL discovery and timed auto-pings — no code required.",
  },
  {
    icon: Shield,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    title: "100% White-Hat Safe",
    description: "Official Google & Bing Indexing API endpoints. No sketchy bots, no grey-hat tactics. Your domain reputation stays pristine.",
  },
];

/* -------------------------------------------------------------------------- */
/*  MCP agent configs                                                         */
/* -------------------------------------------------------------------------- */
const agents = [
  {
    id: "cursor",
    label: "Cursor",
    color: "text-sky-400",
    dot: "bg-sky-400",
    instructions: `Settings → MCP → Add Server\n\nURL:  https://www.indexfast.co/api/mcp\nAuth: Bearer idx_YOUR_KEY`,
  },
  {
    id: "claude",
    label: "Claude Code",
    color: "text-violet-400",
    dot: "bg-violet-400",
    instructions: `# claude_desktop_config.json\n{\n  "mcpServers": {\n    "indexfast": {\n      "command": "curl",\n      "args": [\n        "-X", "POST",\n        "-H", "Authorization: Bearer idx_YOUR_KEY",\n        "-H", "Content-Type: application/json",\n        "https://www.indexfast.co/api/mcp"\n      ]\n    }\n  }\n}`,
  },
  {
    id: "windsurf",
    label: "Windsurf",
    color: "text-teal-400",
    dot: "bg-teal-400",
    instructions: `Settings → MCP → Add Server\n\nURL:  https://www.indexfast.co/api/mcp\nAuth: Bearer idx_YOUR_KEY`,
  },
  {
    id: "kilo",
    label: "Kilocode",
    color: "text-orange-400",
    dot: "bg-orange-400",
    instructions: `.kilocode/mcp.json\n\n{\n  "servers": [\n    {\n      "name": "indexfast",\n      "url": "https://www.indexfast.co/api/mcp",\n      "auth": "Bearer idx_YOUR_KEY"\n    }\n  ]\n}`,
  },
];

const mcpTools = [
  { name: "submit_url", desc: "Index any page from your AI chat" },
  { name: "bulk_submit", desc: "Push an array of URLs in one call" },
  { name: "seo_audit", desc: "Run an instant SEO check on a page" },
  { name: "list_websites", desc: "View all connected sites & status" },
  { name: "get_usage", desc: "Check submission limits & quota" },
];

/* -------------------------------------------------------------------------- */
/*  Tiny copy button                                                          */
/* -------------------------------------------------------------------------- */
function CopySnippet({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
      aria-label={copied ? "Copied to clipboard" : "Copy code to clipboard"}
      className="absolute top-3 right-3 h-7 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-bold text-zinc-300 hover:text-white transition-all flex items-center gap-1.5"
    >
      {copied ? <><Check className="h-3 w-3 text-emerald-400" aria-hidden="true" /> Copied</> : <><Copy className="h-3 w-3" aria-hidden="true" /> Copy</>}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main export                                                               */
/* -------------------------------------------------------------------------- */
export default function DifferentiationSection() {
  const [activeAgent, setActiveAgent] = useState("cursor");
  const active = agents.find(a => a.id === activeAgent)!;

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Section 1 — The IndexFast Edge                                      */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-primary/[0.04] via-transparent to-transparent" />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mb-16 text-center space-y-4"
          >
            <motion.p variants={fadeUp} className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
              Why IndexFast
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl font-serif font-bold tracking-tight sm:text-5xl">
              The IndexFast Edge
            </motion.h2>
            <motion.p variants={fadeUp} className="mx-auto max-w-xl text-base text-muted-foreground">
              Built for indexing, not vanity metrics. Here's why high-velocity teams switch to us.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid gap-5 md:grid-cols-2 lg:grid-cols-4"
          >
            {edgeItems.map((item) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                className="group flex flex-col gap-5 rounded-3xl border border-border/60 bg-card/60 p-7 shadow-sm hover:border-primary/25 hover:shadow-lg transition-all duration-300 backdrop-blur-sm"
              >
                <div className={cn("h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110", item.bg)}>
                  <item.icon className={cn("h-5 w-5", item.color)} strokeWidth={1.75} />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold tracking-tight text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Section 2 — MCP Agent Integration                                  */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative overflow-hidden py-24 sm:py-32 bg-zinc-950 dark:bg-zinc-950">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/10 blur-[120px] opacity-60" />
          <div className="absolute bottom-0 right-0 h-[300px] w-[400px] rounded-full bg-violet-500/10 blur-[100px] opacity-40" />
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mb-16 text-center space-y-4"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
              <Bot className="h-3 w-3" /> MCP — Model Context Protocol
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-3xl font-serif font-bold tracking-tight text-white sm:text-5xl">
              Let your AI agent index<br />
              <span className="text-primary italic">while you code</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mx-auto max-w-xl text-base text-zinc-400">
              Connect IndexFast to Cursor, Claude Code, Windsurf, or Kilocode. Your agent auto-indexes every new page the moment you ship — zero manual work.
            </motion.p>
          </motion.div>

          {/* Two-column layout */}
          <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
            {/* Left — agent tabs + code */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              {/* Agent selector */}
              <div className="flex flex-wrap gap-2">
                {agents.map(a => (
                  <button
                    key={a.id}
                    onClick={() => setActiveAgent(a.id)}
                    aria-label={`Show ${a.label} configuration`}
                    aria-pressed={activeAgent === a.id}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border",
                      activeAgent === a.id
                        ? "bg-white/10 border-white/20 text-white"
                        : "bg-transparent border-white/5 text-zinc-400 hover:border-white/10 hover:text-zinc-200"
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full", a.dot)} aria-hidden="true" />
                    {a.label}
                  </button>
                ))}
              </div>

              {/* Code block */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeAgent}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="relative"
                >
                  <pre className="rounded-3xl bg-zinc-900 border border-white/5 shadow-2xl p-6 text-[12px] font-mono leading-relaxed text-zinc-300 overflow-x-auto min-h-[200px]">
                    {active.instructions}
                  </pre>
                  <CopySnippet text={active.instructions} />
                  {/* Traffic light dots */}
                  <div className="absolute top-5 left-5 flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* "Magic moment" quote */}
              <div className="rounded-2xl bg-primary/5 border border-primary/15 px-5 py-4 flex items-start gap-3">
                <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-zinc-400 leading-relaxed italic">
                  <span className="text-white font-semibold not-italic">"Index this page for me"</span> — say this to your agent after setup and watch your content appear in Google within hours.
                </p>
              </div>
            </motion.div>

            {/* Right — tools list + CTA */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-5"
            >
              {/* Tools card */}
              <div className="rounded-3xl bg-zinc-900 border border-white/5 p-6 space-y-5">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-primary" />
                  <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-300">Available MCP Tools</p>
                </div>
                <div className="space-y-3">
                  {mcpTools.map(tool => (
                    <div key={tool.name} className="flex items-start gap-3 group">
                      <Check className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <code className="text-[11px] font-bold text-primary">{tool.name}</code>
                        <p className="text-[11px] text-zinc-400 mt-0.5">{tool.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Workflow card */}
              <div className="rounded-3xl bg-zinc-900 border border-white/5 p-6 space-y-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-300">Auto-index workflow</p>
                {[
                  "You write & publish a new page",
                  "Your AI agent detects the change",
                  "IndexFast MCP submits it instantly",
                  "Google indexes it within hours",
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-xs text-zinc-300">{step}</p>
                    {i < 3 && <ChevronRight className="h-3 w-3 text-zinc-700 ml-auto shrink-0" />}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                href="/dashboard/mcp"
                className="group flex items-center justify-between w-full rounded-2xl bg-primary px-5 py-4 text-sm font-bold text-white hover:bg-primary/90 transition-all"
              >
                <span>Set up your AI agent →</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
