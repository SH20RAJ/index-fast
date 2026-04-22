"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Globe, 
  Loader2, 
  Copy, 
  Download,
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  List,
  FileJson
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function SitemapUrlExtractorTool() {
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [urls, setUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

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
        throw new Error("Failed to parse sitemap");
      }

      const data = await res.json();
      if (data.urls && data.urls.length > 0) {
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
    link.download = "sitemap-urls.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <Card className="rounded-3xl border-border bg-card/50 shadow-sm overflow-hidden">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
              Enter Sitemap URL
            </Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Input
                  value={sitemapUrl}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSitemapUrl(e.target.value)}
                  placeholder="https://example.com/sitemap.xml"
                  className="h-12 rounded-xl bg-background border-border pl-11 pr-4 text-sm focus-visible:ring-primary/20"
                  disabled={loading}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleExtract()}
                />
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <Button
                onClick={handleExtract}
                disabled={loading || !sitemapUrl.trim()}
                className="h-12 px-8 rounded-xl font-bold uppercase tracking-widest text-[10px]"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <List className="h-4 w-4 mr-2" />
                )}
                Extract URLs
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {done && urls.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 pt-6 border-t border-border"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Extracted URLs</h3>
                    <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[10px] font-bold">
                      {urls.length}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard} className="h-8 rounded-lg text-[10px] font-bold uppercase">
                      <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadTxt} className="h-8 rounded-lg text-[10px] font-bold uppercase">
                      <Download className="h-3.5 w-3.5 mr-1.5" /> TXT
                    </Button>
                  </div>
                </div>

                <div className="relative">
                  <Textarea
                    readOnly
                    value={urls.join("\n")}
                    className="min-h-[250px] rounded-2xl bg-muted/30 border-border p-4 font-mono text-xs leading-relaxed focus-visible:ring-0 resize-none scrollbar-hide"
                  />
                </div>
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
