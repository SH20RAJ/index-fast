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
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  Target,
  Users,
  Flame
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface CompetitionResult {
  keyword: string;
  score: number;
  difficulty: string;
  resultsCount: string;
  related: string[];
}

export default function KeywordCompetitionCheckerTool() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompetitionResult | null>(null);

  const handleCheck = async () => {
    if (!keyword.trim()) {
      toast.error("Please enter a keyword");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/tools/check-keyword-competition", {
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
              Analyze Keyword Competition
            </Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Input
                  value={keyword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)}
                                    placeholder="e.g. best coffee beans"
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
                  <Flame className="h-4 w-4 mr-2" />
                )}
                Analyze Competition
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
                {/* Score Circle */}
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
                    <span className="absolute text-2xl font-bold">{result.score}</span>
                  </div>
                  <div className="space-y-1 text-center md:text-left">
                    <h3 className="text-xl font-bold tracking-tight">Difficulty: {result.difficulty}</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      This keyword has approximately <span className="text-primary font-bold">{result.resultsCount}</span> competing search results.
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground px-1 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" /> Related Opportunities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.related.map((r, i) => (
                      <Badge 
                        key={i} 
                        variant="secondary" 
                        className="bg-background border border-border/50 hover:border-primary/30 py-1.5 px-3 rounded-lg text-xs cursor-pointer transition-colors"
                        onClick={() => {
                          setKeyword(r);
                          handleCheck();
                        }}
                      >
                        {r}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Pro CTA */}
                <div className="p-6 rounded-[2rem] bg-zinc-950 text-white relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                      <h4 className="text-lg font-bold tracking-tight">Win the keyword game</h4>
                      <p className="text-sm text-zinc-400 max-w-md">
                        IndexFast Pro provides daily ranking tracking, backlink analysis, and AI content optimization to help you outrank competitors.
                      </p>
                    </div>
                    <Button asChild className="rounded-xl bg-white text-black hover:bg-zinc-200 font-bold px-6">
                      <a href="/sign-up">
                        Outrank Now
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
