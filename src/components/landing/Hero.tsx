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
  { icon: Zap, text: "Index 4x faster" },
  { icon: Database, text: "IndexNow + Pinging + Archiving" },
  { icon: CheckCircle, text: "SEO + GEO automation" },
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
      {/* Background decorative elements using theme colors */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 right-0 h-96 w-96 rounded-full bg-secondary opacity-20 blur-3xl" />
        <div className="absolute -bottom-1/4 left-1/4 h-72 w-72 rounded-full bg-accent opacity-15 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 lg:pt-8">
          {/* Left Column - Headlines & CTAs */}
          <div className="flex flex-col justify-center space-y-8">
            {/* Badge */}
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                Trusted by 11,400+ sites
              </Badge>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-5xl font-black leading-tight tracking-tighter text-balance sm:text-6xl md:text-7xl">
                Get indexed
                <span className="block text-primary">4x faster</span>
              </h1>
              <p className="text-lg leading-relaxed text-muted-foreground sm:text-xl max-w-lg">
                Automate sitemap syncing, Bing submissions, and IndexNow pings. Your content gets discovered in 4-24 hours, not weeks.
              </p>
            </div>

            {/* Quick Benefits */}
            <div className="flex flex-col gap-2.5">
              {benefits.map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <div key={i} className="flex items-center gap-2.5 text-sm font-medium">
                    <Icon className="h-4 w-4 text-accent" />
                    <span>{benefit.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Primary CTA - High Priority */}
            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground font-bold text-base py-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
                onClick={() => stack.redirectToSignUp()}
              >
                Start Indexing Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="font-semibold" asChild>
                <Link href="/blog">See it in action</Link>
              </Button>
            </div>

            {/* Social Proof Metrics */}
            <div className="grid grid-cols-3 gap-4 border-t border-border/50 pt-8">
              {socialProof.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Live Feed Card */}
          <div className="flex items-center justify-center lg:justify-end">
            <Card className="w-full max-w-sm border border-border/50 bg-card shadow-xl backdrop-blur">
              <CardContent className="space-y-4 p-6 sm:p-7">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold tracking-[0.12em] text-muted-foreground uppercase">Real-time Activity</h3>
                    <p className="text-sm font-semibold text-foreground mt-1">Live indexing feed</p>
                  </div>
                  <div className="flex h-2 w-2 items-center justify-center">
                    <span className="absolute inline-flex h-2.5 w-2.5 rounded-full bg-destructive opacity-75 animate-pulse"></span>
                    <span className="relative inline-block h-2.5 w-2.5 rounded-full bg-success"></span>
                  </div>
                </div>

                {/* Feed Items */}
                <div className="space-y-3">
                  {feedItems.map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-3 rounded-lg border border-border/40 bg-background/50 p-3.5 hover:bg-background/80 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono font-semibold text-foreground truncate">{item.domain}</code>
                          <span className="text-xs text-muted-foreground shrink-0">{item.engine}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                      </div>
                      <div className="text-xs font-semibold text-primary shrink-0">{item.status}</div>
                    </div>
                  ))}
                </div>

                {/* Stats Bar */}
                <div className="rounded-lg border border-dashed border-border/60 bg-muted/30 p-3.5">
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    <span className="font-semibold text-foreground">Today:</span> 4,127 URLs submitted across Google, Bing, and IndexNow. Zero errors.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
