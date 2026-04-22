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
    label: "Add a website",
    href: "/sites",
    icon: Plus,
    description: "Connect your first site to start indexing.",
  },
  {
    label: "View activity",
    href: "/submissions",
    icon: Activity,
    description: "Check your recent indexing results.",
  },
  {
    label: "Account settings",
    href: "/settings",
    icon: Settings,
    description: "Manage your plan and preferences.",
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
      label: "Websites",
      value: formatNumber(data.websitesCount),
      hint: `${websiteHeadroom} available`,
      icon: Globe,
    },
    {
      label: "Usage this month",
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
      label: "Recent Activity",
      value: formatDate(data.recentSubmissions[0]?.createdAt),
      hint: "View history",
      icon: CalendarClock,
    },
  ];

  return (
    <div className="space-y-8">
      {needsSetup ? (
        <Card className="overflow-hidden border-border/50 bg-muted/20 rounded-[32px]">
          <CardContent className="flex flex-col gap-6 p-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/5 text-primary border border-primary/10">
                <ListChecks className="h-6 w-6" />
              </div>
              <div className="min-w-0 space-y-1">
                <h2 className="text-lg font-bold tracking-tight">Finish setup</h2>
                <p className="text-sm text-muted-foreground">Add your first site to start tracking indexing.</p>
              </div>
            </div>
            <AddSiteFlow />
          </CardContent>
        </Card>
      ) : null}

      <section className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_0%_0%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_55%),radial-gradient(ellipse_70%_50%_at_100%_0%,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_50%)]" />
        <div className="relative grid gap-8 p-6 md:grid-cols-[1.25fr_0.75fr] md:p-10">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {planTone} · workspace
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Indexing health at a glance
              </h2>
              <p className="max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
                Capacity, delivery quality, and your latest pushes—organized the way modern SaaS dashboards are: scannable in five seconds, actionable in two clicks.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <Button asChild size="lg" className="h-11 rounded-xl px-7 font-semibold">
                <Link href="/sites">
                  <Plus className="mr-2 h-4 w-4" />
                  Connect site
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-11 rounded-xl border-border/80 px-6 font-semibold">
                <Link href="/submissions">
                  Open stream
                  <ArrowUpRight className="ml-2 h-4 w-4" />
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
