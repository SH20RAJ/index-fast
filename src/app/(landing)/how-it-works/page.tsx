import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, CheckCircle2, Clock3, Gauge, Link2, Search, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "How It Works - IndexFast",
  description:
    "Learn how IndexFast connects your sitemap, submits fresh URLs to IndexNow and Bing, and tracks indexing outcomes in one workflow.",
  alternates: {
    canonical: "/how-it-works",
  },
};

const pipeline = [
  {
    id: "01",
    title: "Connect your site once",
    description:
      "Add your primary domain, sitemap URL, and IndexNow key file. IndexFast validates the setup before running submissions.",
    icon: ShieldCheck,
  },
  {
    id: "02",
    title: "Detect URL changes fast",
    description:
      "Scheduled scans pick up newly published URLs from your sitemap, deduplicate entries, and stage them for submission.",
    icon: Search,
  },
  {
    id: "03",
    title: "Submit to multiple engines",
    description:
      "Batched requests are sent to IndexNow and Bing endpoints with retries, reducing failed pushes under network load.",
    icon: Link2,
  },
  {
    id: "04",
    title: "Track status and iterate",
    description:
      "Monitor accepted, failed, and pending submissions to prioritize technical fixes and improve index coverage over time.",
    icon: Gauge,
  },
];

const operators = [
  "Solo builders shipping content every day",
  "SEO teams managing multiple sites and client portfolios",
  "Programmatic SEO operators publishing pages at scale",
  "Ecommerce teams launching high-priority product URLs",
];

const guarantees = [
  "No manual copy-paste URL submission loop",
  "A repeatable operating workflow for index pushes",
  "Visibility into what was submitted and when",
  "A clean handoff between publishing and indexing",
];

export default function HowItWorksPage() {
  return (
    <section className="relative isolate overflow-hidden border-b border-border/70 py-12 sm:py-16 lg:py-20">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70 [background:radial-gradient(60rem_30rem_at_20%_0%,rgba(255,184,108,0.12),transparent),radial-gradient(48rem_28rem_at_80%_10%,rgba(120,180,255,0.12),transparent)]" />

      <div className="mx-auto w-full max-w-6xl space-y-12 px-4 sm:px-6 lg:px-8">
        <header className="space-y-5">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] tracking-[0.14em] uppercase">
            Workflow Breakdown
          </Badge>
          <h1 className="max-w-4xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            How IndexFast works from publish to index.
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            IndexFast is built as a practical indexing pipeline, not a vanity dashboard. Connect once, detect fresh URLs,
            submit in batches, and use status feedback to improve indexing consistency.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button asChild className="font-semibold">
              <Link href="/sign-up">
                Start free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="font-medium">
              <Link href="/docs">Read full docs</Link>
            </Button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {pipeline.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.id} className="border-border/70 bg-card/85">
                <CardHeader className="space-y-3">
                  <p className="text-xs font-black tracking-[0.16em] text-muted-foreground">STEP {step.id}</p>
                  <CardTitle className="flex items-center gap-2 text-xl font-bold tracking-tight">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border/70 bg-background/80">
                      <Icon className="h-4 w-4" />
                    </span>
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                  {step.description}
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Card className="border-border/70 bg-background/85">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold tracking-tight">
                <Clock3 className="h-5 w-5" /> Who this is for
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0 text-sm text-muted-foreground">
              {operators.map((item) => (
                <p key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground/70" />
                  <span>{item}</span>
                </p>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-background/85">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold tracking-tight">
                <CheckCircle2 className="h-5 w-5" /> What you get
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0 text-sm text-muted-foreground">
              {guarantees.map((item) => (
                <p key={item} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-foreground/70" />
                  <span>{item}</span>
                </p>
              ))}
            </CardContent>
          </Card>
        </section>

        <Card className="border-border/70 bg-gradient-to-r from-card to-muted/35">
          <CardContent className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight sm:text-2xl">Ready to run indexing as an actual system?</h2>
              <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                Create your account, connect your sitemap, and start shipping URLs with a repeatable process.
              </p>
            </div>
            <Button asChild className="sm:shrink-0">
              <Link href="/sign-up">
                Create account <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}