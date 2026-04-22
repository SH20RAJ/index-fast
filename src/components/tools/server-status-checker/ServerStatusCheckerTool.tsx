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
  Activity,
  CheckCircle2, 
  XCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Timer
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface StatusResult {
  url: string;
  status: number;
  statusText: string;
  ok: boolean;
  responseTime: number;
}

export default function ServerStatusCheckerTool() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StatusResult | null>(null);

  const handleCheck = async () => {
    if (!url.trim()) {
      toast.error("Please enter a URL to check");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/tools/check-server-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (!res.ok && data.status === 0) {
        throw new Error(data.error || "Failed to reach server");
      }
      setResult(data);
      toast.success("Check complete");
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
              Analyze Server Uptime
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
                  <Zap className="h-4 w-4 mr-2" />
                )}
                Check Status
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
                  result.ok ? "bg-green-500/5 border border-green-500/10" : "bg-red-500/5 border border-red-500/10"
                )}>
                  <div className={cn(
                    "h-16 w-16 rounded-full flex items-center justify-center shrink-0",
                    result.ok ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                  )}>
                    {result.ok ? <CheckCircle2 className="h-8 w-8" /> : <XCircle className="h-8 w-8" />}
                  </div>
                  <div className="space-y-1 text-center md:text-left">
                    <h3 className="text-xl font-bold tracking-tight">
                      {result.ok ? "Server is Online" : "Server is Offline"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {result.ok 
                        ? "Your website is responding normally to requests." 
                        : "The server is currently unreachable or returned an error."}
                    </p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-border/50 bg-background/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                        <Activity className="h-3 w-3" /> Status Code
                      </span>
                      <Badge className={cn(
                        "border-none text-[10px] font-bold",
                        result.ok ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                      )}>
                        {result.status || "ERR"}
                      </Badge>
                    </div>
                    <p className="text-sm font-bold font-mono">{result.statusText || "Connection Failed"}</p>
                  </div>
                  <div className="p-4 rounded-2xl border border-border/50 bg-background/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                        <Timer className="h-3 w-3" /> Response Time
                      </span>
                      <Badge className="bg-primary/5 text-primary border-none text-[10px] font-bold">
                        {result.responseTime}ms
                      </Badge>
                    </div>
                    <p className="text-sm font-bold font-mono">
                      {result.responseTime < 300 ? "Fast" : result.responseTime < 1000 ? "Average" : "Slow"}
                    </p>
                  </div>
                </div>

                {/* Pro CTA */}
                <div className="p-6 rounded-[2rem] bg-zinc-950 text-white relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                      <h4 className="text-lg font-bold tracking-tight">Never miss an outage again</h4>
                      <p className="text-sm text-zinc-400 max-w-md">
                        IndexFast Pro monitors your site 24/7 and pings search engines as soon as your server is back online.
                      </p>
                    </div>
                    <Button asChild className="rounded-xl bg-white text-black hover:bg-zinc-200 font-bold px-6">
                      <a href="/sign-up">
                        Setup Monitoring
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
