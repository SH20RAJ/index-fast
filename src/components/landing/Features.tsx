"use client";

import { Bolt, Brain, Database, Gauge, Search, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "Kill Indexing Blockers",
    desc: "Automatically surface technical issues that prevent bots from crawling your content. Fix before rankings tank.",
    icon: Sparkles,
  },
  {
    title: "Direct API Injection",
    desc: "Skip the crawl queue. We push your URLs directly into Bing and IndexNow APIs for near-instant visibility.",
    icon: Bolt,
  },
  {
    title: "AI Search Exposure",
    desc: "Ensure your content is the first thing AI agents (ChatGPT, Perplexity, Gemini) see when sourcing data.",
    icon: Brain,
  },
  {
    title: "Instant Batch Operations",
    desc: "Upload 1,000+ high-traffic URLs at once. Perfect for large ecommerce sites and programmatic SEO.",
    icon: Gauge,
  },
  {
    title: "24/7 Sitemap Tracking",
    desc: "We monitor your sitemap every 30 minutes. As soon as you publish, we push. No manual input needed.",
    icon: Database,
  },
  {
    title: "One-Click GSC Sync",
    desc: "Instantly import your entire site portfolio from Google Search Console and begin indexing in seconds.",
    icon: Search,
  },
];

export default function Features() {
  return (
    <section id="features" className="border-b border-border/70 py-14 sm:py-20 bg-muted/20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 max-w-3xl space-y-4">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] tracking-[0.14em] uppercase border-primary/20 text-primary bg-primary/5">
            Enterprise Performance
          </Badge>
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl leading-tight">
            Stop waiting for Google. <br />
            <span className="text-muted-foreground">Start forcing indexing.</span>
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground sm:text-xl max-w-2xl">
            In SEO, speed is the only advantage you can automate. IndexFast gives you the tools to outrun competitors by being ready before they even crawl.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <Card key={f.title} className="border-beam border-border/70 bg-card transition-all premium-card relative isolate overflow-hidden">
                <CardContent className="space-y-4 p-7 sm:p-8">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-border/50 bg-background/90 shadow-sm text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground/80">{f.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
