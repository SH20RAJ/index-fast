"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Link2,
  Globe,
  Settings,
} from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

type TestResult = {
  url: string;
  allowed: boolean;
  reason: string;
};

export default function RobotsTxtTesterView() {
  const searchParams = useSearchParams();
  const [robotsTxtUrl, setRobotsTxtUrl] = useState("");
  const [robotsTxtContent, setRobotsTxtContent] = useState("");
  const [testUrls, setTestUrls] = useState("");
  const [userAgent, setUserAgent] = useState("*");
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [done, setDone] = useState(false);
  const [fetching, setFetching] = useState(false);

  // Pre-fill URL from query params
  useEffect(() => {
    const urlParam = searchParams.get("url");
    if (urlParam) {
      const robotsUrl = urlParam.endsWith("/robots.txt") ? urlParam : `${urlParam.replace(/\/$/, "")}/robots.txt`;
      setRobotsTxtUrl(robotsUrl);
    }
  }, [searchParams]);

  const handleFetchRobots = async () => {
    if (!robotsTxtUrl.trim()) return;
    setFetching(true);
    try {
      const res = await fetch("/api/toolbox/robots-txt-tester", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ robotsTxtUrl, urls: [] }),
      });
      const data = await res.json();
      if (data.robotsTxt) {
        setRobotsTxtContent(data.robotsTxt);
        toast.success("robots.txt fetched successfully");
      } else {
        toast.error(data.error || "Failed to fetch robots.txt");
      }
    } catch (e) {
      toast.error("Failed to fetch robots.txt");
    } finally {
      setFetching(false);
    }
  };

  const handleTest = async () => {
    const urls = testUrls.split("\n").filter(u => u.trim());
    if (urls.length === 0) {
      toast.error("Please provide at least one URL to test");
      return;
    }
    if (!robotsTxtContent.trim() && !robotsTxtUrl.trim()) {
      toast.error("Please provide robots.txt content or URL");
      return;
    }

    setRunning(true);
    setDone(false);
    try {
      const res = await fetch("/api/toolbox/robots-txt-tester", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ robotsTxtUrl, robotsTxtContent, urls, userAgent }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error || `Server error ${res.status}`);
      }

      const data = await res.json() as { results: TestResult[] };
      setResults(data.results);
      setDone(true);
      toast.success("Test completed");
    } catch (error: any) {
      toast.error(error.message || "Test failed");
    } finally {
      setRunning(false);
    }
  };

  const reset = () => {
    setResults([]);
    setDone(false);
    setRobotsTxtUrl("");
    setRobotsTxtContent("");
    setTestUrls("");
  };

  return (
    <div className="space-y-10 pb-24 pt-4 max-w-6xl mx-auto px-4 md:px-0">
      <PageHeader
        title="Robots.txt Tester"
        description="Validate your robots.txt directives and verify whether critical URLs are blocked for search crawlers."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Input */}
        <div className="lg:col-span-7 space-y-8">
          <Card className="rounded-[32px] border-zinc-100 dark:border-white/5 bg-white dark:bg-zinc-900/40 shadow-xl overflow-hidden">
            <CardContent className="p-8 space-y-8">
              {/* robots.txt source */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-1">robots.txt URL (Optional)</Label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Input
                        value={robotsTxtUrl}
                        onChange={(e) => setRobotsTxtUrl(e.target.value)}
                        placeholder="https://example.com/robots.txt"
                        className="h-14 rounded-2xl bg-zinc-50 border-none dark:bg-white/5 pl-11 pr-4 font-mono text-xs focus-visible:ring-rose-500/30"
                      />
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    </div>
                    <Button 
                      variant="outline"
                      onClick={handleFetchRobots}
                      disabled={fetching || !robotsTxtUrl}
                      className="h-14 px-6 rounded-2xl border-zinc-100 dark:border-white/5 text-[10px] font-bold uppercase tracking-widest"
                    >
                      {fetching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Fetch"}
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-1">robots.txt Content</Label>
                  <Textarea
                    value={robotsTxtContent}
                    onChange={(e) => setRobotsTxtContent(e.target.value)}
                    placeholder="User-agent: *\nDisallow: /admin/\nSitemap: https://example.com/sitemap.xml"
                    className="min-h-[200px] rounded-2xl bg-zinc-50 border-none dark:bg-white/5 p-6 font-mono text-xs leading-relaxed focus-visible:ring-rose-500/30"
                  />
                </div>
              </div>

              {/* Test settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-50 dark:border-white/5">
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-1">User Agent</Label>
                  <div className="relative">
                    <Input
                      value={userAgent}
                      onChange={(e) => setUserAgent(e.target.value)}
                      placeholder="*"
                      className="h-12 rounded-xl bg-zinc-50 border-none dark:bg-white/5 pl-11 pr-4 font-mono text-xs focus-visible:ring-rose-500/30"
                    />
                    <Settings className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-1">Test URLs (One per line)</Label>
                  <Textarea
                    value={testUrls}
                    onChange={(e) => setTestUrls(e.target.value)}
                    placeholder="/page-1\nhttps://example.com/page-2"
                    className="min-h-[100px] rounded-xl bg-zinc-50 border-none dark:bg-white/5 p-4 font-mono text-xs leading-relaxed focus-visible:ring-rose-500/30"
                  />
                </div>
              </div>

              <div className="pt-6 flex flex-col sm:flex-row items-center gap-6">
                <Button
                  onClick={handleTest}
                  disabled={running || (!robotsTxtContent && !robotsTxtUrl)}
                  className="h-16 w-full sm:w-64 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white shadow-2xl shadow-rose-500/10 font-bold uppercase tracking-widest text-[11px]"
                >
                  {running ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-3 h-4 w-4" />}
                  {running ? "Testing..." : "Test Directives"}
                </Button>
                {done && (
                  <Button 
                    variant="ghost" 
                    onClick={reset} 
                    className="rounded-full px-8 h-16 text-[10px] font-bold uppercase tracking-widest text-zinc-400"
                  >
                    Reset
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-5 space-y-8">
          <AnimatePresence>
            {!done ? (
              <Card className="rounded-[32px] border-zinc-100 dark:border-white/5 bg-zinc-50/50 dark:bg-white/[0.02] overflow-hidden border-dashed h-full min-h-[400px]">
                <CardContent className="h-full flex flex-col items-center justify-center p-12 text-center opacity-40">
                  <FileText className="h-12 w-12 mb-6 text-zinc-300" />
                  <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Results will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Verification Report</h3>
                  <Badge variant="outline" className="font-mono text-[9px] px-3 py-1 bg-zinc-50 dark:bg-white/5 border-none">
                    {results.length} URLs Tested
                  </Badge>
                </div>

                <div className="space-y-3">
                  {results.map((r, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "p-5 rounded-[24px] border transition-all flex items-center justify-between group",
                        r.allowed 
                          ? "bg-emerald-50/30 dark:bg-emerald-500/[0.02] border-emerald-500/10 hover:border-emerald-500/20" 
                          : "bg-rose-50/30 dark:bg-rose-500/[0.02] border-rose-500/10 hover:border-rose-500/20"
                      )}
                    >
                      <div className="flex flex-col gap-1 min-w-0 pr-6">
                        <p className="text-[11px] font-mono text-zinc-900 dark:text-zinc-100 truncate">{r.url}</p>
                        <p className={cn(
                          "text-[9px] font-bold uppercase tracking-widest",
                          r.allowed ? "text-emerald-500" : "text-rose-500"
                        )}>
                          {r.reason}
                        </p>
                      </div>
                      <div className="shrink-0">
                        {r.allowed ? (
                          <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          </div>
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-rose-500/10 flex items-center justify-center">
                            <XCircle className="h-4 w-4 text-rose-500" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <Card className="rounded-[24px] border-zinc-100 dark:border-white/5 bg-zinc-900 dark:bg-zinc-900/60 p-6 text-white overflow-hidden relative">
                  <div className="space-y-4 relative z-10">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Summary</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-light tracking-tighter text-emerald-400">
                        {Math.round((results.filter(r => r.allowed).length / results.length) * 100)}%
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Crawl Accessibility</span>
                    </div>
                    <p className="text-[11px] text-white/50 leading-relaxed max-w-[200px]">
                      {results.filter(r => !r.allowed).length > 0 
                        ? `${results.filter(r => !r.allowed).length} critical paths are currently blocked for search crawlers.`
                        : "All tested paths are accessible to search crawlers."}
                    </p>
                  </div>
                  <AlertCircle className="absolute -right-4 -bottom-4 h-24 w-24 text-white/5 rotate-12" />
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
