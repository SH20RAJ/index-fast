"use client";
import Link from "next/link";
import { ArrowRight, Sparkles, Database, Zap, CheckCircle } from "lucide-react";
import { useStackApp } from "@stackframe/stack";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const socialProof = [
  { value: "2.8M+", label: "URLs indexed" },
  { value: "98.6%", label: "Success rate" },
  { value: "4-24h", label: "Avg discovery" },
];

const benefits = [
  { icon: Zap, text: "Index 4x faster with IndexNow" },
  { icon: Database, text: "Auto-submit to Wayback Machine" },
  { icon: CheckCircle, text: "GEO for AI crawlers (ChatGPT, Perplexity, Claude)" },
];

const feedItems = [
  { domain: "example.com", status: "✓ Indexed", time: "14 mins ago", engine: "Google" },
  { domain: "blog.site.io", status: "✓ Indexed", time: "28 mins ago", engine: "Bing" },
  { domain: "shop.dev", status: "✓ Indexed", time: "42 mins ago", engine: "IndexNow" },
  { domain: "docs.app", status: "✓ Indexed", time: "1h ago", engine: "Google" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
    },
  },
};

export default function Hero() {
  const stack = useStackApp();

  return (
    <section id="home" className="relative overflow-hidden border-b border-border/50 bg-background pb-12 pt-16 md:pb-24 md:pt-32">
      {/* Dynamic Background Blurs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-[120px] dark:bg-primary/5" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-[120px] dark:bg-primary/5" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center"
        >
          {/* ── Left Column ── */}
          <div className="flex flex-col gap-10">
            {/* Top Label */}
            <motion.div variants={itemVariants}>
              <Badge variant="secondary" className="gap-2 px-4 py-1.5 text-xs font-bold uppercase tracking-widest bg-primary/10 text-primary border-none">
                <Sparkles className="h-3.5 w-3.5" />
                Trusted by 11,400+ Growth Teams
              </Badge>
            </motion.div>

            {/* Headline */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h1 className="text-6xl font-black leading-[0.95] tracking-tighter sm:text-7xl lg:text-8xl">
                Get indexed <br />
                <span className="text-primary italic">lightning fast.</span>
              </h1>
              <p className="max-w-xl text-xl leading-relaxed text-muted-foreground/80 md:text-2xl">
                Automate your SEO workflow with sitemap syncing, Bing submissions, and IndexNow pings. 
                Move from "Discovered" to "Indexed" in hours.
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                color="primary"
                className="h-14 px-8 text-lg font-black shadow-2xl shadow-primary/30 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                onClick={() => stack.redirectToSignUp()}
              >
                Start Indexing Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="h-14 px-8 text-lg font-bold border-border/50 bg-background/50 backdrop-blur-sm transition-all hover:bg-muted" 
                asChild
              >
                <Link href="/tools">Explore Toolbox</Link>
              </Button>
            </motion.div>

            {/* Benefits Row */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <b.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold leading-tight text-foreground/80">{b.text}</span>
                </div>
              ))}
            </motion.div>

            {/* Social Proof */}
            <motion.div variants={itemVariants} className="flex items-center gap-8 border-t border-border/50 pt-10">
              {socialProof.map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-black tracking-tight">{stat.value}</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right Column — Interactive Card ── */}
          <motion.div 
            variants={itemVariants}
            className="relative"
          >
            {/* Decorative element behind card */}
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-primary/20 via-transparent to-primary/10 blur-2xl opacity-50" />
            
            <Card className="relative overflow-hidden border-border/50 bg-background/60 shadow-2xl backdrop-blur-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
              <CardContent className="relative space-y-6 p-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                      Real-time Network
                    </p>
                    <h3 className="text-lg font-bold">Live submission feed</h3>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 ring-1 ring-inset ring-emerald-500/20">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                      <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Live</span>
                  </div>
                </div>

                {/* Rows */}
                <div className="space-y-3">
                  {feedItems.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                      className="group flex items-center justify-between gap-4 rounded-xl border border-border/40 bg-muted/30 p-4 transition-all hover:bg-muted/50 hover:shadow-sm"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background font-bold text-[10px] shadow-sm">
                          {item.engine[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold">{item.domain}</p>
                          <p className="text-[10px] text-muted-foreground">{item.time} • via {item.engine}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none font-bold text-[10px]">
                        {item.status}
                      </Badge>
                    </motion.div>
                  ))}
                </div>

                {/* Footer Insight */}
                <div className="rounded-xl bg-primary/5 p-4 ring-1 ring-primary/10">
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    <span className="font-bold text-foreground">Optimization Engine:</span> 4,127 URLs submitted today with <span className="text-emerald-500 font-bold">100% success rate</span>. AI agents already crawled 14% of them.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
