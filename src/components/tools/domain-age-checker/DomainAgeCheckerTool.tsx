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
  ArrowRight,
  ShieldCheck,
  Calendar,
  Clock,
  Building2,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface AgeResult {
  domain: string;
  createdDate: string;
  age: string;
  registrar: string;
}

export default function DomainAgeCheckerTool() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AgeResult | null>(null);

  const handleCheck = async () => {
    if (!domain.trim()) {
      toast.error("Please enter a domain");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/tools/check-domain-age", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });

      if (!res.ok) {
        throw new Error("Failed to retrieve domain data");
      }

      const data = await res.json();
      setResult(data);
      toast.success("Domain analysis complete");
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
              Enter Domain Name
            </Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Input
                  value={domain}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDomain(e.target.value)}
                  placeholder="example.com"
                  className="h-12 rounded-xl bg-background border-border pl-11 pr-4 text-sm focus-visible:ring-primary/20"
                  disabled={loading}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleCheck()}
                />
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <Button
                onClick={handleCheck}
                disabled={loading || !domain.trim()}
                className="h-12 px-8 rounded-xl font-bold uppercase tracking-widest text-[10px]"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <History className="h-4 w-4 mr-2" />
                )}
                Check Age
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 pt-6 border-t border-border"
              >
                {/* Age Highlight */}
                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col md:flex-row items-center gap-6">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Clock className="h-8 w-8" />
                  </div>
                  <div className="space-y-1 text-center md:text-left">
                    <h3 className="text-xl font-bold tracking-tight">{result.age}</h3>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Total Domain Age</p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl border border-border/50 bg-background/50 space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Created Date</span>
                    </div>
                    <p className="text-base font-bold">{result.createdDate}</p>
                  </div>
                  <div className="p-5 rounded-2xl border border-border/50 bg-background/50 space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Registrar</span>
                    </div>
                    <p className="text-base font-bold truncate">{result.registrar}</p>
                  </div>
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
