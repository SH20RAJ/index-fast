"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Loader2, Globe, AlertCircle, Calendar } from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/dashboard/PageHeader";
import CronJobManager, { type CronJob } from "@/components/dashboard/CronJobManager";

interface SiteOption {
  id: string;
  url: string;
  sitemapUrl: string | null;
}

interface SiteJobsManagerViewProps {
  sites: SiteOption[];
  initialSiteId: string | null;
}

interface SiteJobsResponse {
  jobs: CronJob[];
}

export default function SiteJobsManagerView({ sites, initialSiteId }: SiteJobsManagerViewProps) {
  const [siteId, setSiteId] = useState<string>(initialSiteId ?? "");
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedSite = useMemo(() => sites.find((site) => site.id === siteId) ?? null, [sites, siteId]);

  async function loadJobs(targetSiteId: string) {
    if (!targetSiteId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/websites/${targetSiteId}/cron-jobs`, { cache: "no-store" });
      const payload = (await response.json()) as SiteJobsResponse | { error?: string };

      if (!response.ok) {
        throw new Error((payload as { error?: string }).error || "Failed to load jobs.");
      }

      setJobs((payload as SiteJobsResponse).jobs ?? []);
    } catch (err) {
      setJobs([]);
      setError(err instanceof Error ? err.message : "Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!siteId) {
      return;
    }

    void loadJobs(siteId);
  }, [siteId]);

  if (sites.length === 0) {
    return (
      <div className="space-y-6 pb-16">
        <PageHeader
          title="Auto Submit Jobs"
          description="Create recurring indexing schedules for your websites."
        />
        <Card className="border-dashed border-2 bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <Calendar className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black tracking-tighter">No websites found</h3>
              <p className="text-sm font-medium text-muted-foreground max-w-xs mx-auto">
                Add a website first, then come back here to automate submissions.
              </p>
            </div>
            <Button asChild className="font-black rounded-xl shadow-lg shadow-primary/10">
              <Link href="/sites">Go to Websites</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      <PageHeader
        title="Auto Submit Jobs"
        description="Schedule recurring submissions and monitor automation status."
        action={
          <div className="w-full sm:w-[320px]">
            <Select
              value={siteId}
              onChange={(val: any) => setSiteId(val as string)}
              options={sites.map((site) => ({ label: site.url, value: site.id }))}
              placeholder="Select a website"
              selectClassName="h-10 rounded-md border-border bg-background"
              className="w-full"
            />
          </div>
        }
      />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-bold">Error</AlertTitle>
          <AlertDescription className="font-medium">{error}</AlertDescription>
        </Alert>
      )}

      {selectedSite && (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
              <div className="space-y-1">
                <h4 className="flex items-center gap-2 text-sm font-medium tracking-tight">
                  <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                  {selectedSite.url}
                </h4>
                <p className="break-all text-xs text-muted-foreground">
                  Sitemap: {selectedSite.sitemapUrl || "Not configured"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="h-7 px-3 text-[10px] uppercase tracking-wide">
                  Jobs: {jobs.length}
                </Badge>
                <Badge 
                  variant="default" 
                  className={cn(
                    "h-7 px-3 text-[10px] uppercase tracking-wide",
                    jobs.some(j => j.enabled) ? "bg-emerald-500/15 text-emerald-500" : "bg-muted text-muted-foreground"
                  )}
                >
                  Active: {jobs.filter((job) => job.enabled).length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="flex items-center gap-3 rounded-md border border-border bg-muted/30 p-3">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground">
            Fetching schedules...
          </p>
        </div>
      )}

      {selectedSite && !loading && (
        <CronJobManager
          siteId={selectedSite.id}
          siteUrl={selectedSite.url}
          initialJobs={jobs}
          isLoading={loading}
          onRefresh={() => void loadJobs(selectedSite.id)}
        />
      )}
    </div>
  );
}
