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
  Zap,
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Search,
  Radar,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface SubmissionResult {
  name: string;
  status: string;
}

interface FreeResult {
  url: string;
  results: SubmissionResult[];
  message: string;
}

export default function FreeSearchEngineSubmissionTool() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FreeResult | null>(null);

  const handleSubmit = async () => {
    if (!url.trim()) {
      toast.error("Please enter your website URL");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/tools/free-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        throw new Error("Submission failed");
      }

      const data = await res.json();
      setResult(data);
      toast.success("Indexing signals sent!");
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
              Enter Your Website URL
            </Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Input
                  value={url}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="h-12 rounded-xl bg-background border-border pl-11 pr-4 text-sm focus-visible:ring-primary/20"
                  disabled={loading}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleSubmit()}
                />
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <Button
                onClick={handleSubmit}
                disabled={loading || !url.trim()}
                className="h-12 px-8 rounded-xl font-bold uppercase tracking-widest text-[10px]"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Radar className="h-4 w-4 mr-2" />
                )}
                Submit to Engines
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground px-1 italic">
              We'll send crawl signals to Google, Bing, and other major engines.
            </p>
          </div>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 pt-6 border-t border-border"
              >
                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Activity className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold tracking-tight">Indexing Signals Broadcasted</h4>
                      <p className="text-xs text-muted-foreground">{result.message}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {result.results.map((r, i) => (
                      <div key={i} className="p-3 rounded-xl bg-background border border-border/50 flex items-center justify-between">
                        <span className="text-[11px] font-bold">{r.name}</span>
                        <div className="flex items-center gap-1.5">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-[9px] font-bold uppercase text-green-600">Sent</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pro CTA */}
                <div className="p-6 rounded-[2rem] bg-zinc-950 text-white relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                      <h4 className="text-lg font-bold tracking-tight">Never submit manually again</h4>
                      <p className="text-sm text-zinc-400 max-w-md">
                        IndexFast Pro monitors your site 24/7 and triggers instant indexing requests as soon as you publish new content.
                      </p>
                    </div>
                    <Button asChild className="rounded-xl bg-white text-black hover:bg-zinc-200 font-bold px-6">
                      <a href="/sign-up">
                        Automate Indexing
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
