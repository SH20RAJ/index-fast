"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowRight,
  Download,
  ShieldCheck,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface UrlResult {
  url: string;
  status: number;
  ok: boolean;
  loading: boolean;
}

export default function SitemapHealthCheckerTool() {
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [results, setResults] = useState<UrlResult[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const handleCheck = async () => {
    if (!sitemapUrl.trim()) {
      toast.error("Please enter a sitemap URL");
      return;
    }

    setIsExtracting(true);
    setResults([]);

    try {
      // Step 1: Extract URLs
      const extractRes = await fetch("/api/toolbox/parse-sitemap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: sitemapUrl }),
      });

      if (!extractRes.ok) {
        throw new Error("Failed to parse sitemap");
      }

      const { urls } = await extractRes.json();
      if (!urls || urls.length === 0) {
        throw new Error("No URLs found in sitemap");
      }

      const initialResults = urls.slice(0, 50).map((url: string) => ({
        url,
        status: 0,
        ok: false,
        loading: false,
      }));
      
      setResults(initialResults);
      setIsExtracting(false);
      setIsChecking(true);

      // Step 2: Check each URL (sequentially to avoid overwhelming servers/local rate limits)
      for (let i = 0; i < initialResults.length; i++) {
        setResults(prev => prev.map((r, idx) => idx === i ? { ...r, loading: true } : r));
        
        try {
          const checkRes = await fetch("/api/tools/check-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: initialResults[i].url }),
          });
          
          const data = await checkRes.json();
          setResults(prev => prev.map((r, idx) => idx === i ? { 
            ...r, 
            status: data.status, 
            ok: data.ok, 
            loading: false 
          } : r));
        } catch (err) {
          setResults(prev => prev.map((r, idx) => idx === i ? { 
            ...r, 
            status: 500, 
            ok: false, 
            loading: false 
          } : r));
        }
      }
      
      toast.success("Health check complete");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsExtracting(false);
      setIsChecking(false);
    }
  };

  const stats = {
    total: results.length,
    healthy: results.filter(r => r.status === 200).length,
    broken: results.filter(r => r.status !== 200 && r.status !== 0).length,
    pending: results.filter(r => r.status === 0).length,
  };

  return (
    <div className="space-y-8">
      <Card className="rounded-3xl border-border bg-card/50 shadow-sm overflow-hidden">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
              Enter Sitemap URL
            </Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Input
                  value={sitemapUrl}
                  onChange={(e) => setSitemapUrl(e.target.value)}
                  placeholder="https://example.com/sitemap.xml"
                  className="h-12 rounded-xl bg-background border-border pl-11 pr-4 text-sm focus-visible:ring-primary/20"
                  disabled={isExtracting || isChecking}
                />
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <Button
                onClick={handleCheck}
                disabled={isExtracting || isChecking || !sitemapUrl.trim()}
                className="h-12 px-8 rounded-xl font-bold uppercase tracking-widest text-[10px]"
              >
                {isExtracting || isChecking ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Activity className="h-4 w-4 mr-2" />
                )}
                {isExtracting ? "Extracting..." : isChecking ? "Checking..." : "Check Health"}
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 pt-6 border-t border-border"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Total</p>
                    <p className="text-xl font-bold">{stats.total}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/10 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-green-600/70 mb-1">Healthy</p>
                    <p className="text-xl font-bold text-green-600">{stats.healthy}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-red-600/70 mb-1">Broken</p>
                    <p className="text-xl font-bold text-red-600">{stats.broken}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-zinc-500/5 border border-zinc-500/10 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600/70 mb-1">Pending</p>
                    <p className="text-xl font-bold text-zinc-600">{stats.pending}</p>
                  </div>
                </div>

                {/* Results Table */}
                <div className="rounded-2xl border border-border overflow-hidden">
                  <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
                    <table className="w-full text-left text-sm">
                      <thead className="sticky top-0 bg-muted/80 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">
                        <tr>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">URL</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {results.map((result, idx) => (
                          <tr key={idx} className="hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap">
                              {result.loading ? (
                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                              ) : result.status === 0 ? (
                                <div className="h-2 w-2 rounded-full bg-zinc-200 animate-pulse" />
                              ) : result.status === 200 ? (
                                <Badge className="bg-green-500/10 text-green-600 border-none hover:bg-green-500/20">
                                  200 OK
                                </Badge>
                              ) : (
                                <Badge className="bg-red-500/10 text-red-600 border-none hover:bg-red-500/20">
                                  {result.status || "ERR"}
                                </Badge>
                              )}
                            </td>
                            <td className="px-4 py-3 truncate max-w-[300px] font-mono text-[11px] text-muted-foreground">
                              {result.url}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pro CTA */}
                <div className="p-6 rounded-[2rem] bg-zinc-950 text-white relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                      <h4 className="text-lg font-bold tracking-tight">Automate your sitemap checks</h4>
                      <p className="text-sm text-zinc-400 max-w-md">
                        IndexFast monitors your sitemap daily and pings search engines automatically when content changes.
                      </p>
                    </div>
                    <Button asChild className="rounded-xl bg-white text-black hover:bg-zinc-200 font-bold px-6">
                      <a href="/sign-up">
                        Get Started Free
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
