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

export default function DashboardOverview({ data }: DashboardOverviewProps) {
  const websiteRatio = ratio(data.usage.websitesUsed, data.usage.websitesLimit);
  const submissionRatio = ratio(data.usage.submissionsUsed, data.usage.submissionsLimit);
  const successRate = data.submissionsThisMonth > 0 ? Math.round((data.successfulThisMonth / data.submissionsThisMonth) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Monitor your indexing activity and manage subscription resources.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/sites">
              <Plus className="w-4 h-4 mr-2" />
              Add Website
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/settings">
              <Settings className="w-4 h-4 mr-2" />
              Subscription
            </Link>
          </Button>
        </div>
      </div>

      {/* Plan Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Plan</p>
              <p className="text-lg font-semibold">{data.plan.name}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Monthly Cost</p>
              <p className="text-lg font-semibold">${data.plan.priceMonthly}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Active Sites</p>
              <p className="text-lg font-semibold">{data.websitesCount}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Success Rate</p>
              <p className="text-lg font-semibold">{successRate}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Websites</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data.usage.websitesUsed}</p>
            <p className="text-xs text-muted-foreground mt-1">of {formatNumber(data.usage.websitesLimit)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Submissions This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatNumber(data.submissionsThisMonth)}</p>
            <p className="text-xs text-muted-foreground mt-1">of {formatNumber(data.usage.submissionsLimit)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Successful</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatNumber(data.successfulThisMonth)}</p>
            <p className="text-xs text-muted-foreground mt-1">{successRate}% success rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Plan Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatNumber(data.usage.websitesLimit)}</p>
            <p className="text-xs text-muted-foreground mt-1">max websites</p>
          </CardContent>
        </Card>
      </div>

      {/* Resources Section */}
      <Card>
        <CardHeader>
          <CardTitle>Resources & Quota</CardTitle>
          <CardDescription>{data.plan.tagline}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium">Websites</p>
              <p className="text-sm text-muted-foreground">
                {data.usage.websitesUsed} of {formatNumber(data.usage.websitesLimit)}
              </p>
            </div>
            <Progress value={websiteRatio} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium">Monthly Submissions</p>
              <p className="text-sm text-muted-foreground">
                {formatNumber(data.usage.submissionsUsed)} of {formatNumber(data.usage.submissionsLimit)}
              </p>
            </div>
            <Progress value={submissionRatio} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Activity Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest submissions</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <Link href="/submissions">
              View All <ExternalLink className="w-3 h-3" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {data.recentSubmissions.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <p className="text-sm">No submissions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentSubmissions.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{entry.websiteUrl ?? "Site"}</p>
                    <p className="text-xs text-muted-foreground truncate">{entry.url}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <Badge variant="outline" className="text-xs">
                      {entry.engine.toUpperCase()}
                    </Badge>
                    {entry.status === "success" ? (
                      <Badge className="text-xs bg-green-100 text-green-800 hover:bg-green-100">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Success
                      </Badge>
                    ) : (
                      <Badge className="text-xs bg-red-100 text-red-800 hover:bg-red-100">
                        <AlertCircle className="w-3 h-3 mr-1" />
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

      {/* Top Sites */}
      <Card>
        <CardHeader>
          <CardTitle>High-Traffic Assets</CardTitle>
          <CardDescription>Your most active properties</CardDescription>
        </CardHeader>
        <CardContent>
          {data.topSites.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <p className="text-sm">No properties tracked yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.topSites.map((site) => (
                <div key={site.id} className="p-4 rounded-lg border">
                  <p className="text-sm font-medium truncate mb-1">{site.url}</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Last sync: {site.lastSyncAt ? new Date(site.lastSyncAt).toLocaleDateString() : "Pending"}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {formatNumber(site.submissions)} submissions
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

