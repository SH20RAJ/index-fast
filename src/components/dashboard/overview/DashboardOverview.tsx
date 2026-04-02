import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Globe,
  Layers,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import type { DashboardData } from "@/app/(dashboard)/actions";

interface DashboardOverviewProps {
  data: DashboardData;
}

function ratio(used: number, limit: number) {
  if (limit <= 0) return 0;
  return Math.min(100, Math.round((used / limit) * 100));
}

function formatNumber(num: number) {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return num.toString();
}

export default function DashboardOverview({ data }: DashboardOverviewProps) {
  const websiteRatio = ratio(data.usage.websitesUsed, data.usage.websitesLimit);
  const submissionRatio = ratio(data.usage.submissionsUsed, data.usage.submissionsLimit);

  const metrics = [
    { label: "Active sites", value: formatNumber(data.websitesCount), icon: Globe },
    { label: "Submissions", value: formatNumber(data.submissionsThisMonth), icon: Activity },
    {
      label: "Success rate",
      value: data.submissionsThisMonth > 0 ? `${Math.round((data.successfulThisMonth / data.submissionsThisMonth) * 100)}%` : "0%",
      icon: CheckCircle2,
    },
    { label: "Plan capacity", value: formatNumber(data.usage.websitesLimit), icon: Layers },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <Card>
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Live analytics</Badge>
            <Badge variant="outline">{data.plan.name} tier</Badge>
            <Badge variant="outline">${data.plan.priceMonthly}/mo</Badge>
          </div>
          <CardTitle className="text-2xl md:text-3xl">Operations Center</CardTitle>
          <CardDescription className="max-w-2xl text-sm md:text-base">
            Minimal command view for indexing throughput, site health, and plan usage.
          </CardDescription>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/sites">Add website</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/settings">Subscription</Link>
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} size="sm">
            <CardContent className="flex items-center gap-3">
              <div className="rounded-md border border-border p-2">
                <metric.icon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xl font-semibold">{metric.value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">{metric.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Resources & quota</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span>Websites</span>
                <span>{data.usage.websitesUsed}/{formatNumber(data.usage.websitesLimit)}</span>
              </div>
              <Progress value={websiteRatio} />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span>Monthly submissions</span>
                <span>{formatNumber(data.usage.submissionsUsed)}/{formatNumber(data.usage.submissionsLimit)}</span>
              </div>
              <Progress value={submissionRatio} />
            </div>

            <p className="rounded-md border border-border bg-muted/40 p-2.5 text-xs text-muted-foreground">{data.plan.tagline}</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Activity stream</CardTitle>
              <CardDescription>Latest indexing submissions.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/submissions">View history <ArrowUpRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            {data.recentSubmissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border p-8 text-center">
                <Sparkles className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No submissions yet. Add a site to start syncing.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {data.recentSubmissions.map((entry) => (
                  <div key={entry.id} className="rounded-md border border-border p-3">
                    <div className="truncate text-sm font-medium">{entry.websiteUrl ?? "Site"}</div>
                    <div className="truncate text-xs text-muted-foreground">{entry.url}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="outline">{entry.engine.toUpperCase()}</Badge>
                      <Badge variant={entry.status === "success" ? "secondary" : "destructive"}>{entry.status.toUpperCase()}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top sites</CardTitle>
        </CardHeader>
        <CardContent>
          {data.topSites.length === 0 ? (
            <div className="rounded-md border border-dashed border-border p-6 text-sm text-muted-foreground">No sites connected yet.</div>
          ) : (
            <div className="space-y-3">
              {data.topSites.map((site, idx) => (
                <div key={site.id}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{site.url}</p>
                      <p className="text-xs text-muted-foreground">
                        Last sync: {site.lastSyncAt ? new Date(site.lastSyncAt).toLocaleString() : "Pending first sync"}
                      </p>
                    </div>
                    <Badge variant="outline">{formatNumber(site.submissions)} submissions</Badge>
                  </div>
                  {idx !== data.topSites.length - 1 && <Separator className="mt-3" />}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
