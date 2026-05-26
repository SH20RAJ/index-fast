"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Globe,
  Zap,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Send,
  RotateCcw,
  Info,
  History,
  List,
  FileJson,
  Download,
  Search,
  Plus,
  Trash2,
  Link as LinkIcon,
  Layers,
  LayoutGrid,
  ExternalLink,
} from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// ── Ping service registry ──────────────────────────────────────────
type PingGroup = {
  id: string;
  label: string;
  color: string;
  description: string;
  endpoints: string[];
};

const PING_GROUPS: PingGroup[] = [
  {
    id: "google-global",
    label: "Google Blog Search (Global)",
    color: "text-pink-500",
    description: "Primary + major regional Google blogsearch endpoints for global discovery.",
    endpoints: [
      "http://blogsearch.google.com/ping/RPC2",
      "http://blogsearch.google.co.uk/ping/RPC2",
      "http://blogsearch.google.co.in/ping/RPC2",
      "http://blogsearch.google.com.au/ping/RPC2",
      "http://blogsearch.google.com.br/ping/RPC2",
      "http://blogsearch.google.de/ping/RPC2",
      "http://blogsearch.google.fr/ping/RPC2",
      "http://blogsearch.google.co.jp/ping/RPC2",
      "http://blogsearch.google.es/ping/RPC2",
      "http://blogsearch.google.it/ping/RPC2",
      "http://blogsearch.google.ru/ping/RPC2",
      "http://blogsearch.google.nl/ping/RPC2",
      "http://blogsearch.google.pl/ping/RPC2",
      "http://blogsearch.google.com.mx/ping/RPC2",
      "http://blogsearch.google.ca/ping/RPC2",
      "http://blogsearch.google.com.ar/ping/RPC2",
      "http://blogsearch.google.com.co/ping/RPC2",
      "http://blogsearch.google.com.tr/ping/RPC2",
    ],
  },
  {
    id: "google-regional",
    label: "Google Blog Search (Extended Regional)",
    color: "text-pink-500",
    description: "Additional regional Google endpoints for extended geographic signal coverage.",
    endpoints: [
      "http://blogsearch.google.ae/ping/RPC2",
      "http://blogsearch.google.at/ping/RPC2",
      "http://blogsearch.google.be/ping/RPC2",
      "http://blogsearch.google.bg/ping/RPC2",
      "http://blogsearch.google.ch/ping/RPC2",
      "http://blogsearch.google.cl/ping/RPC2",
      "http://blogsearch.google.co.id/ping/RPC2",
      "http://blogsearch.google.co.il/ping/RPC2",
      "http://blogsearch.google.co.nz/ping/RPC2",
      "http://blogsearch.google.co.th/ping/RPC2",
      "http://blogsearch.google.co.ve/ping/RPC2",
      "http://blogsearch.google.co.za/ping/RPC2",
      "http://blogsearch.google.co.ma/ping/RPC2",
      "http://blogsearch.google.co.cr/ping/RPC2",
      "http://blogsearch.google.com.my/ping/RPC2",
      "http://blogsearch.google.com.pe/ping/RPC2",
      "http://blogsearch.google.com.sa/ping/RPC2",
      "http://blogsearch.google.com.sg/ping/RPC2",
      "http://blogsearch.google.com.tw/ping/RPC2",
      "http://blogsearch.google.com.ua/ping/RPC2",
      "http://blogsearch.google.com.uy/ping/RPC2",
      "http://blogsearch.google.com.vn/ping/RPC2",
      "http://blogsearch.google.fi/ping/RPC2",
      "http://blogsearch.google.gr/ping/RPC2",
      "http://blogsearch.google.hr/ping/RPC2",
      "http://blogsearch.google.ie/ping/RPC2",
      "http://blogsearch.google.jp/ping/RPC2",
      "http://blogsearch.google.lt/ping/RPC2",
      "http://blogsearch.google.pt/ping/RPC2",
      "http://blogsearch.google.ro/ping/RPC2",
      "http://blogsearch.google.se/ping/RPC2",
      "http://blogsearch.google.sk/ping/RPC2",
      "http://blogsearch.google.us/ping/RPC2",
    ],
  },
  {
    id: "aggregators",
    label: "Ping Aggregators",
    color: "text-pink-500",
    description: "Services like Ping-O-Matic that re-broadcast to dozens of directories on your behalf.",
    endpoints: [
      "http://pingomatic.com/",
      "http://ping.pubsub.com/ping",
      "http://xping.pubsub.com/ping",
      "http://rpc.bloggerei.de/ping/",
      "http://blogpingr.de/ping/rpc2",
    ],
  },
  {
    id: "blog-directories",
    label: "Blog Directories",
    color: "text-amber-500",
    description: "Niche blog directories and content syndication networks.",
    endpoints: [
      "http://i-learn.jp/ping/",
      "http://blogsearch.google.lk/ping/RPC2",
      "http://blogsearch.google.ws/ping/RPC2",
      "http://blogsearch.google.st/ping/RPC2",
      "http://blogsearch.google.sn/ping/RPC2",
      "http://blogsearch.google.sm/ping/RPC2",
      "http://blogsearch.google.si/ping/RPC2",
      "http://blogsearch.google.lu/ping/RPC2",
      "http://blogsearch.google.li/ping/RPC2",
    ],
  },
];

