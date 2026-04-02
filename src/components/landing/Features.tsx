"use client";

import { Bolt, Brain, Database, Gauge, Search, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "Technical SEO Auditor",
    desc: "Surface crawl and index blockers instantly, then ship prioritized fixes before rankings are impacted.",
    icon: Sparkles,
  },
  {
    title: "Universal URL Pings",
    desc: "Push URL updates to IndexNow and submission endpoints with retries, logs, and clean operational control.",
    icon: Bolt,
  },
  {
    title: "AI Visibility Signals",
    desc: "Measure discoverability across AI assistants and close visibility gaps before demand shifts.",
    icon: Brain,
  },
  {
    title: "Instant Batch Submission",
    desc: "Launch high-priority URL batches in one action with direct Bing and IndexNow integrations.",
    icon: Gauge,
  },
  {
    title: "Sitemap Auto-Sync",
    desc: "Watch sitemap changes continuously and auto-submit fresh pages before competitor refresh cycles.",
    icon: Database,
  },
  {
    title: "GSC Property Sync",
    desc: "Import verified sites from Google Search Console and run indexing operations from one focused dashboard.",
    icon: Search,
  },
];

export default function Features() {
  return (
    <section id="features" className="border-b border-border/70 py-14 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl space-y-3 sm:mb-12">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] tracking-[0.14em] uppercase">
            Enterprise Infrastructure
          </Badge>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            Feature set built to win
            <span className="block text-muted-foreground">the indexing race.</span>
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Publish velocity alone does not win. Reliable submission speed and operator-level visibility do.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <Card key={f.title} className="border-border/70 bg-card/70 transition-colors hover:border-primary/40">
                <CardContent className="space-y-4 p-5 sm:p-6">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/70 bg-background/90">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold tracking-tight">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
