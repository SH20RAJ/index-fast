"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    num: "01",
    title: "Add your site",
    desc: "Simply connect your sitemap and link your Google Search Console account. It takes just a few minutes.",
    punch: "Quick Setup",
  },
  {
    num: "02",
    title: "Auto-Index",
    desc: "Our system automatically finds your new pages and submits them to search engines immediately.",
    punch: "Save Time",
  },
  {
    num: "03",
    title: "Track Results",
    desc: "Monitor your indexing status and see exactly which pages have been successfully indexed.",
    punch: "Clear Reporting",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-border/70 bg-card/30 py-14 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl space-y-3 sm:mb-12">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] tracking-[0.14em] uppercase">
            How it works
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Get your pages ranked.
            <span className="block text-muted-foreground">Faster and easier than ever.</span>
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            IndexFast helps you get your new content noticed by Google and Bing in minutes, not days.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <Card key={step.title} className="relative overflow-hidden border-border/70 bg-background/90">
              <span className="pointer-events-none absolute -right-4 -top-4 text-8xl font-black tracking-tighter text-muted/35">
                {step.num}
              </span>
              <CardContent className="relative space-y-3 p-5 sm:p-6">
                <p className="text-[11px] font-bold tracking-[0.14em] text-primary uppercase">{step.punch}</p>
                <h3 className="text-xl font-bold tracking-tight">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