type PingResult = {
  endpoint: string;
  status: "success" | "failed" | "pending";
  resourceUrl: string;
  ms?: number;
};

type PingHistoryItem = {
  id: string;
  timestamp: number;
  url: string;
  title: string;
  successCount: number;
  totalCount: number;
};

// ── Main component ─────────────────────────────────────────────────
export default function PingView() {
  const searchParams = useSearchParams();
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [bulkUrls, setBulkUrls] = useState("");
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [activeTab, setActiveTab] = useState("single");
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(
    new Set(["google-global", "aggregators"])
  );
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(["google-global"]));
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<PingResult[]>([]);
  const [done, setDone] = useState(false);
  const [history, setHistory] = useState<PingHistoryItem[]>([]);
  const [parsingSitemap, setParsingSitemap] = useState(false);
  const [totalPingsInSession, setTotalPingsInSession] = useState(0);

  // Pre-fill URL from query params
  useEffect(() => {
    const urlParam = searchParams.get("url");
    if (urlParam) {
      setUrl(urlParam);
    }
    
    // Load history from localStorage
    const savedHistory = localStorage.getItem("ping_history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("ping_history", JSON.stringify(history.slice(0, 10)));
    }
  }, [history]);

  const endpointsToPing = useMemo(() => {
    const list: string[] = [];
    PING_GROUPS.forEach((g) => {
      if (selectedGroups.has(g.id)) list.push(...g.endpoints);
    });
    return list;
  }, [selectedGroups]);

  const successCount = results.filter((r) => r.status === "success").length;
  const failedCount = results.filter((r) => r.status === "failed").length;
  const progress = totalPingsInSession > 0 ? Math.round((results.length / totalPingsInSession) * 100) : 0;

  function toggleGroup(id: string) {
    setSelectedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleExpand(id: string) {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    setSelectedGroups(new Set(PING_GROUPS.map((g) => g.id)));
  }
  function selectNone() {
    setSelectedGroups(new Set());
  }

  async function handleSitemapParse() {
    if (!sitemapUrl.trim()) return;
    setParsingSitemap(true);
    try {
      const res = await fetch("/api/toolbox/parse-sitemap", {
        method: "POST",
        body: JSON.stringify({ url: sitemapUrl }),
      });
      const data = await res.json();
      if (data.urls) {
        setBulkUrls(data.urls.join("\n"));
        setActiveTab("bulk");
        toast.success(`Loaded ${data.urls.length} URLs from sitemap`);
      } else {
        toast.error(data.error || "Failed to parse sitemap");
      }
    } catch (e) {
      toast.error("Failed to parse sitemap");
    } finally {
      setParsingSitemap(false);
    }
  }

  async function handlePing(onlyFailed = false) {
    let resources: { url: string; title?: string }[] = [];
    
    if (activeTab === "single") {
      if (!url.trim()) return;
      resources = [{ url, title }];
    } else if (activeTab === "bulk") {
      const lines = bulkUrls.split("\n").filter(l => l.trim());
      if (lines.length === 0) return;
      resources = lines.map(line => ({ url: line.trim() }));
    }

    const endpointsToUse = onlyFailed 
      ? Array.from(new Set(results.filter(r => r.status === "failed").map(r => r.endpoint)))
      : endpointsToPing;

    if (resources.length === 0 || endpointsToUse.length === 0) {
      toast.error("Please provide at least one URL and select at least one network.");
      return;
    }

    const totalCount = resources.length * endpointsToUse.length;
    if (totalCount > 1000) {
      toast.error("Too many pings requested. Please reduce URLs or networks.");
      return;
    }

    setRunning(true);
    if (!onlyFailed) {
      setDone(false);
      setResults([]);
      setTotalPingsInSession(totalCount);
    } else {
      // If retrying, remove the failed ones from current results to avoid duplicates
      setResults(prev => prev.filter(r => r.status !== "failed"));
      // We don't change totalPingsInSession on retry so progress bar reflects total work
    }

    // Process in batches of 20 endpoints per request for real-time feedback
    const BATCH_SIZE = 20;
    const allResults: PingResult[] = onlyFailed ? [...results.filter(r => r.status !== "failed")] : [];
    
    try {
      for (const resource of resources) {
        for (let i = 0; i < endpointsToUse.length; i += BATCH_SIZE) {
          const batch = endpointsToUse.slice(i, i + BATCH_SIZE);
          
          const res = await fetch("/api/ping", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: resource.url, title: resource.title || "", endpoints: batch }),
          });

          if (!res.ok) {
            const err = await res.json().catch(() => ({ error: "Batch failed" }));
            toast.error(err.error || "A batch of pings failed");
            continue;
          }

          const data = await res.json() as { results: PingResult[] };
          allResults.push(...data.results);
          setResults([...allResults]); // Partial updates for UI
        }
      }
      
      // Save to history (only for fresh runs)
      if (!onlyFailed) {
        const newHistoryItem: PingHistoryItem = {
          id: Math.random().toString(36).substring(7),
          timestamp: Date.now(),
          url: resources[0].url + (resources.length > 1 ? ` (+${resources.length - 1} more)` : ""),
          title: resources[0].title || "Untitled",
          successCount: allResults.filter(r => r.status === "success").length,
          totalCount: allResults.length,
        };
        setHistory(prev => [newHistoryItem, ...prev]);
      }
      toast.success("Broadcast completed");
    } catch (error: any) {
      toast.error(error.message || "Ping failed");
    } finally {
      setRunning(false);
      setDone(true);
    }
  }

  function reset() {
    setResults([]);
    setDone(false);
    setUrl("");
    setTitle("");
    setBulkUrls("");
    setSitemapUrl("");
  }

  const exportResults = (format: 'csv' | 'json') => {
    if (results.length === 0) return;
    
    let content = "";
    let mimeType = "";
    let fileName = `ping-results-${new Date().toISOString().split('T')[0]}`;

    if (format === 'csv') {
      content = "Resource URL,Endpoint,Status,Latency (ms)\n" + 
        results.map(r => `"${r.resourceUrl}","${r.endpoint}","${r.status}","${r.ms || ''}"`).join("\n");
      mimeType = "text/csv";
      fileName += ".csv";
    } else {
      content = JSON.stringify(results, null, 2);
      mimeType = "application/json";
      fileName += ".json";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-10 pb-24 pt-4 max-w-6xl mx-auto px-4 md:px-0">
      <PageHeader
        title="Universal Ping"
        description="Broadcast your digital presence across 100+ global discovery networks simultaneously."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Form */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="rounded-[32px] border-zinc-100 dark:border-white/5 bg-white dark:bg-zinc-900/40 shadow-xl shadow-zinc-200/20 dark:shadow-none overflow-hidden">
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full h-16 bg-zinc-50 dark:bg-zinc-900/60 rounded-none border-b border-zinc-100 dark:border-white/5 p-1">
                  <TabsTrigger value="single" className="flex-1 h-full rounded-none data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-none font-bold uppercase tracking-widest text-[10px]">
                    <LinkIcon className="h-3.5 w-3.5 mr-2" />
                    Single URL
                  </TabsTrigger>
                  <TabsTrigger value="bulk" className="flex-1 h-full rounded-none data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-none font-bold uppercase tracking-widest text-[10px]">
                    <List className="h-3.5 w-3.5 mr-2" />
                    Bulk URLs
                  </TabsTrigger>
                  <TabsTrigger value="sitemap" className="flex-1 h-full rounded-none data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-none font-bold uppercase tracking-widest text-[10px]">
                    <Search className="h-3.5 w-3.5 mr-2" />
                    Sitemap Import
                  </TabsTrigger>
                </TabsList>

                <div className="p-8">
                  <TabsContent value="single" className="space-y-6 mt-0">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-3">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-1">Resource URL</Label>
                        <div className="relative">
                          <Input
                            value={url}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
                            placeholder="https://example.com/blog-post"
                            className="h-14 rounded-2xl bg-zinc-50 border-none dark:bg-white/5 pl-11 pr-4 font-mono text-xs focus-visible:ring-rose-500/30"
                            disabled={running}
                          />
                          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-1">Resource Title</Label>
                        <div className="relative">
                          <Input
                            value={title}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                            placeholder="My Epic Content"
                            className="h-14 rounded-2xl bg-zinc-50 border-none dark:bg-white/5 pl-11 pr-4 text-xs focus-visible:ring-rose-500/30"
                            disabled={running}
                          />
                          <Plus className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="bulk" className="space-y-6 mt-0">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-1">Enter URLs (One per line)</Label>
                      <Textarea
                        value={bulkUrls}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBulkUrls(e.target.value)}
                        placeholder="https://example.com/page-1\nhttps://example.com/page-2"
                        className="min-h-[160px] rounded-2xl bg-zinc-50 border-none dark:bg-white/5 p-4 font-mono text-xs focus-visible:ring-rose-500/30"
                        disabled={running}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="sitemap" className="space-y-6 mt-0">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-1">Sitemap URL</Label>
                      <div className="flex gap-3">
                        <div className="relative flex-1">
                          <Input
                            value={sitemapUrl}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSitemapUrl(e.target.value)}
                            placeholder="https://example.com/sitemap.xml"
                            className="h-14 rounded-2xl bg-zinc-50 border-none dark:bg-white/5 pl-11 pr-4 font-mono text-xs focus-visible:ring-rose-500/30"
                            disabled={running || parsingSitemap}
                          />
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        </div>
                        <Button 
                          onClick={handleSitemapParse}
                          disabled={!sitemapUrl || running || parsingSitemap}
                          className="h-14 px-8 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold uppercase tracking-widest text-[10px]"
                        >
                          {parsingSitemap ? <Loader2 className="h-4 w-4 animate-spin" /> : "Fetch"}
                        </Button>
                      </div>
                      <p className="text-[10px] text-zinc-400 px-1 italic">We'll extract all URLs from this sitemap and load them into the Bulk tab.</p>
                    </div>
                  </TabsContent>

                  {/* Network Presets */}
                  <div className="mt-10 space-y-6">
                    <div className="flex items-center justify-between px-1">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center">
                        <Layers className="h-3.5 w-3.5 mr-2" />
                        Network Selection — {endpointsToPing.length} Endpoints
                      </h3>
                      <div className="flex gap-4">
                        <button onClick={selectAll} className="text-[10px] font-bold text-rose-500 uppercase tracking-widest hover:underline transition-all">All</button>
                        <button onClick={() => setSelectedGroups(new Set(["google-global"]))} className="text-[10px] font-bold text-pink-500 uppercase tracking-widest hover:underline transition-all">Google Only</button>
                        <button onClick={selectNone} className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest hover:underline transition-all">None</button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {PING_GROUPS.map((group) => {
                        const isSelected = selectedGroups.has(group.id);
                        const isExpanded = expandedGroups.has(group.id);
                        return (
                          <div
                            key={group.id}
                            className={cn(
                              "rounded-2xl border transition-all relative overflow-hidden group",
                              isSelected 
                                ? "border-rose-500/20 bg-rose-500/5 dark:bg-rose-500/[0.03]" 
                                : "border-zinc-100 bg-zinc-50/50 dark:border-white/5 dark:bg-white/[0.02] hover:border-zinc-200 dark:hover:border-white/10"
                            )}
                          >
                            <div className="flex items-start gap-4 p-5">
                              <div className="pt-0.5">
                                <Checkbox
                                  id={`group-${group.id}`}
                                  checked={isSelected}
                                  onCheckedChange={() => toggleGroup(group.id)}
                                  disabled={running}
                                  className="rounded-md data-[state=checked]:bg-rose-500 data-[state=checked]:border-rose-500"
                                />
                              </div>
                              <div className="flex-1 min-w-0 pr-6">
                                <label 
                                  htmlFor={`group-${group.id}`} 
                                  className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100 cursor-pointer block group-hover:text-rose-500 transition-colors"
                                >
                                  {group.label}
                                  <Badge variant="outline" className="ml-2 py-0 h-4 text-[9px] font-mono font-normal border-zinc-200 dark:border-white/10 text-zinc-500">
                                    {group.endpoints.length}
                                  </Badge>
                                </label>
                                <p className="text-[11px] text-zinc-500 font-light mt-1.5 leading-relaxed">
                                  {group.description}
                                </p>
                              </div>
                              <button 
                                onClick={() => toggleExpand(group.id)} 
                                className="absolute right-4 top-5 text-zinc-300 hover:text-zinc-500 transition-colors"
                              >
                                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </button>
                            </div>
                            
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div 
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="px-5 pb-5 pt-0 border-t border-rose-500/10 dark:border-white/5"
                                >
                                  <div className="max-h-40 overflow-y-auto mt-4 space-y-2 scrollbar-hide">
                                    {group.endpoints.map((ep) => (
                                      <div key={ep} className="flex items-center text-[10px] font-mono text-zinc-400 group/item">
                                        <div className="w-1 h-1 rounded-full bg-zinc-300 mr-2 shrink-0" />
                                        <span className="truncate group-hover/item:text-rose-500 transition-colors">{ep}</span>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-10 flex flex-col sm:flex-row items-center gap-6">
                    <Button
                      onClick={() => handlePing(false)}
                      disabled={running || (activeTab === "single" && !url.trim()) || (activeTab === "bulk" && !bulkUrls.trim()) || selectedGroups.size === 0}
                      className="h-16 w-full sm:w-72 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white shadow-2xl shadow-rose-500/10 font-bold uppercase tracking-widest text-[11px] transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {running ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Broadcasting...
                        </>
                      ) : (
                        <>
                          <Send className="mr-3 h-4 w-4" />
                          Start Broadcast
                        </>
                      )}
                    </Button>
                    <div className="flex gap-3 w-full sm:w-auto">
                      {done && failedCount > 0 && (
                        <Button 
                          variant="outline"
                          onClick={() => handlePing(true)}
                          disabled={running}
                          className="rounded-full px-8 h-16 text-[10px] font-bold uppercase tracking-widest text-rose-500 border-rose-500/20 hover:bg-rose-50"
                        >
                          <RotateCcw className="mr-2 h-3.5 w-3.5" />
                          Retry Failed
                        </Button>
                      )}
                      {done && (
                        <Button 
                          variant="ghost" 
                          onClick={reset} 
                          className="rounded-full px-8 h-16 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-rose-500 hover:bg-rose-50/50"
                        >
                          Reset
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Stats & History */}
        <div className="lg:col-span-4 space-y-8">
          {/* Real-time Stats */}
          <Card className="rounded-[32px] border-zinc-100 dark:border-white/5 bg-zinc-900 dark:bg-zinc-900/60 shadow-xl overflow-hidden text-white">
            <CardContent className="p-8">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/50">Current Session</h3>
                  <div className="h-8 w-8 rounded-full bg-rose-500/20 flex items-center justify-center">
                    <Zap className={cn("h-4 w-4 text-rose-500", running && "animate-pulse")} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Success</p>
                    <p className="text-4xl font-light tracking-tighter text-pink-400 tabular-nums">{successCount}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Failed</p>
                    <p className="text-4xl font-light tracking-tighter text-rose-400 tabular-nums">{failedCount}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-white/40">Progress</span>
                    <span className="text-white/60">{results.length} Pings Completed</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-rose-500" 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ type: "spring", damping: 20 }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent History */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center px-4">
              <History className="h-3.5 w-3.5 mr-2" />
              Recent Broadcasts
            </h3>
            
            <div className="space-y-3">
              {history.length === 0 ? (
                <div className="p-10 rounded-[32px] border border-dashed border-zinc-200 dark:border-white/5 flex flex-col items-center justify-center text-center opacity-50">
                  <History className="h-8 w-8 mb-3 text-zinc-300" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">No History Yet</p>
                </div>
              ) : (
                history.map((item) => (
                  <div key={item.id} className="p-5 rounded-[24px] bg-white dark:bg-white/[0.02] border border-zinc-100 dark:border-white/5 shadow-sm group hover:border-rose-500/20 transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-[11px] font-bold truncate max-w-[180px] text-zinc-900 dark:text-zinc-100">{item.url}</p>
                      <span className="text-[9px] font-mono text-zinc-400">{new Date(item.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-zinc-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-pink-500/50" 
                          style={{ width: `${(item.successCount / item.totalCount) * 100}%` }} 
                        />
                      </div>
                      <span className="text-[10px] font-bold tabular-nums text-pink-500">{item.successCount}/{item.totalCount}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            {history.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setHistory([])}
                className="w-full h-10 rounded-2xl text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-rose-500"
              >
                Clear History
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Results Detail Table */}
      <AnimatePresence>
        {(results.length > 0) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-light tracking-tight text-zinc-900 dark:text-zinc-100">Broadcast Log</h3>
                <Badge variant="secondary" className="bg-zinc-100 dark:bg-white/5 text-zinc-500 border-none font-mono">
                  {results.length} total entries
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => exportResults('csv')}
                  className="rounded-xl h-10 border-zinc-100 dark:border-white/5 text-[10px] font-bold uppercase tracking-widest"
                >
                  <Download className="h-3 w-3 mr-2" />
                  CSV
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => exportResults('json')}
                  className="rounded-xl h-10 border-zinc-100 dark:border-white/5 text-[10px] font-bold uppercase tracking-widest"
                >
                  <FileJson className="h-3 w-3 mr-2" />
                  JSON
                </Button>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900/40 rounded-[32px] border border-zinc-100 dark:border-white/5 shadow-xl shadow-zinc-200/20 dark:shadow-none overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-100 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-800/20">
                      <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Resource URL</th>
                      <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Ping Endpoint</th>
                      <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Status</th>
                      <th className="p-5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">Latency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50 dark:divide-white/5">
                    {results.slice(0, 50).map((r, i) => (
                      <tr key={i} className="hover:bg-zinc-50/80 dark:hover:bg-white/[0.01] transition-colors group">
                        <td className="p-5">
                          <p className="text-[11px] font-mono text-zinc-500 truncate max-w-[240px]">{r.resourceUrl}</p>
                        </td>
                        <td className="p-5">
                          <p className="text-[11px] font-mono text-zinc-500 truncate max-w-[300px] group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{r.endpoint}</p>
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              r.status === "success" ? "bg-pink-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-rose-500"
                            )} />
                            <span className={cn(
                              "text-[10px] font-bold uppercase tracking-wider",
                              r.status === "success" ? "text-pink-500" : "text-rose-500"
                            )}>
                              {r.status}
                            </span>
                          </div>
                        </td>
                        <td className="p-5 text-right">
                          <span className="text-[10px] font-mono text-zinc-400">{r.ms ? `${r.ms}ms` : "-"}</span>
                        </td>
                      </tr>
                    ))}
                    {results.length > 50 && (
                      <tr>
                        <td colSpan={4} className="p-5 text-center text-[10px] font-bold uppercase tracking-widest text-zinc-300 italic">
                          Showing first 50 results. Download full report for complete log.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
