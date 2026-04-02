"use client";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useStackApp } from "@stackframe/stack";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const feedItems = [
  { source: "Sitemap", url: "/sitemap.xml", status: "Queued" },
  { source: "Blog", url: "/blog/geo-checklist", status: "Pinged" },
  { source: "Feature", url: "/features/indexnow-sync", status: "Accepted" },
];

const trustMetrics = [
  { value: "4-24h", label: "Discovery window" },
  { value: "99.95%", label: "Uptime" },
  { value: "10M+", label: "URLs/run" },
];

export default function Hero() {
  const stack = useStackApp();

  return (
    <section id="home" className="relative overflow-hidden border-b border-border/70">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.12),transparent_44%),radial-gradient(circle_at_20%_30%,rgba(2,132,199,0.08),transparent_35%)]" />
      <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 pb-14 pt-12 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:pb-20 lg:pt-20">
        <div className="space-y-7">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] tracking-[0.14em] uppercase">
            <Sparkles className="mr-1 h-3 w-3" /> indexing infrastructure
          </Badge>
          <h1 className="text-5xl font-black leading-[0.92] tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Index your site at
            <span className="block text-muted-foreground">light speed.</span>
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            Stop waiting weeks for search engines. IndexFast automates sitemap sync, Bing submissions, and IndexNow pings in one focused pipeline.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="font-semibold" onClick={() => stack.redirectToSignUp()}>
              Get Started Free <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>
          <div className="grid max-w-md grid-cols-3 gap-3 pt-2">
            {trustMetrics.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-border/70 bg-card/60 p-3">
                <div className="text-lg font-bold tracking-tight">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <Card className="border-border/70 bg-card/80 shadow-xl shadow-black/5 backdrop-blur">
          <CardContent className="space-y-4 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold tracking-[0.14em] text-muted-foreground uppercase">Pipeline Status</div>
              <Badge className="bg-emerald-600 hover:bg-emerald-600">Live</Badge>
            </div>
            <div className="space-y-2">
              {feedItems.map((item) => (
                <div key={item.url} className="flex items-center justify-between rounded-md border border-border/70 p-3">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">{item.source}</p>
                    <p className="font-mono text-xs font-semibold text-foreground sm:text-sm">{item.url}</p>
                  </div>
                  <Badge variant="secondary">{item.status}</Badge>
                </div>
              ))}
            </div>
            <div className="rounded-md border border-dashed border-border/80 bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">Latest Scan:</span> 1,204 URLs synced from XML sitemaps. 98.2% validation rate. Median submission latency: 840ms.
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
