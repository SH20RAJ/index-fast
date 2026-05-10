"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Loader2, Globe, AlertCircle, Calendar, Zap, RefreshCw, ArrowUpRight, Activity } from "lucide-react";
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

export default function SiteJobsManagerView({ sites, initialSiteId }: SiteJobsManagerViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedSite: globalSite, setSelectedSite } = useSiteContext();
  const [siteId, setSiteId] = useState<string>(initialSiteId || globalSite?.id || "");
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedSite = useMemo(() => sites.find((site) => site.id === siteId) ?? null, [sites, siteId]);

  // Sync with Global Context if it changes
  useEffect(() => {
    if (globalSite?.id && globalSite.id !== siteId) {
      setSiteId(globalSite.id);
    }
  }, [globalSite]);

  async function loadJobs(targetSiteId: string) {
    if (!targetSiteId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/websites/${targetSiteId}/cron-jobs`, { cache: "no-store" });
      const payload = await response.json();

      if (!response.ok) throw new Error(payload.error || "Failed to load jobs.");
      setJobs(payload.jobs ?? []);
    } catch (err: any) {
      setJobs([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (siteId) {
      void loadJobs(siteId);
    }
  }, [siteId]);

  const handleSiteChange = (newId: string) => {
    if (!newId) return;
    setSiteId(newId);
    
    // Sync global context if needed
    const newGlobalSite = sites.find(s => s.id === newId);
    if (newGlobalSite) {
        setSelectedSite(newGlobalSite);
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("siteId", newId);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  if (sites.length === 0) {
    return (
      <div className="space-y-6 pb-16 max-w-5xl mx-auto">
        <PageHeader
          title="Automation"
          description="Schedule recurring indexing workflows for your websites."
        />
        <Card className="border-dashed border-2 bg-muted/20 rounded-[2.5rem]">
          <CardContent className="flex flex-col items-center justify-center py-24 text-center space-y-6">
            <div className="h-20 w-20 rounded-3xl bg-primary/5 flex items-center justify-center border border-primary/10">
              <Calendar className="h-10 w-10 text-primary/40" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-serif font-bold tracking-tight">No properties found</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Connect your first website to unlock automated indexing protocols and scheduled sitemap pings.
              </p>
            </div>
            <Button asChild className="rounded-full px-8 h-12 font-bold shadow-xl shadow-primary/20">
              <Link href="/sites">Add Your First Site</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24 max-w-6xl mx-auto px-4">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 py-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_var(--primary)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">Automation System v2.0</span>
          </div>
          <div>
            <h1 className="text-5xl font-serif font-bold tracking-tight text-foreground leading-tight">Scheduled<br />Indexing</h1>
            <p className="text-sm text-muted-foreground/70 mt-3 max-w-md font-medium">Configure high-velocity indexing cycles to ensure your content is discovered by Google and Bing within minutes of publication.</p>
          </div>
        </div>
        
        <div className="flex flex-col gap-3 min-w-[280px]">
          <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 px-1">Select Site</label>
          <div className="relative group">
            <div className="absolute -inset-1 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Select 
              value={siteId} 
              onValueChange={handleSiteChange}
              placeholder="Choose a site..."
              options={sites.map(s => ({ 
                label: new URL(s.url).hostname, 
                value: s.id 
              }))}
            />
          </div>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-md animate-in fade-in duration-500">
           <div className="relative group">
            <div className="absolute -inset-4 rounded-[3rem] bg-primary/20 blur-2xl opacity-50 animate-pulse" />
            <div className="relative bg-white/80 dark:bg-zinc-900/80 p-10 rounded-[2.5rem] shadow-2xl border border-white/10 flex flex-col items-center gap-6 min-w-[280px]">
              <div className="relative">
                <div className="absolute inset-0 rounded-full border-2 border-primary/10" />
                <Loader2 className="h-10 w-10 animate-spin text-primary stroke-[1.5px]" />
              </div>
              <div className="space-y-1.5 text-center">
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-900 dark:text-zinc-100">Synchronizing</p>
                <p className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 italic">Accessing Automation Protocols...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-8 rounded-[2.5rem] bg-red-500/5 border border-red-500/10 flex items-center gap-6 animate-in slide-in-from-top-6 duration-700 shadow-sm">
          <div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center shrink-0">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-black text-red-500 uppercase tracking-[0.2em]">System Failure</p>
            <p className="text-sm text-red-600/80 font-semibold">{error}</p>
          </div>
        </div>
      )}

      {selectedSite && !loading && (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { 
                label: "Active Pipelines", 
                value: jobs.filter(j => j.enabled).length, 
                sub: "Running currently",
                icon: Zap,
                color: "text-amber-500",
                bg: "bg-amber-500/10"
              },
              { 
                label: "Cycle Frequency", 
                value: jobs.length > 0 ? (jobs[0].frequency.charAt(0).toUpperCase() + jobs[0].frequency.slice(1)) : "None", 
                sub: "Primary rhythm",
                icon: RefreshCw,
                color: "text-blue-500",
                bg: "bg-blue-500/10"
              },
              { 
                label: "Status", 
                value: jobs.some(j => j.enabled) ? "Operational" : "Standby", 
                sub: "Engine health",
                icon: Activity,
                color: jobs.some(j => j.enabled) ? "text-primary" : "text-zinc-400",
                bg: jobs.some(j => j.enabled) ? "bg-primary/10" : "bg-zinc-500/10"
              },
              { 
                label: "Property", 
                value: new URL(selectedSite.url).hostname.split('.')[0], 
                sub: "Target origin",
                icon: Globe,
                color: "text-purple-500",
                bg: "bg-purple-500/10"
              },
            ].map((stat) => (
              <Card key={stat.label} className="group border-none bg-card/40 dark:bg-white/5 backdrop-blur-sm rounded-[2rem] hover:bg-card/60 transition-all duration-500">
                <CardContent className="p-7">
                   <div className="space-y-4">
                      <div className={cn("p-3 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-500", stat.bg)}>
                        <stat.icon className={cn("h-5 w-5", stat.color)} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">{stat.label}</p>
                        <h3 className="text-2xl font-serif font-bold tracking-tight mt-1 truncate">{stat.value}</h3>
                        <p className="text-[10px] text-muted-foreground/60 font-semibold mt-1">{stat.sub}</p>
                      </div>
                    </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-8">
            <div className="relative">
              <div className="absolute -inset-1 rounded-[3.2rem] bg-gradient-to-br from-primary/10 to-transparent opacity-50 blur-xl" />
              <div className="relative rounded-[3rem] overflow-hidden border border-border/40 bg-white/80 dark:bg-zinc-900/40 backdrop-blur-xl p-2 shadow-2xl shadow-primary/5">
                <div className="bg-zinc-50/50 dark:bg-white/[0.02] rounded-[2.8rem] p-4 sm:p-8 md:p-12">
                  <CronJobManager
                    siteId={selectedSite.id}
                    siteUrl={selectedSite.url}
                    initialJobs={jobs}
                    isLoading={loading}
                    onRefresh={() => void loadJobs(selectedSite.id)}
                  />
                </div>
              </div>
            </div>
            
            <Card className="rounded-[2.5rem] bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-none shadow-xl overflow-hidden group">
               <CardContent className="p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative">
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                    <Activity className="h-32 w-32" />
                 </div>
                 <div className="space-y-2 relative z-10">
                   <div className="flex items-center gap-2">
                     <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Operational Insight</p>
                   </div>
                   <h4 className="text-2xl font-serif font-bold">Staggered Cycles</h4>
                   <p className="text-sm opacity-60 max-w-md font-medium leading-relaxed">By alternating your automation schedules, you maintain a persistent "indexing signal" that encourages search engines to crawl your property more frequently.</p>
                 </div>
                 <Button asChild variant="outline" className="relative z-10 h-14 px-10 rounded-full border-white/20 bg-white/5 hover:bg-white/10 text-white dark:border-zinc-900/20 dark:bg-zinc-900/5 dark:hover:bg-zinc-900/10 dark:text-zinc-900 font-black uppercase tracking-[0.2em] text-[10px] shadow-lg">
                   <Link href={`/sites/url?siteId=${siteId}`} className="flex items-center gap-2">
                     Inventory Manager <ArrowUpRight className="h-4 w-4" />
                   </Link>
                 </Button>
               </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
