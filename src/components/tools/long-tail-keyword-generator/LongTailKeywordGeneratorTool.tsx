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
  ArrowRight,
  ShieldCheck,
  Target,
  Sparkles,
  Copy,
  Zap,
  ListPlus,
  Compass
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface KeywordResult {
  keyword: string;
  words: number;
  intent: string;
}

interface GenResult {
  seed: string;
  results: KeywordResult[];
}

export default function LongTailKeywordGeneratorTool() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenResult | null>(null);

  const handleGenerate = async () => {
    if (!keyword.trim()) {
      toast.error("Please enter a base keyword");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/tools/generate-long-tail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });

      if (!res.ok) {
        throw new Error("Generation failed");
      }

      const data = await res.json();
      setResult(data);
      toast.success(`Generated ${data.results.length} long-tail keywords`);
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
    toast.success("Keywords copied");
  };

  return (
    <div className="space-y-8">
      <Card className="rounded-3xl border-border bg-card/50 shadow-sm overflow-hidden">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
              Base Keyword
            </Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Input
                  value={keyword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)}
                                    placeholder="e.g. coffee beans"
                                    className="h-12 rounded-xl bg-background border-border pl-11 pr-4 text-sm focus-visible:ring-primary/20"
                                    disabled={loading}
                                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleGenerate()}
                />
                <Compass className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <Button
                onClick={handleGenerate}
                disabled={loading || !keyword.trim()}
                className="h-12 px-8 rounded-xl font-bold uppercase tracking-widest text-[10px]"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <ListPlus className="h-4 w-4 mr-2" />
                )}
                Generate Ideas
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
                    <Sparkles className="h-4 w-4 text-primary" /> Long-tail variations
                  </h3>
                  <Button variant="ghost" size="sm" onClick={copyAll} className="h-8 rounded-lg text-[10px] font-bold uppercase">
                    <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy List
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.results.map((r, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-all group flex items-center justify-between">
                      <div className="space-y-1 min-w-0">
                        <p className="text-sm font-bold text-foreground capitalize truncate">{r.keyword}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-medium text-muted-foreground">{r.words} words</span>
                          <span className="w-1 h-1 rounded-full bg-border" />
                          <span className="text-[10px] font-bold text-primary/60 uppercase">{r.intent}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => {
                        navigator.clipboard.writeText(r.keyword);
                        toast.success("Copied");
                      }}>
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
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
