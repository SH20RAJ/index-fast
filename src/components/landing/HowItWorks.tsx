"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    num: "01",
    title: "Connect Once",
    desc: "Import verified properties and sitemap endpoints in minutes. Your indexing stack is ready without custom setup.",
    punch: "No engineering bottleneck",
  },
  {
    num: "02",
    title: "Submit at Speed",
    desc: "Detect fresh URLs from sitemap updates and submit immediately to IndexNow and Bing from one workflow.",
    punch: "From publish to ping fast",
  },
  {
    num: "03",
    title: "Scale with Proof",
    desc: "Track accepted requests, failures, and trend lines so teams can double down on what actually improves discovery.",
    punch: "Execution with visibility",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-border/70 bg-card/30 py-14 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl space-y-3 sm:mb-12">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] tracking-[0.14em] uppercase">
            Operational Workflow
          </Badge>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            Stop publishing blind.
            <span className="block text-muted-foreground">Start indexing with intent.</span>
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            IndexFast gives you a daily operating system to push fresh pages, monitor outcomes, and compound discoverability.
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
