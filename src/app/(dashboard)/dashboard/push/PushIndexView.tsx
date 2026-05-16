"use client";

import { useState } from "react";
import { Loader2, Send, CheckCircle2, Globe, Zap, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Site {
  id: string;
  url: string;
  sitemapUrl: string | null;
  indexNowKey: string | null;
  bingApiKey: string | null;
}

interface PushResult {
  totalUrls?: number;
  stats?: {
    indexNow?: { enabled: boolean; submittedUrls: number; successBatches: number; failedBatches: number };
    bing?: { enabled: boolean; submittedUrls: number; successBatches: number; failedBatches: number };
  };
}

export default function PushIndexView({ sites }: { sites: Site[] }) {
  const [selectedSiteId, setSelectedSiteId] = useState(sites[0]?.id || "");
  const [urls, setUrls] = useState("");
  const [engines, setEngines] = useState<{ indexNow: boolean; bing: boolean }>({
    indexNow: true,
    bing: true,
  });
  const [pushing, setPushing] = useState(false);
  const [result, setResult] = useState<PushResult | null>(null);

  const selectedSite = sites.find((s) => s.id === selectedSiteId);

  const toggleEngine = (engine: "indexNow" | "bing") => {
    setEngines((prev) => ({ ...prev, [engine]: !prev[engine] }));
  };

  const handlePush = async () => {
    if (!selectedSiteId) {
      toast.error("Select a website first.");
      return;
    }
    if (!engines.indexNow && !engines.bing) {
      toast.error("Select at least one engine.");
      return;
    }

    const urlList = urls
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    if (urlList.length === 0) {
      toast.error("Enter at least one URL.");
      return;
    }

    setPushing(true);
    setResult(null);

    try {
      const res = await fetch(`/api/websites/${selectedSiteId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "urls",
          urls: urlList.join("\n"),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Push failed.");

      setResult(data);
      toast.success(`Pushed ${data.totalUrls || urlList.length} URL(s) to search engines.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Push failed.");
    } finally {
      setPushing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto pb-20">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
            Indexing Signal
          </span>
        </div>
        <h1 className="text-3xl font-serif font-bold tracking-tight">Push Indexing</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Send indexing signals to multiple search engines at once.
        </p>
      </div>

      {/* Website Selector */}
      <div className="space-y-2">
        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
          Select Website
        </Label>
        <div className="grid gap-2">
          {sites.map((site) => (
            <button
              key={site.id}
              onClick={() => setSelectedSiteId(site.id)}
              className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${
                selectedSiteId === site.id
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border/50 bg-card hover:border-primary/20"
              }`}
            >
              <div
                className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                  selectedSiteId === site.id
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Globe className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold truncate">
                  {site.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  {site.indexNowKey && (
                    <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 rounded-full">
                      IndexNow
                    </Badge>
                  )}
                  {site.bingApiKey && (
                    <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 rounded-full">
                      Bing
                    </Badge>
                  )}
                </div>
              </div>
              {selectedSiteId === site.id && (
                <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                  <CheckCircle2 className="h-3 w-3 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Engine Selection */}
      <div className="space-y-3">
        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
          Select Engines
        </Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => toggleEngine("indexNow")}
            disabled={!selectedSite?.indexNowKey}
            className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
              engines.indexNow
                ? "border-emerald-500 bg-emerald-500/5"
                : "border-border/50 bg-card hover:border-emerald-500/30"
            } ${!selectedSite?.indexNowKey ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            <div
              className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                engines.indexNow ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"
              }`}
            >
              <Zap className="h-4 w-4" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold">IndexNow</p>
              <p className="text-[10px] text-muted-foreground">Instant signal</p>
            </div>
            {!selectedSite?.indexNowKey && (
              <span className="text-[9px] text-muted-foreground ml-auto">No key</span>
            )}
          </button>

          <button
            onClick={() => toggleEngine("bing")}
            disabled={!selectedSite?.bingApiKey}
            className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
              engines.bing
                ? "border-blue-500 bg-blue-500/5"
                : "border-border/50 bg-card hover:border-blue-500/30"
            } ${!selectedSite?.bingApiKey ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            <div
              className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                engines.bing ? "bg-blue-500/10 text-blue-600" : "bg-muted text-muted-foreground"
              }`}
            >
              <Globe className="h-4 w-4" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold">Bing</p>
              <p className="text-[10px] text-muted-foreground">Webmaster API</p>
            </div>
            {!selectedSite?.bingApiKey && (
              <span className="text-[9px] text-muted-foreground ml-auto">No key</span>
            )}
          </button>
        </div>
      </div>

      {/* URL Input */}
      <div className="space-y-2">
        <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
          URLs to Index
        </Label>
        <Textarea
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          placeholder="https://example.com/page-1&#10;https://example.com/page-2&#10;https://example.com/page-3"
          className="min-h-[180px] rounded-2xl bg-card border-border/50 p-4 resize-none text-sm font-medium focus-visible:ring-1 focus-visible:ring-primary/20"
        />
        <p className="text-[10px] text-muted-foreground/60 px-1">
          One URL per line. Paste your sitemap URLs or enter specific pages.
        </p>
      </div>

      {/* Push Button */}
      <div className="flex items-center gap-4">
        <Button
          onClick={handlePush}
          disabled={pushing || (!engines.indexNow && !engines.bing)}
          className="h-12 px-10 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:opacity-90 font-bold uppercase tracking-widest text-[10px] shadow-lg"
        >
          {pushing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          {pushing ? "Sending Signals..." : "Index Now"}
        </Button>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
            Real-time distribution
          </p>
        </div>
      </div>

      {/* Result */}
      {result && (
        <Card className="rounded-2xl border-emerald-500/20 bg-emerald-500/5">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <p className="text-sm font-bold text-emerald-700">Signals Sent — {result.totalUrls} URL(s)</p>
            </div>
            {result.stats?.indexNow?.enabled && (
              <p className="text-xs text-emerald-700/80">
                IndexNow: {result.stats.indexNow.submittedUrls} URL(s) submitted
                {result.stats.indexNow.failedBatches > 0 && ` (${result.stats.indexNow.failedBatches} batch failed)`}
              </p>
            )}
            {result.stats?.bing?.enabled && (
              <p className="text-xs text-emerald-700/80">
                Bing: {result.stats.bing.submittedUrls} URL(s) submitted
                {result.stats.bing.failedBatches > 0 && ` (${result.stats.bing.failedBatches} batch failed)`}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Info */}
      {!selectedSite?.indexNowKey && !selectedSite?.bingApiKey && selectedSite && (
        <Card className="rounded-2xl border-amber-500/20 bg-amber-500/5">
          <CardContent className="p-5 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-amber-700">No API Keys Configured</p>
              <p className="text-xs text-amber-700/80 mt-1">
                Go to <a href={`/sites/${selectedSiteId}`} className="underline font-medium">Site Settings</a> to add your IndexNow key or Bing Webmaster API key.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
