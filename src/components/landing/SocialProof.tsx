"use client";

import { Activity, CheckCircle2, Clock3, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { value: "2.8M+", label: "URLs submitted" },
  { value: "98.6%", label: "Successful batches" },
  { value: "11,400+", label: "Active websites" },
  { value: "9m", label: "Median submit-to-log" },
];

const liveFeedExamples = [
  { site: "acmeblog.com", engine: "Bing", ago: "2m ago", status: "success" },
  { site: "docs.novacrm.io", engine: "IndexNow", ago: "4m ago", status: "success" },
  { site: "shop.orbitlane.co", engine: "Bing", ago: "7m ago", status: "success" },
  { site: "help.pixelops.app", engine: "IndexNow", ago: "10m ago", status: "success" },
];

const caseStudies = [
  {
    title: "SaaS Docs Indexing",
    result: "+42% discovered pages",
    detail: "from 2,100 to 2,982 indexed docs in 30 days",
  },
  {
    title: "Agency Multi-Site Ops",
    result: "-68% indexing lag",
    detail: "from 5.3 days down to 1.7 days median",
  },
  {
    title: "Publisher Refresh Pipeline",
    result: "+31% fresh URL pickup",
    detail: "across weekly sitemap deltas",
  },
];

const trustSignals = [
  "Google Search Console sync",
  "Bing Webmaster submission",
  "IndexNow key validation",
  "Encrypted key storage",
];

export default function SocialProof() {
  return (
    <section className="border-b border-border/70 py-14 sm:py-18">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-3 sm:mb-10">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em]">
            Social Proof
          </Badge>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            Trusted by teams shipping SEO at speed.
          </h2>
          <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
            Real submission activity, measurable outcomes, and infrastructure-level trust signals.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <Card key={item.label} className="border-border/70 bg-card/70">
              <CardContent className="p-5">
                <p className="text-2xl font-black tracking-tight">{item.value}</p>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{item.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card className="border-border/70 bg-card/70">
            <CardContent className="space-y-3 p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Live Submission Feed</p>
                <Badge className="bg-emerald-600 hover:bg-emerald-600">Live</Badge>
              </div>
              <div className="space-y-2">
                {liveFeedExamples.map((item) => (
                  <div key={`${item.site}-${item.ago}`} className="flex items-center justify-between rounded-md border border-border/70 p-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{item.site}</p>
                      <p className="text-xs text-muted-foreground">{item.engine}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      {item.ago}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/70">
            <CardContent className="space-y-3 p-5 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Trust & Infrastructure</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {trustSignals.map((signal) => (
                  <div key={signal} className="flex items-center gap-2 rounded-md border border-border/70 bg-background/80 p-3 text-sm">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span>{signal}</span>
                  </div>
                ))}
              </div>
              <div className="mt-1 flex items-center gap-5 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Activity className="h-3.5 w-3.5" /> Uptime 99.95%</span>
                <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> 24/7 queue processing</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {caseStudies.map((study) => (
            <Card key={study.title} className="border-border/70 bg-card/70">
              <CardContent className="space-y-1.5 p-5">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{study.title}</p>
                <p className="text-lg font-black tracking-tight">{study.result}</p>
                <p className="text-sm text-muted-foreground">{study.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
