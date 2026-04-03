"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Radio,
  Globe,
  Zap,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Send,
  RotateCcw,
  Info,
} from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import { cn } from "@/lib/utils";

// ── Ping service registry ──────────────────────────────────────────
type PingGroup = {
  id: string;
  label: string;
  color: string;
  description: string;
  endpoints: string[];
};

const PING_GROUPS: PingGroup[] = [
  {
    id: "google-global",
    label: "Google Blog Search (Global)",
    color: "text-blue-500",
    description: "Primary + major regional Google blogsearch endpoints for global discovery.",
    endpoints: [
      "http://blogsearch.google.com/ping/RPC2",
      "http://blogsearch.google.co.uk/ping/RPC2",
      "http://blogsearch.google.co.in/ping/RPC2",
      "http://blogsearch.google.com.au/ping/RPC2",
      "http://blogsearch.google.com.br/ping/RPC2",
      "http://blogsearch.google.de/ping/RPC2",
      "http://blogsearch.google.fr/ping/RPC2",
      "http://blogsearch.google.co.jp/ping/RPC2",
      "http://blogsearch.google.es/ping/RPC2",
      "http://blogsearch.google.it/ping/RPC2",
      "http://blogsearch.google.ru/ping/RPC2",
      "http://blogsearch.google.nl/ping/RPC2",
      "http://blogsearch.google.pl/ping/RPC2",
      "http://blogsearch.google.com.mx/ping/RPC2",
      "http://blogsearch.google.ca/ping/RPC2",
      "http://blogsearch.google.com.ar/ping/RPC2",
      "http://blogsearch.google.com.co/ping/RPC2",
      "http://blogsearch.google.com.tr/ping/RPC2",
    ],
  },
  {
    id: "google-regional",
    label: "Google Blog Search (Extended Regional)",
    color: "text-indigo-500",
    description: "Additional regional Google endpoints for extended geographic signal coverage.",
    endpoints: [
      "http://blogsearch.google.ae/ping/RPC2",
      "http://blogsearch.google.at/ping/RPC2",
      "http://blogsearch.google.be/ping/RPC2",
      "http://blogsearch.google.bg/ping/RPC2",
      "http://blogsearch.google.ch/ping/RPC2",
      "http://blogsearch.google.cl/ping/RPC2",
      "http://blogsearch.google.co.id/ping/RPC2",
      "http://blogsearch.google.co.il/ping/RPC2",
      "http://blogsearch.google.co.nz/ping/RPC2",
      "http://blogsearch.google.co.th/ping/RPC2",
      "http://blogsearch.google.co.ve/ping/RPC2",
      "http://blogsearch.google.co.za/ping/RPC2",
      "http://blogsearch.google.co.ma/ping/RPC2",
      "http://blogsearch.google.co.cr/ping/RPC2",
      "http://blogsearch.google.com.my/ping/RPC2",
      "http://blogsearch.google.com.pe/ping/RPC2",
      "http://blogsearch.google.com.sa/ping/RPC2",
      "http://blogsearch.google.com.sg/ping/RPC2",
      "http://blogsearch.google.com.tw/ping/RPC2",
      "http://blogsearch.google.com.ua/ping/RPC2",
      "http://blogsearch.google.com.uy/ping/RPC2",
      "http://blogsearch.google.com.vn/ping/RPC2",
      "http://blogsearch.google.fi/ping/RPC2",
      "http://blogsearch.google.gr/ping/RPC2",
      "http://blogsearch.google.hr/ping/RPC2",
      "http://blogsearch.google.ie/ping/RPC2",
      "http://blogsearch.google.jp/ping/RPC2",
      "http://blogsearch.google.lt/ping/RPC2",
      "http://blogsearch.google.pt/ping/RPC2",
      "http://blogsearch.google.ro/ping/RPC2",
      "http://blogsearch.google.se/ping/RPC2",
      "http://blogsearch.google.sk/ping/RPC2",
      "http://blogsearch.google.us/ping/RPC2",
    ],
  },
  {
    id: "aggregators",
    label: "Ping Aggregators",
    color: "text-emerald-500",
    description: "Services like Ping-O-Matic that re-broadcast to dozens of directories on your behalf.",
    endpoints: [
      "http://pingomatic.com/",
      "http://ping.pubsub.com/ping",
      "http://xping.pubsub.com/ping",
      "http://rpc.bloggerei.de/ping/",
      "http://blogpingr.de/ping/rpc2",
    ],
  },
  {
    id: "blog-directories",
    label: "Blog Directories",
    color: "text-amber-500",
    description: "Niche blog directories and content syndication networks.",
    endpoints: [
      "http://i-learn.jp/ping/",
      "http://blogsearch.google.lk/ping/RPC2",
      "http://blogsearch.google.ws/ping/RPC2",
      "http://blogsearch.google.st/ping/RPC2",
      "http://blogsearch.google.sn/ping/RPC2",
      "http://blogsearch.google.sm/ping/RPC2",
      "http://blogsearch.google.si/ping/RPC2",
      "http://blogsearch.google.lu/ping/RPC2",
      "http://blogsearch.google.li/ping/RPC2",
    ],
  },
];

