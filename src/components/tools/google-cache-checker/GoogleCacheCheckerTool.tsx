"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  Search, 
  ExternalLink,
  History,
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function GoogleCacheCheckerTool() {
  const [url, setUrl] = useState("");
  const [hasChecked, setHasChecked] = useState(false);

  const googleCacheUrl = `https://webcache.googleusercontent.com/search?q=cache:${encodeURIComponent(url)}`;

  const handleCheck = () => {
    if (!url.trim()) {
      toast.error("Please enter a URL to check");
      return;
    }
    
    window.open(googleCacheUrl, "_blank");
    setHasChecked(true);
    toast.info("Opening Google Cache...");
  };

  return (
    <div className="space-y-8">
      <Card className="rounded-3xl border-border bg-card/50 shadow-sm overflow-hidden">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
              Check Cached Version
            </Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Input
                  value={url}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
                  placeholder="https://example.com/page"
                  className="h-12 rounded-xl bg-background border-border pl-11 pr-4 text-sm focus-visible:ring-primary/20"
                />
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <Button
                onClick={handleCheck}
                disabled={!url.trim()}
                className="h-12 px-8 rounded-xl font-bold uppercase tracking-widest text-[10px]"
              >
                <History className="h-4 w-4 mr-2" />
                View Cache
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground px-1 italic">
              Shows the last time Google crawled and saved a snapshot of this page.
            </p>
          </div>

          <AnimatePresence>
            {hasChecked && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 pt-6 border-t border-border"
              >
                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold tracking-tight">Is the cache outdated?</h4>
                      <p className="text-xs text-muted-foreground">If the content you see is old, you may need to request a recrawl.</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="outline" className="rounded-lg border-primary/20 bg-primary/5 text-primary py-1 px-3 text-[10px] font-bold uppercase">
                      Confirm Freshness
                    </Badge>
                  </div>
                </div>

                {/* Pro CTA */}
                <div className="p-6 rounded-[2rem] bg-zinc-950 text-white relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                      <h4 className="text-lg font-bold tracking-tight">Force Google to update your cache</h4>
                      <p className="text-sm text-zinc-400 max-w-md">
                        Use IndexFast Pro to instantly notify Google when you update content, ensuring searchers always see your latest version.
                      </p>
                    </div>
                    <Button asChild className="rounded-xl bg-white text-black hover:bg-zinc-200 font-bold px-6">
                      <a href="/sign-up">
                        Refresh My Cache
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
