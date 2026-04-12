"use client";

import { useEffect, useState, useMemo } from "react";
import { useSiteContext } from "@/components/dashboard/SiteContext";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getSitemapStatsAction, fetchSitemapDetailsAction, bulkPingAction } from "@/app/(dashboard)/actions";
import { Box, Link as LinkIcon, CheckCircle2, RotateCw, ChevronRight, ChevronDown, Send, Globe, Zap, ExternalLink, Selection, MousePointerClick, MoreVertical } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import SubmissionTerminal, { LogEntry } from "./SubmissionTerminal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

export default function SitemapsView() {
  const { selectedSite } = useSiteContext();
  const [stats, setStats] = useState<SitemapStats | null>(null);
  const [sitemaps, setSitemaps] = useState<FetchedSitemap[]>([]);
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Terminal & Execution State
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
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
        
        // Initial sitemap list from discovered ones
        const initial = res.data.discoveredSitemaps.map(url => ({
          url,
          isIndex: false,
          urls: [],
          subSitemaps: [],
          isExpanded: false
        }));
        
        // Add primary sitemap if not in list
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
    
    // If expanding and not yet loaded, fetch details
    if (!sitemap.isExpanded && sitemap.urls.length === 0 && sitemap.subSitemaps.length === 0) {
      setSitemaps(prev => prev.map((s, i) => i === index ? { ...s, loading: true } : s));
      
      const res = await fetchSitemapDetailsAction(sitemap.url);
      if (res.status === "success" && res.data) {
        setSitemaps(prev => prev.map((s, i) => i === index ? { 
          ...s, 
          ...res.data, 
          isExpanded: true,
          loading: false 
        } : s));
      } else {
        toast.error(`Could not crawl sitemap: ${res.message}`);
        setSitemaps(prev => prev.map((s, i) => i === index ? { ...s, loading: false } : s));
      }
    } else {
      setSitemaps(prev => prev.map((s, i) => i === index ? { ...s, isExpanded: !s.isExpanded } : s));
    }
  };

  const handleSelectUrl = (url: string) => {
    setSelectedUrls(prev => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
  };

  const handleSelectSitemap = (index: number, checked: boolean) => {
    const sitemap = sitemaps[index];
    setSelectedUrls(prev => {
      const next = new Set(prev);
      sitemap.urls.forEach(url => {
        if (checked) next.add(url);
        else next.delete(url);
      });
      return next;
    });
  };

  const handleBulkPing = async () => {
    if (selectedUrls.size === 0) return;
    if (!selectedSite?.id) return;

    setTerminalOpen(true);
    setIsPinging(true);
    setLogs([]);

    const urlsToPing = Array.from(selectedUrls);
    
    // Start with "pending" logs for all
    setLogs(urlsToPing.flatMap(url => [
      { url, engine: "IndexNow", status: "pending" },
      { url, engine: "Bing API", status: "pending" },
      { url, engine: "Wayback Machine", status: "pending" },
      { url, engine: "Pings (120+)", status: "pending" },
    ]));

    try {
      const res = await bulkPingAction(selectedSite.id, urlsToPing);
      
      if (res.status === "success" && res.data) {
        // Map individual results back to logs
        // Note: The structure of triggerSubmissions returns objects per URL:Engine
        const newLogs: LogEntry[] = [];
        
        // Handle Main Submissions (Bing/IndexNow/Universal)
        res.data.submissions.forEach((sub: any) => {
          newLogs.push({
            url: sub.url,
            engine: sub.engine,
            status: sub.status,
            message: sub.errorMessage
          });
        });

        // Handle Wayback Machine
        res.data.wayback.forEach((wb: any) => {
          newLogs.push({
            url: wb.url,
            engine: "Wayback",
            status: wb.success ? "success" : "failed",
            message: !wb.success ? "Network failure" : undefined
          });
        });

        setLogs(newLogs);
        toast.success(`Bulk indexing triggered for ${urlsToPing.length} URLs`);
      } else {
        toast.error(`Bulk action failed: ${res.message}`);
      }
    } catch (err) {
      toast.error("A critical error occurred during bulk submission.");
    } finally {
      setIsPinging(false);
    }
  };

  if (!selectedSite) {
    return (
      <div className="space-y-6">
        <PageHeader title="Sitemaps Tracking" description="Select a website to view its discovered sitemaps." />
        <Card className="p-12 text-center text-muted-foreground border-dashed bg-muted/30">
          <Box className="w-8 h-8 mx-auto mb-4 text-muted-foreground/30" />
          <p>Please select a website from the sidebar to view sitemaps.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-32 max-w-6xl relative">
      <PageHeader
        title="Sitemaps Tracking"
        description={`Command center for ${selectedSite.url.replace(/^https?:\/\//, '')}`}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-3xl border-zinc-100 shadow-sm dark:border-white/5 dark:bg-zinc-900/40">
           <CardHeader className="pb-2">
            <CardDescription className="text-[10px] uppercase tracking-widest font-bold opacity-60">Database Inventory</CardDescription>
            <CardTitle className="text-3xl tracking-tight font-black">{stats?.totalFetched || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[10px] text-muted-foreground flex items-center gap-1 uppercase font-bold tracking-tighter">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Synced URLs
            </p>
          </CardContent>
        </Card>

        {selectedUrls.size > 0 && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="md:col-span-2"
          >
            <Card className="rounded-3xl bg-primary border-primary shadow-xl shadow-primary/20">
              <CardContent className="flex items-center justify-between p-6 py-4">
                <div className="flex flex-col">
                  <span className="text-sm font-black text-white uppercase tracking-widest leading-none">Selected URLs</span>
                  <span className="text-2xl font-black text-white/90">{selectedUrls.size}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={handleBulkPing} 
                    disabled={isPinging}
                    className="rounded-xl bg-white text-primary hover:bg-white/90 font-black text-xs uppercase tracking-widest transition-transform active:scale-95"
                  >
                    {isPinging ? <RotateCw className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
                    Bulk Indexing Ping
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => setSelectedUrls(new Set())}
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    Clear Filter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
           <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Discoverable Sources</h3>
           <Badge variant="outline" className="text-[10px] font-bold opacity-50 uppercase">{sitemaps.length} Sources</Badge>
        </div>

        {sitemaps.length > 0 ? (
          <div className="space-y-4">
            {sitemaps.map((sitemap, idx) => (
              <Card key={idx} className={cn(
                "rounded-3xl overflow-hidden border-zinc-100 dark:border-white/5 dark:bg-zinc-900/40 transition-all duration-300",
                sitemap.isExpanded && "ring-1 ring-primary/20 bg-zinc-50/50 dark:bg-white/[0.01]"
              )}>
                {/* Header Row */}
                <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-zinc-50/30 dark:hover:bg-white/[0.01]">
                   <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={cn(
                        "h-10 w-10 flex items-center justify-center rounded-xl shrink-0",
                        sitemap.isIndex ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"
                      )}>
                        <Globe className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold truncate max-w-[300px] lg:max-w-md">{sitemap.url}</span>
                        <div className="flex items-center gap-3 mt-1">
                           <Badge variant="outline" className="text-[9px] uppercase font-bold py-0 h-4 border-zinc-200 dark:border-white/10">
                              {sitemap.isIndex ? "Index" : "XML Sitemap"}
                           </Badge>
                           {sitemap.urls.length > 0 && (
                             <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tight">
                               {sitemap.urls.length} URLs Found
                             </span>
                           )}
                           {sitemap.subSitemaps.length > 0 && (
                             <span className="text-[10px] font-black text-amber-500 uppercase tracking-tight">
                               {sitemap.subSitemaps.length} Nested Sitemaps
                             </span>
                           )}
                        </div>
                      </div>
                   </div>

                   <div className="flex items-center gap-2 ml-auto">
                      <Button variant="ghost" size="sm" onClick={() => toggleSitemap(idx)} className="rounded-lg">
                        {sitemap.loading ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : sitemap.isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-lg h-8 w-8 p-0 border-zinc-200 dark:border-white/10" asChild>
                         <a href={sitemap.url} target="_blank" rel="noreferrer"><ExternalLink className="w-3.5 h-3.5" /></a>
                      </Button>
                   </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {sitemap.isExpanded && !sitemap.loading && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-zinc-100 dark:border-white/5 overflow-hidden"
                    >
                      <div className="bg-zinc-50/50 dark:bg-white/[0.01] p-4">
                        {sitemap.isIndex ? (
                          <div className="space-y-2">
                             <p className="text-[10px] font-black uppercase text-zinc-400 mb-2 tracking-widest px-2">Nested Manifests</p>
                             {sitemap.subSitemaps.map((sub, sIdx) => (
                               <div key={sIdx} className="p-3 rounded-xl border border-zinc-100 dark:border-white/5 bg-background flex items-center justify-between">
                                 <span className="text-xs font-medium truncate flex-1">{sub}</span>
                                 <Button variant="ghost" size="sm" className="h-7 text-[10px] uppercase font-black" 
                                   onClick={() => {
                                      // Add new sitemap to list
                                      if(!sitemaps.some(s => s.url === sub)) {
                                        setSitemaps(prev => [...prev, { url: sub, isIndex: false, urls: [], subSitemaps: [], isExpanded: false }]);
                                        toast.info("Nested sitemap added to manifest list.");
                                      }
                                   }}> Crawl Sub </Button>
                               </div>
                             ))}
                          </div>
                        ) : (
                          <div className="space-y-2">
                             <div className="flex items-center justify-between px-2 mb-2">
                               <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">URL Manifest List</p>
                               <div className="flex items-center gap-2">
                                 <Button variant="link" size="sm" className="h-auto p-0 text-[10px] uppercase font-black" onClick={() => handleSelectSitemap(idx, true)}>Select All</Button>
                                 <span className="text-zinc-600">/</span>
                                 <Button variant="link" size="sm" className="h-auto p-0 text-[10px] uppercase font-black text-rose-500" onClick={() => handleSelectSitemap(idx, false)}>Deselect</Button>
                               </div>
                             </div>
                             
                             <div className="max-h-80 overflow-y-auto rounded-2xl border border-zinc-100 dark:border-white/5 bg-background shadow-inner divide-y divide-zinc-50 dark:divide-white/5">
                                {sitemap.urls.map((url, uIdx) => (
                                  <div key={uIdx} className={cn(
                                    "p-3 flex items-center gap-3 transition-colors",
                                    selectedUrls.has(url) ? "bg-primary/5" : "hover:bg-zinc-50/50 dark:hover:bg-white/[0.01]"
                                  )}>
                                    <Checkbox 
                                      checked={selectedUrls.has(url)} 
                                      onCheckedChange={() => handleSelectUrl(url)} 
                                      className="h-4 w-4 rounded-md border-zinc-300 dark:border-white/20"
                                    />
                                    <span className="text-xs font-medium truncate flex-1">{url}</span>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" title="Ping This URL" onClick={() => {
                                      setSelectedUrls(new Set([url]));
                                      toast.info("Single URL selected for pinging.");
                                    }}>
                                      <Send className="w-3 h-3" />
                                    </Button>
                                  </div>
                                ))}
                             </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            ))}
          </div>
        ) : (
           <Card className="rounded-[40px] p-20 text-center text-muted-foreground border-dashed bg-zinc-50/50 dark:bg-white/[0.02]">
            <RotateCw className="w-12 h-12 mx-auto mb-4 opacity-10" />
            <p className="text-lg font-bold">Initializing Discovery Engine</p>
            <p className="text-sm opacity-60">Scanning for sitemaps in GSC and site metadata...</p>
          </Card>
        )}
      </div>

      <SubmissionTerminal 
        logs={logs} 
        isOpen={terminalOpen} 
        onClose={() => setTerminalOpen(false)} 
      />

      {/* Backdrop for Terminal Focus */}
      {isPinging && terminalOpen && (
        <div className="fixed inset-0 bg-background/20 backdrop-blur-sm z-40 pointer-events-none" />
      )}
    </div>
  );
}
