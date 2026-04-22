"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  FileText,
  UserCheck,
  Bot
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface RobotsResult {
  url: string;
  userAgent: string;
  allowed: boolean;
  disallowed: boolean;
  crawlDelay: number | undefined;
  sitemaps: string[];
  robotsTxt: string;
}

export default function RobotsTxtTesterTool() {
  const [url, setUrl] = useState("");
  const [robotsTxt, setRobotsTxt] = useState("");
  const [userAgent, setUserAgent] = useState("*");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RobotsResult | null>(null);

  const handleTest = async () => {
    if (!url.trim()) {
      toast.error("Please enter a URL to test");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/tools/test-robots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, robotsTxt, userAgent }),
      });

      if (!res.ok) {
        throw new Error("Failed to test robots.txt");
      }

      const data = await res.json();
      setResult(data);
      if (data.robotsTxt && !robotsTxt) {
        setRobotsTxt(data.robotsTxt);
      }
      toast.success("Test complete");
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
                URL to Test
              </Label>
              <div className="relative">
                <Input
                  value={url}
                  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setUrl(e.target.value)}
                  placeholder="https://example.com/page"
                  className="h-12 rounded-xl bg-background border-border pl-11 pr-4 text-sm focus-visible:ring-primary/20"
                  disabled={loading}
                />
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
                User Agent
              </Label>
              <div className="relative">
                <Input
                  value={userAgent}
                  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setUserAgent(e.target.value)}
                  placeholder="Googlebot"
                  className="h-12 rounded-xl bg-background border-border pl-11 pr-4 text-sm focus-visible:ring-primary/20"
                  disabled={loading}
                />
                <Bot className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Robots.txt Content (Optional)
              </Label>
              <span className="text-[10px] text-muted-foreground italic">Leave blank to fetch from site</span>
            </div>
            <div className="relative">
              <Textarea
                value={robotsTxt}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setRobotsTxt(e.target.value)}
                placeholder="User-agent: *&#10;Disallow: /admin"
                className="min-h-[150px] rounded-2xl bg-background border-border p-4 font-mono text-xs leading-relaxed focus-visible:ring-primary/20 resize-none"
                disabled={loading}
              />
              <FileText className="absolute right-4 top-4 h-4 w-4 text-muted-foreground/30" />
            </div>
          </div>

          <Button
            onClick={handleTest}
            disabled={loading || !url.trim()}
            className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-[10px]"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <ShieldCheck className="h-4 w-4 mr-2" />
            )}
            Test URL Access
          </Button>

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
                  result.allowed ? "bg-green-500/5 border border-green-500/10" : "bg-red-500/5 border border-red-500/10"
                )}>
                  <div className={cn(
                    "h-16 w-16 rounded-full flex items-center justify-center shrink-0",
                    result.allowed ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                  )}>
                    {result.allowed ? <CheckCircle2 className="h-8 w-8" /> : <XCircle className="h-8 w-8" />}
                  </div>
                  <div className="space-y-1 text-center md:text-left">
                    <h3 className="text-xl font-bold tracking-tight">
                      {result.allowed ? "URL is Crawlable" : "URL is Blocked"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {result.allowed 
                        ? `Crawlers using "${result.userAgent}" can access this page.` 
                        : `Access is explicitly denied for "${result.userAgent}" in robots.txt.`}
                    </p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-border/50 bg-background/50 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Crawl Delay</span>
                    <p className="text-sm font-bold">{result.crawlDelay ? `${result.crawlDelay} seconds` : "None specified"}</p>
                  </div>
                  <div className="p-4 rounded-2xl border border-border/50 bg-background/50 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sitemaps Detected</span>
                    <p className="text-sm font-bold">{result.sitemaps.length || 0}</p>
                  </div>
                </div>

                {result.sitemaps.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Detected Sitemaps</span>
                    <div className="space-y-2">
                      {result.sitemaps.map((s, i) => (
                        <div key={i} className="p-3 rounded-xl bg-muted/30 border border-border/50 text-[11px] font-mono truncate">
                          {s}
                        </div>
                      ))}
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
