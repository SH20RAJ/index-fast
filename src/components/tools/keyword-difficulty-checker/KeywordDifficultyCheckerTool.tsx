"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Search, 
  BarChart3,
  ArrowRight,
  ShieldCheck,
  Target,
  Flame,
  AlertTriangle,
  TrendingUp,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface DifficultyResult {
  keyword: string;
  difficulty: number;
  level: string;
  competitors: string[];
  analysis: string;
}

export default function KeywordDifficultyCheckerTool() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DifficultyResult | null>(null);

  const handleCheck = async () => {
    if (!keyword.trim()) {
      toast.error("Please enter a keyword");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/tools/check-keyword-difficulty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });

      if (!res.ok) {
        throw new Error("Analysis failed");
      }

      const data = await res.json();
      setResult(data);
      toast.success("Keyword analysis complete");
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
              Enter Target Keyword
            </Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Input
                  value={keyword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)}
                                    placeholder="e.g. coffee beans subscription"
                                    className="h-12 rounded-xl bg-background border-border pl-11 pr-4 text-sm focus-visible:ring-primary/20"
                                    disabled={loading}
                                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleCheck()}
                />
                <Target className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <Button
                onClick={handleCheck}
                disabled={loading || !keyword.trim()}
                className="h-12 px-8 rounded-xl font-bold uppercase tracking-widest text-[10px]"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <BarChart3 className="h-4 w-4 mr-2" />
                )}
                Check Difficulty
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
                {/* Difficulty Highlight */}
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
                        strokeDashoffset={251.2 - (251.2 * result.difficulty) / 100}
                        className={cn(
                          "transition-all duration-1000 ease-out",
                          result.difficulty < 40 ? "text-green-500" : result.difficulty < 70 ? "text-amber-500" : "text-red-500"
                        )}
                      />
                    </svg>
                    <span className="absolute text-2xl font-bold">{result.difficulty}</span>
                  </div>
                  <div className="space-y-2 text-center md:text-left">
                    <h3 className="text-xl font-bold tracking-tight">Difficulty: {result.level}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                      {result.analysis}
                    </p>
                  </div>
                </div>

                {/* Top Competitors */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground px-1 flex items-center gap-2">
                    <Globe className="h-4 w-4" /> Top Domains in SERP
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {result.competitors.map((d, i) => (
                      <div key={i} className="p-3 rounded-xl bg-muted/30 border border-border/50 flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-primary/40" />
                        <span className="text-xs font-mono text-muted-foreground truncate">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pro CTA */}
                <div className="p-6 rounded-[2rem] bg-zinc-950 text-white relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                      <h4 className="text-lg font-bold tracking-tight">Outrank the giants</h4>
                      <p className="text-sm text-zinc-400 max-w-md">
                        IndexFast Pro provides daily ranking tracking, backlink analysis, and AI content optimization to help you outrank established competitors.
                      </p>
                    </div>
                    <Button asChild className="rounded-xl bg-white text-black hover:bg-zinc-200 font-bold px-6">
                      <a href="/sign-up">
                        Setup Strategy
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
