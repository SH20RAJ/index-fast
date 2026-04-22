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
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface AuditDetails {
  robots: string;
  canonical: string | null;
  xRobots: string | null;
  noindex: boolean;
}

interface AuditResult {
  url: string;
  status: number;
  ok: boolean;
  indexable: boolean;
  details: AuditDetails;
}

export default function IndexabilityCheckerTool() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);

  const handleCheck = async () => {
    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/tools/audit-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        throw new Error("Failed to audit URL");
      }

      const data = await res.json();
      setResult(data);
      toast.success("Audit complete");
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
                  <Search className="h-4 w-4 mr-2" />
                )}
                Check Indexability
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
                {/* Result Header */}
                <div className={cn(
                  "p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6",
                  result.indexable ? "bg-green-500/5 border border-green-500/10" : "bg-red-500/5 border border-red-500/10"
                )}>
                  <div className={cn(
                    "h-16 w-16 rounded-full flex items-center justify-center shrink-0",
                    result.indexable ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                  )}>
                    {result.indexable ? <CheckCircle2 className="h-8 w-8" /> : <XCircle className="h-8 w-8" />}
                  </div>
                  <div className="space-y-1 text-center md:text-left">
                    <h3 className="text-xl font-bold tracking-tight">
                      {result.indexable ? "Page is Indexable" : "Page is Not Indexable"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {result.indexable 
                        ? "Search engines can crawl and index this page without issues." 
                        : "One or more signals are blocking search engines from indexing this page."}
                    </p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailCard 
                    label="HTTP Status" 
                    value={result.status.toString()} 
                    status={result.ok ? "success" : "error"}
                    desc={result.ok ? "Healthy response" : "Server returned an error"}
                  />
                  <DetailCard 
                    label="Robots Meta" 
                    value={result.details.robots} 
                    status={result.details.noindex ? "error" : "success"}
                    desc={result.details.noindex ? "Noindex tag detected" : "Indexable tag detected"}
                  />
                  <DetailCard 
                    label="Canonical Tag" 
                    value={result.details.canonical || "Missing"} 
                    status={result.details.canonical ? "success" : "warning"}
                    desc={result.details.canonical ? "Point to standard URL" : "No canonical specified"}
                  />
                  <DetailCard 
                    label="X-Robots Header" 
                    value={result.details.xRobots || "None"} 
                    status={result.details.xRobots?.includes("noindex") ? "error" : "success"}
                    desc={result.details.xRobots?.includes("noindex") ? "Blocked via HTTP header" : "No blocking header"}
                  />
                </div>

                {/* Fix CTA */}
                {!result.indexable && (
                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider text-[10px]">Action required</p>
                      <p className="text-xs text-amber-600 dark:text-amber-300 leading-relaxed">
                        Search engines cannot index this page. Check your meta tags or HTTP headers for "noindex" directives.
                      </p>
                    </div>
                  </div>
                )}
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

function DetailCard({ label, value, status, desc }: { label: string, value: string, status: "success" | "warning" | "error", desc: string }) {
  return (
    <div className="p-4 rounded-2xl border border-border/50 bg-background/50 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
        <div className={cn(
          "h-2 w-2 rounded-full",
          status === "success" ? "bg-green-500" : status === "warning" ? "bg-amber-500" : "bg-red-500"
        )} />
      </div>
      <p className="text-sm font-bold font-mono truncate">{value}</p>
      <p className="text-[10px] text-muted-foreground font-medium">{desc}</p>
    </div>
  );
}
