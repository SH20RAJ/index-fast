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
    <div className="space-y-10 pb-16 max-w-5xl">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="URLs"
          description="View your site pages and submit them for indexing."
        />
      </div>

      {loading && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 animate-pulse">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground font-medium">Loading pages...</p>
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

      {payload && (
        <div className="space-y-10">
          <SummaryStats 
            inventoryTotal={payload.inventory.total}
            sitemapCount={payload.sitemapPreview.count}
            hasIndexNowKey={!!payload.website.indexNowKey}
            hasBingApiKey={!!payload.website.bingApiKey}
          />

          <section className="grid gap-8 lg:grid-cols-[1fr_350px]">
            <ManualPushCard 
              sitemapUrl={sitemapUrl}
              onSitemapUrlChange={setSitemapUrl}
              manualUrls={manualUrls}
              onManualUrlsChange={setManualUrls}
              submitting={submitting}
              onSubmit={handleSubmit}
              submitResult={submitResult}
            />

            <div className="space-y-8">
              <ExternalLinks websiteUrl={payload.website.url} />
              <HealthStats stats={payload.stats} />
            </div>
          </section>

          <UrlPulseList 
            inventoryUrls={payload.inventory.urls}
            sitemapUrls={payload.sitemapPreview.urls}
            onExport={handleExport}
          />
        </div>
      )}
    </div>
  );
}
