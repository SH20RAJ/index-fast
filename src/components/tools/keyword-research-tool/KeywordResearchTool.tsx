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
  Target,
  Sparkles,
  Copy,
  CheckCircle2,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface KeywordResult {
  keyword: string;
  relevance: number;
  difficulty: number;
  volume: number;
}

interface ResearchResult {
  seed: string;
  results: KeywordResult[];
}

export default function KeywordResearchTool() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);

  const handleResearch = async () => {
    if (!keyword.trim()) {
      toast.error("Please enter a seed keyword");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/tools/research-keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });

      if (!res.ok) {
        throw new Error("Research failed");
      }

      const data = await res.json();
      setResult(data);
      toast.success(`Found ${data.results.length} suggestions`);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyAll = () => {
    if (!result) return;
    const text = result.results.map(r => r.keyword).join("\n");
    navigator.clipboard.writeText(text);
    toast.success("All keywords copied");
  };

  return (
    <div className="space-y-8">
      <Card className="rounded-3xl border-border bg-card/50 shadow-sm overflow-hidden">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
              Seed Keyword
            </Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g. digital marketing"
                  className="h-12 rounded-xl bg-background border-border pl-11 pr-4 text-sm focus-visible:ring-primary/20"
                  disabled={loading}
                  onKeyDown={(e) => e.key === "Enter" && handleResearch()}
                />
                <Target className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <Button
                onClick={handleResearch}
                disabled={loading || !keyword.trim()}
                className="h-12 px-8 rounded-xl font-bold uppercase tracking-widest text-[10px]"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Get Suggestions
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 pt-6 border-t border-border"
              >
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" /> Opportunities for "{result.seed}"
                  </h3>
                  <Button variant="ghost" size="sm" onClick={copyAll} className="h-8 rounded-lg text-[10px] font-bold uppercase">
                    <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy All
                  </Button>
                </div>

                <div className="rounded-2xl border border-border overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-muted/80 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border">
                      <tr>
                        <th className="px-6 py-4">Keyword</th>
                        <th className="px-6 py-4 text-center">Difficulty</th>
                        <th className="px-6 py-4 text-right">Est. Volume</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {result.results.map((r, idx) => (
                        <tr key={idx} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4 font-bold text-foreground capitalize">
                            {r.keyword}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                                <div 
                                  className={cn(
                                    "h-full rounded-full",
                                    r.difficulty < 30 ? "bg-green-500" : r.difficulty < 70 ? "bg-amber-500" : "bg-red-500"
                                  )}
                                  style={{ width: `${r.difficulty}%` }}
                                />
                              </div>
                              <span className="text-[10px] font-mono font-bold text-muted-foreground">{r.difficulty}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Badge variant="secondary" className="bg-primary/5 text-primary border-none font-mono">
                              {r.volume.toLocaleString()}/mo
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pro CTA */}
                <div className="p-6 rounded-[2rem] bg-zinc-950 text-white relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                      <h4 className="text-lg font-bold tracking-tight">Unlock AI keyword intelligence</h4>
                      <p className="text-sm text-zinc-400 max-w-md">
                        IndexFast Pro uses advanced AI to find low-hanging fruit keywords your competitors missed and helps you rank for them.
                      </p>
                    </div>
                    <Button asChild className="rounded-xl bg-white text-black hover:bg-zinc-200 font-bold px-6">
                      <a href="/sign-up">
                        Research with AI
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
