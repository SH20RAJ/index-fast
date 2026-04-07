"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <div className="space-y-10 pb-16 pt-4 max-w-5xl">
      <PageHeader
        title="Universal Ping"
        description="Broadcast your digital presence across global discovery networks."
      />

      {/* Input form */}
      <Card className="rounded-[32px] border-zinc-100 dark:border-white/5 bg-white dark:bg-zinc-900/40 shadow-sm overflow-hidden">
        <CardContent className="p-8 space-y-10">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-1">Resource URL</Label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/stream"
                className="h-12 rounded-2xl bg-zinc-50 border-none dark:bg-white/5 px-4 font-mono text-xs"
                disabled={running}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-1">Resource Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="The Unseen Stream"
                className="h-12 rounded-2xl bg-zinc-50 border-none dark:bg-white/5 px-4 text-xs"
                disabled={running}
              />
            </div>
          </div>

          {/* Group selector */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Target Networks — {totalEndpoints} Selected</h3>
              <div className="flex gap-3">
                <button onClick={selectAll} className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">All</button>
                <button onClick={selectNone} className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">None</button>
              </div>
            </div>

            <div className="grid gap-3">
              {PING_GROUPS.map((group) => {
                const isSelected = selectedGroups.has(group.id);
                const isExpanded = expandedGroups.has(group.id);
                return (
                  <div
                    key={group.id}
                    className={cn(
                      "rounded-2xl border transition-all",
                      isSelected ? "border-rose-500/20 bg-rose-500/5" : "border-zinc-100 bg-zinc-50/50 dark:border-white/5 dark:bg-white/[0.02]"
                    )}
                  >
                    <div className="flex items-center gap-4 p-4 md:px-6">
                      <Checkbox
                        id={`group-${group.id}`}
                        checked={isSelected}
                        onCheckedChange={() => toggleGroup(group.id)}
                        disabled={running}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <label htmlFor={`group-${group.id}`} className="text-sm font-medium text-zinc-900 dark:text-zinc-100 cursor-pointer">{group.label}</label>
                          <span className="text-[10px] font-bold text-zinc-400 tabular-nums">{group.endpoints.length}</span>
                        </div>
                        <p className="text-xs text-zinc-500 font-light mt-0.5 truncate">{group.description}</p>
                      </div>
                      <button onClick={() => toggleExpand(group.id)} className="text-zinc-300 hover:text-zinc-500 transition-colors">
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                    {isExpanded && (
                      <div className="px-6 pb-4 pt-0 border-t border-zinc-100 dark:border-white/5">
                        <div className="max-h-32 overflow-y-auto pt-4 space-y-1">
                          {group.endpoints.map((ep) => (
                            <p key={ep} className="text-[9px] font-mono text-zinc-400">{ep}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center gap-6">
            <Button
              onClick={handlePing}
              disabled={running || !url.trim() || selectedGroups.size === 0}
              className="h-14 w-full sm:w-64 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white shadow-xl shadow-zinc-900/10 font-bold uppercase tracking-widest text-xs"
            >
              {running ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              {running ? "Broadcasting..." : "Start Broadcast"}
            </Button>
            {done && (
              <Button variant="ghost" onClick={reset} className="rounded-full px-6 text-xs font-bold uppercase tracking-widest text-zinc-400">
                Reset
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {(running || done) && (
        <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 px-1">
            {[
              { label: "Progress", value: `${progress}%` },
              { label: "Total", value: results.length },
              { label: "Success", value: successCount, color: "text-emerald-500" },
              { label: "Failed", value: failedCount, color: "text-rose-500" },
            ].map((s) => (
              <div key={s.label} className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{s.label}</p>
                <p className={cn("text-2xl font-light tracking-tight", s.color)}>{s.value}</p>
              </div>
            ))}
          </div>

          {done && results.length > 0 && (
            <div className="bg-white dark:bg-zinc-900/40 rounded-[32px] border border-zinc-100 dark:border-white/5 overflow-hidden">
              <div className="divide-y divide-zinc-50 dark:divide-white/5 max-h-[400px] overflow-y-auto">
                {results.map((r, i) => (
                  <div key={i} className="p-4 md:px-8 flex items-center justify-between hover:bg-zinc-50/50 transition-colors">
                    <p className="text-xs font-mono text-zinc-500 truncate pr-8">{r.endpoint}</p>
                    <div className={cn(
                      "h-1.5 w-1.5 rounded-full shrink-0",
                      r.status === "success" ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" : "bg-rose-500"
                    )} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
