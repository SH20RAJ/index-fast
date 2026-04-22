"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  Loader2, 
  Link as LinkIcon,
  ArrowRight,
  ShieldCheck,
  Search,
  ExternalLink,
  BarChart3,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface LinkItem {
  href: string;
  text: string;
  isInternal: boolean;
  isNofollow: boolean;
  type: string;
}

interface AnalysisResult {
  url: string;
  links: LinkItem[];
  stats: {
    total: number;
    internal: number;
    external: number;
    nofollow: number;
  };
}

export default function WebsiteLinkAnalyzerTool() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleCheck = async () => {
    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/tools/analyze-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        throw new Error("Analysis failed");
      }

      const data = await res.json();
      setResult(data);
      toast.success("Analysis complete");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="rounded-3xl border-border bg-card/50 shadow-sm overflow-hidden">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
              Analyze Page Links
            </Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Input
                  value={url}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
                  placeholder="https://example.com/page"
                  className="h-12 rounded-xl bg-background border-border pl-11 pr-4 text-sm focus-visible:ring-primary/20"
                  disabled={loading}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleCheck()}
                />
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <Button
                onClick={handleCheck}
                disabled={loading || !url.trim()}
                className="h-12 px-8 rounded-xl font-bold uppercase tracking-widest text-[10px]"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <BarChart3 className="h-4 w-4 mr-2" />
                )}
                Analyze Links
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 pt-6 border-t border-border"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard label="Total Links" value={result.stats.total.toString()} color="primary" />
                  <StatCard label="Internal" value={result.stats.internal.toString()} color="green" />
                  <StatCard label="External" value={result.stats.external.toString()} color="amber" />
                  <StatCard label="Nofollow" value={result.stats.nofollow.toString()} color="zinc" />
                </div>

                {/* Links Table */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground px-1 flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" /> Link Breakdown
                  </h3>
                  <div className="rounded-2xl border border-border overflow-hidden bg-background/50">
                    <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
                      <table className="w-full text-left text-sm">
                        <thead className="sticky top-0 bg-muted/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">
                          <tr>
                            <th className="px-6 py-4">Anchor Text & URL</th>
                            <th className="px-6 py-4 text-right">Attributes</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {result.links.map((link, idx) => (
                            <tr key={idx} className="hover:bg-muted/30 transition-colors">
                              <td className="px-6 py-4 space-y-1">
                                <p className="font-bold text-foreground line-clamp-1">{link.text}</p>
                                <p className="text-[10px] font-mono text-muted-foreground truncate max-w-[300px]">{link.href}</p>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex flex-wrap justify-end gap-1.5">
                                  <Badge variant="outline" className={cn(
                                    "text-[9px] uppercase border-none font-bold",
                                    link.isInternal ? "bg-green-500/10 text-green-600" : "bg-amber-500/10 text-amber-600"
                                  )}>
                                    {link.type}
                                  </Badge>
                                  {link.isNofollow && (
                                    <Badge variant="outline" className="text-[9px] uppercase bg-zinc-500/10 text-zinc-600 border-none font-bold">
                                      Nofollow
                                    </Badge>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                {/* Pro CTA */}
                <div className="p-8 rounded-[2.5rem] bg-zinc-950 text-white relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,0.2),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-4 text-center md:text-left">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/70">
                        <ShieldCheck className="h-3.5 w-3.5 text-rose-500" />
                        Powered by official Google Indexing API
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-2xl font-bold tracking-tight">Automate your indexing today</h4>
                        <p className="text-sm text-zinc-400 max-w-md">
                          Stop checking manually. Join 1,000+ teams using IndexFast to get their content discovered instantly and safely.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <Button asChild size="lg" className="rounded-xl bg-white text-black hover:bg-zinc-200 font-bold px-8 h-12 w-full sm:w-auto transition-all active:scale-95 shadow-xl shadow-white/5">
                        <a href="/sign-up">
                          Start Indexing Free
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                      <p className="text-[10px] text-zinc-500 font-medium">No credit card required · Instant setup</p>
                    </div>
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

function StatCard({ label, value, color }: { label: string, value: string, color: string }) {
  const colorMap: any = {
    primary: "bg-primary/5 text-primary border-primary/10",
    green: "bg-green-500/5 text-green-600 border-green-500/10",
    amber: "bg-amber-500/5 text-amber-600 border-amber-500/10",
    zinc: "bg-zinc-500/5 text-zinc-600 border-zinc-500/10",
  };

  return (
    <div className={cn("p-4 rounded-2xl border text-center space-y-1", colorMap[color] || colorMap.primary)}>
      <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
