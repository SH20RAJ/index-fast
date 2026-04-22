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
  Shield,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Calendar,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface AuthorityResult {
  domain: string;
  score: number;
  age: number;
  indexedPages: string;
  rating: string;
}

export default function DomainAuthorityCheckerTool() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuthorityResult | null>(null);

  const handleCheck = async () => {
    if (!domain.trim()) {
      toast.error("Please enter a domain");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/tools/check-domain-authority", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });

      if (!res.ok) {
        throw new Error("Analysis failed");
      }

      const data = await res.json();
      setResult(data);
      toast.success("Domain analysis complete");
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
              Analyze Domain Authority
            </Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Input
                  value={domain}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDomain(e.target.value)}
                  placeholder="example.com"
                  className="h-12 rounded-xl bg-background border-border pl-11 pr-4 text-sm focus-visible:ring-primary/20"
                  disabled={loading}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleCheck()}
                />
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <Button
                onClick={handleCheck}
                disabled={loading || !domain.trim()}
                className="h-12 px-8 rounded-xl font-bold uppercase tracking-widest text-[10px]"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <ShieldCheck className="h-4 w-4 mr-2" />
                )}
                Check Authority
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
                    <span className="absolute text-2xl font-bold">{result.score}</span>
                  </div>
                  <div className="space-y-1 text-center md:text-left">
                    <h3 className="text-xl font-bold tracking-tight">Rating: {result.rating}</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Based on domain age, SSL status, and Google's indexed pages count.
                    </p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl border border-border/50 bg-background/50 space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Domain Age</span>
                    </div>
                    <p className="text-base font-bold">{result.age} Years</p>
                  </div>
                  <div className="p-5 rounded-2xl border border-border/50 bg-background/50 space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Layers className="h-4 w-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Indexed Pages</span>
                    </div>
                    <p className="text-base font-bold">{result.indexedPages}</p>
                  </div>
                </div>

                {/* Pro CTA */}
                <div className="p-6 rounded-[2rem] bg-zinc-950 text-white relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                      <h4 className="text-lg font-bold tracking-tight">Grow your authority faster</h4>
                      <p className="text-sm text-zinc-400 max-w-md">
                        IndexFast Pro helps you increase domain authority by ensuring search engines find and value your content instantly.
                      </p>
                    </div>
                    <Button asChild className="rounded-xl bg-white text-black hover:bg-zinc-200 font-bold px-6">
                      <a href="/sign-up">
                        Increase Authority
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
