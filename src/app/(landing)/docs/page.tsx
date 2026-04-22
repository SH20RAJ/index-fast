import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, BookOpenText, Bot, Clock3, FileText, Gauge, KeyRound, Link2, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Documentation - IndexFast",
  description:
    "Complete IndexFast documentation covering setup, indexing workflow, API behavior, operations, troubleshooting, and best practices.",
  alternates: {
    canonical: "/docs",
  },
};

const quickStart = [
  "Create your IndexFast account and add your website.",
  "Verify your IndexNow key on your website's main folder.",
  "Add your sitemap URL to our system.",
  "Run your first indexing request from the dashboard.",
  "Turn on automatic jobs to keep your new pages indexed.",
];

const coreModules = [
  {
    title: "Sitemap Scanner",
    description: "Automatically finds new pages from your sitemap and gets them ready for indexing.",
    icon: FileText,
  },
  {
    title: "IndexNow Pinger",
    description: "Sends instant notifications to search engines whenever you publish new content.",
    icon: Link2,
  },
  {
    title: "Bing Submitter",
    description: "Pushes your new pages directly to Bing so they show up in search results faster.",
    icon: Bot,
  },
  {
    title: "Simple Dashboard",
    description: "Track your indexing progress and see exactly which pages have been indexed.",
    icon: Gauge,
  },
];

const troubleshooting = [
  {
    issue: "IndexNow key validation fails",
    action: "Confirm your key file is reachable at the domain root and matches the configured key string.",
  },
  {
    issue: "Submissions return partial failures",
    action: "Review endpoint responses in dashboard logs, then re-run only the failed batches after fixing URL errors.",
  },
  {
    issue: "New URLs not detected",
    action: "Check sitemap freshness, ensure URLs are in loc tags, and validate sitemap accessibility without auth.",
  },
  {
    issue: "Unexpected indexing delay",
    action: "Verify technical SEO basics first: status codes, canonical setup, crawlability, and duplicate content signals.",
  },
];

export default function DocsPage() {
  return (
    <section className="relative isolate overflow-hidden border-b border-border/70 py-12 sm:py-16 lg:py-20">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70 [background:radial-gradient(52rem_28rem_at_15%_0%,rgba(145,185,255,0.14),transparent),radial-gradient(44rem_26rem_at_90%_8%,rgba(255,196,110,0.14),transparent)]" />

      <div className="mx-auto w-full max-w-6xl space-y-12 px-4 sm:px-6 lg:px-8">
        <header className="space-y-5">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] tracking-[0.14em] uppercase">
            Help Center
          </Badge>
          <h1 className="max-w-4xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Everything you need to know.
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Learn how to set up your account, connect your website, and start indexing your pages automatically.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button asChild className="font-semibold">
              <Link href="/sign-up">
                Get started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="font-medium">
              <Link href="/how-it-works">See how it works</Link>
            </Button>
          </div>
        </header>

        <Card className="border-border/70 bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold tracking-tight">
              <BookOpenText className="h-5 w-5" /> Quick Start
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0 text-sm text-muted-foreground sm:text-[15px]">
            {quickStart.map((step, idx) => (
              <p key={step} className="flex gap-3">
                <span className="min-w-6 text-foreground">{idx + 1}.</span>
                <span>{step}</span>
              </p>
            ))}
          </CardContent>
        </Card>

        <section className="grid gap-4 md:grid-cols-2">
          {coreModules.map((module) => {
            const Icon = module.icon;
            return (
              <Card key={module.title} className="border-border/70 bg-background/85">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl font-bold tracking-tight">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border/70 bg-card">
                      <Icon className="h-4 w-4" />
                    </span>
                    {module.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                  {module.description}
                </CardContent>
              </Card>
            );
          })}
        </section>

        <Card className="border-border/70 bg-background/85">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold tracking-tight">
              <KeyRound className="h-5 w-5" /> API and payload reference
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
            <div className="rounded-lg border border-border/70 bg-card/70 p-4">
              <p className="font-semibold text-foreground">IndexNow endpoint</p>
              <p className="mt-1 font-mono text-xs text-foreground/80">POST https://www.bing.com/indexnow</p>
              <p className="mt-2 text-sm">
                Required fields: host, key, urlList. Keep batches clean, canonical, and noindex-free.
              </p>
            </div>
            <div className="rounded-lg border border-border/70 bg-card/70 p-4">
              <p className="font-semibold text-foreground">Bing batch endpoint</p>
              <p className="mt-1 font-mono text-xs text-foreground/80">
                POST https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=YOUR_API_KEY
              </p>
              <p className="mt-2 text-sm">Required fields: siteUrl and urlList. Segment large submissions into stable batch sizes.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-background/85">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold tracking-tight">
              <Clock3 className="h-5 w-5" /> Operational runbook
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 pt-0 text-sm text-muted-foreground sm:grid-cols-3">
            <div className="rounded-lg border border-border/70 bg-card/70 p-4">
              <p className="font-semibold text-foreground">Daily</p>
              <p className="mt-1">Review failed batches, fix malformed URLs, and replay targeted submissions.</p>
            </div>
            <div className="rounded-lg border border-border/70 bg-card/70 p-4">
              <p className="font-semibold text-foreground">Weekly</p>
              <p className="mt-1">Audit sitemap freshness and compare submission volume with publishing volume.</p>
            </div>
            <div className="rounded-lg border border-border/70 bg-card/70 p-4">
              <p className="font-semibold text-foreground">Monthly</p>
              <p className="mt-1">Tune batch sizes, improve template quality, and remove low-value URL patterns.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-background/85">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-bold tracking-tight">
              <ShieldCheck className="h-5 w-5" /> Troubleshooting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0 text-sm text-muted-foreground sm:text-[15px]">
            {troubleshooting.map((item) => (
              <div key={item.issue} className="rounded-lg border border-border/70 bg-card/70 p-4">
                <p className="font-semibold text-foreground">{item.issue}</p>
                <p className="mt-1">{item.action}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-gradient-to-r from-card to-muted/35">
          <CardContent className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight sm:text-2xl">Need more help?</h2>
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                Our support team is here to help you get started or answer any questions.
              </p>
            </div>
            <Button asChild className="sm:shrink-0">
              <Link href="/contact">
                Contact Us <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
