"use client";

import { Quote, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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
    name: "Daniel Kim",
    occupation: "Technical Content Lead",
    company: "DevAxis",
    quote:
      "Our docs updates are now visible faster, and the team can validate indexing workflows without leaving one dashboard.",
  },
  {
    name: "Priya Nair",
    occupation: "Founder",
    company: "Rankforge Studio",
    quote:
      "For a lean team, this became our indexing control center. We publish, submit, and monitor without extra tooling.",
  },
  {
    name: "Luca Martins",
    occupation: "SEO Consultant",
    company: "Orbit Search",
    quote:
      "Client reporting is easier because submission activity is consistent and measurable across properties.",
  },
  {
    name: "Maya Chen",
    occupation: "Content Operations Manager",
    company: "BeaconLearn",
    quote:
      "IndexFast gave us a repeatable process. We no longer miss indexing windows after big content pushes.",
  },
];

export default function Testimonials() {
  return (
    <section className="border-b border-border/70 py-14 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-3 sm:mb-10">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em]">
            Testimonials
          </Badge>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">What teams say after switching</h2>
          <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
            Real operators, real roles, and practical outcomes from faster indexing workflows.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <Card key={`${item.name}-${item.company}`} className="border-border/70 bg-card/80">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-center justify-between">
                  <Quote className="h-4 w-4 text-muted-foreground" />
                  <div className="flex items-center gap-0.5 text-primary">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <Star className="h-3.5 w-3.5 fill-current" />
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-foreground/90">"{item.quote}"</p>

                <div className="border-t border-border/70 pt-3">
                  <p className="text-sm font-semibold tracking-tight">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.occupation} · {item.company}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
