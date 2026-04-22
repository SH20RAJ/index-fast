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
  CheckCircle2, 
  XCircle,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function GoogleIndexCheckerTool() {
  const [url, setUrl] = useState("");
  const [hasChecked, setHasChecked] = useState(false);

  const googleSearchUrl = `https://www.google.com/search?q=site:${encodeURIComponent(url)}`;

  const handleCheck = () => {
    if (!url.trim()) {
      toast.error("Please enter a URL to check");
      return;
    }
    
    window.open(googleSearchUrl, "_blank");
    setHasChecked(true);
    toast.info("Opening Google search...");
  };

  return (
    <div className="space-y-8">
      <Card className="rounded-3xl border-border bg-card/50 shadow-sm overflow-hidden">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
              Check Indexing Status
            </Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
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
                <Search className="h-4 w-4 mr-2" />
                Check on Google
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground px-1 italic">
              This will open a Google search for <code className="bg-muted px-1 rounded text-primary">site:your-url</code>
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
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold tracking-tight">Did you see your page?</h4>
                      <p className="text-xs text-muted-foreground">Confirm the result to get optimization tips.</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="rounded-xl border-green-500/20 bg-green-500/5 hover:bg-green-500/10 text-green-600 h-10 text-[10px] font-bold uppercase">
                      <CheckCircle2 className="h-3.5 w-3.5 mr-2" /> Indexed
                    </Button>
                    <Button variant="outline" className="rounded-xl border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-600 h-10 text-[10px] font-bold uppercase">
                      <XCircle className="h-3.5 w-3.5 mr-2" /> Not Indexed
                    </Button>
                  </div>
                </div>

                {/* Pro CTA */}
                <div className="p-6 rounded-[2rem] bg-zinc-950 text-white relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                      <h4 className="text-lg font-bold tracking-tight">Track indexing automatically</h4>
                      <p className="text-sm text-zinc-400 max-w-md">
                        Stop manual checking. IndexFast Pro monitors your URLs and notifies you when they appear in search results.
                      </p>
                    </div>
                    <Button asChild className="rounded-xl bg-white text-black hover:bg-zinc-200 font-bold px-6">
                      <a href="/sign-up">
                        Monitor Now
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
