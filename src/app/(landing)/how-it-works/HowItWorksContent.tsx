"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, Gauge, Link2, Search, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const pipeline = [
  {
    id: "01",
    title: "Connect your site once",
    description:
      "Add your primary domain, sitemap URL, and IndexNow key file. IndexFast validates the setup before running submissions.",
    icon: ShieldCheck,
  },
  {
    id: "02",
    title: "Detect URL changes fast",
    description:
      "Scheduled scans pick up newly published URLs from your sitemap, deduplicate entries, and stage them for submission.",
    icon: Search,
  },
  {
    id: "03",
    title: "Submit to multiple engines",
    description:
      "Batched requests are sent to IndexNow and Bing endpoints with retries, reducing failed pushes under network load.",
    icon: Link2,
  },
  {
    id: "04",
    title: "Global Engine Propagation",
    description:
      "Your URLs are broadcasted across a high-speed ecosystem of 120+ global search engines, regional directories, and AI datasets instantly.",
    icon: Gauge,
  },
];

const operators = [
  "Solo builders shipping content every day",
  "SEO teams managing multiple sites and client portfolios",
  "Programmatic SEO operators publishing pages at scale",
  "Ecommerce teams launching high-priority product URLs",
];

const guarantees = [
  "No manual copy-paste URL submission loop",
  "A repeatable operating workflow for index pushes",
  "Visibility into what was submitted and when",
  "A clean handoff between publishing and indexing",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const slideInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

import { CronTerminal, ApiSubmission, PingRadar, EngineEcosystem } from "./WorkflowVisuals";

export default function HowItWorksContent() {
  return (
    <section className="relative isolate overflow-hidden border-b border-border/70 py-12 sm:py-16 lg:py-20">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70 [background:radial-gradient(60rem_30rem_at_20%_0%,rgba(255,184,108,0.12),transparent),radial-gradient(48rem_28rem_at_80%_10%,rgba(120,180,255,0.12),transparent)]" />

      <div className="mx-auto w-full max-w-6xl space-y-16 px-4 sm:px-6 lg:px-8">
        <motion.header 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-5"
        >
          <motion.div variants={itemVariants}>
            <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] tracking-[0.14em] uppercase shadow-sm border-primary/20 text-primary">
              Infrastructure Breakdown
            </Badge>
          </motion.div>
          <motion.h1 
            variants={itemVariants}
            className="max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-400"
          >
            A high-performance indexing engine.
          </motion.h1>
          <motion.p variants={itemVariants} className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            IndexFast isn't just a dashboard—it's a production-grade indexing pipeline that automates discovery, injection, and multi-engine propagation.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 pt-4">
            <Button asChild size="lg" className="h-14 font-black rounded-2xl shadow-xl shadow-primary/10 tracking-wide uppercase text-xs">
              <Link href="/sign-up">
                Start Accelerating <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 font-bold rounded-2xl bg-background/50 backdrop-blur-sm tracking-wide uppercase text-xs">
              <Link href="/docs">View Documentation</Link>
            </Button>
          </motion.div>
        </motion.header>

        {/* Animated Pipeline Diagram */}
        <div className="relative py-8">
          <div className="absolute left-8 top-16 bottom-16 w-[2px] bg-gradient-to-b from-transparent via-primary/30 to-transparent hidden md:block" />
          <motion.section 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-12 md:gap-20"
          >
            {pipeline.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="grid md:grid-cols-2 gap-8 items-center lg:gap-16">
                  <motion.div variants={itemVariants} className="relative pl-0 md:pl-20 group order-2 md:order-1">
                    {/* Custom animated connector */}
                    <div className="absolute left-[calc(2rem-5px)] top-8 hidden md:flex h-3 w-3 rounded-full bg-primary/40 group-hover:bg-primary transition-colors duration-300 shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                    
                    <Card className="border-beam border-border/70 bg-card/85 backdrop-blur-md shadow-sm transition-all duration-300 premium-card h-full">
                      <CardHeader className="space-y-3 pb-4">
                        <p className="text-[10px] font-black tracking-[0.2em] text-primary/80 uppercase">PHASE {step.id}</p>
                        <CardTitle className="flex items-center gap-3 text-xl font-bold tracking-tight">
                          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-gradient-to-br from-background to-muted/50 shadow-sm">
                            <Icon className="h-5 w-5 text-foreground/80 group-hover:text-primary transition-colors duration-300" />
                          </span>
                          {step.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                        {step.description}
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div 
                    variants={idx % 2 === 0 ? slideInRight : slideInLeft} 
                    className="flex justify-center order-1 md:order-2"
                  >
                    {idx === 0 && (
                      <div className="w-full flex justify-center py-4">
                        <div className="p-1 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl">
                          <div className="px-6 py-4 bg-background/80 rounded-xl backdrop-blur-lg border border-border/50 font-mono text-[11px] text-zinc-400">
                            ID: PRO-2987-X <br/>
                            STATUS: ACTIVE <br/>
                            DOMAIN: VERIFIED
                          </div>
                        </div>
                      </div>
                    )}
                    {idx === 1 && <CronTerminal />}
                    {idx === 2 && <ApiSubmission />}
                    {idx === 3 && <EngineEcosystem />}
                  </motion.div>
                </div>
              );
            })}
          </motion.section>
        </div>

        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-6 lg:grid-cols-2"
        >
          <motion.div variants={slideInLeft}>
            <Card className="h-full border-beam border-border/70 bg-background/85 backdrop-blur-md shadow-sm transition-all duration-500 premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-bold tracking-tight">
                  <span className="p-2 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 group-hover:bg-teal-500/20 transition-colors">
                    <Clock3 className="h-5 w-5" />
                  </span>
                  Who this is for
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-2 text-sm text-muted-foreground">
                {operators.map((item, i) => (
                  <motion.div 
                    key={item} 
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 + 0.3 }}
                    className="flex items-center gap-3"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-teal-500 shrink-0" />
                    <span className="font-medium text-foreground/80">{item}</span>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={slideInRight}>
            <Card className="h-full border-beam border-border/70 bg-background/85 backdrop-blur-md shadow-sm transition-all duration-500 premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl font-bold tracking-tight">
                  <span className="p-2 rounded-lg bg-pink-500/10 text-pink-600 dark:text-pink-400 group-hover:bg-pink-500/20 transition-colors">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                  What you get
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-2 text-sm text-muted-foreground">
                {guarantees.map((item, i) => (
                  <motion.div 
                    key={item}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 + 0.3 }}
                    className="flex items-center gap-3"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-pink-500 shrink-0" />
                    <span className="font-medium text-foreground/80">{item}</span>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <Card className="relative overflow-hidden border-none bg-gradient-to-br from-zinc-900 to-zinc-800 text-white shadow-2xl">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]" />
            <CardContent className="relative flex flex-col gap-6 p-8 sm:p-10 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <h2 className="text-2xl font-black tracking-tight sm:text-3xl text-white">
                  Ready to run indexing as an actual system?
                </h2>
                <p className="max-w-xl text-zinc-300">
                  Create your account, connect your sitemap, and start shipping URLs with a repeatable process.
                </p>
              </div>
              <Button asChild size="lg" className="shrink-0 rounded-full bg-white text-zinc-900 hover:bg-zinc-100 border-none font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all">
                <Link href="/sign-up">
                  Create account <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
