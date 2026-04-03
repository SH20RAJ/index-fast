"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Plus,
  Settings,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Activity,
  Globe,
  ShieldCheck,
  Zap,
  CircleCheck,
} from "lucide-react";
import type { DashboardData } from "@/app/(dashboard)/actions";

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
    label: "Add website",
    href: "/sites",
    icon: Plus,
    description: "Connect a new property and start tracking submissions.",
  },
  {
    label: "Review submissions",
    href: "/submissions",
    icon: Activity,
    description: "Inspect successes, failures, and recent indexing activity.",
  },
  {
    label: "Update plan",
    href: "/settings",
    icon: Settings,
    description: "Adjust limits, billing, and account preferences.",
  },
];

const insightRows = [
  {
    label: "Websites in play",
    icon: Globe,
  },
  {
    label: "Submission health",
    icon: ShieldCheck,
  },
  {
    label: "Indexing momentum",
    icon: Zap,
  },
];

export default function DashboardOverview({ data }: DashboardOverviewProps) {
  const websiteRatio = ratio(data.usage.websitesUsed, data.usage.websitesLimit);
  const submissionRatio = ratio(data.usage.submissionsUsed, data.usage.submissionsLimit);
  const successRate = data.submissionsThisMonth > 0 ? Math.round((data.successfulThisMonth / data.submissionsThisMonth) * 100) : 0;
  const planTone = statusTone(successRate);

  const insightValues = [
    `${formatNumber(data.usage.websitesUsed)} live`,
    `${successRate}% success`,
    `${Math.max(0, 100 - submissionRatio)}% headroom`,
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="overflow-hidden rounded-[28px] border border-black/5 bg-white/80 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60">
        <div className="grid gap-6 p-5 md:grid-cols-[1.35fr_0.9fr] md:p-8">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-black/5 px-3 py-1 text-xs font-medium text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
              <Sparkles className="h-3.5 w-3.5" />
              {planTone} workspace health
            </div>
            <div className="space-y-3">
              <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
                Keep every site moving from discovery to indexing without losing track of the details.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                A cleaner command center for websites, submissions, billing, and indexing health.
                See what is live, what needs attention, and where you still have room to scale.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild className="rounded-full px-5 shadow-sm">
                <Link href="/sites">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Website
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-black/10 bg-white/80 px-5 shadow-sm hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
                <Link href="/submissions">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Activity
                </Link>
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {insightRows.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-black/5 bg-white/70 p-3 shadow-sm dark:border-white/10 dark:bg-white/5"
                    style={{ animationDelay: `${index * 90}ms` }}
                  >
                    <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{item.label}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-950 dark:text-white">{insightValues[index]}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[24px] border border-black/5 bg-slate-950 p-5 text-white shadow-[0_16px_50px_rgba(15,23,42,0.3)] dark:border-white/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/60">Plan overview</p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight">{data.plan.name}</h2>
                <p className="mt-1 text-sm text-white/70">{data.plan.tagline}</p>
              </div>
              <Badge className="rounded-full bg-white/10 text-white hover:bg-white/10">${data.plan.priceMonthly}/mo</Badge>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-white/60">Sites used</p>
                <p className="mt-2 text-2xl font-semibold">{data.websitesCount}</p>
                <p className="mt-1 text-xs text-white/60">of {formatNumber(data.usage.websitesLimit)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-white/60">Success rate</p>
                <p className="mt-2 text-2xl font-semibold">{successRate}%</p>
                <p className="mt-1 text-xs text-white/60">this month</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between text-xs text-white/65">
                <span>Website capacity</span>
                <span>{websiteRatio}% full</span>
              </div>
              <Progress value={websiteRatio} className="mt-3 h-2 bg-white/10 [&>div]:bg-white" />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {quickActions.map((action, index) => {
          const Icon = action.icon;

          return (
            <Card key={action.label} className="border-black/5 bg-white/80 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-950 dark:text-white">{action.label}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{action.description}</p>
                    </div>
                  </div>
                  <Button asChild size="icon" variant="ghost" className="h-9 w-9 rounded-full border border-black/5 bg-black/5 dark:border-white/10 dark:bg-white/5">
                    <Link href={action.href} aria-label={action.label}>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-black/5 bg-white/80 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60">
          <CardHeader className="border-b border-black/5 pb-4 dark:border-white/10">
            <CardTitle className="text-base">Recent activity</CardTitle>
            <CardDescription>Your latest submissions and response status.</CardDescription>
          </CardHeader>
          <CardContent className="p-5">
            {data.recentSubmissions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-black/10 bg-black/[0.02] p-8 text-center dark:border-white/10 dark:bg-white/[0.03]">
                <CircleCheck className="mx-auto h-10 w-10 text-slate-400" />
                <p className="mt-3 text-sm font-medium text-slate-950 dark:text-white">Nothing submitted yet</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Add a site to start tracking indexing activity here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.recentSubmissions.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.04)] transition-transform hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5 md:flex-row md:items-center md:justify-between"
                    style={{ animationDelay: `${index * 70}ms` }}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">{entry.websiteUrl ?? "Site"}</p>
                        <Badge variant="outline" className="rounded-full border-black/10 text-[11px] uppercase tracking-wide text-slate-600 dark:border-white/10 dark:text-slate-300">
                          {entry.engine.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="mt-1 truncate text-sm text-slate-600 dark:text-slate-300">{entry.url}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{formatDate(entry.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {entry.status === "success" ? (
                        <Badge className="rounded-full bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Success
                        </Badge>
                      ) : (
                        <Badge className="rounded-full bg-rose-500/10 text-rose-700 hover:bg-rose-500/10 dark:text-rose-300">
                          <AlertCircle className="mr-1 h-3 w-3" />
                          Failed
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-black/5 bg-white/80 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60">
          <CardHeader className="border-b border-black/5 pb-4 dark:border-white/10">
            <CardTitle className="text-base">Usage at a glance</CardTitle>
            <CardDescription>Know what is left before you hit the limit.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 p-5">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700 dark:text-slate-200">Websites</span>
                <span className="text-slate-500 dark:text-slate-400">{data.usage.websitesUsed} / {formatNumber(data.usage.websitesLimit)}</span>
              </div>
              <Progress value={websiteRatio} className="h-2 bg-black/5 dark:bg-white/10" />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700 dark:text-slate-200">Submissions this month</span>
                <span className="text-slate-500 dark:text-slate-400">{formatNumber(data.submissionsThisMonth)} / {formatNumber(data.usage.submissionsLimit)}</span>
              </div>
              <Progress value={submissionRatio} className="h-2 bg-black/5 dark:bg-white/10" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-black/5 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.03]">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Plan</p>
                <p className="mt-2 text-base font-semibold text-slate-950 dark:text-white">{data.plan.name}</p>
              </div>
              <div className="rounded-2xl border border-black/5 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.03]">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Monthly cost</p>
                <p className="mt-2 text-base font-semibold text-slate-950 dark:text-white">${data.plan.priceMonthly}</p>
              </div>
            </div>

            <Button asChild variant="outline" className="w-full rounded-full border-black/10 bg-white/80 shadow-sm hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10">
              <Link href="/settings">
                View billing & limits
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="border-black/5 bg-white/80 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60">
          <CardHeader className="border-b border-black/5 pb-4 dark:border-white/10">
            <CardTitle className="text-base">High-traffic assets</CardTitle>
            <CardDescription>Your most active properties, sorted by submission volume.</CardDescription>
          </CardHeader>
          <CardContent className="p-5">
            {data.topSites.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-black/10 bg-black/[0.02] p-8 text-center dark:border-white/10 dark:bg-white/[0.03]">
                <Globe className="mx-auto h-10 w-10 text-slate-400" />
                <p className="mt-3 text-sm font-medium text-slate-950 dark:text-white">No properties tracked yet</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Add your first site to see activity patterns here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.topSites.map((site, index) => (
                  <div key={site.id} className="rounded-2xl border border-black/5 bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-white/5" style={{ animationDelay: `${index * 70}ms` }}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">{site.url}</p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Last sync {formatDate(site.lastSyncAt)}</p>
                      </div>
                      <Badge variant="secondary" className="rounded-full bg-black/5 text-xs text-slate-700 hover:bg-black/5 dark:bg-white/10 dark:text-slate-200">
                        {formatNumber(site.submissions)} submissions
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-black/5 bg-slate-950 text-white shadow-[0_20px_60px_rgba(15,23,42,0.24)] dark:border-white/10">
          <CardHeader className="border-b border-white/10 pb-4">
            <CardTitle className="text-base">What to do next</CardTitle>
            <CardDescription className="text-white/65">A tighter checklist for the next pass through the dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-5">
            {[
              {
                title: data.websitesCount === 0 ? "Connect your first website" : "Review recent submissions",
                body: data.websitesCount === 0 ? "The dashboard becomes much more useful once a site is connected." : "Check the latest activity for any failed or pending indexing attempts.",
              },
              {
                title: websiteRatio > 80 ? "Watch your website limit" : "You still have room to grow",
                body: websiteRatio > 80 ? "You are close to the plan cap. Consider upgrading before adding more sites." : "There is healthy capacity left in your current plan.",
              },
              {
                title: successRate < 70 ? "Investigate failed submissions" : "Keep the current flow moving",
                body: successRate < 70 ? "A few failures can usually be traced from the activity feed." : "Your success rate is solid enough to keep scaling with the same setup.",
              },
            ].map((item, index) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4" style={{ animationDelay: `${index * 90}ms` }}>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-white/10 p-2">
                    <CircleCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-white/70">{item.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

