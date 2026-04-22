"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  Copy, 
  CheckCircle2, 
  FileJson,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Hash
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function BingBatchRequestBuilderTool() {
  const [host, setHost] = useState("");
  const [key, setKey] = useState("");
  const [urlsRaw, setUrlsRaw] = useState("");
  const [copied, setCopied] = useState(false);

  const payload = useMemo(() => {
    const urls = urlsRaw.split("\n")
      .map(u => u.trim())
      .filter(u => u.length > 0);
    
    if (urls.length === 0 || !host) return null;

    return JSON.stringify({
      host: host.replace(/^https?:\/\//, '').replace(/\/$/, ''),
      key: key.trim() || "YOUR_API_KEY",
      urlList: urls
    }, null, 2);
  }, [host, key, urlsRaw]);

  const handleCopy = () => {
    if (!payload) return;
    navigator.clipboard.writeText(payload);
    setCopied(true);
    toast.success("Payload copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <Card className="rounded-3xl border-border bg-card/50 shadow-sm overflow-hidden">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
                Website Host
              </Label>
              <div className="relative">
                <Input
                  value={host}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHost(e.target.value)}
                  placeholder="example.com"
                  className="h-12 rounded-xl bg-background border-border pl-11 pr-4 text-sm focus-visible:ring-primary/20"
                />
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
                API Key (Optional)
              </Label>
              <div className="relative">
                <Input
                  value={key}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKey(e.target.value)}
                  placeholder="Your Bing API Key"
                  className="h-12 rounded-xl bg-background border-border pl-11 pr-4 text-sm focus-visible:ring-primary/20 font-mono"
                />
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                URLs to Submit (One per line)
              </Label>
              <Badge variant="outline" className="text-[9px] font-bold uppercase">
                {urlsRaw.split("\n").filter(u => u.trim()).length} URLs
              </Badge>
            </div>
            <div className="relative">
              <Textarea
                value={urlsRaw}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setUrlsRaw(e.target.value)}
                placeholder="https://example.com/page1&#10;https://example.com/page2"
                className="min-h-[150px] rounded-2xl bg-background border-border p-4 font-mono text-xs leading-relaxed focus-visible:ring-primary/20 resize-none"
              />
            </div>
          </div>

          <AnimatePresence>
            {payload && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 pt-6 border-t border-border"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                      <FileJson className="h-3.5 w-3.5" /> Generated JSON Payload
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleCopy}
                      className="h-8 rounded-lg text-[10px] font-bold uppercase hover:bg-primary/5 hover:text-primary"
                    >
                      {copied ? <CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 mr-1.5" />}
                      {copied ? "Copied" : "Copy Payload"}
                    </Button>
                  </div>
                  <div className="relative group">
                    <pre className="p-5 rounded-2xl bg-zinc-950 text-zinc-300 font-mono text-[11px] leading-relaxed overflow-x-auto scrollbar-hide border border-white/5">
                      {payload}
                    </pre>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-primary uppercase tracking-wider text-[10px]">How to use</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Send a POST request to <code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary">https://www.bing.com/api/v1/webmaster/custom/submiturlbatch</code> with this JSON payload and your API key in the query parameters.
                    </p>
                  </div>
                </div>

                {/* Pro CTA */}
                <div className="p-6 rounded-[2rem] bg-zinc-950 text-white relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                      <h4 className="text-lg font-bold tracking-tight">Stop building payloads manually</h4>
                      <p className="text-sm text-zinc-400 max-w-md">
                        IndexFast Pro automates your Bing and Google submissions. No code or JSON required.
                      </p>
                    </div>
                    <Button asChild className="rounded-xl bg-white text-black hover:bg-zinc-200 font-bold px-6">
                      <a href="/sign-up">
                        Automate Now
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