type PingResult = {
  endpoint: string;
  status: "success" | "failed" | "pending";
  ms?: number;
};

// ── Main component ─────────────────────────────────────────────────
export default function PingView() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(
    new Set(["google-global", "aggregators"])
  );
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(["google-global"]));
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<PingResult[]>([]);
  const [done, setDone] = useState(false);

  const totalEndpoints = useMemo(() => {
    let count = 0;
    PING_GROUPS.forEach((g) => {
      if (selectedGroups.has(g.id)) count += g.endpoints.length;
    });
    return count;
  }, [selectedGroups]);

  const successCount = results.filter((r) => r.status === "success").length;
  const failedCount = results.filter((r) => r.status === "failed").length;
  const progress = totalEndpoints > 0 ? Math.round((results.length / totalEndpoints) * 100) : 0;

  function toggleGroup(id: string) {
    setSelectedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleExpand(id: string) {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    setSelectedGroups(new Set(PING_GROUPS.map((g) => g.id)));
  }
  function selectNone() {
    setSelectedGroups(new Set());
  }

  async function handlePing() {
    if (!url || selectedGroups.size === 0) return;
    setRunning(true);
    setDone(false);
    setResults([]);

    const endpoints: string[] = [];
    PING_GROUPS.forEach((g) => {
      if (selectedGroups.has(g.id)) endpoints.push(...g.endpoints);
    });

    try {
      const res = await fetch("/api/ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, title, endpoints }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error || `Server error ${res.status}`);
      }

      const data = await res.json() as { results: PingResult[] };
      setResults(data.results);
    } catch {
      setResults(endpoints.map((ep) => ({ endpoint: ep, status: "failed" as const })));
    } finally {
      setRunning(false);
      setDone(true);
    }
  }

  function reset() {
    setResults([]);
    setDone(false);
    setUrl("");
    setTitle("");
  }

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Universal Ping"
        description="Broadcast your new content to 100+ search engines, blog directories, and ping aggregators in one click."
      />

      {/* Info banner */}
      <Alert className="border-blue-500/20 bg-blue-500/5">
        <Info className="h-4 w-4 text-blue-500" />
        <AlertTitle className="font-bold text-blue-600">What is a Ping?</AlertTitle>
        <AlertDescription className="text-sm text-muted-foreground">
          A <strong>ping</strong> is a small notification telling search engines and directories that your page has new content — triggering faster crawling. This is the <strong>Secondary Discovery Layer</strong> complementing IndexNow &amp; Google API.
        </AlertDescription>
      </Alert>

      {/* Input form */}
      <Card className="border-border/40 bg-card/30 backdrop-blur-sm">
        <CardHeader>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Radio className="h-5 w-5" />
          </div>
          <CardTitle className="text-xl font-black tracking-tight">Ping Configuration</CardTitle>
          <CardDescription>Enter the page URL and optional title, then choose your target groups.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Page URL <span className="text-red-500">*</span>
              </label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/new-blog-post"
                className="h-11 bg-background/50 border-border/40 font-mono text-sm"
                disabled={running}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Page Title (optional)
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My New Blog Post"
                className="h-11 bg-background/50 border-border/40"
                disabled={running}
              />
            </div>
          </div>

          {/* Group selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Target Groups — {totalEndpoints} endpoints selected
              </label>
              <div className="flex gap-2">
                <button onClick={selectAll} className="text-[10px] font-bold text-primary hover:underline">Select All</button>
                <span className="text-muted-foreground/40">·</span>
                <button onClick={selectNone} className="text-[10px] font-bold text-muted-foreground hover:underline">None</button>
              </div>
            </div>

            <div className="space-y-2">
              {PING_GROUPS.map((group) => {
                const isSelected = selectedGroups.has(group.id);
                const isExpanded = expandedGroups.has(group.id);
                return (
                  <div
                    key={group.id}
                    className={cn(
                      "rounded-xl border transition-all",
                      isSelected ? "border-primary/30 bg-primary/5" : "border-border/30 bg-background/30"
                    )}
                  >
                    <div className="flex items-center gap-3 p-4">
                      <Checkbox
                        id={`group-${group.id}`}
                        checked={isSelected}
                        onCheckedChange={() => toggleGroup(group.id)}
                        disabled={running}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Globe className={cn("h-4 w-4 shrink-0", group.color)} />
                          <label
                            htmlFor={`group-${group.id}`}
                            className="text-sm font-bold cursor-pointer"
                          >
                            {group.label}
                          </label>
                          <Badge variant="outline" className="text-[9px] font-black px-1.5 py-0 h-4">
                            {group.endpoints.length}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{group.description}</p>
                      </div>
                      <button
                        onClick={() => toggleExpand(group.id)}
                        className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 border-t border-border/20">
                        <div className="max-h-40 overflow-y-auto space-y-1">
                          {group.endpoints.map((ep) => (
                            <p key={ep} className="text-[10px] font-mono text-muted-foreground/70 py-0.5">
                              {ep}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={handlePing}
              disabled={running || !url.trim() || selectedGroups.size === 0}
              className="h-12 px-8 font-black rounded-xl gap-2 shadow-lg shadow-primary/10"
            >
              {running ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Pinging...</>
              ) : (
                <><Send className="h-4 w-4" /> Start Universal Ping</>
              )}
            </Button>
            {done && (
              <Button variant="outline" onClick={reset} className="h-12 px-6 font-bold rounded-xl gap-2">
                <RotateCcw className="h-4 w-4" /> Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Live progress */}
      {running && (
        <Card className="border-border/40 bg-card/30 backdrop-blur-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm font-bold">Pinging {totalEndpoints} endpoints…</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground">{progress}% complete</p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {done && results.length > 0 && (
        <div className="space-y-4">
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total Pinged", value: results.length, icon: Zap, color: "text-blue-500" },
              { label: "Success", value: successCount, icon: CheckCircle2, color: "text-emerald-500" },
              { label: "Failed / Timeout", value: failedCount, icon: AlertCircle, color: "text-red-500" },
            ].map((s) => (
              <Card key={s.label} className="border-border/40 bg-card/40">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{s.label}</p>
                    <p className="text-2xl font-black">{s.value}</p>
                  </div>
                  <s.icon className={cn("h-6 w-6", s.color)} />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Log */}
          <Card className="border-border/40 bg-card/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-black">Ping Results</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="max-h-96 overflow-y-auto space-y-1">
                {results.map((r, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-mono border",
                      r.status === "success"
                        ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-700"
                        : "bg-red-500/5 border-red-500/20 text-red-600"
                    )}
                  >
                    {r.status === "success" ? (
                      <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-500" />
                    ) : (
                      <AlertCircle className="h-3 w-3 shrink-0 text-red-500" />
                    )}
                    <span className="truncate flex-1">{r.endpoint}</span>
                    {r.ms !== undefined && (
                      <span className="text-muted-foreground shrink-0">{r.ms}ms</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
