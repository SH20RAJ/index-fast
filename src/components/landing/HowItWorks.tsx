"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    num: "01",
    title: "Submit URLs",
    desc: "Connect your sitemap or paste URLs manually. We'll automatically find every page that needs indexing.",
    punch: "Setup in 1 minute",
  },
  {
    num: "02",
    title: "We send signals",
    desc: "We push high-priority indexing signals directly to Google and Bing APIs to bypass the slow crawl queue.",
    punch: "Instant Submission",
  },
  {
    num: "03",
    title: "Track results",
    desc: "Watch your pages get indexed in real-time. See exactly what's live and what needs attention.",
    punch: "Real-time visibility",
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
