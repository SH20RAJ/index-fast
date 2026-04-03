"use client";
import Link from "next/link";
import { ArrowRight, Sparkles, Database, Zap, CheckCircle } from "lucide-react";
import { useStackApp } from "@stackframe/stack";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const socialProof = [
  { value: "2.8M+", label: "URLs indexed" },
  { value: "98.6%", label: "Success rate" },
  { value: "4-24h", label: "Avg discovery" },
];

const benefits = [
  { icon: Zap, text: "Index 4x faster with IndexNow" },
  { icon: Database, text: "Auto-submit to Wayback Machine" },
  { icon: CheckCircle, text: "GEO for AI crawlers (ChatGPT, Perplexity, Claude)" },
];

const toolboxIncludes = [
  "AI visibility diagnostics for ChatGPT & Perplexity",
  "Generative Engine Optimization (GEO) audits",
  "IndexNow key validator",
  "Wayback Machine archive submission",
];

const feedItems = [
  { domain: "example.com", status: "✓ Indexed", time: "14 mins ago", engine: "Google" },
  { domain: "blog.site.io", status: "✓ Indexed", time: "28 mins ago", engine: "Bing" },
  { domain: "shop.dev", status: "✓ Indexed", time: "42 mins ago", engine: "IndexNow" },
  { domain: "docs.app", status: "✓ Indexed", time: "1h ago", engine: "Google" },
];

export default function Hero() {
  const stack = useStackApp();

  return (
    <section id="home" className="relative overflow-hidden border-b border-border/70">
      {/* Subtle background blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 right-0 h-80 w-80 rounded-full bg-secondary opacity-20 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-accent opacity-10 blur-3xl" />
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        {/* ── Left Column ── */}
        <div className="flex flex-col justify-center gap-8">
          {/* Trust badge */}
          <div>
            <Badge variant="secondary" className="px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="mr-1.5 h-3 w-3" />
              Trusted by 11,400+ sites
            </Badge>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl font-black leading-[1.05] tracking-tighter sm:text-6xl lg:text-7xl">
              Get indexed
              <span className="block text-primary">4x faster</span>
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
              Automate sitemap syncing, Bing submissions, and IndexNow pings.
              Your content gets discovered in 4–24 hours, not weeks.
            </p>
          </div>

          {/* Benefits list */}
          <div className="flex flex-col gap-2.5">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <div key={i} className="flex items-center gap-2.5 text-sm font-medium">
                  <Icon className="h-4 w-4 shrink-0 text-foreground/70" />
                  <span>{b.text}</span>
                </div>
              );
            })}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              className="font-bold"
              onClick={() => stack.redirectToSignUp()}
            >
              Start Indexing Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="font-semibold" asChild>
              <Link href="/tools">Get Free Access</Link>
            </Button>
          </div>

          {/* Free toolbox card */}
          {/* <div className="rounded-xl border border-border/60 bg-card/50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Inside Free Toolbox
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {toolboxIncludes.map((item) => (
                <p key={item} className="flex items-start gap-2 text-sm leading-snug">
                  <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-foreground/60" />
                  {item}
                </p>
              ))}
            </div>
          </div> */}

          {/* Social proof metrics */}
          <div className="grid grid-cols-3 gap-4 border-t border-border/40 pt-6">
            {socialProof.map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-black tracking-tight">{stat.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Column — Live feed card ── */}
        <div className="flex items-center justify-center lg:justify-end">
          <Card className="w-full max-w-sm border-border/50 bg-card shadow-xl">
            <CardContent className="space-y-4 p-6">
              {/* Card header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Real-time Activity
                  </p>
                  <p className="mt-1 text-sm font-semibold">Live indexing feed</p>
                </div>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
              </div>

              {/* Feed rows */}
              <div className="space-y-2.5">
                {feedItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between gap-3 rounded-lg border border-border/40 bg-background/50 p-3 transition-colors hover:bg-background/80"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <code className="truncate text-xs font-semibold">{item.domain}</code>
                        <span className="shrink-0 text-[10px] text-muted-foreground">{item.engine}</span>
                      </div>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">{item.time}</p>
                    </div>
                    <span className="shrink-0 text-xs font-bold text-emerald-500">{item.status}</span>
                  </div>
                ))}
              </div>

              {/* Daily stats */}
              <div className="rounded-lg border border-dashed border-border/50 bg-muted/20 p-3">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">Today:</span> 4,127 URLs submitted
                  across Google, Bing, and IndexNow. Zero errors.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
