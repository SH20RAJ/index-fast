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
  Search,
  Loader2,
  Copy,
  Download,
  Trash2,
  Globe,
  FileJson,
  FileText,
  List,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function SitemapExtractorView() {
  const searchParams = useSearchParams();
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [urls, setUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // Pre-fill from query params
  useEffect(() => {
    const urlParam = searchParams.get("url");
    if (urlParam) {
      setSitemapUrl(urlParam);
    }
  }, [searchParams]);

  const handleExtract = async () => {
    if (!sitemapUrl.trim()) {
      toast.error("Please enter a sitemap URL");
      return;
    }

    setLoading(true);
    setDone(false);
    setUrls([]);

    try {
      const res = await fetch("/api/toolbox/parse-sitemap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: sitemapUrl }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed to parse sitemap" }));
        throw new Error(err.error || "Failed to parse sitemap");
      }

      const data = await res.json();
      if (data.urls) {
        setUrls(data.urls);
        setDone(true);
        toast.success(`Extracted ${data.urls.length} URLs`);
      } else {
        throw new Error("No URLs found in sitemap");
      }
    } catch (error: any) {
      toast.error(error.message || "Extraction failed");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (urls.length === 0) return;
    navigator.clipboard.writeText(urls.join("\n"));
    toast.success("Copied to clipboard");
  };

  const downloadTxt = () => {
    if (urls.length === 0) return;
    const blob = new Blob([urls.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sitemap-urls-${new Date().toISOString().split("T")[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadCsv = () => {
    if (urls.length === 0) return;
    const blob = new Blob(["URL\n" + urls.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sitemap-urls-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setSitemapUrl("");
    setUrls([]);
    setDone(false);
  };

  return (
    <div className="space-y-10 pb-24 pt-4 max-w-5xl mx-auto px-4">
      <PageHeader
        title="Sitemap to URL Extractor"
        description="Convert any XML sitemap, sitemap index, or RSS feed into a clean, actionable list of URLs."
      />

      <Card className="rounded-[32px] border-zinc-100 dark:border-white/5 bg-white dark:bg-zinc-900/40 shadow-xl shadow-zinc-200/20 dark:shadow-none overflow-hidden">
        <CardContent className="p-8 space-y-8">
          <div className="space-y-3">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-1">Sitemap URL</Label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Input
                  value={sitemapUrl}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSitemapUrl(e.target.value)}
                  placeholder="https://example.com/sitemap.xml"
                  className="h-14 rounded-2xl bg-zinc-50 border-none dark:bg-white/5 pl-11 pr-4 font-mono text-xs focus-visible:ring-rose-500/30"
                  disabled={loading}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleExtract()}
                />
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              </div>
              <Button
                onClick={handleExtract}
                disabled={loading || !sitemapUrl.trim()}
                className="h-14 px-8 rounded-2xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white shadow-xl shadow-zinc-900/10 font-bold uppercase tracking-widest text-[10px]"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Extract URLs"}
              </Button>
            </div>
            <p className="text-[10px] text-zinc-400 px-1 italic flex items-center gap-1.5">
              <AlertCircle className="h-3 w-3" />
              Works with XML Sitemaps, Sitemap Indices, and RSS/Atom feeds.
            </p>
          </div>

          <AnimatePresence>
            {done && urls.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6 pt-4 border-t border-zinc-100 dark:border-white/5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-light tracking-tight text-zinc-900 dark:text-zinc-100">Extracted Results</h3>
                    <Badge variant="secondary" className="bg-rose-500/10 text-rose-500 border-none font-mono">
                      {urls.length} URLs
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      className="rounded-xl h-10 border-zinc-100 dark:border-white/5 text-[10px] font-bold uppercase tracking-widest"
                    >
                      <Copy className="h-3 w-3 mr-2" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadTxt}
                      className="rounded-xl h-10 border-zinc-100 dark:border-white/5 text-[10px] font-bold uppercase tracking-widest"
                    >
                      <FileText className="h-3 w-3 mr-2" />
                      TXT
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadCsv}
                      className="rounded-xl h-10 border-zinc-100 dark:border-white/5 text-[10px] font-bold uppercase tracking-widest"
                    >
                      <List className="h-3 w-3 mr-2" />
                      CSV
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={reset}
                      className="rounded-xl h-10 text-[10px] font-bold uppercase tracking-widest text-zinc-400"
                    >
                      <Trash2 className="h-3 w-3 mr-2" />
                      Clear
                    </Button>
                  </div>
                </div>

                <div className="relative">
                  <Textarea
                    readOnly
                    value={urls.join("\n")}
                    className="min-h-[300px] rounded-2xl bg-zinc-50 border-none dark:bg-white/5 p-6 font-mono text-xs leading-relaxed focus-visible:ring-0 resize-none scrollbar-hide"
                  />
                  <div className="absolute top-4 right-4 pointer-events-none opacity-5">
                    <FileJson className="h-24 w-24" />
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    asChild
                    variant="link"
                    className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-rose-500"
                  >
                    <a href={`/toolbox/ping?url=${encodeURIComponent(sitemapUrl)}`} className="flex items-center gap-1.5">
                      Send to Universal Ping
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
