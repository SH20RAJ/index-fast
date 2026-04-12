"use client";

import { useEffect, useState, useMemo } from "react";
import { useSiteContext } from "@/components/dashboard/SiteContext";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getSitemapStatsAction, fetchSitemapDetailsAction, bulkPingAction } from "@/app/(dashboard)/actions";
import { Box, CheckCircle2, RotateCw, ChevronRight, ChevronDown, Send, Globe, Zap, ExternalLink, LayoutGrid, ListTree, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useLogs, type LogEntry } from "@/components/dashboard/LogContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface SitemapStats {
  sitemapUrl: string | null;
  discoveredSitemaps: string[];
  totalFetched: number;
}

interface FetchedSitemap {
  url: string;
  isIndex: boolean;
  urls: string[];
  subSitemaps: string[];
  isExpanded?: boolean;
  loading?: boolean;
}

type TabType = "manifests" | "discovery";

export default function SitemapsView() {
  const { selectedSite } = useSiteContext();
  const { addLogs, setIsTerminalOpen } = useLogs();
  
  const [stats, setStats] = useState<SitemapStats | null>(null);
  const [sitemaps, setSitemaps] = useState<FetchedSitemap[]>([]);
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("manifests");

  // Status for bulk execution
  const [isPinging, setIsPinging] = useState(false);

  useEffect(() => {
    async function loadStats() {
      if (!selectedSite?.id) return;
      
      setLoading(true);
      setError(null);
      
      const res = await getSitemapStatsAction(selectedSite.id);
      if (res.status === "error") {
        setError(res.message || "Failed to load sitemap statistics.");
      } else if (res.data) {
        setStats(res.data);
        
        const initial = res.data.discoveredSitemaps.map((url: string) => ({
          url,
          isIndex: false,
          urls: [],
          subSitemaps: [],
          isExpanded: false
        }));
        
        if (res.data.sitemapUrl && !res.data.discoveredSitemaps.includes(res.data.sitemapUrl)) {
          initial.unshift({
            url: res.data.sitemapUrl,
            isIndex: false,
            urls: [],
            subSitemaps: [],
            isExpanded: false
          });
        }
        
        setSitemaps(initial);
      }
      
      setLoading(false);
    }
    
    loadStats();
  }, [selectedSite]);

  const toggleSitemap = async (index: number) => {
    const sitemap = sitemaps[index];
    if (!sitemap.isExpanded && sitemap.urls.length === 0 && sitemap.subSitemaps.length === 0) {
      setSitemaps(prev => prev.map((s, i) => i === index ? { ...s, loading: true } : s));
      const res = await fetchSitemapDetailsAction(sitemap.url);
      if (res.status === "success" && res.data) {
        setSitemaps(prev => prev.map((s, i) => i === index ? { ...s, ...res.data, isExpanded: true, loading: false } : s));
      } else {
        toast.error(`Could not crawl: ${res.message}`);
        setSitemaps(prev => prev.map((s, i) => i === index ? { ...s, loading: false } : s));
      }
    } else {
      setSitemaps(prev => prev.map((s, i) => i === index ? { ...s, isExpanded: !s.isExpanded } : s));
    }
  };

  const handleBulkPing = async () => {
    if (selectedUrls.size === 0 || !selectedSite?.id) return;
    setIsPinging(true);
    const urlsToPing = Array.from(selectedUrls);
    
    // Register initial pending logs in global console
    addLogs(urlsToPing.flatMap(url => [
      { url, engine: "IndexNow", status: "pending" },
      { url, engine: "Bing API", status: "pending" },
      { url, engine: "Wayback", status: "pending" },
    ]));
    setIsTerminalOpen(true);

    try {
      const res = await bulkPingAction(selectedSite.id, urlsToPing);
      if (res.status === "success" && res.data) {
        const finishedLogs: Omit<LogEntry, "timestamp">[] = [];
        res.data.submissions.forEach((sub: any) => finishedLogs.push({ url: sub.url, engine: sub.engine, status: sub.status, message: sub.errorMessage }));
        res.data.wayback.forEach((wb: any) => finishedLogs.push({ url: wb.url, engine: "Wayback", status: wb.success ? "success" : "failed" }));
        addLogs(finishedLogs);
        toast.success(`Indexing triggered for ${urlsToPing.length} URLs`);
      }
    } catch (err) {
      toast.error("Bulk submission failed.");
    } finally {
      setIsPinging(false);
    }
  };

  const sitemapGroups = useMemo(() => {
    return {
      indexes: sitemaps.filter(s => s.isIndex || s.subSitemaps.length > 0),
      standard: sitemaps.filter(s => !s.isIndex && s.subSitemaps.length === 0)
    };
  }, [sitemaps]);

  if (!selectedSite) {
    return (
      <div className="space-y-6">
        <PageHeader title="Sitemaps Engine" description="Select a website to manage its manifest ecosystem." />
        <Card className="p-20 text-center border-dashed bg-zinc-50/50 dark:bg-white/[0.02] rounded-[48px]">
          <Box className="w-12 h-12 mx-auto mb-6 text-zinc-300" />
          <p className="text-xl font-bold tracking-tight">Vessel Not Selected</p>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">Choose a property from the sidebar to begin deep-crawling sitemaps.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-32 max-w-6xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <PageHeader
          title="Sitemaps Engine"
          description={`Unified manifest management for ${selectedSite.url.replace(/^https?:\/\//, '')}`}
        />
        <div className="flex bg-zinc-100 dark:bg-white/5 p-1 rounded-2xl border border-zinc-200 dark:border-white/10 shrink-0">
          <Button 
            variant={activeTab === "manifests" ? "default" : "ghost"} 
            size="sm"
            onClick={() => setActiveTab("manifests")}
            className="rounded-xl h-9 text-xs font-black uppercase tracking-widest"
          >
            <ListTree className="w-3.5 h-3.5 mr-2" /> Manifests
          </Button>
          <Button 
            variant={activeTab === "discovery" ? "default" : "ghost"} 
            size="sm"
            onClick={() => setActiveTab("discovery")}
            className="rounded-xl h-9 text-xs font-black uppercase tracking-widest"
          >
            <History className="w-3.5 h-3.5 mr-2" /> Discovery Log
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1 rounded-[40px] border-zinc-100 dark:bg-zinc-900/40 p-6 flex flex-col justify-between">
           <div>
             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Synced URLs</span>
             <h4 className="text-4xl font-black mt-2">{stats?.totalFetched || 0}</h4>
           </div>
           <p className="text-[10px] font-medium text-emerald-500 flex items-center gap-1 mt-4">
             <CheckCircle2 className="w-3.5 h-3.5" /> Database Match
           </p>
        </Card>

        {selectedUrls.size > 0 ? (
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="md:col-span-3">
            <Card className="rounded-[40px] bg-zinc-900 text-white p-6 dark:bg-zinc-100 dark:text-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-6">
               <div className="flex items-center gap-6">
                 <div className="h-14 w-14 rounded-full bg-rose-500 flex items-center justify-center text-white shrink-0">
                   <Zap className="w-6 h-6 fill-white" />
                 </div>
                 <div>
                    <h3 className="text-lg font-bold">Action Ready</h3>
                    <p className="text-xs opacity-60 font-medium uppercase tracking-widest">{selectedUrls.size} URLs selected for bulk indexing</p>
                 </div>
               </div>
               <div className="flex items-center gap-3">
                  <Button onClick={handleBulkPing} disabled={isPinging} className="rounded-2xl h-12 px-8 bg-rose-500 hover:bg-rose-600 text-white font-black uppercase tracking-widest shadow-lg shadow-rose-500/20">
                    {isPinging ? <RotateCw className="w-4 h-4 animate-spin" /> : "Trigger Global Indexing"}
                  </Button>
                  <Button variant="ghost" className="text-zinc-400 hover:text-white" onClick={() => setSelectedUrls(new Set())}>Clear</Button>
               </div>
            </Card>
          </motion.div>
        ) : (
          <Card className="md:col-span-3 rounded-[40px] border-dashed border-2 p-8 flex items-center justify-center text-zinc-400 uppercase tracking-[0.2em] font-black text-[10px]">
             Select URLs below to initiate propagation
          </Card>
        )}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "manifests" ? (
          <motion.div key="manifests" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
            {/* Indexes Section */}
            {sitemapGroups.indexes.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 ml-2">
                  <Badge className="bg-amber-500 rounded-lg">Indexes</Badge>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Master Manifests</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {sitemapGroups.indexes.map((s, i) => (
                    <SitemapCard 
                      key={s.url} 
                      sitemap={s} 
                      index={i} 
                      toggle={toggleSitemap} 
                      selectedUrls={selectedUrls} 
                      setSelectedUrls={setSelectedUrls} 
                      handleSelectAll={(idx: number, c: boolean) => {
                        const sm = sitemaps[idx];
                        setSelectedUrls(prev => {
                          const next = new Set<string>(prev);
                          sm.urls.forEach(u => c ? next.add(u) : next.delete(u));
                          return next;
                        });
                      }} 
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Standard Sitemaps */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 ml-2">
                <Badge className="bg-blue-500 rounded-lg">Flat</Badge>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">URL Manifests</h3>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {sitemapGroups.standard.map((s, i) => (
                  <SitemapCard 
                    key={s.url} 
                    sitemap={s} 
                    index={sitemaps.indexOf(s)} 
                    toggle={toggleSitemap} 
                    selectedUrls={selectedUrls} 
                    setSelectedUrls={setSelectedUrls} 
                    handleSelectAll={(idx: number, c: boolean) => {
                      const sm = sitemaps[idx];
                      setSelectedUrls(prev => {
                        const next = new Set<string>(prev);
                        sm.urls.forEach(u => c ? next.add(u) : next.delete(u));
                        return next;
                      });
                    }} 
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="discovery" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
             <Card className="rounded-[40px] border-zinc-100 overflow-hidden">
               <CardHeader className="p-8 pb-4">
                 <CardTitle className="text-xl font-bold">Action History</CardTitle>
                 <CardDescription>Visual timeline of URL discovery and indexing events.</CardDescription>
               </CardHeader>
               <CardContent className="p-0">
                 <div className="p-8 py-20 text-center text-zinc-400 italic font-light">
                    Discovery log data persistence coming in next release. Monitoring live logs in the console.
                 </div>
               </CardContent>
             </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface SitemapCardProps {
  sitemap: FetchedSitemap;
  index: number;
  toggle: (index: number) => Promise<void>;
  selectedUrls: Set<string>;
  setSelectedUrls: React.Dispatch<React.SetStateAction<Set<string>>>;
  handleSelectAll: (index: number, checked: boolean) => void;
}

function SitemapCard({ sitemap, index, toggle, selectedUrls, setSelectedUrls, handleSelectAll }: SitemapCardProps) {
  return (
    <Card className={cn("rounded-3xl border-zinc-100 transition-all dark:bg-zinc-900/40", sitemap.isExpanded && "ring-1 ring-zinc-900 overflow-hidden")}>
      <div className="p-4 flex flex-col sm:flex-row items-center gap-4">
        <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shrink-0", sitemap.isIndex ? "bg-amber-500/10 text-amber-600" : "bg-blue-500/10 text-blue-600")}>
          <Globe className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
           <p className="text-sm font-bold truncate">{sitemap.url}</p>
           <div className="flex items-center gap-3 mt-1">
             <span className="text-[10px] font-black uppercase text-zinc-400 tracking-tighter">
               {sitemap.urls.length > 0 ? `${sitemap.urls.length} Entries Discovered` : sitemap.loading ? "Crawling XML..." : "Manifest Scanning..."}
             </span>
           </div>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="sm" onClick={() => toggle(index)} className="rounded-xl h-10 w-10">
             {sitemap.loading ? <RotateCw className="w-4 h-4 animate-spin" /> : sitemap.isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
           </Button>
           <Button variant="outline" size="sm" asChild className="rounded-xl h-10 px-4">
              <a href={sitemap.url} target="_blank" rel="noreferrer"><ExternalLink className="w-3.5 h-3.5" /></a>
           </Button>
        </div>
      </div>

      <AnimatePresence>
        {sitemap.isExpanded && !sitemap.loading && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-zinc-100 dark:border-white/5 p-4 bg-zinc-50/50 dark:bg-black/20">
            {sitemap.isIndex ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {sitemap.subSitemaps.map((sub: string, i: number) => (
                    <div key={i} className="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-white/5 flex items-center justify-between shadow-sm">
                      <span className="text-[11px] font-medium truncate flex-1 pr-4">{sub}</span>
                      <Button variant="ghost" size="sm" className="h-7 text-[9px] font-black uppercase">Deep Scan</Button>
                    </div>
                  ))}
               </div>
            ) : (
              <div className="space-y-4">
                 <div className="flex items-center justify-between px-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">URL Manifest List</span>
                    <div className="flex items-center gap-4">
                       <Button variant="link" size="sm" className="h-auto p-0 text-[10px] font-bold text-zinc-500 uppercase" onClick={() => handleSelectAll(index, true)}>Select All</Button>
                       <Button variant="link" size="sm" className="h-auto p-0 text-[10px] font-bold text-rose-500 uppercase" onClick={() => handleSelectAll(index, false)}>Clear</Button>
                    </div>
                 </div>
                 <div className="grid grid-cols-1 gap-1 max-h-64 overflow-y-auto rounded-2xl p-2 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5">
                    {sitemap.urls.map((url: string, i: number) => (
                      <div key={i} className={cn("p-2 px-3 rounded-lg flex items-center gap-3 transition-colors", selectedUrls.has(url) ? "bg-rose-500/5 text-rose-600" : "hover:bg-zinc-50")}>
                        <Checkbox checked={selectedUrls.has(url)} onCheckedChange={(val) => {
                          setSelectedUrls((prev) => {
                            const n = new Set<string>(prev);
                            val ? n.add(url) : n.delete(url);
                            return n;
                          });
                        }} />
                        <span className="text-[11px] truncate">{url}</span>
                        <Button variant="ghost" size="sm" className="ml-auto h-6 w-6 p-0 hover:bg-rose-500 hover:text-white" onClick={() => {
                          toast.success("URL Selected");
                          setSelectedUrls((prev) => new Set<string>([...Array.from(prev), url]));
                        }}>
                          <Zap className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                 </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
