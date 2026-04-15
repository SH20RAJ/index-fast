import Link from "next/link";
import { ArrowRight, Clock3, Database, Gauge, Globe, LineChart, LockKeyhole, RefreshCw, ServerCog, ShieldAlert, Sparkles, TriangleAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { AdminDashboardData } from "../actions";

interface AdminDashboardProps {
  data: AdminDashboardData;
  lockAction: () => Promise<never>;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value);
}

function formatDate(value: string | null) {
  if (!value) {
    return "No activity";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

function getStatusTone(status: string) {
  if (status === "success") return "text-emerald-300 bg-emerald-400/10 border-emerald-400/20";
  if (status === "failed") return "text-rose-300 bg-rose-400/10 border-rose-400/20";
  return "text-amber-300 bg-amber-400/10 border-amber-400/20";
}

export default function AdminDashboard({ data, lockAction }: AdminDashboardProps) {
  const successRate = data.totals.submissions > 0 ? (data.totals.successfulSubmissions / data.totals.submissions) * 100 : 0;
  const indexedRate = data.totals.urlsTracked > 0 ? (data.totals.urlsIndexed / data.totals.urlsTracked) * 100 : 0;

  const metrics = [
    { label: "Users", value: formatNumber(data.totals.users), hint: `${formatNumber(data.totals.freeUsers)} free / ${formatNumber(data.totals.proUsers)} pro / ${formatNumber(data.totals.agencyUsers)} agency`, icon: LockKeyhole },
    { label: "Websites", value: formatNumber(data.totals.websites), hint: `${formatNumber(data.totals.websitesWithGsc)} connected to GSC`, icon: Globe },
    { label: "Submissions", value: formatNumber(data.totals.submissions), hint: `${formatNumber(data.totals.submissionsThisMonth)} this month`, icon: Database },
    { label: "Success rate", value: formatPercent(successRate), hint: `${formatNumber(data.totals.successfulThisMonth)} successful submissions this month`, icon: LineChart },
    { label: "Pending", value: formatNumber(data.totals.pendingSubmissions), hint: `${formatNumber(data.totals.failedSubmissions)} failed in the queue`, icon: TriangleAlert },
    { label: "Indexed URLs", value: formatNumber(data.totals.urlsIndexed), hint: `${formatPercent(indexedRate)} of tracked URLs`, icon: Gauge },
    { label: "Cron jobs", value: formatNumber(data.totals.activeCronJobs), hint: `${formatNumber(data.totals.websitesWithSitemaps)} sites expose a sitemap`, icon: Clock3 },
    { label: "Discoverability", value: `${Math.round(data.totals.discoverabilityScore)}/100`, hint: "Average URL discoverability score", icon: Sparkles },
  ];

  const operatorLinks = [
    { label: "Open dashboard", href: "/dashboard", description: "Jump back to operator-level views." },
    { label: "Inspect sites", href: "/sites", description: "Review site configuration and sync readiness." },
    { label: "Review submissions", href: "/submissions", description: "Audit success, failure, and pending rows." },
    { label: "Run toolbox", href: "/dashboard/toolbox", description: "Use the internal diagnostics workspace." },
  ];

  return (
    <div className="space-y-6 pb-10">
      <section className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[#07111f] text-white shadow-[0_40px_120px_rgba(2,8,23,0.32)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(251,191,36,0.18),transparent_25%),radial-gradient(circle_at_85%_10%,rgba(34,197,94,0.16),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.1),transparent_28%)]" />
        <div className="relative flex flex-col gap-6 p-6 sm:p-8 xl:flex-row xl:items-end xl:justify-between xl:p-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/65">
              <ShieldAlert className="h-3.5 w-3.5 text-amber-300" />
              Admin control panel
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-light tracking-tight text-white sm:text-5xl">
                Platform-wide stats, operational shortcuts, and maintenance signals.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-white/62 sm:text-base">
                This view rolls up the full data set across users, sites, submissions, URLs, and cron jobs so you can triage the platform from one place.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <form action={lockAction}>
              <Button type="submit" variant="secondary" className="rounded-full bg-white/10 text-white hover:bg-white/15">
                Lock panel
                <LockKeyhole className="ml-2 h-4 w-4" />
              </Button>
            </form>
            <Button asChild className="rounded-full bg-amber-300 text-slate-950 hover:bg-amber-200">
              <Link href="/dashboard">
                Open operator dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <Card key={metric.label} className="border-white/8 bg-white/95 shadow-sm shadow-slate-900/5 backdrop-blur dark:border-white/5 dark:bg-slate-950/70">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">{metric.label}</p>
                    <p className="text-3xl font-light tracking-tight text-slate-950 dark:text-white">{metric.value}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-white/75">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">{metric.hint}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-white/8 bg-white/95 shadow-sm shadow-slate-900/5 backdrop-blur dark:border-white/5 dark:bg-slate-950/70">
          <CardContent className="space-y-5 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">Top sites</p>
                <h2 className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">Highest volume properties</h2>
              </div>
              <Badge variant="secondary" className="rounded-full bg-slate-100 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:bg-white/5 dark:text-slate-300">
                {formatNumber(data.topSites.length)} tracked
              </Badge>
            </div>

            <div className="space-y-3">
              {data.topSites.map((site) => (
                <div key={site.id} className="rounded-3xl border border-slate-200 bg-white px-4 py-4 dark:border-white/5 dark:bg-white/[0.03]">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">{site.url}</p>
                        <span className="rounded-full border border-slate-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:border-white/10 dark:text-slate-400">
                          {site.userEmail}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Last sync {formatDate(site.lastSyncAt)} · {site.gscConnected ? "GSC connected" : "GSC missing"}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-right text-xs">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Submissions</p>
                        <p className="mt-1 font-semibold text-slate-950 dark:text-white">{formatNumber(site.submissions)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Success</p>
                        <p className="mt-1 font-semibold text-slate-950 dark:text-white">{formatPercent(site.successRate)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Health</p>
                        <p className="mt-1 font-semibold text-slate-950 dark:text-white">{site.gscConnected ? "Healthy" : "Review"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/8 bg-white/95 shadow-sm shadow-slate-900/5 backdrop-blur dark:border-white/5 dark:bg-slate-950/70">
          <CardContent className="space-y-4 p-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">Operator shortcuts</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">Actions to do now</h2>
            </div>

            <div className="space-y-3">
              {operatorLinks.map((link) => (
                <Button key={link.href} asChild variant="ghost" className="h-auto w-full justify-between rounded-3xl border border-slate-200 bg-white px-4 py-4 text-left hover:bg-slate-50 dark:border-white/5 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]">
                  <Link href={link.href}>
                    <span className="space-y-1 text-left">
                      <span className="block text-sm font-semibold text-slate-950 dark:text-white">{link.label}</span>
                      <span className="block text-xs font-normal leading-5 text-slate-500 dark:text-slate-400">{link.description}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
                  </Link>
                </Button>
              ))}
            </div>

            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">System notes</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2"><RefreshCw className="mt-0.5 h-4 w-4 text-emerald-500" />Review failed submissions and retry the affected URLs.</li>
                <li className="flex items-start gap-2"><ServerCog className="mt-0.5 h-4 w-4 text-amber-500" />Check sites without a sitemap or GSC connection.</li>
                <li className="flex items-start gap-2"><LineChart className="mt-0.5 h-4 w-4 text-sky-500" />Compare indexed URLs against discovered URLs weekly.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card className="border-white/8 bg-white/95 shadow-sm shadow-slate-900/5 backdrop-blur dark:border-white/5 dark:bg-slate-950/70">
          <CardContent className="space-y-4 p-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">Recent submissions</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">Latest platform activity</h2>
            </div>

            <div className="space-y-3">
              {data.recentSubmissions.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
                  No submissions recorded yet.
                </div>
              ) : (
                data.recentSubmissions.map((submission) => (
                  <div key={submission.id} className="rounded-3xl border border-slate-200 bg-white px-4 py-4 dark:border-white/5 dark:bg-white/[0.03]">
                    <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">{submission.websiteUrl}</p>
                          <Badge variant="outline" className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${getStatusTone(submission.status)}`}>
                            {submission.status}
                          </Badge>
                        </div>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">{submission.url}</p>
                        <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">{submission.userEmail} · {submission.engine}</p>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(submission.createdAt)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/8 bg-white/95 shadow-sm shadow-slate-900/5 backdrop-blur dark:border-white/5 dark:bg-slate-950/70">
          <CardContent className="space-y-4 p-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">Recent sites</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">Newest account onboarding</h2>
            </div>

            <div className="space-y-3">
              {data.recentSites.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
                  No sites recorded yet.
                </div>
              ) : (
                data.recentSites.map((site) => (
                  <div key={site.id} className="rounded-3xl border border-slate-200 bg-white px-4 py-4 dark:border-white/5 dark:bg-white/[0.03]">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">{site.url}</p>
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] ${site.gscConnected ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-700 dark:text-emerald-300" : "border-amber-400/20 bg-amber-400/10 text-amber-700 dark:text-amber-300"}`}>
                          {site.gscConnected ? "GSC on" : "GSC off"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{site.userEmail}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Sitemap {site.sitemapUrl ? "present" : "missing"} · Last sync {formatDate(site.lastSyncAt)} · Added {formatDate(site.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}