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
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Send, 
  Download, 
  ExternalLink, 
  Loader2, 
  Globe, 
  Database, 
  History, 
  ShieldCheck, 
  Zap,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  Search,
  ListFilter
} from "lucide-react";
import Link from "next/link";
import {
  buildBingIndexNowPortalUrl,
  buildGoogleSearchConsolePropertyUrl,
} from "@/lib/utils";
import PageHeader from "@/components/dashboard/PageHeader";

type SubmitMode = "sitemap" | "urls";

interface SiteOption {
  id: string;
  url: string;
  sitemapUrl: string | null;
}

interface SiteUrlsPayload {
  website: {
    id: string;
    url: string;
    sitemapUrl: string | null;
    indexNowKey: string | null;
    bingApiKey: string | null;
    lastSyncAt: string | null;
  };
  sitemaps: {
    primary: string | null;
    discovered: string[];
    candidates: string[];
  };
  inventory: {
    total: number;
    urls: Array<{
      id: string;
      url: string;
      isIndexed: boolean | null;
      lastDetectedAt: string | null;
      lastSubmittedAt: string | null;
    }>;
  };
  recentSubmissions: Array<{
    id: string;
    engine: "indexnow" | "bing" | "google" | "pingomatic" | "pingler";
    status: "success" | "failed" | "pending";
    url: string;
    createdAt: string | null;
  }>;
  stats: Array<{
    engine: string;
    total: number;
    success: number;
    failed: number;
  }>;
  sitemapPreview: {
    count: number;
    urls: string[];
    error?: string;
  };
}

interface SubmitResponse {
  totalUrls: number;
  logs: string[];
  stats: {
    indexNow: {
      enabled: boolean;
      batches: number;
      successBatches: number;
      failedBatches: number;
      submittedUrls: number;
    };
    bing: {
      enabled: boolean;
      batches: number;
      successBatches: number;
      failedBatches: number;
      submittedUrls: number;
    };
    insertedInventoryUrls: number;
  };
}

