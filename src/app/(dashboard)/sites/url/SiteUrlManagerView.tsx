"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from "@/components/ui/alert";
import { 
  Loader2, 
  Globe, 
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import PageHeader from "@/components/dashboard/PageHeader";
import { useSiteContext } from "@/components/dashboard/SiteContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

// Sub-components
import SummaryStats from "./_components/SummaryStats";
import ManualPushCard from "./_components/ManualPushCard";
import ExternalLinks from "./_components/ExternalLinks";
import HealthStats from "./_components/HealthStats";
import UrlPulseList from "./_components/UrlPulseList";

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

interface SiteUrlManagerViewProps {
  sites: SiteOption[];
  initialSiteId: string | null;
}

export default function SiteUrlManagerView({ sites, initialSiteId }: SiteUrlManagerViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedSite } = useSiteContext();
  const [siteId, setSiteId] = useState<string>(selectedSite?.id || initialSiteId || "");
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState<SiteUrlsPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [manualUrls, setManualUrls] = useState("");
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<SubmitResponse | null>(null);

  useEffect(() => {
    if (selectedSite?.id && selectedSite.id !== siteId) {
      setSiteId(selectedSite.id);
    }
  }, [selectedSite, siteId]);

  useEffect(() => {
    if (!siteId) return;

    const fetchSiteData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/websites/${siteId}/urls`, { cache: "no-store" });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load site URLs.");
        }

        setPayload(data as SiteUrlsPayload);
        setSitemapUrl(data.sitemaps.primary ?? "");
      } catch (err) {
        setPayload(null);
        setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchSiteData();
  }, [siteId]);

  const handleSiteChange = (newId: string) => {
    if (!newId) return;
    setSiteId(newId);
    
    const params = new URLSearchParams(searchParams.toString());
    params.set("siteId", newId);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleSubmit = async (mode: SubmitMode) => {
    if (!siteId) return;

    setSubmitting(true);
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Submission failed.");
      }

      setSubmitResult(data as SubmitResponse);

      // Refresh payload to show updated inventory/stats
      const refreshed = await fetch(`/api/websites/${siteId}/urls`, { cache: "no-store" });
      if (refreshed.ok) {
        const nextPayload = await refreshed.json();
        setPayload(nextPayload);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleExport = (format: "csv" | "json") => {
    if (!payload) return;

    const allUrls = [
      ...(payload.inventory.urls || []),
      ...(payload.sitemapPreview.urls || []).map(url => ({ url, isIndexed: null, lastDetectedAt: null }))
    ];

    let content: string;
    let filename: string;

    if (format === "csv") {
      const headers = ["URL", "Status", "Last Detected"];
      const rows = allUrls.map((u) => {
        const url = typeof u === "string" ? u : u.url;
        const status = typeof u === "object" && u.isIndexed !== null ? (u.isIndexed ? "Indexed" : "Not Indexed") : "Unknown";
        const lastDetected = typeof u === "object" && u.lastDetectedAt ? new Date(u.lastDetectedAt).toLocaleString() : "N/A";
        return [`"${url.replace(/"/g, '""')}"`, status, `"${lastDetected}"`];
      });
      content = [headers, ...rows].map((row) => row.join(",")).join("\n");
      filename = `urls-${new Date().toISOString().split("T")[0]}.csv`;
    } else {
      content = JSON.stringify(allUrls, null, 2);
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
  };

  if (sites.length === 0) {
    return (
      <div className="space-y-6 pb-16">
        <PageHeader 
          title="Site URLs" 
          description="Inspect sitemaps, URL inventory, and push manual submissions." 
        />
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
    <div className="space-y-12 pb-20 max-w-6xl mx-auto">
      {/* Header & Site Selector */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/40 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Live Property View</span>
          </div>
          <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground">Site Intelligence</h1>
          <p className="text-sm text-muted-foreground/80 mt-1 max-w-md">Analyze discovered URLs and manage indexing signal distribution across global search networks.</p>
        </div>
        
        <div className="flex flex-col gap-2 min-w-[240px]">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-1">Selected Website</label>
          <Select 
            value={siteId} 
            onValueChange={handleSiteChange}
            placeholder="Select a property..."
            options={sites.map(s => ({ 
              label: new URL(s.url).hostname, 
              value: s.id 
            }))}
          />
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/20 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-card p-8 rounded-[2.5rem] shadow-2xl border border-border/40 flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground animate-pulse">Synchronizing Data...</p>
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

      {payload && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {/* Top Row: Summary Stats */}
          <SummaryStats 
            inventoryTotal={payload.inventory.total}
            sitemapCount={payload.sitemapPreview.count}
            hasIndexNowKey={!!payload.website.indexNowKey}
            hasBingApiKey={!!payload.website.bingApiKey}
          />

          {/* Main Workspace: Manual Actions & Secondary Data */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
            <div className="space-y-8">
              <ManualPushCard 
                sitemapUrl={sitemapUrl}
                onSitemapUrlChange={setSitemapUrl}
                manualUrls={manualUrls}
                onManualUrlsChange={setManualUrls}
                submitting={submitting}
                onSubmit={handleSubmit}
                submitResult={submitResult}
              />
              
              {/* URL Pulse List moved into the main area for better prominence */}
              <UrlPulseList 
                inventoryUrls={payload.inventory.urls}
                sitemapUrls={payload.sitemapPreview.urls}
                onExport={handleExport}
              />
            </div>

            <div className="space-y-8">
              {/* Sidebar Content */}
              <div className="p-8 rounded-[2.5rem] bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-xl shadow-zinc-900/10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Property Meta</span>
                </div>
                <h3 className="text-xl font-serif font-bold tracking-tight mb-4">Quick Insights</h3>
                <div className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Primary Origin</p>
                    <p className="text-sm font-medium truncate">{payload.website.url}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Last Intelligence Sync</p>
                    <p className="text-sm font-medium">{payload.website.lastSyncAt ? new Date(payload.website.lastSyncAt).toLocaleString() : 'Pending first sync'}</p>
                  </div>
                  <Button asChild variant="outline" className="w-full h-12 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white dark:border-zinc-950/10 dark:bg-zinc-950/5 dark:hover:bg-zinc-950/10 dark:text-zinc-950 font-bold uppercase tracking-widest text-[10px] mt-4">
                    <Link href={`/sites/jobs?siteId=${siteId}`}>Configure Automation</Link>
                  </Button>
                </div>
              </div>

              <HealthStats stats={payload.stats} />
              <ExternalLinks websiteUrl={payload.website.url} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
