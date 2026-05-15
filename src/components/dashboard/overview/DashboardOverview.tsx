"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Globe,
  RefreshCw,
  Edit2,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Zap,
} from "lucide-react";
import type { DashboardData, DashboardSiteSummary } from "@/app/(dashboard)/actions";

interface DashboardOverviewProps {
  data: DashboardData;
}

function formatDate(date: Date | string | null | undefined) {
  if (!date) return "Never synced";
  const value = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

function SiteCard({ site }: { site: DashboardSiteSummary }) {
  return (
    <Card className="overflow-hidden border-border/60 bg-card transition-all hover:border-primary/30 hover:shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold">{site.name}</CardTitle>
            <p className="text-xs text-muted-foreground">{site.domain}</p>
          </div>
        </div>
        <Badge variant={site.autoIndexingEnabled ? "default" : "secondary"} className="h-5 text-[10px] uppercase tracking-wider">
          {site.autoIndexingEnabled ? "Auto Indexing On" : "Auto Indexing Off"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sitemap</p>
            <p className="truncate font-medium">{site.sitemapUrl || "Not set"}</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sources</p>
            <p className="font-medium">{site.sourceCount} found</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2">
            {site.indexNowVerified ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            <span className="text-xs font-medium">IndexNow</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2">
            {site.bingApiKeyLastFour ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            <span className="text-xs font-medium">Bing API</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Synced {formatDate(site.lastSyncAt)}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" asChild>
              <Link href={`/sites/${site.id}`}>
                <Edit2 className="mr-1.5 h-3 w-3" />
                Edit
              </Link>
            </Button>
            <Button size="sm" className="h-8 px-3 text-xs font-bold shadow-sm">
              <RefreshCw className="mr-1.5 h-3 w-3" />
              Sync now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardOverview({ data }: DashboardOverviewProps) {
  const needsSetup = data.websitesCount === 0;

  return (
    <div className="max-w-5xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage your website indexing and automation.</p>
        </div>
        {!needsSetup && (
          <Button asChild className="rounded-xl font-bold shadow-lg shadow-primary/20">
            <Link href="/dashboard/sites/new">
              <Plus className="mr-2 h-4 w-4" />
              Add site
            </Link>
          </Button>
        )}
      </div>

      {needsSetup ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Card className="w-full max-w-xl overflow-hidden rounded-3xl border-2 border-primary/20 bg-card shadow-2xl shadow-primary/5">
            <div className="bg-primary/5 px-8 py-10 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Zap className="h-8 w-8" />
              </div>
              <h2 className="mb-2 text-2xl font-bold">Set up auto indexing</h2>
              <p className="text-muted-foreground">
                Add your website, sitemap or feed, IndexNow key, and optional Bing API key. 
                IndexFast will fetch your URLs and submit them automatically.
              </p>
            </div>
            <CardContent className="flex justify-center p-8">
              <Button asChild size="lg" className="h-12 rounded-2xl px-8 text-base font-bold shadow-xl shadow-primary/25 transition-transform hover:scale-105 active:scale-95">
                <Link href="/sites/new">
                  <Plus className="mr-2 h-5 w-5" />
                  Add site
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {data.sites.map((site) => (
            <SiteCard key={site.id} site={site} />
          ))}
        </div>
      )}

      {!needsSetup && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/dashboard/mcp" className="group">
            <Card className="h-full border-border/60 bg-muted/10 transition-colors hover:bg-muted/30">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="rounded-xl bg-primary/10 p-2 text-primary transition-colors group-hover:bg-primary/20">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold">AI Agents (MCP)</h3>
                  <p className="text-xs text-muted-foreground">Advanced SEO automation</p>
                </div>
                <ExternalLink className="ml-auto h-4 w-4 text-muted-foreground/50" />
              </CardContent>
            </Card>
          </Link>
          <Link href="/toolbox" className="group">
            <Card className="h-full border-border/60 bg-muted/10 transition-colors hover:bg-muted/30">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="rounded-xl bg-orange-500/10 p-2 text-orange-500 transition-colors group-hover:bg-orange-500/20">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold">Toolbox</h3>
                  <p className="text-xs text-muted-foreground">Free SEO utilities</p>
                </div>
                <ExternalLink className="ml-auto h-4 w-4 text-muted-foreground/50" />
              </CardContent>
            </Card>
          </Link>
        </div>
      )}
    </div>
  );
}

