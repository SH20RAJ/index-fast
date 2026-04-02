"use client";

import Link from "next/link";
import { Globe, Search, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const tools = [
  {
    title: "Sitemap Health",
    desc: "Scan for 404s and broken links that waste crawl budget.",
    icon: Globe,
    href: "/tools",
  },
  {
    title: "Key Verifier",
    desc: "Validate your IndexNow and Bing credentials instantly.",
    icon: ShieldCheck,
    href: "/tools",
  },
  {
    title: "AI Analysis",
    desc: "Preview how AI crawlers parse and interpret your pages.",
    icon: Search,
    href: "/tools",
  },
];

export default function FreeTools() {
  return (
    <section id="free-tools" className="border-b border-border/70 bg-card/30 py-14 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 space-y-3 text-center sm:mb-12">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] tracking-[0.14em] uppercase">
            Public Utilities
          </Badge>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Free diagnostic tools</h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Uncover indexing blockers immediately with focused utilities you can run in minutes.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card key={tool.title} className="border-border/70 bg-background/90">
                <CardContent className="space-y-4 p-5 sm:p-6">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/70 bg-muted/40">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold tracking-tight">{tool.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{tool.desc}</p>
                  <Button asChild variant="outline" className="w-full justify-between">
                    <Link href={tool.href}>
                      Run audit <span>{"->"}</span>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
