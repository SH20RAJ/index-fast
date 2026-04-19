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
  Send,
  Loader2,
  CheckCircle2,
  XCircle,
  FileText,
  AlertCircle,
  Link2,
} from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import { cn } from "@/lib/utils";

type SubmissionResult = {
  url: string;
  status: "success" | "failed";
  message?: string;
};

export default function SubmitExpressView() {
  const searchParams = useSearchParams();
  const [urlsInput, setUrlsInput] = useState("");
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<SubmissionResult[]>([]);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill URL from query params
  useEffect(() => {
    const urlParam = searchParams.get("url");
    if (urlParam) {
      setUrlsInput(urlParam);
    }
  }, [searchParams]);

  const urls = useMemo(() => {
    return urlsInput
      .split("\n")
      .map((u) => u.trim())
      .filter((u) => u.length > 0 && (u.startsWith("http://") || u.startsWith("https://")));
  }, [urlsInput]);

  const successCount = results.filter((r) => r.status === "success").length;
  const failedCount = results.filter((r) => r.status === "failed").length;
  const progress = urls.length > 0 ? Math.round((results.length / urls.length) * 100) : 0;

  async function handleSubmit() {
    if (urls.length === 0) {
      setError("Please enter at least one valid URL starting with http:// or https://");
      return;
    }

    setRunning(true);
    setDone(false);
    setResults([]);
    setError(null);

    try {
      const res = await fetch("/api/toolbox/submitexpress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error || `Server error ${res.status}`);
      }

      const data = await res.json() as { results: SubmissionResult[] };
      setResults(data.results);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during submission.");
      setResults(urls.map((u) => ({ url: u, status: "failed", message: err.message })));
    } finally {
      setRunning(false);
      setDone(true);
    }
  }

  function reset() {
    setResults([]);
    setDone(false);
    setUrlsInput("");
    setError(null);
  }

  return (
    <div className="space-y-10 pb-16 pt-4 max-w-5xl">
      <PageHeader
        title="SubmitExpress Submission"
        description="Bulk submit your URLs and Sitemaps to search engines via SubmitExpress."
      />

      <Card className="rounded-[32px] border-zinc-100 dark:border-white/5 bg-white dark:bg-zinc-900/40 shadow-sm overflow-hidden">
        <CardContent className="p-8 space-y-8">
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                URLs / Sitemap (One per line)
              </Label>
              <Badge variant="secondary" className="bg-zinc-50 text-zinc-400 dark:bg-white/5 text-[9px] font-bold">
                {urls.length} Detected
              </Badge>
            </div>
            <Textarea
              value={urlsInput}
              onChange={(e) => setUrlsInput(e.target.value)}
              placeholder="https://example.com/sitemap.xml&#10;https://example.com/page-1&#10;https://example.com/page-2"
              className="min-h-[200px] rounded-2xl bg-zinc-50 border-none dark:bg-white/5 px-4 py-3 font-mono text-xs focus-visible:ring-rose-500/20"
              disabled={running}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-rose-500 text-xs px-1">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-6">
            <Button
              onClick={handleSubmit}
              disabled={running || urls.length === 0}
              className="h-14 w-full sm:w-64 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white shadow-xl shadow-zinc-900/10 font-bold uppercase tracking-widest text-xs"
            >
              {running ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              {running ? "Submitting..." : "Submit All URLs"}
            </Button>
            {done && (
              <Button variant="ghost" onClick={reset} className="rounded-full px-6 text-xs font-bold uppercase tracking-widest text-zinc-400">
                Clear All
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {(running || done) && (
        <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-700">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 px-1">
            {[
              { label: "Progress", value: `${progress}%` },
              { label: "Total URLs", value: urls.length },
              { label: "Success", value: successCount, color: "text-pink-500" },
              { label: "Failed", value: failedCount, color: "text-rose-500" },
            ].map((s) => (
              <div key={s.label} className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{s.label}</p>
                <p className={cn("text-2xl font-light tracking-tight", s.color)}>{s.value}</p>
              </div>
            ))}
          </div>

          {results.length > 0 && (
            <div className="bg-white dark:bg-zinc-900/40 rounded-[32px] border border-zinc-100 dark:border-white/5 overflow-hidden">
              <div className="p-4 px-8 border-b border-zinc-100 dark:border-white/5 bg-zinc-50/50 dark:bg-white/[0.02]">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Submission Logs</h3>
              </div>
              <div className="divide-y divide-zinc-50 dark:divide-white/5 max-h-[400px] overflow-y-auto">
                {results.map((r, i) => (
                  <div key={i} className="p-4 md:px-8 flex items-center justify-between hover:bg-zinc-50/50 transition-colors">
                    <div className="flex flex-col gap-1 min-w-0 pr-8">
                      <p className="text-xs font-mono text-zinc-900 dark:text-zinc-100 truncate">{r.url}</p>
                      {r.message && <p className="text-[10px] text-zinc-500 truncate">{r.message}</p>}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {r.status === "success" ? (
                        <CheckCircle2 className="h-4 w-4 text-pink-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-rose-500" />
                      )}
                      <div className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        r.status === "success" ? "bg-pink-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" : "bg-rose-500"
                      )} />
                    </div>
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
