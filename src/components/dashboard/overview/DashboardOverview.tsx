"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Settings,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Activity,
  Globe,
  Layers,
  Shield,
  Gauge,
  CalendarClock,
  BarChart3,
  ListChecks,
} from "lucide-react";
import type { DashboardData } from "@/app/(dashboard)/actions";
import { motion } from "framer-motion";
import AddSiteFlow from "@/components/dashboard/AddSiteFlow";

interface DashboardOverviewProps {
  data: DashboardData;
}

function ratio(used: number, limit: number) {
  if (limit <= 0) {
    return 0;
  }
  return Math.min(100, Math.round((used / limit) * 100));
}

function formatNumber(num: number) {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return num.toString();
}

function formatDate(date: Date | string | null | undefined) {
  if (!date) return "No activity yet";
  const value = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

function statusTone(rate: number) {
  if (rate >= 90) return "Excellent";
  if (rate >= 70) return "Healthy";
  if (rate >= 40) return "Watch";
  return "Needs attention";
}

const quickActions = [
  {
    label: "Add site",
    href: "/sites",
    icon: Plus,
    description: "Connect a new site to start indexing.",
  },
  {
    label: "Activity",
    href: "/submissions",
    icon: Activity,
    description: "View your recent indexing updates.",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Manage your account and plan.",
  },
];

export default function DashboardOverview({ data }: DashboardOverviewProps) {
  const websiteRatio = ratio(data.usage.websitesUsed, data.usage.websitesLimit);
  const submissionRatio = ratio(data.usage.submissionsUsed, data.usage.submissionsLimit);
  const successRate =
    data.submissionsThisMonth > 0 ? Math.round((data.successfulThisMonth / data.submissionsThisMonth) * 100) : 0;
  const planTone = successRate >= 90 ? "Great" : successRate >= 70 ? "Good" : "Needs attention";
  const websiteHeadroom = Math.max(0, data.usage.websitesLimit - data.usage.websitesUsed);
  const submissionsHeadroom = Math.max(0, data.usage.submissionsLimit - data.usage.submissionsUsed);
  const needsSetup = data.websitesCount === 0;

  const scorecards = [
    {
      label: "Sites",
      value: formatNumber(data.websitesCount),
      hint: `${websiteHeadroom} free`,
      icon: Globe,
    },
    {
      label: "Used this month",
      value: formatNumber(data.submissionsThisMonth),
      hint: `${formatNumber(submissionsHeadroom)} left`,
      icon: BarChart3,
    },
    {
      label: "Success rate",
      value: `${successRate}%`,
      hint: planTone,
      icon: Shield,
    },
    {
      label: "Last update",
      value: formatDate(data.recentSubmissions[0]?.createdAt),
      hint: "View all",
      icon: CalendarClock,
    },
  ];

  const onboardingSteps = [
    { label: "Connect your first site", completed: data.websitesCount > 0, href: "/sites" },
    { label: "Verify Search Console access", completed: data.websitesCount > 0, href: "/sites" },
    { label: "Run your first indexing sync", completed: data.recentSubmissions.length > 0, href: "/sites" },
  ];

  return (
    <div className="space-y-8">
      {needsSetup ? (
        <div className="grid gap-6 md:grid-cols-[1fr_350px]">
          <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card p-8 shadow-2xl shadow-primary/5">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,color-mix(in_oklab,var(--primary)_15%,transparent),transparent_50%)]" />
            <div className="relative space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                <Sparkles className="h-3 w-3" />
                Getting Started
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-serif font-bold tracking-tight text-foreground sm:text-4xl">
                  Welcome to IndexFast
                </h2>
                <p className="max-w-md text-base text-muted-foreground leading-relaxed">
                  Let's get your first site indexed. Follow these steps to reach your magic moment.
                </p>
              </div>
              
              <div className="grid gap-3 pt-2">
                {onboardingSteps.map((step, idx) => (
                  <Link key={idx} href={step.href}>
                    <div className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl border transition-all hover:scale-[1.01] active:scale-[0.99]",
                      step.completed ? "bg-green-500/5 border-green-500/20 opacity-60" : "bg-muted/30 border-border/50 hover:bg-muted/50"
                    )}>
                      <div className={cn(
                        "h-6 w-6 rounded-full flex items-center justify-center border",
                        step.completed ? "bg-green-500 border-green-500 text-white" : "border-muted-foreground/30 text-transparent"
                      )}>
                        <Check className="h-3.5 w-3.5" strokeWidth={4} />
                      </div>
                      <span className={cn("text-sm font-bold", step.completed ? "text-green-600 line-through" : "text-foreground")}>
                        {step.label}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="pt-4">
                <AddSiteFlow />
              </div>
            </div>
          </section>

          <Card className="rounded-3xl border-border/50 bg-muted/10 p-6 flex flex-col justify-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold">100% API Safe</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We use official Google Indexing APIs. Your site is safe, secure, and will never be penalized for using our automation.
              </p>
            </div>
          </Card>
        </div>
      ) : (
        <section className="relative overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          {/* ... rest of the existing hero for active users ... */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_0%_0%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_55%),radial-gradient(ellipse_70%_50%_at_100%_0%,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_50%)]" />
          <div className="relative grid gap-6 p-6 md:grid-cols-[1.3fr_0.7fr] md:p-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Sparkles className="h-3 w-3 text-primary" />
                {planTone} Workspace
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-serif font-bold tracking-tight text-foreground sm:text-4xl">
                  Indexing Overview
                </h2>
                <p className="max-w-lg text-sm font-sans leading-relaxed text-muted-foreground">
                  Monitor your website's indexing health, success rate, and recent updates in one place.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <Button asChild size="sm" className="h-9 rounded-lg px-4 font-semibold">
                  <Link href="/sites">
                    <Plus className="mr-2 h-3.5 w-3.5" />
                    Connect site
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="h-9 rounded-lg border-border/80 px-4 font-semibold">
                  <Link href="/submissions">
                    View activity
                    <ArrowUpRight className="ml-2 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-xl border border-border bg-muted/30 p-6 dark:bg-muted/15">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Current plan</p>
                  <p className="text-2xl font-semibold tracking-tight text-foreground">{data.plan.name}</p>
                </div>
                <Badge variant="secondary" className="rounded-lg text-[11px] font-semibold">
                  ${data.plan.priceMonthly}/mo
                </Badge>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Active sites</p>
                  <p className="mt-1 text-3xl font-semibold tabular-nums text-foreground">{data.websitesCount}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Success rate</p>
                  <p className="mt-1 text-3xl font-semibold tabular-nums text-primary">{successRate}%</p>
                </div>
              </div>

              <div className="mt-8 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <span>Site slots</span>
                  <span>{websiteRatio}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${websiteRatio}%` }}
                    transition={{ type: "spring", stiffness: 120, damping: 22 }}
                    className="h-full rounded-full bg-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {scorecards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className="border-border/80 bg-card/80 shadow-none">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{card.label}</p>
                    <p className="truncate text-lg font-semibold text-foreground sm:text-xl">{card.value}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/50 p-2 text-muted-foreground">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">{card.hint}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.label} href={action.href} className="group block">
              <Card className="h-full border-border/80 bg-card transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted/40 text-foreground transition-colors group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{action.label}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{action.description}</p>
                    </div>
                    <div className="inline-flex items-center text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors group-hover:text-foreground">
                      Open
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-border/80">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-border/60 px-6 py-4">
            <CardTitle className="text-sm font-semibold text-foreground">Recent activity</CardTitle>
            <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold text-primary" asChild>
              <Link href="/submissions">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {data.recentSubmissions.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <Gauge className="mx-auto h-9 w-9 text-muted-foreground/40" />
                <p className="mt-4 text-sm font-medium text-foreground">No submissions yet</p>
                <p className="mt-1 text-sm text-muted-foreground">Connect a site and run a sync to populate this feed.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {data.recentSubmissions.slice(0, 5).map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between gap-3 px-4 py-3.5 transition-colors hover:bg-muted/30 sm:px-6"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-medium text-foreground">{entry.websiteUrl || "Site"}</p>
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                          {entry.engine}
                        </span>
                      </div>
                      <p className="truncate font-mono text-xs text-muted-foreground">{entry.url}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="hidden text-xs text-muted-foreground sm:inline">{formatDate(entry.createdAt)}</span>
                      {entry.status === "success" ? (
                        <span className="h-2 w-2 rounded-full bg-pink-500" title="Success" />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-destructive" title="Failed or pending" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardHeader className="border-b border-border/60 px-6 py-4">
            <CardTitle className="text-sm font-semibold text-foreground">Capacity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <span>Websites</span>
                <span>
                  {data.usage.websitesUsed} / {data.usage.websitesLimit}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-foreground/80" style={{ width: `${websiteRatio}%` }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <span>Monthly submissions</span>
                <span>
                  {formatNumber(data.submissionsThisMonth)} / {formatNumber(data.usage.submissionsLimit)}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${submissionRatio}%` }} />
              </div>
            </div>

            <div className="rounded-xl border border-dashed border-border bg-muted/20 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-muted p-2 text-muted-foreground">
                  <Layers className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Headroom</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {websiteHeadroom} website slots and {formatNumber(submissionsHeadroom)} submission credits remain this
                    cycle.
                  </p>
                </div>
              </div>
            </div>

            <Button asChild variant="secondary" className="h-11 w-full rounded-xl text-xs font-semibold uppercase tracking-wide">
              <Link href="/settings">Manage billing</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
