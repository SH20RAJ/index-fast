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
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
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
    <div className="space-y-8 pb-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Site URLs
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-[600px]">
            List sitemap URLs, inspect inventory, and manually submit sitemap or URL lists.
          </p>
        </div>
        <div className="w-full sm:w-[320px]">
          <Select value={siteId} onValueChange={setSiteId}>
            <SelectTrigger className="h-10 rounded-md border-border bg-background">
              <SelectValue placeholder="Select a website" />
            </SelectTrigger>
            <SelectContent>
              {sites.map((site) => (
                <SelectItem key={site.id} value={site.id}>
                  {site.url}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-bold">Error</AlertTitle>
          <AlertDescription className="font-medium">{error}</AlertDescription>
        </Alert>
      )}

      {loading && (
        <div className="flex items-center gap-3 rounded-md border border-border bg-muted/30 p-3">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground">
            Syncing site data...
          </p>
        </div>
      )}

      {payload && (
        <>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="h-8 px-4 text-[10px] uppercase tracking-wide">
                    Inventory: {payload.inventory.total}
                  </Badge>
                  <Badge 
                    variant={payload.sitemapPreview.count > 0 ? "default" : "secondary"} 
                    className={cn(
                      "h-8 px-4 text-[10px] uppercase tracking-wide",
                      payload.sitemapPreview.count > 0 && "bg-primary text-primary-foreground"
                    )}
                  >
                    Sitemap URLs: {payload.sitemapPreview.count}
                  </Badge>
                  <Badge 
                    variant={payload.website.indexNowKey ? "default" : "secondary"} 
                    className={cn(
                      "h-8 px-4 text-[10px] uppercase tracking-wide",
                      payload.website.indexNowKey ? "bg-emerald-500/15 text-emerald-500" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {payload.website.indexNowKey ? "IndexNow Active" : "No IndexNow Key"}
                  </Badge>
                  <Badge 
                    variant={payload.website.bingApiKey ? "default" : "secondary"} 
                    className={cn(
                      "h-8 px-4 text-[10px] uppercase tracking-wide",
                      payload.website.bingApiKey ? "bg-emerald-500/15 text-emerald-500" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {payload.website.bingApiKey ? "Bing API Set" : "No Bing Key"}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="outline" className="h-9 rounded-md text-[11px]">
                    <a href={buildBingIndexNowPortalUrl(payload.website.url)} target="_blank" rel="noopener noreferrer">
                      Bing IndexNow <ExternalLink className="ml-1.5 h-3 w-3 opacity-50" />
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="h-9 rounded-md text-[11px]">
                    <a href={buildGoogleSearchConsolePropertyUrl(payload.website.url)} target="_blank" rel="noopener noreferrer">
                      Search Console <ExternalLink className="ml-1.5 h-3 w-3 opacity-50" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-6 pb-0">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted/50 text-muted-foreground">
                <Send className="h-6 w-6 stroke-[1.5px]" />
              </div>
              <CardTitle className="text-xl font-semibold tracking-tight">Manual Submission</CardTitle>
              <CardDescription>
                Push instantaneous indexing requests to search engines via sitemap or individual URLs.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Tabs value={mode} onValueChange={(v) => setMode(v as SubmitMode)} className="w-full space-y-6">
                <TabsList className="grid h-10 w-full grid-cols-2 rounded-md bg-muted p-1 sm:w-fit">
                  <TabsTrigger value="sitemap" className="rounded-sm px-8">
                    Sitemap
                  </TabsTrigger>
                  <TabsTrigger value="urls" className="rounded-sm px-8">
                    URL List
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="sitemap" className="space-y-4 focus-visible:outline-none">
                  <div className="space-y-2">
                    <label className="ml-1 text-xs text-muted-foreground">Sitemap target</label>
                    <Input 
                      value={sitemapUrl} 
                      onChange={(e) => setSitemapUrl(e.target.value)} 
                      placeholder="https://example.com/sitemap.xml" 
                      className="h-10 rounded-md"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="urls" className="space-y-4 focus-visible:outline-none">
                  <div className="space-y-2">
                    <label className="ml-1 text-xs text-muted-foreground">Individual URLs (one per line)</label>
                    <Textarea 
                      value={manualUrls} 
                      onChange={(e) => setManualUrls(e.target.value)} 
                      placeholder="https://example.com/page-1" 
                      className="min-h-[160px] resize-none rounded-md p-3"
                    />
                  </div>
                </TabsContent>

                <div className="flex flex-col items-center gap-4 border-t border-border pt-4 sm:flex-row">
                  <Button 
                    onClick={() => void handleSubmit()} 
                    disabled={submitting} 
                    className="h-10 w-full gap-2 rounded-md px-6 sm:w-fit"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {submitting ? "Pushing Batches..." : "Start Submission"}
                  </Button>
                  <p className="max-w-sm text-xs text-muted-foreground">
                    IndexNow runs in safe batches (1000 URLs) and Bing uses batch endpoint limits automatically.
                  </p>
                </div>
              </Tabs>

              {submitError && (
                <Alert variant="destructive" className="mt-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle className="font-bold">Submission Failed</AlertTitle>
                  <AlertDescription className="font-medium">{submitError}</AlertDescription>
                </Alert>
              )}

              {submitResult && (
                <Alert variant="default" className="mt-6 border-emerald-500/50 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <AlertTitle className="font-bold">Submission Finished</AlertTitle>
                  <AlertDescription className="font-medium">
                    Submitted {submitResult.totalUrls} URL(s). 
                    IndexNow: {submitResult.stats.indexNow.successBatches}/{submitResult.stats.indexNow.batches} Batches Pass. 
                    Bing: {submitResult.stats.bing.successBatches}/{submitResult.stats.bing.batches} Batches Pass.
                  </AlertDescription>
                </Alert>
              )}

              {submitResult && (
                <div className="mt-8 overflow-hidden rounded-lg border border-border bg-muted/20">
                  <div className="flex items-center justify-between border-b border-border bg-muted/40 p-4">
                    <h5 className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      <FileText className="h-4 w-4" /> 
                      Submission Logs ({submitResult.logs.length})
                    </h5>
                    <div className="flex gap-1.5">
                      <Button size="icon" variant="ghost" onClick={() => exportLogs("csv")} className="h-7 w-7 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-500">
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => exportLogs("json")} className="h-7 w-7 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-500">
                        <Database className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="max-h-[320px] space-y-1 overflow-y-auto p-6 font-mono text-[11px] leading-relaxed">
                    {paginatedLogs.map((entry, i) => (
                      <p key={i} className="border-b border-border/20 py-0.5 text-muted-foreground last:border-0">
                        {entry}
                      </p>
                    ))}
                    {logsTotalPages > 1 && (
                      <div className="pt-6 flex justify-center items-center gap-2">
                        <Button size="icon" variant="outline" disabled={logsPage === 1} onClick={() => setLogsPage(p => p - 1)} className="h-8 w-8 rounded-xl border-border/40">
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="mx-4 text-[10px] uppercase tracking-wide text-muted-foreground">
                          Page {logsPage} / {logsTotalPages}
                        </span>
                        <Button size="icon" variant="outline" disabled={logsPage === logsTotalPages} onClick={() => setLogsPage(p => p + 1)} className="h-8 w-8 rounded-xl border-border/40">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader className="p-6 pb-3">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-md border border-border bg-muted/50 text-muted-foreground">
                  <ListFilter className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg font-semibold tracking-tight">Sitemap Candidates</CardTitle>
                <CardDescription className="text-xs">Auto-discovered and provided sitemap paths.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6 pt-2">
                {payload.sitemaps.candidates.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No sitemap candidates available.</p>
                ) : (
                  <div className="space-y-2">
                    {payload.sitemaps.candidates.map((entry) => (
                      <div key={entry} className="break-all rounded-md border border-border bg-muted/30 p-3 font-mono text-[11px] text-muted-foreground">
                        {entry}
                      </div>
                    ))}
                  </div>
                )}
                {payload.sitemapPreview.error && (
                  <Alert variant="default" className="border-amber-500/20 bg-amber-500/5 text-amber-600 py-3">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-[11px] font-bold">
                      {payload.sitemapPreview.error}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-6 pb-3">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-md border border-border bg-muted/50 text-muted-foreground">
                  <History className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg font-semibold tracking-tight">Submission Stats</CardTitle>
                <CardDescription className="text-xs">Historical performance across indexing engines.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-6 pt-2">
                {payload.stats.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No submission history yet.</p>
                ) : (
                  <div className="space-y-4">
                    {payload.stats.map((row) => (
                      <div key={row.engine} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "h-1.5 w-1.5 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]",
                            row.success > 0 ? "bg-emerald-500" : "bg-muted-foreground/30"
                          )} />
                          <span className="text-xs font-medium uppercase tracking-wide">{row.engine}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-emerald-500">{row.success}</span>
                          <span className="text-[11px] text-muted-foreground">/</span>
                          <span className="text-[11px] font-semibold text-red-500/70">{row.failed}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Separator className="bg-border/20" />
                <div className="flex items-center justify-between">
                   <span className="text-[10px] uppercase tracking-wide text-muted-foreground">IndexNow Context</span>
                   <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    {statsMap.get("indexnow")?.total ?? 0} Records
                   </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-col justify-between gap-4 p-6 pb-3 md:flex-row md:items-end">
              <div className="space-y-2">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-md border border-border bg-muted/50 text-muted-foreground">
                  <Database className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg font-semibold tracking-tight">
                  URLs & Inventory 
                  <span className="ml-2 text-muted-foreground">
                    ({(payload?.inventory.urls?.length ?? 0) + (payload?.sitemapPreview.urls?.length ?? 0)})
                  </span>
                </CardTitle>
                <CardDescription className="text-xs">Full repository of discovered and indexed URLs.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => exportUrls("csv")} className="h-9 gap-2 rounded-md px-3 text-[11px]">
                  <Download className="h-3 w-3" /> Export CSV
                </Button>
                <Button size="sm" variant="outline" onClick={() => exportUrls("json")} className="h-9 gap-2 rounded-md px-3 text-[11px]">
                  <Database className="h-3 w-3" /> Export JSON
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-2">
              <Separator className="mb-6 bg-border/40" />
              {payload?.inventory.urls?.length === 0 && payload.sitemapPreview.urls?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
                  <Search className="h-8 w-8 mb-4 stroke-1" />
                  <p className="text-xs font-black uppercase tracking-widest">Repository empty</p>
                  <p className="text-[10px] font-bold">Run sync or submit from sitemap to populate results.</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="mb-4 hidden grid-cols-12 gap-4 px-3 md:grid">
                    <div className="col-span-8 text-[10px] uppercase tracking-wide text-muted-foreground">Resource URL</div>
                    <div className="col-span-4 text-right text-[10px] uppercase tracking-wide text-muted-foreground">Last Detected</div>
                  </div>
                  {paginatedUrls.map((urlItem, idx) => {
                    const url = typeof urlItem === "object" ? urlItem.url : urlItem;
                    const urlId = typeof urlItem === "object" ? urlItem.id : url;
                    const lastDetected =
                      typeof urlItem === "object" && urlItem.lastDetectedAt
                        ? new Date(urlItem.lastDetectedAt).toLocaleString()
                        : "Unknown";
                    const isIndexed = typeof urlItem === "object" && urlItem.isIndexed;

                    return (
                      <div key={`${urlId}-${idx}`} className="group grid grid-cols-1 items-center gap-4 rounded-md border border-transparent p-3 transition-colors hover:border-border hover:bg-muted/20 md:grid-cols-12">
                        <div className="md:col-span-8 flex items-center gap-3">
                          <div className={cn(
                            "h-1.5 w-1.5 rounded-full shrink-0",
                            isIndexed ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-muted-foreground/20"
                          )} />
                          <span className="max-w-full truncate font-mono text-xs">
                            {url}
                            <ExternalLink className="inline-block ml-2 h-3 w-3 opacity-0 group-hover:opacity-30 transition-opacity cursor-pointer hover:opacity-100" />
                          </span>
                        </div>
                        <div className="md:col-span-4 text-left md:text-right">
                          <span className="text-[11px] text-muted-foreground tabular-nums">
                            {lastDetected}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  
                  {urlsTotalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-8">
                       <Button size="icon" variant="outline" disabled={urlsPage === 1} onClick={() => setUrlsPage(p => p - 1)} className="h-10 w-10 rounded-2xl border-border/40">
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="flex flex-col items-center mx-6">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-1">Index Page</span>
                        <span className="text-xs font-black tabular-nums">
                          {urlsPage} <span className="text-muted-foreground/30 font-medium">of</span> {urlsTotalPages}
                        </span>
                      </div>
                      <Button size="icon" variant="outline" disabled={urlsPage === urlsTotalPages} onClick={() => setUrlsPage(p => p + 1)} className="h-10 w-10 rounded-2xl border-border/40">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

interface SiteUrlManagerViewProps {
  sites: SiteOption[];
  initialSiteId: string | null;
}
