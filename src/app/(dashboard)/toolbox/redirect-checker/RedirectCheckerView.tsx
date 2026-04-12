"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Link2,
  Search,
  ExternalLink,
  ChevronRight,
  Zap,
} from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

type ChainStep = {
  url: string;
  status: number | string;
  statusText: string;
};

export default function RedirectCheckerView() {
  const searchParams = useSearchParams();
  const [url, setUrl] = useState("");
  const [running, setRunning] = useState(false);
  const [chain, setChain] = useState<ChainStep[]>([]);
  const [done, setDone] = useState(false);

  // Pre-fill URL from query params
  useEffect(() => {
    const urlParam = searchParams.get("url");
    if (urlParam) {
      setUrl(urlParam);
    }
  }, [searchParams]);

  const handleTrace = async () => {
    if (!url.trim()) {
      toast.error("Please provide a URL to trace");
      return;
    }

    setRunning(true);
    setDone(false);
    try {
      const res = await fetch("/api/toolbox/redirect-checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error || `Server error ${res.status}`);
      }

      const data = await res.json() as { chain: ChainStep[] };
      setChain(data.chain);
      setDone(true);
      toast.success("Redirect trace completed");
    } catch (error: any) {
      toast.error(error.message || "Trace failed");
    } finally {
      setRunning(false);
    }
  };

  const reset = () => {
    setChain([]);
    setDone(false);
    setUrl("");
  };

  return (
    <div className="space-y-10 pb-24 pt-4 max-w-6xl mx-auto px-4 md:px-0">
      <PageHeader
        title="Redirect Checker"
        description="Trace HTTP redirect chains to detect loops, latency issues, and crawl budget waste."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Input */}
        <div className="lg:col-span-7 space-y-8">
          <Card className="rounded-[32px] border-zinc-100 dark:border-white/5 bg-white dark:bg-zinc-900/40 shadow-xl overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-1">Target URL</Label>
                <div className="relative">
                  <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/old-page"
                    className="h-14 rounded-2xl bg-zinc-50 border-none dark:bg-white/5 pl-11 pr-4 font-mono text-xs focus-visible:ring-rose-500/30"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-6">
                <Button
                  onClick={handleTrace}
                  disabled={running || !url.trim()}
                  className="h-16 w-full sm:w-64 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white shadow-2xl shadow-rose-500/10 font-bold uppercase tracking-widest text-[11px]"
                >
                  {running ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-3 h-4 w-4" />}
                  {running ? "Tracing..." : "Trace Redirects"}
                </Button>
                {done && (
                  <Button 
                    variant="ghost" 
                    onClick={reset} 
                    className="rounded-full px-8 h-16 text-[10px] font-bold uppercase tracking-widest text-zinc-400"
                  >
                    Reset
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <AnimatePresence>
            {done && chain.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Redirect Chain</h3>
                  <Badge variant="outline" className="font-mono text-[9px] px-3 py-1 bg-zinc-50 dark:bg-white/5 border-none">
                    {chain.length} Steps
                  </Badge>
                </div>

                <div className="space-y-4 relative pl-4 md:pl-8 before:absolute before:left-[19px] md:before:left-[35px] before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-100 dark:before:bg-white/5">
                  {chain.map((step, i) => (
                    <div key={i} className="relative flex items-start gap-4 md:gap-8">
                      <div className={cn(
                        "relative z-10 h-8 w-8 md:h-12 md:w-12 rounded-full border-4 border-white dark:border-zinc-900 flex items-center justify-center shrink-0 shadow-sm",
                        i === chain.length - 1 ? "bg-emerald-500 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                      )}>
                        {i === chain.length - 1 ? <CheckCircle2 className="h-4 w-4 md:h-6 md:w-6" /> : <span className="text-[10px] md:text-xs font-bold">{i + 1}</span>}
                      </div>
                      <div className="flex-1 bg-zinc-50/50 dark:bg-white/[0.02] border border-zinc-100 dark:border-white/5 rounded-2xl p-4 md:p-6 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className={cn(
                            "text-xs md:text-sm font-bold uppercase tracking-widest",
                            Number(step.status) >= 300 && Number(step.status) < 400 ? "text-amber-500" : 
                            Number(step.status) >= 200 && Number(step.status) < 300 ? "text-emerald-500" : "text-rose-500"
                          )}>
                            HTTP {step.status} — {step.statusText}
                          </p>
                          <a href={step.url} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-rose-500 transition-colors">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                        <p className="text-[11px] md:text-xs font-mono text-zinc-500 break-all">{step.url}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Insights */}
        <div className="lg:col-span-5 space-y-8">
          <Card className="rounded-[32px] border-zinc-100 dark:border-white/5 bg-zinc-900 dark:bg-zinc-900/60 p-8 text-white overflow-hidden relative min-h-[300px] flex flex-col justify-between">
            <div className="space-y-6 relative z-10">
              <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-rose-400" />
              </div>
              <h3 className="text-xl font-light tracking-tight">Redirect Insights</h3>
              <p className="text-sm text-white/50 leading-relaxed">
                Redirect chains can significantly increase page load time and waste crawl budget. Ideally, every redirect should be a single step to the destination.
              </p>
            </div>
            
            {done && chain.length > 0 && (
              <div className="pt-8 border-t border-white/10 space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Latency Impact</span>
                  <Badge className={cn(
                    "font-bold text-[10px] border-none px-3",
                    chain.length > 2 ? "bg-rose-500 text-white" : "bg-emerald-500 text-white"
                  )}>
                    {chain.length > 2 ? "High Risk" : "Low Impact"}
                  </Badge>
                </div>
                <p className="text-[11px] text-white/40">
                  {chain.length > 1 
                    ? `This chain has ${chain.length - 1} hops. Each hop adds roughly 100-300ms to the first-byte response time.`
                    : "No redirects detected. This is optimal for search crawlers."}
                </p>
              </div>
            )}
            
            <Zap className="absolute -right-8 -bottom-8 h-48 w-48 text-white/[0.03] -rotate-12" />
          </Card>

          <div className="space-y-4 px-4">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">SEO Best Practices</h4>
            <ul className="space-y-3">
              {[
                "Avoid redirect chains longer than 2 hops.",
                "Ensure all redirects use the permanent 301 status.",
                "Update internal links to point directly to target URLs.",
                "Avoid redirecting to broken or noindexed pages.",
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-[11px] text-zinc-500">
                  <ChevronRight className="h-3 w-3 mt-0.5 text-rose-500 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
