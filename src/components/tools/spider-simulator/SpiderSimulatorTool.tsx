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
  Search, 
  Eye,
  ArrowRight,
  ShieldCheck,
  FileText,
  Layout,
  Type,
  Link as LinkIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface SpiderResult {
  url: string;
  meta: {
    title: string;
    description: string;
    h1: string[];
  };
  textContent: string;
  links: { text: string; href: string }[];
  wordCount: number;
}

export default function SpiderSimulatorTool() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SpiderResult | null>(null);

  const handleSimulate = async () => {
    if (!url.trim()) {
      toast.error("Please enter a URL to simulate");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/tools/simulate-spider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        throw new Error("Simulation failed");
      }

      const data = await res.json();
      setResult(data);
      toast.success("Simulation complete");
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
              Enter Page URL
            </Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Input
                  value={url}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
                  placeholder="https://example.com/page"
                  className="h-12 rounded-xl bg-background border-border pl-11 pr-4 text-sm focus-visible:ring-primary/20"
                  disabled={loading}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleSimulate()}
                />
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <Button
                onClick={handleSimulate}
                disabled={loading || !url.trim()}
                className="h-12 px-8 rounded-xl font-bold uppercase tracking-widest text-[10px]"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Eye className="h-4 w-4 mr-2" />
                )}
                Simulate Spider
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 pt-6 border-t border-border"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard icon={Type} label="Word Count" value={result.wordCount.toString()} />
                  <StatCard icon={LinkIcon} label="Links Found" value={result.links.length.toString()} />
                  <StatCard icon={Layout} label="H1 Count" value={result.meta.h1.length.toString()} />
                  <StatCard icon={FileText} label="Meta Status" value={result.meta.description ? "Set" : "Missing"} />
                </div>

                {/* Metadata View */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground px-1 flex items-center gap-2">
                    <Layout className="h-4 w-4" /> Metadata as Bot
                  </h3>
                  <div className="p-6 rounded-2xl bg-muted/30 border border-border/50 space-y-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Title</p>
                      <p className="text-sm font-bold">{result.meta.title || "No title found"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Description</p>
                      <p className="text-sm leading-relaxed text-muted-foreground">{result.meta.description || "No description found"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">H1 Headings</p>
                      <div className="space-y-1">
                        {result.meta.h1.length > 0 ? result.meta.h1.map((h, i) => (
                          <p key={i} className="text-sm font-semibold">{h}</p>
                        )) : <p className="text-sm text-muted-foreground italic">No H1 tags found</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text Content View */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground px-1 flex items-center gap-2">
                    <Type className="h-4 w-4" /> Raw Text Content
                  </h3>
                  <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
                    <p className="text-[11px] font-mono leading-relaxed text-muted-foreground line-clamp-[12]">
                      {result.textContent}
                    </p>
                  </div>
                </div>

                {/* Pro CTA */}
                <div className="p-6 rounded-[2rem] bg-zinc-950 text-white relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                      <h4 className="text-lg font-bold tracking-tight">Boost your search visibility</h4>
                      <p className="text-sm text-zinc-400 max-w-md">
                        IndexFast Pro helps you optimize content and ensures bots can find and index every important page.
                      </p>
                    </div>
                    <Button asChild className="rounded-xl bg-white text-black hover:bg-zinc-200 font-bold px-6">
                      <a href="/sign-up">
                        Improve Visibility
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

function StatCard({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="p-4 rounded-2xl bg-background border border-border/50 text-center space-y-1">
      <Icon className="h-4 w-4 mx-auto text-muted-foreground/50" />
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