export default function SiteUrlManagerView({ sites, initialSiteId }: SiteUrlManagerViewProps) {
  const [siteId, setSiteId] = useState<string>(initialSiteId ?? "");
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState<SiteUrlsPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [mode, setMode] = useState<SubmitMode>("sitemap");
  const [manualUrls, setManualUrls] = useState("");
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitResult, setSubmitResult] = useState<SubmitResponse | null>(null);

  // Pagination state
  const [urlsPage, setUrlsPage] = useState(1);
  const [logsPage, setLogsPage] = useState(1);
  const urlsPerPage = 25;
  const logsPerPage = 15;

  const paginatedUrls = useMemo(() => {
    if (!payload) return [];
    const allUrls: Array<{ id: string; url: string; isIndexed: boolean | null; lastDetectedAt: string | null } | string> = [
      ...(payload.inventory.urls || []),
    ];
    // Add sitemap URLs only if we need them
    if (allUrls.length < urlsPerPage) {
      const remaining = urlsPerPage - allUrls.length;
      allUrls.push(
        ...(payload.sitemapPreview.urls || []).slice(0, remaining).map((url) => url)
      );
    }
    const start = (urlsPage - 1) * urlsPerPage;
    return allUrls.slice(start, start + urlsPerPage);
  }, [payload, urlsPage]);

  const urlsTotalPages = useMemo(() => {
    if (!payload) return 0;
    const total = (payload.inventory.urls?.length ?? 0) + (payload.sitemapPreview.urls?.length ?? 0);
    return Math.ceil(total / urlsPerPage);
  }, [payload]);

  const paginatedLogs = useMemo(() => {
    if (!submitResult) return [];
    const start = (logsPage - 1) * logsPerPage;
    return submitResult.logs.slice(start, start + logsPerPage);
  }, [submitResult, logsPage]);

  const logsTotalPages = useMemo(() => {
    if (!submitResult) return 0;
    return Math.ceil(submitResult.logs.length / logsPerPage);
  }, [submitResult]);

  useEffect(() => {
    if (!siteId) {
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`/api/websites/${siteId}/urls`, { cache: "no-store" })
      .then(async (res) => {
        const data = (await res.json()) as SiteUrlsPayload | { error?: string };
        if (!res.ok) {
          throw new Error((data as { error?: string }).error || "Failed to load site URLs.");
        }
        setPayload(data as SiteUrlsPayload);
        setSitemapUrl((data as SiteUrlsPayload).sitemaps.primary ?? "");
      })
      .catch((err) => {
        setPayload(null);
        setError(err instanceof Error ? err.message : "Failed to load site URLs.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [siteId]);

  const statsMap = useMemo(() => {
    const map = new Map<string, { total: number; success: number; failed: number }>();
    payload?.stats.forEach((entry) => {
      map.set(entry.engine, entry);
    });
    return map;
  }, [payload]);

  function exportUrls(format: "csv" | "json") {
    if (!payload) return;

    const allUrls: Array<{ id: string; url: string; isIndexed: boolean | null; lastDetectedAt: string | null } | string> = [
      ...(payload.inventory.urls || []),
    ];
    allUrls.push(...(payload.sitemapPreview.urls || []));

    let content: string;
    let filename: string;

    if (format === "csv") {
      const headers = ["URL", "Status", "Last Detected"];
      const rows = allUrls.map((urlItem) => {
        const url = typeof urlItem === "object" ? urlItem.url : urlItem;
        const status = typeof urlItem === "object" ? (urlItem.isIndexed ? "Indexed" : "Not Indexed") : "Unknown";
        const lastDetected =
          typeof urlItem === "object" && urlItem.lastDetectedAt
            ? `"${new Date(urlItem.lastDetectedAt).toLocaleString()}"`
            : "N/A";
        return [
          `"${url.replace(/"/g, '""')}"`,
          status,
          lastDetected,
        ];
      });
      content = [headers, ...rows].map((row) => row.join(",")).join("\n");
      filename = `urls-${new Date().toISOString().split("T")[0]}.csv`;
    } else {
      const data = allUrls.map((urlItem) => {
        if (typeof urlItem === "object") {
          return {
            url: urlItem.url,
            isIndexed: urlItem.isIndexed,
            lastDetectedAt: urlItem.lastDetectedAt,
          };
        }
        return { url: urlItem, isIndexed: null, lastDetectedAt: null };
      });
      content = JSON.stringify(data, null, 2);
      filename = `urls-${new Date().toISOString().split("T")[0]}.json`;
    }

    const blob = new Blob([content], { type: format === "csv" ? "text/csv" : "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function exportLogs(format: "csv" | "json") {
    if (!submitResult) return;

    let content: string;
    let filename: string;

    if (format === "csv") {
      const headers = ["Log Entry"];
      const rows = submitResult.logs.map((log) => [
        `"${log.replace(/"/g, '""')}"`,
      ]);
      content = [headers, ...rows].map((row) => row.join(",")).join("\n");
      filename = `submission-logs-${new Date().toISOString().split("T")[0]}.csv`;
    } else {
      const data = { timestamp: new Date().toISOString(), logs: submitResult.logs };
      content = JSON.stringify(data, null, 2);
      filename = `submission-logs-${new Date().toISOString().split("T")[0]}.json`;
    }

    const blob = new Blob([content], { type: format === "csv" ? "text/csv" : "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function handleSubmit() {
    if (!siteId) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    setSubmitResult(null);

    try {
      const response = await fetch(`/api/websites/${siteId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          sitemapUrl: mode === "sitemap" ? sitemapUrl : undefined,
          urls: mode === "urls" ? manualUrls : undefined,
        }),
      });

      const contentType = response.headers.get("content-type");
      let data: any;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text || `Server returned ${response.status} ${response.statusText}`);
      }

      if (!response.ok) {
        throw new Error(data.error || "Submission failed.");
      }

      setSubmitResult(data as SubmitResponse);

      const refreshed = await fetch(`/api/websites/${siteId}/urls`, { cache: "no-store" });
      if (refreshed.ok) {
        const nextPayload = (await refreshed.json()) as SiteUrlsPayload;
        setPayload(nextPayload);
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sites.length === 0) {
    return (
      <div className="space-y-6 pb-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Site URLs
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-[600px]">
              Inspect sitemaps, URL inventory, and push manual submissions.
            </p>
          </div>
        </div>
        <Card className="border-dashed border-2 bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <Globe className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black tracking-tighter">No websites found</h3>
              <p className="text-sm font-medium text-muted-foreground max-w-xs mx-auto">
                Add a website first to inspect URLs and submit to IndexNow/Bing.
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
          title="URLs"
          description="Sync sitemaps and push manual indexing requests."
        />
        <div className="w-full sm:w-[280px]">
          <Select
            value={siteId}
            onChange={(val: any) => setSiteId(val as string)}
            options={sites.map((site) => ({ label: site.url, value: site.id }))}
            placeholder="Select a website"
            className="w-full h-11"
          />
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-3 p-4 rounded-3xl bg-zinc-50 dark:bg-white/5 animate-pulse">
          <Loader2 className="h-4 w-4 animate-spin text-rose-500" />
          <p className="text-xs text-zinc-500 font-light italic">Gathering digital signals...</p>
        </div>
      )}

      {payload && (
        <div className="space-y-10">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Inventory", value: payload.inventory.total },
              { label: "Sitemap", value: payload.sitemapPreview.count },
              { label: "IndexNow", value: payload.website.indexNowKey ? "Active" : "Off", color: payload.website.indexNowKey ? "text-emerald-500" : "text-zinc-400" },
              { label: "Bing API", value: payload.website.bingApiKey ? "Ready" : "Off", color: payload.website.bingApiKey ? "text-emerald-500" : "text-zinc-400" },
            ].map((stat) => (
              <div key={stat.label} className="space-y-1 px-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{stat.label}</p>
                <p className={cn("text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-100", stat.color)}>{stat.value}</p>
              </div>
            ))}
          </div>

          <section className="grid gap-8 lg:grid-cols-[1fr_350px]">
            <Card className="rounded-[32px] border-zinc-100 dark:border-white/5 bg-white dark:bg-zinc-900/40 shadow-sm overflow-hidden">
              <CardHeader className="border-b border-zinc-50 dark:border-white/5 px-8 py-6">
                <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-400">Manual Push</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <Tabs value={mode} onValueChange={(v) => setMode(v as SubmitMode)} className="w-full space-y-8">
                  <TabsList className="bg-zinc-100 dark:bg-white/5 p-1 rounded-full w-fit">
                    <TabsTrigger value="sitemap" className="rounded-full px-8 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800">Sitemap</TabsTrigger>
                    <TabsTrigger value="urls" className="rounded-full px-8 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800">Raw URLs</TabsTrigger>
                  </TabsList>

                  <TabsContent value="sitemap" className="mt-0 space-y-4 animate-in fade-in duration-500">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-1">Target Sitemap</Label>
                      <Input 
                        value={sitemapUrl} 
                        onChange={(e) => setSitemapUrl(e.target.value)} 
                        className="h-12 rounded-2xl bg-zinc-50 border-none dark:bg-white/5 px-4"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="urls" className="mt-0 space-y-4 animate-in fade-in duration-500">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-1">URL List (One per line)</Label>
                      <Textarea 
                        value={manualUrls} 
                        onChange={(e) => setManualUrls(e.target.value)} 
                        className="min-h-[200px] rounded-2xl bg-zinc-50 border-none dark:bg-white/5 p-4 resize-none"
                      />
                    </div>
                  </TabsContent>

                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-6">
                    <Button 
                      onClick={() => void handleSubmit()} 
                      disabled={submitting} 
                      className="h-14 w-full sm:w-60 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white shadow-xl shadow-zinc-900/10 font-bold uppercase tracking-widest text-xs"
                    >
                      {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                      {submitting ? "Pushing..." : "Broadcast"}
                    </Button>
                    <p className="text-[10px] text-zinc-400 italic leading-relaxed max-w-[200px]">
                      Pings are distributed in batches across global endpoints.
                    </p>
                  </div>
                </Tabs>

                {submitResult && (
                  <div className="mt-8 p-6 rounded-[24px] bg-emerald-500/5 border border-emerald-500/10 space-y-2 animate-in zoom-in-95 duration-500">
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Broadcast Finished</p>
                    <p className="text-sm text-emerald-700/80 font-light">Successfully pushed {submitResult.totalUrls} signals to the unseen stream.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-8">
              <div className="space-y-4 px-1">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">External Links</h3>
                <div className="grid gap-2">
                  <Button asChild variant="outline" className="h-12 justify-between rounded-2xl border-zinc-100 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-white/5 font-medium text-xs">
                    <a href={buildBingIndexNowPortalUrl(payload.website.url)} target="_blank" rel="noopener noreferrer">
                      Bing Portal <ExternalLink className="h-3 w-3 opacity-30" />
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="h-12 justify-between rounded-2xl border-zinc-100 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-white/5 font-medium text-xs">
                    <a href={buildGoogleSearchConsolePropertyUrl(payload.website.url)} target="_blank" rel="noopener noreferrer">
                      Google Console <ExternalLink className="h-3 w-3 opacity-30" />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="space-y-4 px-1">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Health Stats</h3>
                <div className="space-y-4">
                  {payload.stats.map((row) => (
                    <div key={row.engine} className="flex items-center justify-between">
                      <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{row.engine}</span>
                      <div className="flex gap-2">
                        <span className="text-xs font-bold text-emerald-500">{row.success}</span>
                        <span className="text-xs font-bold text-rose-500">{row.failed}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* URL List */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Inventory Pulse</h3>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => exportUrls("csv")} className="h-8 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-rose-500">CSV</Button>
                <Button size="sm" variant="ghost" onClick={() => exportUrls("json")} className="h-8 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-rose-500">JSON</Button>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900/40 rounded-[32px] border border-zinc-100 dark:border-white/5 overflow-hidden">
              <div className="divide-y divide-zinc-50 dark:divide-white/5">
                {paginatedUrls.map((urlItem, idx) => {
                  const url = typeof urlItem === "object" ? urlItem.url : urlItem;
                  const isIndexed = typeof urlItem === "object" && urlItem.isIndexed;
                  const lastDetected = typeof urlItem === "object" && urlItem.lastDetectedAt ? new Date(urlItem.lastDetectedAt).toLocaleDateString() : "Syncing...";

                  return (
                    <div key={idx} className="p-4 md:px-8 md:py-5 flex items-center justify-between hover:bg-zinc-50/50 dark:hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={cn(
                          "h-1.5 w-1.5 rounded-full shrink-0",
                          isIndexed ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" : "bg-zinc-200 dark:bg-zinc-800"
                        )} />
                        <p className="text-xs font-light text-zinc-500 truncate">{url}</p>
                      </div>
                      <span className="ml-4 shrink-0 text-[10px] font-bold text-zinc-300 tabular-nums uppercase tracking-widest">{lastDetected}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {urlsTotalPages > 1 && (
              <div className="flex justify-center pt-4 gap-2">
                <Button variant="ghost" size="sm" className="rounded-full px-4 text-xs font-bold uppercase tracking-widest" onClick={() => setUrlsPage(p => Math.max(1, p-1))} disabled={urlsPage === 1}>Prev</Button>
                <div className="flex items-center px-4 text-xs font-bold text-zinc-400">{urlsPage} / {urlsTotalPages}</div>
                <Button variant="ghost" size="sm" className="rounded-full px-4 text-xs font-bold uppercase tracking-widest" onClick={() => setUrlsPage(p => Math.min(urlsTotalPages, p+1))} disabled={urlsPage === urlsTotalPages}>Next</Button>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

interface SiteUrlManagerViewProps {
  sites: SiteOption[];
  initialSiteId: string | null;
}
