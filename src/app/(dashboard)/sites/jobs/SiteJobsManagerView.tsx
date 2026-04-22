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
import { useRouter, useSearchParams } from "next/navigation";
import PageHeader from "@/components/dashboard/PageHeader";
import { useSiteContext } from "@/components/dashboard/SiteContext";
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedSite: globalSite } = useSiteContext();
  const [siteId, setSiteId] = useState<string>(globalSite?.id || initialSiteId || "");
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedSite = useMemo(() => sites.find((site) => site.id === siteId) ?? null, [sites, siteId]);

  useEffect(() => {
    if (globalSite?.id && globalSite.id !== siteId) {
      setSiteId(globalSite.id);
    }
  }, [globalSite, siteId]);

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

  const handleSiteChange = (newId: string) => {
    if (!newId) return;
    setSiteId(newId);
    
    // Update URL query parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set("siteId", newId);
    router.push(`?${params.toString()}`, { scroll: false });
  };

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
    <div className="space-y-10 pb-16 max-w-5xl">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Automation"
          description="Schedule recurring submissions and monitor status."
        />
      </div>

      {loading && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 animate-pulse">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground font-medium">Loading automation...</p>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="rounded-2xl border-red-500/20 bg-red-500/5">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertTitle className="text-sm font-bold uppercase tracking-widest text-red-500">Error</AlertTitle>
          <AlertDescription className="text-xs font-medium text-red-600/80">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {selectedSite && !loading && (
        <div className="space-y-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Jobs", value: jobs.length },
              { label: "Active", value: jobs.filter(j => j.enabled).length, color: jobs.some(j => j.enabled) ? "text-primary" : "text-muted-foreground" },
              { label: "Status", value: jobs.some(j => j.enabled) ? "Active" : "Paused", color: jobs.some(j => j.enabled) ? "text-primary" : "text-muted-foreground" },
              { label: "Updates", value: "Hourly", color: "text-muted-foreground" },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-2xl bg-card border border-border/50 space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                <p className={cn("text-2xl font-serif font-bold tracking-tight", stat.color || "text-foreground")}>{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[32px] overflow-hidden border border-zinc-100 dark:border-white/5 bg-white dark:bg-zinc-900/40 shadow-sm">
            <CronJobManager
              siteId={selectedSite.id}
              siteUrl={selectedSite.url}
              initialJobs={jobs}
              isLoading={loading}
              onRefresh={() => void loadJobs(selectedSite.id)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
