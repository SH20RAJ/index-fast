"use client";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { Badge } from "@/components/ui/badge";
import { Globe, Zap, Gauge, Cpu, Layers, Sparkles } from "lucide-react";

const features = [
  {
    Icon: Globe,
    name: "GEO Testing",
    description: "Verify how AI crawlers see your site across global nodes. Optimize for ChatGPT and Gemini visibility.",
    href: "/how-it-works",
    cta: "Explore GEO",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent pointer-events-none" />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: Zap,
    name: "Performance Pulse",
    description: "Automated Core Web Vitals audits with instant indexing impact analysis.",
    href: "/how-it-works",
    cta: "View Metrics",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none" />
    ),
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: Sparkles,
    name: "AI Content Signals",
    description: "Measure your discoverability across 15+ LLM search engines.",
    href: "/how-it-works",
    cta: "Check Signals",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent pointer-events-none" />
    ),
    className: "lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: Gauge,
    name: "Real-time Metrics",
    description: "Live dashboard tracking of sitemap discovery and API submission success rates.",
    href: "/dashboard",
    cta: "Open Dashboard",
    background: (
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent pointer-events-none" />
    ),
    className: "lg:col-start-2 lg:col-end-4 lg:row-start-2 lg:row-end-3",
  },
];

export default function BentoFeatures() {
  return (
    <section className="border-b border-border/70 py-14 sm:py-20 bg-muted/20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 max-w-3xl space-y-4">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] tracking-[0.14em] uppercase border-primary/20 text-primary bg-primary/5">
            Advanced Capabilities
          </Badge>
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl leading-tight">
            Enterprise-grade tools for <br />
            <span className="text-muted-foreground">the modern SEO era.</span>
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground sm:text-xl max-w-2xl">
            Beyond just indexing—we provide the infrastructure to measure and improve your visibility across both traditional and AI search engines.
          </p>
        </div>

        <BentoGrid className="lg:grid-rows-3 lg:auto-rows-[160px]">
          {features.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}
