"use client";

import { Sparkles, Zap, Globe, Gauge, Cpu, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const upcomingFeatures = [
  {
    title: "GEO Testing",
    desc: "Test how AI crawlers see your pages — optimize for ChatGPT, Perplexity, Claude, and Gemini visibility.",
    icon: Globe,
    status: "Beta",
  },
  {
    title: "Lighthouse Integration",
    desc: "Automated performance audits with actionable fixes for Core Web Vitals and accessibility.",
    icon: Zap,
    status: "Coming Soon",
  },
  {
    title: "PageSpeed Insights (In-House)",
    desc: "Real-time speed testing from multiple regions with optimization recommendations.",
    icon: Gauge,
    status: "Coming Soon",
  },
  {
    title: "AI Content Analyzer",
    desc: "Measure how discoverable your content is to generative AI models and close visibility gaps.",
    icon: Cpu,
    status: "Coming Soon",
  },
  {
    title: "Multi-Region Testing",
    desc: "Test indexing speed and visibility across different geographic regions and search engines.",
    icon: Layers,
    status: "Coming Soon",
  },
  {
    title: "Wayback Machine Dashboard",
    desc: "View and manage all archived versions of your site with submission history and success rates.",
    icon: Sparkles,
    status: "Beta",
  },
];

export default function UpcomingFeatures() {
  return (
    <section className="border-b border-border/70 py-14 sm:py-20 bg-background/50">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl space-y-3 sm:mb-12">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] tracking-[0.14em] uppercase">
            Product Roadmap
          </Badge>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            What&apos;s coming next
            <span className="block text-muted-foreground">in 2025 & beyond</span>
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            We&apos;re building enterprise-grade tools for SEO, generative engine optimization, and performance testing. Here&apos;s what&apos;s on the roadmap.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingFeatures.map((feature) => {
            const Icon = feature.icon;
            const isBeta = feature.status === "Beta";
            return (
              <Card key={feature.title} className="border-border/70 bg-card/70 transition-colors hover:border-primary/40 relative overflow-hidden">
                {isBeta ? (
                  <div className="absolute top-0 right-0 h-2 w-2 bg-primary rounded-bl-full" />
                ) : null}
                <CardContent className="space-y-4 p-5 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/70 bg-background/90">
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge
                      variant={isBeta ? "default" : "outline"}
                      className="text-[10px] font-semibold"
                    >
                      {feature.status}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-bold tracking-tight">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
