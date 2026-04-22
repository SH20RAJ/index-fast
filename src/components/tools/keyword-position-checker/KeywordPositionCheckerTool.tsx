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
  Target,
  ArrowRight,
  ShieldCheck,
  Search,
  Trophy,
  BarChart3,
  TrendingUp,
  MapPin
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface PositionResult {
  keyword: string;
  domain: string;
  position: number | string;
  topResults: string[];
}

export default function KeywordPositionCheckerTool() {
  const [url, setUrl] = useState("");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PositionResult | null>(null);

  const handleCheck = async () => {
    if (!url.trim() || !keyword.trim()) {
      toast.error("Please enter both domain and keyword");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/tools/check-keyword-position", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, keyword }),
      });

      if (!res.ok) {
        throw new Error("Position check failed");
      }

      const data = await res.json();
      setResult(data);
      toast.success("Position check complete");
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
                Your Domain
              </Label>
              <div className="relative">
                <Input
                  value={url}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
                  placeholder="example.com"
                  className="h-12 rounded-xl bg-background border-border pl-11 pr-4 text-sm focus-visible:ring-primary/20"
                  disabled={loading}
                />
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
                Target Keyword
              </Label>
              <div className="relative">
                <Input
                  value={keyword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)}
                  placeholder="e.g. best seo tools"
                  className="h-12 rounded-xl bg-background border-border pl-11 pr-4 text-sm focus-visible:ring-primary/20"
                  disabled={loading}
                />
                <Target className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          <Button
            onClick={handleCheck}
            disabled={loading || !url.trim() || !keyword.trim()}
            className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-[10px]"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Check Ranking
          </Button>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 pt-6 border-t border-border"
              >
                {/* Ranking Highlight */}
                <div className={cn(
                  "flex flex-col md:flex-row items-center gap-8 rounded-3xl p-8 border transition-colors",
                  typeof result.position === 'number' && result.position <= 10 ? "bg-green-500/5 border-green-500/10" : "bg-primary/5 border-primary/10"
                )}>
                  <div className={cn(
                    "h-20 w-20 rounded-full flex items-center justify-center shrink-0 shadow-lg",
                    typeof result.position === 'number' && result.position <= 10 ? "bg-green-500 text-white" : "bg-primary text-white"
                  )}>
                    <Trophy className="h-10 w-10" />
                  </div>
                  <div className="space-y-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold tracking-tight">Rank: #{result.position}</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Your current position in Google search results for <span className="text-primary font-bold italic">"{result.keyword}"</span>.
                    </p>
                  </div>
                </div>

                {/* Top Competitors */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground px-1 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" /> Top Competitors Found
                  </h3>
                  <div className="rounded-2xl border border-border overflow-hidden bg-background/50">
                    <div className="divide-y divide-border">
                      {result.topResults.map((link, idx) => (
                        <div key={idx} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-[10px] font-bold text-muted-foreground w-4">#{idx+1}</span>
                            <p className="text-xs font-mono text-muted-foreground truncate max-w-[400px]">{link}</p>
                          </div>
                          <Badge variant="outline" className="text-[9px] uppercase border-none bg-muted/50 font-bold">Live</Badge>
                        </div>
                      ))}
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
