"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Globe,
  Monitor,
  Smartphone,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Gauge,
  ShieldCheck,
  Layout,
  Clock,
  ArrowUpRight,
  TrendingDown,
  Activity,
} from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

// ── Types ──────────────────────────────────────────────────────────
type PageSpeedResult = {
  url: string;
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  metrics: {
    firstContentfulPaint: string;
    largestContentfulPaint: string;
    cumulativeLayoutShift: string;
    totalBlockingTime: string;
    speedIndex: string;
    interactive: string;
  };
  audits: Array<{
    id: string;
    title: string;
    description: string;
    score: number;
    displayValue: string;
  }>;
};

// ── Components ─────────────────────────────────────────────────────

const ScoreRing = ({ score, label, icon: Icon }: { score: number; label: string; icon: any }) => {
  const colorClass = score >= 90 ? "text-pink-500" : score >= 50 ? "text-amber-500" : "text-rose-500";
  const bgClass = score >= 90 ? "bg-pink-500/10" : score >= 50 ? "bg-amber-500/10" : "bg-rose-500/10";

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className={cn("relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-zinc-100 dark:border-zinc-800", bgClass)}>
        <svg className="absolute h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
          <circle
            className={cn("transition-all duration-1000", colorClass)}
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            r="48"
            cx="50"
            cy="50"
            strokeDasharray={301.6}
            strokeDashoffset={301.6 - (301.6 * score) / 100}
            strokeLinecap="round"
          />
        </svg>
        <div className="flex flex-col items-center">
          <span className={cn("text-2xl font-black leading-none", colorClass)}>{Math.round(score)}</span>
        </div>
      </div>
      <div className="space-y-1">
        <p className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-500">
          <Icon className="h-3 w-3" />
          {label}
        </p>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, icon: Icon, description }: { label: string; value: string; icon: any; description: string }) => (
  <Card className="border-border/40 bg-background/50 hover:bg-background/80 transition-all group overflow-hidden">
    <CardContent className="p-4 flex items-start gap-3">
      <div className="p-2 rounded-xl bg-primary/5 text-primary group-hover:scale-110 transition-transform">
        <Icon className="h-4 w-4" />
      </div>
      <div className="space-y-1 min-w-0">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">{label}</p>
        <p className="text-lg font-black tracking-tight truncate">{value || "N/A"}</p>
        <p className="text-[10px] text-muted-foreground/60 leading-tight line-clamp-1">{description}</p>
      </div>
    </CardContent>
  </Card>
);

