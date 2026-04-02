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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Loader2, 
  Briefcase, 
  Globe, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  Calendar
} from "lucide-react";
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
        description="Schedule recurring submissions to IndexNow/Bing and monitor automation state."
        action={
          <div className="w-full sm:w-[320px]">
            <Select value={siteId} onValueChange={setSiteId}>
              <SelectTrigger className="h-11 bg-card/30 backdrop-blur-sm border-border/40 font-bold rounded-xl ring-offset-background transition-all focus:ring-2 focus:ring-primary/20">
                <SelectValue placeholder="Select a website" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/40 font-bold">
                {sites.map((site) => (
                  <SelectItem key={site.id} value={site.id} className="focus:bg-primary/5 focus:text-primary rounded-lg transition-colors">
                    {site.url}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
        <Card className="border-border/40 bg-card/30 backdrop-blur-sm shadow-xl shadow-primary/5 rounded-[24px] overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-sm font-black tracking-tighter flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 text-primary" />
                  {selectedSite.url}
                </h4>
                <p className="text-[11px] font-medium text-muted-foreground/60 break-all">
                  Sitemap: {selectedSite.sitemapUrl || "Not configured"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="h-7 px-3 text-[10px] font-black uppercase tracking-widest bg-muted border-none">
                  Jobs: {jobs.length}
                </Badge>
                <Badge 
                  variant="default" 
                  className={cn(
                    "h-7 px-3 text-[10px] font-black uppercase tracking-widest border-none",
                    jobs.some(j => j.enabled) ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground/60"
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
        <div className="flex items-center gap-3 p-4 bg-muted/20 rounded-2xl border border-border/10">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
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
