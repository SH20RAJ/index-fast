"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Globe, 
  Search, 
  RefreshCw, 
  Check, 
  ChevronRight,
  ArrowRight,
  Loader2,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

interface GscProperty {
  propertyUrl: string;
  permissionLevel: string;
  normalizedUrl: string | null;
  supported: boolean;
  alreadyImported: boolean;
}

export default function AddSiteFlow({ floating = false }: { floating?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"choice" | "manual" | "google">("choice");
  const [manualUrl, setManualUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlParam = searchParams.get("url");
    if (urlParam && !open) {
      setManualUrl(urlParam);
      // Auto-start GSC flow to see if we can find it
      void loadGscSites(urlParam);
      setOpen(true);
    }
  }, [searchParams]);
  
  // Google Console State
  const [gscLoading, setGscLoading] = useState(false);
  const [gscSites, setGscSites] = useState<GscProperty[]>([]);
  const [selection, setSelection] = useState<Set<string>>(new Set());
  const [importing, setImporting] = useState(false);

  const reset = () => {
    setStep("choice");
    setManualUrl("");
    setSelection(new Set());
    setOpen(false);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl) return;
    
    setLoading(true);
    try {
      const response = await fetch("/api/websites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: manualUrl }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to add site");
      
      toast.success("Site added successfully");
      reset();
      router.refresh();
      if (data.website?.id) {
        router.push(`/sites/url?siteId=${data.website.id}`);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadGscSites = async (autoSelectUrl?: string) => {
    setStep("google");
    setGscLoading(true);
    try {
      const response = await fetch("/api/gsc/sites", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
         if (response.status === 400 || response.status === 401) {
            const returnPath = autoSelectUrl ? `/sites?url=${encodeURIComponent(autoSelectUrl)}` : "/sites";
            window.location.href = `/api/gsc/oauth/start?returnTo=${encodeURIComponent(returnPath)}`;
            return;
         }
         throw new Error(data.error || "Failed to load Google sites");
      }
      const sites = (data.sites || []) as GscProperty[];
      setGscSites(sites);
      
      if (autoSelectUrl) {
        const normalizedInput = autoSelectUrl.toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
        const match = sites.find((s) => {
          const normalizedProp = s.propertyUrl.toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "").replace(/^sc-domain:/, "");
          return normalizedProp === normalizedInput;
        });
        
        if (match && !match.alreadyImported) {
          setSelection(new Set([match.propertyUrl]));
        } else if (!match) {
          setStep("manual");
        }
      }
    } catch (err: any) {
      toast.error(err.message);
      if (!autoSelectUrl) setStep("choice");
    } finally {
      setGscLoading(false);
    }
  };

  const handleGoogleImport = async () => {
    if (selection.size === 0) return;
    setImporting(true);
    try {
      const response = await fetch("/api/gsc/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedSiteUrls: Array.from(selection) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Import failed");
      
      toast.success(data.message || "Import complete");
      reset();
      router.refresh();
      if (data.imported && data.imported.length > 0) {
        router.push(`/sites/url?siteId=${data.imported[0].id}`);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { if(!val) reset(); setOpen(val); }}>
      <DialogTrigger asChild>
        {floating ? (
          <button
            className="group flex h-14 w-14 items-center justify-center rounded-full bg-zinc-950 shadow-2xl shadow-black/40 ring-1 ring-white/10 transition-all duration-300 hover:scale-110 hover:shadow-primary/30 dark:bg-white"
            title="Add Website"
            aria-label="Add Website"
          >
            <span aria-hidden="true">
              <Plus className="h-6 w-6 text-white dark:text-zinc-950 transition-transform duration-300 group-hover:rotate-90" />
            </span>
          </button>
        ) : (
          <Button className="rounded-full bg-zinc-950 dark:bg-white dark:text-zinc-950 font-bold px-6 h-10 gap-2">
            <Plus className="h-4 w-4" />
            Add Website
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-[32px] border-none shadow-2xl">
        <div className="p-8">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold tracking-tight text-center">
              {step === "choice" && "Add Site"}
              {step === "manual" && "Enter URL"}
              {step === "google" && "Select Properties"}
            </DialogTitle>
            <DialogDescription className="text-center text-sm">
              {step === "choice" && "Choose how you want to add your site"}
              {step === "manual" && "Type the website address"}
              {step === "google" && "Import from Google Search Console"}
            </DialogDescription>
          </DialogHeader>

          {step === "choice" && (
            <div className="grid gap-4">
              <button 
                onClick={loadGscSites}
                className="flex items-center gap-4 p-5 rounded-2xl border border-zinc-100 hover:border-rose-500/30 hover:bg-rose-500/[0.02] transition-all text-left group"
              >
                <div className="h-12 w-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0 group-hover:scale-110 transition-transform">
                  <Globe className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-zinc-900 dark:text-zinc-100">Google Search Console</p>
                  <p className="text-xs text-zinc-500">Import sites you already own</p>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-300 group-hover:text-rose-500 transition-colors" />
              </button>

              <button 
                onClick={() => setStep("manual")}
                className="flex items-center gap-4 p-5 rounded-2xl border border-zinc-100 hover:border-zinc-300 hover:bg-zinc-50 dark:border-white/5 dark:hover:bg-white/5 transition-all text-left group"
              >
                <div className="h-12 w-12 rounded-xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-zinc-600 dark:text-zinc-400 shrink-0 group-hover:scale-110 transition-transform">
                  <Plus className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-zinc-900 dark:text-zinc-100">Add Manually</p>
                  <p className="text-xs text-zinc-500">Enter a single URL</p>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
              </button>
            </div>
          )}

          {step === "manual" && (
            <form onSubmit={handleManualSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="url" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Website URL</Label>
                <Input 
                  id="url"
                  placeholder="https://example.com" 
                  value={manualUrl}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setManualUrl(e.target.value)}
                  className="h-12 rounded-xl bg-zinc-50 border-none dark:bg-white/5"
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="ghost" onClick={() => setStep("choice")} className="flex-1 h-12 rounded-xl font-bold">Back</Button>
                <Button type="submit" disabled={loading} className="flex-[2] h-12 rounded-xl font-bold">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Website"}
                </Button>
              </div>
            </form>
          )}

          {step === "google" && (
            <div className="space-y-6">
              <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {gscLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-4">
                    <Spinner className="h-6 w-6" />
                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest animate-pulse">Syncing...</p>
                  </div>
                ) : gscSites.filter(s => !s.alreadyImported).length === 0 ? (
                   <div className="py-6 flex flex-col items-center text-center gap-5">
                      <div className="h-14 w-14 rounded-2xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center">
                        <Globe className="h-7 w-7 text-zinc-400" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-zinc-800 dark:text-zinc-200 text-sm">No new sites found</p>
                        <p className="text-xs text-zinc-500 max-w-[280px]">
                          All your Google Console properties are already imported, or your session needs refreshing.
                        </p>
                      </div>
                      <div className="w-full grid gap-3">
                        <button
                          onClick={() => { window.location.href = "/api/gsc/oauth/start?returnTo=/sites"; }}
                          className="flex items-center gap-3 p-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 transition-all text-left group w-full"
                        >
                          <div className="h-9 w-9 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
                            <RefreshCw className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">Reconnect Google</p>
                            <p className="text-[11px] text-zinc-500">Re-authenticate and refresh properties</p>
                          </div>
                        </button>
                        <button
                          onClick={() => setStep("manual")}
                          className="flex items-center gap-3 p-4 rounded-2xl border border-zinc-100 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-white/5 transition-all text-left group w-full"
                        >
                          <div className="h-9 w-9 rounded-xl bg-zinc-100 dark:bg-white/5 flex items-center justify-center text-zinc-600 dark:text-zinc-400 shrink-0">
                            <Plus className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">Add Manually</p>
                            <p className="text-[11px] text-zinc-500">Enter a site URL directly</p>
                          </div>
                        </button>
                      </div>
                   </div>
                ) : (
                  gscSites.filter(s => !s.alreadyImported).map((site) => (
                    <div 
                      key={site.propertyUrl}
                      onClick={() => {
                        setSelection(prev => {
                          const next = new Set(prev);
                          if (next.has(site.propertyUrl)) next.delete(site.propertyUrl);
                          else next.add(site.propertyUrl);
                          return next;
                        });
                      }}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all",
                        selection.has(site.propertyUrl) 
                          ? "bg-rose-500/5 border-rose-500/20" 
                          : "bg-zinc-50 border-transparent hover:border-zinc-200 dark:bg-white/5"
                      )}
                    >
                      <div className={cn(
                        "h-5 w-5 rounded border-2 flex items-center justify-center transition-all",
                        selection.has(site.propertyUrl) ? "bg-rose-500 border-rose-500" : "border-zinc-300 dark:border-white/10"
                      )}>
                        {selection.has(site.propertyUrl) && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <span className="text-sm font-medium truncate flex-1">{site.propertyUrl}</span>
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="ghost" onClick={() => setStep("choice")} className="flex-1 h-12 rounded-xl font-bold">Back</Button>
                <Button 
                  onClick={handleGoogleImport} 
                  disabled={selection.size === 0 || importing} 
                  className="flex-[2] h-12 rounded-xl font-bold bg-zinc-950 dark:bg-white dark:text-zinc-950"
                >
                  {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : `Import ${selection.size} ${selection.size === 1 ? 'Site' : 'Sites'}`}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
