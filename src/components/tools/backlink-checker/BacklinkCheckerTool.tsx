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
  TrendingUp,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface BacklinkResult {
  domain: string;
  totalBacklinks: string;
  referringDomains: string;
  authorityScore: number;
  type: string;
}

export default function BacklinkCheckerTool() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BacklinkResult | null>(null);

  const handleCheck = async () => {
    if (!domain.trim()) {
      toast.error("Please enter a domain");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/tools/check-backlinks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });

      if (!res.ok) {
        throw new Error("Analysis failed");
      }

      const data = await res.json();
      setResult(data);
      toast.success("Backlink analysis complete");
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
              Enter Domain Name
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
                  <LinkIcon className="h-4 w-4 mr-2" />
                )}
                Check Backlinks
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard label="Total Backlinks" value={result.totalBacklinks} icon={LinkIcon} />
                  <StatCard label="Referring Domains" value={result.referringDomains} icon={Globe} />
                  <StatCard label="Authority Score" value={`${result.authorityScore}/100`} icon={ShieldCheck} />
                </div>

                {/* Profile Summary */}
                <div className="p-6 rounded-2xl bg-muted/30 border border-border/50 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-1 text-center md:text-left">
                    <h3 className="text-lg font-bold tracking-tight">Backlink Profile: {result.type}</h3>
                    <p className="text-sm text-muted-foreground">This domain has a diverse set of incoming links from multiple sources.</p>
                  </div>
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 py-1 px-4 rounded-full font-bold uppercase text-[10px] tracking-widest">
                    {result.type} Profile
                  </Badge>
                </div>

                {/* Pro CTA */}
                <div className="p-6 rounded-[2rem] bg-zinc-950 text-white relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                      <h4 className="text-lg font-bold tracking-tight">Track every new backlink</h4>
                      <p className="text-sm text-zinc-400 max-w-md">
                        IndexFast Pro monitors your backlink profile 24/7 and alerts you whenever you gain or lose a high-authority link.
                      </p>
                    </div>
                    <Button asChild className="rounded-xl bg-white text-black hover:bg-zinc-200 font-bold px-6">
                      <a href="/sign-up">
                        Monitor Backlinks
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

function StatCard({ label, value, icon: Icon }: { label: string, value: string, icon: any }) {
  return (
    <div className="p-5 rounded-2xl border border-border/50 bg-background/50 space-y-3 text-center md:text-left">
      <div className="flex items-center gap-2 text-muted-foreground justify-center md:justify-start">
        <Icon className="h-4 w-4" />
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
