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
import { updateWebsiteSitemapAction } from "@/app/(dashboard)/actions";
import { toast } from "sonner";

// Sub-components
import SummaryStats from "./_components/SummaryStats";
import ManualPushCard from "./_components/ManualPushCard";
import ExternalLinks from "./_components/ExternalLinks";
import HealthStats from "./_components/HealthStats";
import SitemapManager from "./_components/SitemapManager";
import ConfigEditor from "./_components/ConfigEditor";

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
    indexNowKeyLocation: string | null;
    bingApiKey: string | null;
    bingApiKeyLastFour: string | null;
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
  sources: Array<{
    id: string;
    url: string;
    type: string;
    enabled: boolean;
    lastFetchedAt: string | null;
  }>;
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
  const [savingSitemap, setSavingSitemap] = useState(false);
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

  const handleSaveSitemap = async (url: string) => {
    if (!siteId) return;
    setSavingSitemap(true);
    try {
      const formData = new FormData();
      formData.append("websiteId", siteId);
      formData.append("sitemapUrl", url);
      const res = await updateWebsiteSitemapAction({ status: "idle", message: "" }, formData);
      if (res.status === "success") {
        toast.success("Sitemap stored permanently.");
        const refreshed = await fetch(`/api/websites/${siteId}/urls`, { cache: "no-store" });
        if (refreshed.ok) setPayload(await refreshed.json());
      } else {
        toast.error(res.message || "Failed to store sitemap.");
      }
    } catch (err) {
      toast.error("Failed to store sitemap.");
    } finally {
      setSavingSitemap(false);
    }
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
      if (!response.ok) throw new Error(data.error || "Submission failed.");

      setSubmitResult(data as SubmitResponse);
      const refreshed = await fetch(`/api/websites/${siteId}/urls`, { cache: "no-store" });
      if (refreshed.ok) setPayload(await refreshed.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (sites.length === 0) {
    return (
      <div className="space-y-6 pb-16">
        <PageHeader title="Site URLs" description="Inspect sitemap URLs, URL inventory, and run manual submission workflows." />
        <Card className="border-dashed border-2 bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <Globe className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <h3 className="text-xl font-black tracking-tighter">No websites found</h3>
            <Button asChild className="font-black rounded-xl shadow-lg">
              <Link href="/sites/new">Add Website</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/40 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Property Analysis</span>
          </div>
          <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground">Site Management</h1>
          <p className="text-sm text-muted-foreground/80 mt-1 max-w-md">Manage sitemaps, configure indexing protocols, and broadcast signals to search engines.</p>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-md">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="rounded-[2rem]">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {payload && (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <SummaryStats 
            inventoryTotal={payload.inventory.total}
            sitemapCount={payload.sitemapPreview.count}
            hasIndexNowKey={!!payload.website.indexNowKey}
            hasBingApiKey={!!payload.website.bingApiKey}
          />

          <SitemapManager 
            websiteId={siteId}
            sources={payload.sources}
            onRefresh={async () => {
              const res = await fetch(`/api/websites/${siteId}/urls`, { cache: "no-store" });
              if (res.ok) setPayload(await res.json());
            }}
          />

          <ConfigEditor 
            websiteId={siteId}
            indexNowKey={payload.website.indexNowKey}
            indexNowKeyLocation={payload.website.indexNowKeyLocation}
            bingApiKeyLastFour={payload.website.bingApiKeyLastFour}
            onRefresh={async () => {
              const res = await fetch(`/api/websites/${siteId}/urls`, { cache: "no-store" });
              if (res.ok) setPayload(await res.json());
            }}
          />

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
                sitemapCandidates={payload.sitemaps.candidates}
                onSaveSitemap={handleSaveSitemap}
                savingSitemap={savingSitemap}
              />
            </div>

            <div className="space-y-8">
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
