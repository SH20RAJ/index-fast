import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Globe,
  Layers,
  Send,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
  return `${num}`;
}

export default function DashboardOverview({ data }: DashboardOverviewProps) {
  const successRate =
    data.submissionsThisMonth > 0
      ? Math.round((data.successfulThisMonth / data.submissionsThisMonth) * 100)
      : 0;

  const metrics = [
    { label: "Active Sites", value: formatNumber(data.websitesCount), icon: Globe },
    { label: "Submissions", value: formatNumber(data.submissionsThisMonth), icon: Send },
    { label: "Success Rate", value: `${successRate}%`, icon: CheckCircle2 },
    { label: "Plan Capacity", value: formatNumber(data.usage.websitesLimit), icon: Layers },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Badge variant="secondary">Live analytics</Badge>
            <CardTitle className="text-2xl">Operations Center</CardTitle>
            <CardDescription>
              Track indexing velocity, site health, and plan usage in one clean view.
            </CardDescription>
            <div className="flex flex-wrap gap-2 pt-1 text-sm text-muted-foreground">
              <Badge variant="outline">{data.plan.name} tier</Badge>
              <Badge variant="outline">${data.plan.priceMonthly}/mo</Badge>
            </div>
          </div>
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

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="rounded-md border p-2 text-muted-foreground">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{metric.value}</p>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{metric.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resources & quota</CardTitle>
            <CardDescription>{data.plan.tagline}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Websites</span>
                <span className="font-medium">
                  {data.usage.websitesUsed} / {formatNumber(data.usage.websitesLimit)}
                </span>
              </div>
              <Progress value={ratio(data.usage.websitesUsed, data.usage.websitesLimit)} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Monthly submissions</span>
                <span className="font-medium">
                  {formatNumber(data.usage.submissionsUsed)} / {formatNumber(data.usage.submissionsLimit)}
                </span>
              </div>
              <Progress value={ratio(data.usage.submissionsUsed, data.usage.submissionsLimit)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Activity stream</CardTitle>
              <CardDescription>Most recent indexing submissions</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/submissions">
                View all <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {data.recentSubmissions.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                No submissions yet. Add a website to start your first job.
              </div>
            ) : (
              <div className="space-y-2">
                {data.recentSubmissions.slice(0, 6).map((entry) => (
                  <div key={entry.id} className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{entry.websiteUrl ?? "Site"}</p>
                      <p className="truncate text-xs text-muted-foreground">{entry.url}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant="secondary">{entry.engine.toUpperCase()}</Badge>
                      <Badge variant={entry.status === "success" ? "default" : "destructive"}>
                        {entry.status.toUpperCase()}
                      </Badge>
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
          <CardTitle className="text-lg">High-traffic assets</CardTitle>
          <CardDescription>Sites with the highest submission volume</CardDescription>
        </CardHeader>
        <CardContent>
          {data.topSites.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              No sites connected yet.
            </div>
          ) : (
            <div className="space-y-2">
              {data.topSites.map((site) => (
                <div key={site.id} className="flex items-center justify-between rounded-lg border p-3">
                  <p className="truncate text-sm font-medium">{site.url}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Activity className="h-4 w-4" />
                    {formatNumber(site.submissions)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
