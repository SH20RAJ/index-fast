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
} from "lucide-react";
import type { DashboardData } from "@/app/(dashboard)/actions";
import { motion } from "framer-motion";

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
    label: "Connect a website",
    href: "/sites",
    icon: Plus,
    description: "Bring a new property into your indexing workflow.",
  },
  {
    label: "Review submission stream",
    href: "/submissions",
    icon: Activity,
    description: "Inspect recent successes, failures, and retries.",
  },
  {
    label: "Tune billing and limits",
    href: "/settings",
    icon: Settings,
    description: "Adjust plan capacity and account preferences.",
  },
];

export default function DashboardOverview({ data }: DashboardOverviewProps) {
  const websiteRatio = ratio(data.usage.websitesUsed, data.usage.websitesLimit);
  const submissionRatio = ratio(data.usage.submissionsUsed, data.usage.submissionsLimit);
  const successRate = data.submissionsThisMonth > 0 ? Math.round((data.successfulThisMonth / data.submissionsThisMonth) * 100) : 0;
  const planTone = statusTone(successRate);
  const websiteHeadroom = Math.max(0, data.usage.websitesLimit - data.usage.websitesUsed);
  const submissionsHeadroom = Math.max(0, data.usage.submissionsLimit - data.usage.submissionsUsed);

  const scorecards = [
    {
      label: "Live websites",
      value: formatNumber(data.websitesCount),
      hint: `${websiteHeadroom} slots free`,
      icon: Globe,
    },
    {
      label: "Submissions this month",
      value: formatNumber(data.submissionsThisMonth),
      hint: `${formatNumber(submissionsHeadroom)} quota left`,
      icon: BarChart3,
    },
    {
      label: "Success rate",
      value: `${successRate}%`,
      hint: planTone,
      icon: Shield,
    },
    {
      label: "Last activity",
      value: formatDate(data.recentSubmissions[0]?.createdAt),
      hint: "Submission stream",
      icon: CalendarClock,
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="relative overflow-hidden rounded-[30px] border border-black/5 bg-white shadow-xl shadow-black/5 dark:border-white/5 dark:bg-zinc-900/50 dark:shadow-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_14%,rgba(244,63,94,0.15),transparent_38%),radial-gradient(circle_at_88%_6%,rgba(14,165,233,0.12),transparent_40%)]" />
        <div className="relative grid gap-8 p-6 md:grid-cols-[1.3fr_0.7fr] md:p-10">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:bg-white/5 dark:text-zinc-400">
              <Sparkles className="h-3 w-3 text-rose-500" />
              {planTone} Control Room
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-light tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-100">
                Dashboard, <br />
                <span className="italic text-rose-500">organized for action.</span>
              </h1>
              <p className="max-w-md text-base text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
                Track plan capacity, submission quality, and next-best actions from one place.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button asChild size="lg" className="rounded-full px-8 shadow-lg shadow-rose-500/20 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white">
                <Link href="/sites">
                  <Plus className="mr-2 h-4 w-4" />
                  Connect Site
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="rounded-full px-7">
                <Link href="/submissions">
                  Open Stream
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="rounded-3xl bg-zinc-900 p-6 text-white shadow-2xl dark:bg-zinc-950 dark:ring-1 dark:ring-white/10">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Current Plan</p>
                <h2 className="text-2xl font-light tracking-tight">{data.plan.name}</h2>
              </div>
              <Badge variant="secondary" className="rounded-full bg-white/5 text-[10px] font-bold text-white border-none">
                ${data.plan.priceMonthly}/mo
              </Badge>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Active Sites</p>
                <p className="text-3xl font-light">{data.websitesCount}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Success Rate</p>
                <p className="text-3xl font-light text-rose-400">{successRate}%</p>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                <span>Capacity</span>
                <span>{websiteRatio}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${websiteRatio}%` }}
                  className="h-full bg-white" 
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
            <Card key={card.label} className="border-black/5 bg-white/90 dark:border-white/5 dark:bg-zinc-900/40">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">{card.label}</p>
                    <p className="text-xl font-medium text-zinc-900 dark:text-zinc-100">{card.value}</p>
                  </div>
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-2 text-zinc-500 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">{card.hint}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.label} href={action.href} className="group">
              <Card className="h-full border-black/5 bg-white transition-all hover:shadow-lg hover:shadow-black/5 dark:border-white/5 dark:bg-zinc-900/40">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-50 text-zinc-900 group-hover:bg-rose-500 group-hover:text-white transition-colors dark:bg-white/5 dark:text-zinc-100">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{action.label}</h3>
                      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 font-light">{action.description}</p>
                    </div>
                    <div className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-zinc-500 transition-colors group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-zinc-100">
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
        <Card className="border-black/5 bg-white dark:border-white/5 dark:bg-zinc-900/40">
          <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-50 px-6 py-4 dark:border-white/5">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-zinc-400">Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-500/5" asChild>
              <Link href="/submissions">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {data.recentSubmissions.length === 0 ? (
              <div className="p-12 text-center">
                <Gauge className="mx-auto h-8 w-8 text-zinc-200" />
                <p className="mt-4 text-sm text-zinc-500">Quiet for now.</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-50 dark:divide-white/5">
                {data.recentSubmissions.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-4 hover:bg-zinc-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">{entry.websiteUrl || "Site"}</p>
                        <span className="text-[10px] font-bold uppercase text-zinc-400">{entry.engine}</span>
                      </div>
                      <p className="truncate text-xs text-zinc-400 font-light mt-0.5">{entry.url}</p>
                    </div>
                    <div className="ml-4 flex items-center gap-3">
                      <span className="text-[10px] text-zinc-400">{formatDate(entry.createdAt)}</span>
                      {entry.status === "success" ? (
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      ) : (
                        <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-black/5 bg-white dark:border-white/5 dark:bg-zinc-900/40">
          <CardHeader className="border-b border-zinc-50 px-6 py-4 dark:border-white/5">
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-zinc-400">Capacity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-bold uppercase text-zinc-400">
                <span>Websites</span>
                <span>{data.usage.websitesUsed} / {data.usage.websitesLimit}</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-white/5 overflow-hidden">
                <div className="h-full bg-zinc-900 dark:bg-zinc-100" style={{ width: `${websiteRatio}%` }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-bold uppercase text-zinc-400">
                <span>Monthly submissions</span>
                <span>{formatNumber(data.submissionsThisMonth)} / {formatNumber(data.usage.submissionsLimit)}</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-white/5 overflow-hidden">
                <div className="h-full bg-rose-500" style={{ width: `${submissionRatio}%` }} />
              </div>
            </div>

            <div className="rounded-xl border border-dashed border-zinc-200 p-4 dark:border-white/10">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-zinc-100 p-2 dark:bg-white/5">
                  <Layers className="h-4 w-4 text-zinc-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Resource headroom</p>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {websiteHeadroom} website slots and {formatNumber(submissionsHeadroom)} submission credits are still available this cycle.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button asChild variant="secondary" className="w-full rounded-xl font-bold text-xs uppercase tracking-widest h-11">
                <Link href="/settings">Manage Billing</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

