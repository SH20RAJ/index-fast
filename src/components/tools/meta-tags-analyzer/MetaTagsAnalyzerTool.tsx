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
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowRight,
  ShieldCheck,
  Search,
  FileText,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface AnalysisItem {
  name: string;
  value: string;
  status: "success" | "warning" | "error";
  message: string;
}

interface AnalysisResult {
  url: string;
  tags: any;
  analysis: AnalysisItem[];
  score: number;
}

export default function MetaTagsAnalyzerTool() {
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
      const res = await fetch("/api/tools/analyze-meta-tags", {
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
              Enter Page URL
            </Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Input
                  value={url}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
                                    placeholder="https://example.com"
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
                Analyze Tags
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
                {/* Score Highlight */}
                <div className="flex flex-col md:flex-row items-center gap-8 bg-primary/5 rounded-3xl p-8 border border-primary/10">
                  <div className="relative h-24 w-24 flex items-center justify-center shrink-0">
                    <svg className="h-full w-full -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-primary/10"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeDasharray={251.2}
                        strokeDashoffset={251.2 - (251.2 * result.score) / 100}
                        className="text-primary transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <span className="absolute text-2xl font-bold">{result.score}%</span>
                  </div>
                  <div className="space-y-1 text-center md:text-left">
                    <h3 className="text-xl font-bold tracking-tight">SEO Tags Health</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      We've analyzed your primary SEO tags. See the detailed breakdown below for optimization tips.
                    </p>
                  </div>
                </div>

                {/* Analysis Table */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground px-1 flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Tag Breakdown
                  </h3>
                  <div className="rounded-2xl border border-border overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-muted/80 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">
                        <tr>
                          <th className="px-6 py-4">Tag Name</th>
                          <th className="px-6 py-4">Status & Recommendation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {result.analysis.map((item, idx) => (
                          <tr key={idx} className="hover:bg-muted/30 transition-colors">
                            <td className="px-6 py-4 font-bold text-foreground">
                              {item.name}
                            </td>
                            <td className="px-6 py-4 space-y-1.5">
                              <div className="flex items-center gap-2">
                                {item.status === "success" ? (
                                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                ) : item.status === "warning" ? (
                                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                                ) : (
                                  <XCircle className="h-3.5 w-3.5 text-red-500" />
                                )}
                                <span className={cn(
                                  "text-xs font-medium",
                                  item.status === "success" ? "text-green-600" : 
                                  item.status === "warning" ? "text-amber-600" : 
                                  "text-red-600"
                                )}>
                                  {item.message}
                                </span>
                              </div>
                              <p className="text-[11px] text-muted-foreground font-mono line-clamp-1">{item.value || "N/A"}</p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
