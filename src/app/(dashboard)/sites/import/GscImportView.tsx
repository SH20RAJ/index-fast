"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { 
  Globe, 
  Search, 
  RefreshCw, 
  Check, 
  ArrowLeft,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { useLogs } from "@/components/dashboard/LogContext";

interface GscProperty {
  propertyUrl: string;
  permissionLevel: string;
  normalizedUrl: string | null;
  supported: boolean;
  alreadyImported: boolean;
}

interface GscSitesResponse {
  connected: boolean;
  sites: GscProperty[];
  error?: string;
}

export default function GscImportView({ planName }: { planName: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addLog, setIsTerminalOpen } = useLogs();

  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [sites, setSites] = useState<GscProperty[]>([]);
  const [selection, setSelection] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const targetUrl = searchParams.get("url");

  function logStep(message: string, status: "success" | "failed" | "pending" = "pending") {
    addLog({ url: "GSC Import", engine: "Discovery", status, message });
  }

  const loadSites = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/gsc/sites", { cache: "no-store" });
      const data = (await response.json()) as GscSitesResponse;

      if (!response.ok) {
        throw new Error(data.error || "Failed to load GSC properties.");
      }

      setSites(data.sites || []);
      
      // Auto-select match if coming from a specific URL
      if (targetUrl) {
        const normalizedTarget = targetUrl.replace(/\/$/, '');
        const match = data.sites.find(s => 
          s.propertyUrl === targetUrl || 
          s.normalizedUrl === normalizedTarget ||
          s.propertyUrl.includes(normalizedTarget)
        );
        if (match && !match.alreadyImported) {
          setSelection(new Set([match.propertyUrl]));
        }
      }
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSites();
  }, []);

  const selectableSites = useMemo(
    () => sites.filter((site) => site.supported && !site.alreadyImported),
    [sites]
  );

  const filteredSites = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return selectableSites;
    return selectableSites.filter(site => 
      site.propertyUrl.toLowerCase().includes(query) || 
      site.normalizedUrl?.toLowerCase().includes(query)
    );
  }, [selectableSites, searchQuery]);

  const handleImport = async () => {
    if (selection.size === 0) return;

    setImporting(true);
    logStep(`Importing ${selection.size} sites...`, "pending");
    setIsTerminalOpen(true);

    try {
      const response = await fetch("/api/gsc/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedSiteUrls: Array.from(selection) }),
      });

      const payload = await response.json();

      if (!response.ok) throw new Error(payload.error || "Import failed.");

      toast.success(payload.message || "Import complete!");
      logStep("Import successful", "success");
      
      if (payload.imported && payload.imported.length > 0) {
        router.push(`/sites/url?siteId=${payload.imported[0].id}`);
      } else {
        router.push("/sites");
      }
    } catch (err: any) {
      toast.error(err.message);
      logStep(`Import failed: ${err.message}`, "failed");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push("/sites")}
            className="rounded-full hover:bg-zinc-100 dark:hover:bg-white/5 -ml-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Websites
          </Button>
          
          <Badge className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-none px-4 py-1.5 rounded-full font-bold uppercase tracking-[0.1em] text-[10px]">
             <Sparkles className="mr-1.5 h-3 w-3" /> Available for Premium Plan
          </Badge>
        </div>

        <Card className="rounded-3xl sm:rounded-[40px] border-none shadow-2xl shadow-rose-500/5 bg-white dark:bg-zinc-950 overflow-hidden">
          <CardHeader className="p-6 sm:p-10 pb-4 text-center">
            <div className="mx-auto h-16 w-16 rounded-3xl bg-rose-500/10 flex items-center justify-center text-rose-500 mb-6">
              <Globe className="h-8 w-8" />
            </div>
            <CardTitle className="text-2xl sm:text-4xl font-black italic tracking-tight">Select GSC Properties</CardTitle>
            <CardDescription className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm sm:text-base">
              Choose the properties you want to sync with IndexFast.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 sm:p-10 pt-4 space-y-6">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-rose-500 transition-colors" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search properties..."
                className="pl-12 h-14 bg-zinc-50 border-none rounded-2xl focus-visible:ring-rose-500/20 dark:bg-white/5 text-base"
              />
            </div>

            <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2 custom-scrollbar min-h-[250px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4 text-zinc-400">
                  <Spinner className="h-8 w-8" />
                  <p className="text-[10px] font-bold uppercase tracking-widest animate-pulse">Syncing with Google Console...</p>
                </div>
              ) : filteredSites.length === 0 ? (
                <div className="py-24 text-center text-zinc-500 bg-zinc-50/50 dark:bg-white/[0.01] rounded-3xl border-2 border-dashed border-zinc-100 dark:border-white/5">
                  <p className="font-light italic text-zinc-400">No importable properties found.</p>
                  <Button variant="link" onClick={loadSites} className="mt-2 text-rose-500 font-bold uppercase tracking-widest text-[10px]">
                    <RefreshCw className="mr-2 h-3 w-3" /> Refresh Scan
                  </Button>
                </div>
              ) : (
                filteredSites.map((site) => (
                  <div 
                    key={site.propertyUrl} 
                    className={cn(
                      "flex items-center gap-4 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border transition-all cursor-pointer group/item",
                      selection.has(site.propertyUrl) 
                        ? "bg-rose-500/5 border-rose-500/20 shadow-sm" 
                        : "bg-white border-zinc-100 hover:border-zinc-200 dark:bg-zinc-900 dark:border-white/5"
                    )}
                    onClick={() => {
                      setSelection(prev => {
                        const next = new Set(prev);
                        if (next.has(site.propertyUrl)) next.delete(site.propertyUrl);
                        else next.add(site.propertyUrl);
                        return next;
                      });
                    }}
                  >
                    <div className={cn(
                      "h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0",
                      selection.has(site.propertyUrl) 
                        ? "bg-rose-500 border-rose-500" 
                        : "border-zinc-200 dark:border-white/10"
                    )}>
                      {selection.has(site.propertyUrl) && <Check className="h-4 w-4 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base font-bold truncate text-zinc-900 dark:text-zinc-100">{site.propertyUrl}</p>
                      <p className="text-[10px] uppercase font-black text-zinc-400 tracking-widest mt-1 opacity-70">{site.permissionLevel}</p>
                    </div>
                    <div className="opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0 hidden sm:block">
                       <ChevronRight className="h-4 w-4 text-rose-500" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>

          <CardFooter className="p-6 sm:p-10 pt-0 flex flex-col sm:flex-row gap-6 items-center sm:justify-between border-t border-zinc-50 dark:border-white/5 bg-zinc-50/30 dark:bg-white/[0.01]">
            <div className="flex items-center gap-8 w-full sm:w-auto justify-center sm:justify-start">
              <button 
                className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-rose-500 transition-colors"
                onClick={() => setSelection(new Set(filteredSites.map(s => s.propertyUrl)))}
              >
                Select All
              </button>
              <button 
                className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                onClick={() => setSelection(new Set())}
              >
                Clear
              </button>
            </div>
            <Button 
              disabled={selection.size === 0 || importing} 
              onClick={handleImport}
              className="w-full sm:w-auto rounded-full px-12 h-14 bg-zinc-950 hover:bg-zinc-900 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-zinc-950/20"
            >
              {importing ? <Spinner className="mr-3 h-4 w-4" /> : <RefreshCw className={cn("mr-3 h-4 w-4", importing && "animate-spin")} />}
              Import {selection.size > 0 ? `${selection.size} Prop${selection.size === 1 ? 'erty' : 'erties'}` : "Sites"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
