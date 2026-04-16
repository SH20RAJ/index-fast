"use client";

import { Quote, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AIAssistantCard } from "@/components/ui/ai-assistant-card";

const testimonials = [
  {
    name: "Aarav Mehta",
    occupation: "SEO Manager",
    company: "Northlane Commerce",
    quote:
      "We used to wait days for fresh pages to appear. With IndexFast, our launch URLs start getting discovered the same day.",
  },
  {
    name: "Sophia Reed",
    occupation: "Growth Marketer",
    company: "CloudPilot",
    quote:
      "The sitemap auto-sync plus Bing and IndexNow submissions removed hours of manual SEO ops every week.",
  },
  {
    name: "Priya Nair",
    occupation: "Founder",
    company: "Rankforge Studio",
    quote:
      "For a lean team, this became our indexing control center. We publish, submit, and monitor without extra tooling.",
  },
];

export default function Testimonials() {
  return (
    <section className="border-b border-border/70 py-14 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
          {/* Left: testimonials */}
          <div className="flex flex-col gap-6">
            <div className="space-y-3">
              <Badge
                variant="outline"
                className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em]"
              >
                Testimonials
              </Badge>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                What teams say after switching
              </h2>
              <p className="text-base text-muted-foreground sm:text-lg max-w-lg">
                Real operators, real roles, and practical outcomes from faster
                indexing workflows.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {testimonials.map((item) => (
                <Card
                  key={`${item.name}-${item.company}`}
                  className="border-border/70 bg-card/80"
                >
                  <CardContent className="space-y-3 p-5">
                    <div className="flex items-center justify-between">
                      <Quote className="h-4 w-4 text-muted-foreground" />
                      <div className="flex items-center gap-0.5 text-primary">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/90">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                    <div className="border-t border-border/70 pt-3">
                      <p className="text-sm font-semibold tracking-tight">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.occupation} · {item.company}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right: AI Assistant Card demo */}
          <div className="flex items-start justify-center lg:justify-end lg:sticky lg:top-24">
            <div className="w-full max-w-[420px] rounded-2xl border border-border/60 bg-card shadow-xl shadow-black/5 overflow-hidden">
              <AIAssistantCard
                userName="there"
                onSend={(text) => {
                  // demo only — no real API in this context
                  console.log("Demo prompt:", text);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
