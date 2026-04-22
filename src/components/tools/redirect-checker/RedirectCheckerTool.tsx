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
  ArrowDown,
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  Search,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface RedirectStep {
  url: string;
  status: number | string;
  statusText: string;
}

interface RedirectResult {
  chain: RedirectStep[];
  totalRedirects: number;
}

export default function RedirectCheckerTool() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RedirectResult | null>(null);

  const handleCheck = async () => {
    if (!url.trim()) {
      toast.error("Please enter a URL to check");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/toolbox/redirect-checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        throw new Error("Failed to trace redirects");
      }

      const data = await res.json();
      setResult(data);
      toast.success("Trace complete");
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
              Analyze Redirect Path
            </Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Input
                  value={url}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
                  placeholder="https://example.com/old-page"
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
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Trace Redirects
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
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Redirect Chain</h3>
                  <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[10px] font-bold">
                    {result.totalRedirects} Redirect{result.totalRedirects !== 1 ? 's' : ''}
                  </Badge>
                </div>

                <div className="space-y-4 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-px before:bg-border/60">
                  {result.chain.map((step, idx) => (
                    <div key={idx} className="relative pl-10">
                      <div className={cn(
                        "absolute left-0 top-0 h-10 w-10 rounded-xl flex items-center justify-center border bg-background shadow-sm z-10",
                        step.status === 200 ? "border-green-500/20 text-green-600" : 
                        step.status === "Error" ? "border-red-500/20 text-red-600" :
                        "border-primary/20 text-primary"
                      )}>
                        <span className="text-[10px] font-bold">{step.status}</span>
                      </div>
                      <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-1 hover:bg-muted/50 transition-colors">
                        <p className="text-xs font-mono truncate text-foreground">{step.url}</p>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{step.statusText}</p>
                      </div>
                      {idx < result.chain.length - 1 && (
                        <div className="flex justify-center w-10 mt-2">
                          <ArrowDown className="h-4 w-4 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Pro CTA */}
                <div className="p-6 rounded-[2rem] bg-zinc-950 text-white relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                      <h4 className="text-lg font-bold tracking-tight">Fix redirect loops forever</h4>
                      <p className="text-sm text-zinc-400 max-w-md">
                        Get notified instantly when a redirect breaks or a loop is detected on your site.
                      </p>
                    </div>
                    <Button asChild className="rounded-xl bg-white text-black hover:bg-zinc-200 font-bold px-6">
                      <a href="/sign-up">
                        Fix & Monitor
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
