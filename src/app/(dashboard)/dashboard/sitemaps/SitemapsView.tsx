"use client";

import { useEffect, useState } from "react";
import { useSiteContext } from "@/components/dashboard/SiteContext";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getSitemapStatsAction } from "@/app/(dashboard)/actions";
import { Box, Link as LinkIcon, CheckCircle2, RotateCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SitemapStats {
  sitemapUrl: string | null;
  discoveredSitemaps: string[];
  totalFetched: number;
}

export default function SitemapsView() {
  const { selectedSite } = useSiteContext();
  const [stats, setStats] = useState<SitemapStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      }
      
      setLoading(false);
    }
    
    loadStats();
  }, [selectedSite]);

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
    <div className="space-y-8 pb-12 max-w-5xl">
      <PageHeader
        title="Sitemaps Tracking"
        description={`Sitemaps and crawled URLs for ${selectedSite.url.replace(/^https?:\/\//, '')}`}
      />

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="flex justify-center p-12">
          <RotateCw className="w-6 h-6 animate-spin text-zinc-400" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="rounded-[32px] overflow-hidden border-zinc-100 shadow-sm dark:border-white/5 dark:bg-zinc-900/40">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs uppercase tracking-widest font-bold">Total URLs Fetched</CardDescription>
                <CardTitle className="text-4xl tracking-tight font-light">{stats?.totalFetched || 0}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Synced from indexing timeline
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-[32px] overflow-hidden border-zinc-100 shadow-sm dark:border-white/5 dark:bg-zinc-900/40">
               <CardHeader className="pb-2">
                <CardDescription className="text-xs uppercase tracking-widest font-bold">Primary Sitemap</CardDescription>
                <CardTitle className="text-lg tracking-tight font-medium truncate mt-2">
                  {stats?.sitemapUrl || 'No sitemap assigned'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats?.sitemapUrl && (
                  <a href={stats.sitemapUrl} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                    <LinkIcon className="w-3 h-3" /> External Link
                  </a>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="pt-4">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-zinc-500">Known Sitemaps</h3>
            {stats?.discoveredSitemaps && stats.discoveredSitemaps.length > 0 ? (
               <Card className="rounded-[32px] overflow-hidden border-zinc-100 shadow-sm dark:border-white/5 dark:bg-zinc-900/40">
                <div className="divide-y divide-zinc-50 dark:divide-white/5">
                  {stats.discoveredSitemaps.map((url, i) => (
                    <div key={i} className="p-5 flex items-center justify-between hover:bg-zinc-50/50 dark:hover:bg-white/[0.02]">
                      <span className="text-sm font-medium">{url}</span>
                      <a href={url} target="_blank" rel="noreferrer" className="text-xs text-zinc-400 hover:text-zinc-600">View</a>
                    </div>
                  ))}
                </div>
              </Card>
            ) : (
               <Card className="rounded-[32px] p-8 text-center text-muted-foreground border-dashed bg-zinc-50/50 dark:bg-white/[0.02]">
                <p className="text-sm">No sitemaps discovered from GSC or manually added.</p>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