export default function PageSpeedView() {
  const searchParams = useSearchParams();
  const [url, setUrl] = useState("");
  const [strategy, setStrategy] = useState<"mobile" | "desktop">("mobile");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PageSpeedResult | null>(null);

  // Pre-fill URL from query params
  useEffect(() => {
    const urlParam = searchParams.get("url");
    if (urlParam) {
      setUrl(urlParam);
    }
  }, [searchParams]);

  async function handleAnalyze() {
    if (!url) return;
    setLoading(true);
    setError(null);
    setResult(null);

    // Ensure URL has protocol
    let targetUrl = url.trim();
    if (!targetUrl.startsWith("http")) {
      targetUrl = `https://${targetUrl}`;
    }

    try {
      const response = await fetch("/api/toolbox/pagespeed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl, strategy }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Failed to analyze page speed.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setUrl("");
    setStrategy("mobile");
  }

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      <PageHeader
        title="Page Performance"
        description="Decode your Core Web Vitals and performance metrics with a deep diagnostic from Google Lighthouse."
      />

      {/* Input Section */}
      <Card className="border-border/40 bg-card/30 backdrop-blur-sm shadow-xl shadow-primary/5 overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Activity className="h-32 w-32" />
        </div>
        <CardContent className="p-6 md:p-8 space-y-8 relative z-10">
          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Analysis Strategy
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setStrategy("mobile")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-bold transition-all",
                    strategy === "mobile"
                      ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                      : "bg-background border-border/40 text-muted-foreground hover:bg-muted"
                  )}
                  disabled={loading}
                >
                  <Smartphone className="h-4 w-4" /> Mobile
                </button>
                <button
                  onClick={() => setStrategy("desktop")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-bold transition-all",
                    strategy === "desktop"
                      ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                      : "bg-background border-border/40 text-muted-foreground hover:bg-muted"
                  )}
                  disabled={loading}
                >
                  <Monitor className="h-4 w-4" /> Desktop
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Enter URL to Analyze
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="pl-11 h-12 bg-background border-border/40 focus-visible:ring-primary/20 transition-all text-sm font-medium rounded-xl shadow-inner shadow-black/[0.02]"
                    disabled={loading}
                    onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                  />
                </div>
                <Button
                  onClick={handleAnalyze}
                  disabled={loading || !url.trim()}
                  className="h-12 px-8 font-black rounded-xl gap-2 shadow-lg shadow-primary/10 transition-all hover:scale-105 active:scale-95"
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</>
                  ) : (
                    <><Search className="h-4 w-4" /> Run Diagnosis</>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2 duration-300">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="font-bold">{error}</AlertDescription>
        </Alert>
      )}

      {loading && !result && (
        <Card className="border-border/40 bg-card/20 animate-pulse">
          <CardContent className="py-24 flex flex-col items-center justify-center space-y-6 text-center">
            <div className="relative h-20 w-20">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <div className="absolute inset-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Gauge className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold tracking-tight">Processing Website Audit</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Running lighthouse tests, resolving resources, and calculating performance scores...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results View */}
      {result && (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
          {/* Top Score Rings */}
          <Card className="border-border/40 bg-background/40 backdrop-blur-3xl overflow-hidden group">
            <div className="p-8 md:p-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-4 items-center">
                <ScoreRing score={result.scores.performance} label="Performance" icon={Zap} />
                <ScoreRing score={result.scores.accessibility} label="Accessibility" icon={Globe} />
                <ScoreRing score={result.scores.bestPractices} label="Best Practices" icon={ShieldCheck} />
                <ScoreRing score={result.scores.seo} label="SEO" icon={Search} />
              </div>
            </div>
            <div className="bg-muted/30 px-8 py-3 border-t border-border/20 flex items-center justify-between">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate max-w-[200px]">
                {result.url}
              </p>
              <Button variant="ghost" size="sm" onClick={reset} className="h-7 text-[10px] font-black uppercase tracking-widest gap-1.5 hover:bg-background">
                <RotateCcw className="h-3 w-3" /> New Test
              </Button>
            </div>
          </Card>

          {/* Core Metrics Grid */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 ml-1">
              <div className="h-6 w-1 bg-primary rounded-full" />
              <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Core Web Vitals</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <MetricCard 
                label="FCP" 
                value={result.metrics.firstContentfulPaint} 
                icon={Layout} 
                description="Time for first text or image to appear."
              />
              <MetricCard 
                label="LCP" 
                value={result.metrics.largestContentfulPaint} 
                icon={Zap} 
                description="Time for largest visible element to load."
              />
              <MetricCard 
                label="CLS" 
                value={result.metrics.cumulativeLayoutShift} 
                icon={Activity} 
                description="Measures unexpected layout shifts."
              />
              <MetricCard 
                label="TBT" 
                value={result.metrics.totalBlockingTime} 
                icon={ShieldCheck} 
                description="Total time tasks were blocked."
              />
              <MetricCard 
                label="Speed Index" 
                value={result.metrics.speedIndex} 
                icon={TrendingDown} 
                description="How fast visual elements appear."
              />
              <MetricCard 
                label="Interactive" 
                value={result.metrics.interactive} 
                icon={CheckCircle2} 
                description="Time for page to respond to input."
              />
            </div>
          </div>

          {/* Audit Opportunities */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 ml-1">
              <div className="h-6 w-1 bg-primary rounded-full" />
              <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Top Optimization Opportunities</h3>
            </div>
            <div className="grid gap-3">
              {result.audits.map((audit) => (
                <Card key={audit.id} className="border-border/40 bg-card/20 hover:bg-card/40 transition-colors group">
                  <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <h4 className="text-sm font-bold tracking-tight group-hover:text-primary transition-colors">{audit.title}</h4>
                      <p className="text-xs text-muted-foreground/70 leading-relaxed max-w-2xl">{audit.description}</p>
                    </div>
                    {audit.displayValue && (
                      <Badge variant="secondary" className="px-3 py-1 text-[10px] font-black bg-rose-500/10 text-rose-500 border-rose-500/20 rounded-full shrink-0">
                        {audit.displayValue}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
