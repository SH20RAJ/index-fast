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
  Download,
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  FileCode,
  List,
  Copy
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function XmlSitemapGeneratorTool() {
  const [url, setUrl] = useState("");
  const [urls, setUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleGenerate = async () => {
    if (!url.trim()) {
      toast.error("Please enter a website URL");
      return;
    }

    setLoading(true);
    setDone(false);
    setUrls([]);

    try {
      const res = await fetch("/api/tools/generate-sitemap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        throw new Error("Generation failed");
      }

      const data = await res.json();
      setUrls(data.urls);
      setDone(true);
      toast.success(`Generated sitemap with ${data.count} URLs`);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const generateXml = () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u}</url>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;
    return xml;
  };

  const handleDownload = () => {
    const xml = generateXml();
    const blob = new Blob([xml], { type: "application/xml" });
    const urlBlob = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = urlBlob;
    link.download = "sitemap.xml";
    link.click();
    URL.revokeObjectURL(urlBlob);
  };

  return (
    <div className="space-y-8">
      <Card className="rounded-3xl border-border bg-card/50 shadow-sm overflow-hidden">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
              Enter Website URL
            </Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Input
                  value={url}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="h-12 rounded-xl bg-background border-border pl-11 pr-4 text-sm focus-visible:ring-primary/20"
                  disabled={loading}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleGenerate()}
                />
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <Button
                onClick={handleGenerate}
                disabled={loading || !url.trim()}
                className="h-12 px-8 rounded-xl font-bold uppercase tracking-widest text-[10px]"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <FileCode className="h-4 w-4 mr-2" />
                )}
                Generate Sitemap
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
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Found URLs</h3>
                    <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[10px] font-bold">
                      {urls.length}
                    </Badge>
                  </div>
                  <Button onClick={handleDownload} className="h-9 rounded-xl font-bold uppercase tracking-widest text-[10px] gap-2">
                    <Download className="h-3.5 w-3.5" /> Download XML
                  </Button>
                </div>

                <div className="rounded-2xl border border-border overflow-hidden bg-muted/30">
                  <div className="max-h-[300px] overflow-y-auto p-4 space-y-2 scrollbar-hide">
                    {urls.map((u, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
                        <span className="text-primary/40 w-4">{i+1}.</span>
                        <span className="truncate">{u}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pro CTA */}
                <div className="p-6 rounded-[2rem] bg-zinc-950 text-white relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                      <h4 className="text-lg font-bold tracking-tight">Setup recurring sitemaps</h4>
                      <p className="text-sm text-zinc-400 max-w-md">
                        IndexFast Pro handles complex sites, large URL counts, and automatically pings search engines every time your site changes.
                      </p>
                    </div>
                    <Button asChild className="rounded-xl bg-white text-black hover:bg-zinc-200 font-bold px-6">
                      <a href="/sign-up">
                        Setup Automation
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
