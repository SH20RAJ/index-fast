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
    <div className="space-y-12 pb-20 max-w-6xl mx-auto">
      {/* Header & Site Selector */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/40 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Automation Control</span>
          </div>
          <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground">Robot Scheduling</h1>
          <p className="text-sm text-muted-foreground/80 mt-1 max-w-md">Configure and monitor automated indexing workflows to maintain fresh visibility across search engines.</p>
        </div>
        
        <div className="flex flex-col gap-2 min-w-[240px]">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-1">Active Property</label>
          <Select 
            value={siteId} 
            onValueChange={handleSiteChange}
          >
            <option value="" disabled>Select a property...</option>
            {sites.map(s => (
              <option key={s.id} value={s.id}>{new URL(s.url).hostname}</option>
            ))}
          </Select>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/20 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-card p-8 rounded-[2.5rem] shadow-2xl border border-border/40 flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground animate-pulse">Accessing Automation Protocol...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-6 rounded-[2rem] bg-red-500/5 border border-red-500/10 flex items-center gap-4 animate-in slide-in-from-top-4 duration-500">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <div>
            <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Protocol Error</p>
            <p className="text-xs text-red-600/80 font-medium">{error}</p>
          </div>
        </div>
      )}

      {selectedSite && !loading && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {/* Dashboard Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { 
                label: "Total Jobs", 
                value: jobs.length, 
                sub: "Configured tasks",
                icon: Calendar,
                color: "text-blue-500",
                bg: "bg-blue-500/5"
              },
              { 
                label: "Active Flow", 
                value: jobs.filter(j => j.enabled).length, 
                sub: "Running currently",
                icon: Zap,
                color: "text-emerald-500",
                bg: "bg-emerald-500/5"
              },
              { 
                label: "System Health", 
                value: jobs.some(j => j.enabled) ? "Nominal" : "Idle", 
                sub: "Operational status",
                icon: Globe,
                color: jobs.some(j => j.enabled) ? "text-primary" : "text-zinc-400",
                bg: jobs.some(j => j.enabled) ? "bg-primary/5" : "bg-zinc-500/5"
              },
              { 
                label: "Next Cycle", 
                value: "T-Minus", 
                sub: "Automation pulse",
                icon: Loader2,
                color: "text-purple-500",
                bg: "bg-purple-500/5"
              },
            ].map((stat) => (
              <Card key={stat.label} className="group border-none bg-zinc-50/50 dark:bg-white/5 overflow-hidden rounded-[2rem] transition-all duration-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <div className={cn("p-2.5 rounded-2xl w-fit transition-transform group-hover:scale-110 duration-500", stat.bg)}>
                        <stat.icon className={cn("h-5 w-5", stat.color)} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">{stat.label}</p>
                        <h3 className="text-2xl font-serif font-bold tracking-tight mt-1">{stat.value}</h3>
                        <p className="text-[10px] text-muted-foreground/60 font-medium mt-0.5">{stat.sub}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div className="rounded-[3rem] overflow-hidden border border-border/40 bg-white dark:bg-zinc-900/40 shadow-xl shadow-zinc-900/5 p-2">
              <div className="bg-zinc-50/50 dark:bg-white/[0.02] rounded-[2.8rem] p-6 md:p-10">
                <CronJobManager
                  siteId={selectedSite.id}
                  siteUrl={selectedSite.url}
                  initialJobs={jobs}
                  isLoading={loading}
                  onRefresh={() => void loadJobs(selectedSite.id)}
                />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-between p-8 rounded-[2.5rem] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 gap-6">
               <div className="space-y-1">
                 <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Pro Tip</p>
                 <h4 className="text-lg font-serif font-bold">Staggered Scheduling</h4>
                 <p className="text-xs opacity-60 max-w-md">Distribute your automation cycles across different hours to ensure consistent indexing signals throughout the day.</p>
               </div>
               <Button asChild variant="outline" className="h-12 px-8 rounded-full border-white/20 bg-white/5 hover:bg-white/10 text-white dark:border-zinc-900/20 dark:bg-zinc-900/5 dark:hover:bg-zinc-900/10 dark:text-zinc-900 font-bold uppercase tracking-widest text-[10px]">
                 <Link href={`/sites/url?siteId=${siteId}`}>View Real-time URLs</Link>
               </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
