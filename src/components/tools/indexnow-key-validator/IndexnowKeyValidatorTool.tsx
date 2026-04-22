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
  CheckCircle2, 
  XCircle, 
  Key,
  ArrowRight,
  ShieldCheck,
  Link as LinkIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface ValidationResult {
  valid: boolean;
  message: string;
  fetchedKey?: string;
  providedKey?: string;
  status?: number;
}

export default function IndexnowKeyValidatorTool() {
  const [key, setKey] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);

  const handleValidate = async () => {
    if (!key.trim() || !url.trim()) {
      toast.error("Please enter both the key and the file URL");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/tools/validate-indexnow-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, url }),
      });

      if (!res.ok) {
        throw new Error("Validation failed");
      }

      const data = await res.json();
      setResult(data);
      if (data.valid) {
        toast.success("Key is valid!");
      } else {
        toast.error("Key validation failed");
      }
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
                IndexNow Key
              </Label>
              <div className="relative">
                <Input
                  value={key}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKey(e.target.value)}
                  placeholder="e.g. 74c28309a17744148..."
                  className="h-12 rounded-xl bg-background border-border pl-11 pr-4 text-sm focus-visible:ring-primary/20 font-mono"
                  disabled={loading}
                />
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
                Key File URL
              </Label>
              <div className="relative">
                <Input
                  value={url}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
                  placeholder="https://example.com/your-key.txt"
                  className="h-12 rounded-xl bg-background border-border pl-11 pr-4 text-sm focus-visible:ring-primary/20"
                  disabled={loading}
                />
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          <Button
            onClick={handleValidate}
            disabled={loading || !key.trim() || !url.trim()}
            className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-[10px]"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <ShieldCheck className="h-4 w-4 mr-2" />
            )}
            Verify Key File
          </Button>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 pt-6 border-t border-border"
              >
                {/* Result Header */}
                <div className={cn(
                  "p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6",
                  result.valid ? "bg-green-500/5 border border-green-500/10" : "bg-red-500/5 border border-red-500/10"
                )}>
                  <div className={cn(
                    "h-16 w-16 rounded-full flex items-center justify-center shrink-0",
                    result.valid ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                  )}>
                    {result.valid ? <CheckCircle2 className="h-8 w-8" /> : <XCircle className="h-8 w-8" />}
                  </div>
                  <div className="space-y-1 text-center md:text-left">
                    <h3 className="text-xl font-bold tracking-tight">
                      {result.valid ? "Valid Key File" : "Invalid Key File"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {result.message}
                    </p>
                  </div>
                </div>

                {!result.valid && result.fetchedKey && (
                  <div className="p-4 rounded-xl border border-border/50 bg-background/50 space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Difference detected</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase px-1">Provided</p>
                        <div className="p-3 rounded-lg bg-muted/30 font-mono text-xs truncate">{result.providedKey}</div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase px-1">Fetched from file</p>
                        <div className="p-3 rounded-lg bg-red-500/5 text-red-600 font-mono text-xs truncate">{result.fetchedKey}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pro CTA */}
                <div className="p-6 rounded-[2rem] bg-zinc-950 text-white relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center md:text-left">
                      <h4 className="text-lg font-bold tracking-tight">Automate IndexNow submissions</h4>
                      <p className="text-sm text-zinc-400 max-w-md">
                        Don't deal with keys and validation manually. IndexFast handles everything for you.
                      </p>
                    </div>
                    <Button asChild className="rounded-xl bg-white text-black hover:bg-zinc-200 font-bold px-6">
                      <a href="/sign-up">
                        Setup IndexNow
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
