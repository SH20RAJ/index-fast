"use client";

import { useState, useEffect, useMemo, useActionState } from "react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Plus, 
  Globe, 
  RefreshCw, 
  Trash2, 
  BarChart3, 
  CheckCircle2, 
  Edit, 
  Clock, 
  ChevronDown, 
  Search,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  MoreVertical,
  X,
  Archive,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import PageHeader from "@/components/dashboard/PageHeader";
import CronJobManager, { type CronJob } from "@/components/dashboard/CronJobManager";
import { useLogs } from "@/components/dashboard/LogContext";
import {
  buildBingIndexNowPortalUrl,
  buildGoogleSearchConsolePropertyUrl,
} from "@/lib/utils";
import {
  addWebsiteAction,
  deleteWebsiteAction,
  runWebsiteSyncAction,
  refreshGscMetadataAction,
  updateWebsiteIndexingKeysAction,
} from "@/app/(dashboard)/actions";
import { defaultActionState, type ActionState } from "@/app/(dashboard)/action-state";

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

interface WebsiteRecord {
  id: string;
  url: string;
  sitemapUrl: string | null;
  indexNowKey: string | null;
  bingApiKey: string | null;
  yandexToken: string | null;
  baiduToken: string | null;
  naverToken: string | null;
  siteHealth: unknown;
  gscConnected: boolean | null;
  lastSyncAt: Date | null;
}

interface SitesViewProps {
  initialSites: WebsiteRecord[];
  planName: string;
  websiteLimit: number;
}

export default function SitesView({ initialSites, planName, websiteLimit }: SitesViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [gscLoading, setGscLoading] = useState(false);
  const [gscImporting, setGscImporting] = useState(false);
  const [gscConnected, setGscConnected] = useState(false);
  const [gscSites, setGscSites] = useState<GscProperty[]>([]);
  const [gscSelection, setGscSelection] = useState<Set<string>>(new Set());
  const [gscError, setGscError] = useState<string | null>(null);
  const [gscStatusMessage, setGscStatusMessage] = useState<string | null>(null);
  const { addLog, setIsTerminalOpen } = useLogs();
  const [editingSiteId, setEditingSiteId] = useState<string | null>(null);
  const [moreActionsSiteId, setMoreActionsSiteId] = useState<string | null>(null);
  const [cronSiteId, setCronSiteId] = useState<string | null>(null);
  const [cronJobsBySite, setCronJobsBySite] = useState<Record<string, CronJob[]>>({});
  const [cronLoadingBySite, setCronLoadingBySite] = useState<Record<string, boolean>>({});
  const [cronErrorBySite, setCronErrorBySite] = useState<Record<string, string | null>>({});
  const [gscPanelExpanded, setGscPanelExpanded] = useState(false);
  const [siteSearchQuery, setSiteSearchQuery] = useState("");
  const [gscSearchQuery, setGscSearchQuery] = useState("");

  const [createState, createAction, createPending] = useActionState<ActionState, FormData>(
    addWebsiteAction,
    defaultActionState
  );
  const [syncState, syncAction, syncPending] = useActionState<ActionState, FormData>(
    runWebsiteSyncAction,
    defaultActionState
  );
  const [deleteState, deleteAction, deletePending] = useActionState<ActionState, FormData>(
    deleteWebsiteAction,
    defaultActionState
  );
  const [refreshState, refreshAction, refreshPending] = useActionState<ActionState, FormData>(
    refreshGscMetadataAction,
    defaultActionState
  );
  const [updateKeysState, updateKeysAction, updateKeysPending] = useActionState<ActionState, FormData>(
    updateWebsiteIndexingKeysAction,
    defaultActionState
  );

  const isPremium = planName.toLowerCase() !== "free";

  const slotsLeft = Math.max(0, websiteLimit - initialSites.length);

  const selectableSites = useMemo(
    () => gscSites.filter((site) => site.supported && !site.alreadyImported),
    [gscSites]
  );

  const filteredGscSites = useMemo(() => {
    const query = gscSearchQuery.trim().toLowerCase();
    if (!query) return selectableSites;
    return selectableSites.filter(site => 
      site.propertyUrl.toLowerCase().includes(query) || 
      site.normalizedUrl?.toLowerCase().includes(query)
    );
  }, [selectableSites, gscSearchQuery]);

  const filteredSites = useMemo(() => {
    const query = siteSearchQuery.trim().toLowerCase();
    if (!query) {
      return initialSites;
    }

    return initialSites.filter((site) =>
      [site.url, site.sitemapUrl ?? "", site.lastSyncAt ? new Date(site.lastSyncAt).toLocaleString() : ""]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [initialSites, siteSearchQuery]);

  const gscConnectedCount = useMemo(
    () => initialSites.filter((site) => Boolean(site.gscConnected)).length,
    [initialSites]
  );

  const credentialsCompleteCount = useMemo(
    () =>
      initialSites.filter((site) => Boolean(site.indexNowKey) && Boolean(site.bingApiKey) && Boolean(getIndexNowKeyLocationUrl(site)))
        .length,
    [initialSites]
  );

  function getIndexNowKeyLocationUrl(site: WebsiteRecord) {
    if (!site.siteHealth || typeof site.siteHealth !== "object") {
      return "";
    }

    const root = site.siteHealth as Record<string, unknown>;
    const indexing = root.indexing as Record<string, unknown> | undefined;
    const indexNow = indexing?.indexNow as Record<string, unknown> | undefined;
    const keyLocationUrl = indexNow?.keyLocationUrl;
    return typeof keyLocationUrl === "string" ? keyLocationUrl : "";
  }

  function logStep(message: string, status: "success" | "failed" | "pending" = "pending") {
    addLog({ url: "GSC Import", engine: "Discovery", status, message });
    setIsTerminalOpen(true);
  }

  async function loadCronJobs(siteId: string) {
    setCronLoadingBySite((prev) => ({ ...prev, [siteId]: true }));
    setCronErrorBySite((prev) => ({ ...prev, [siteId]: null }));
    try {
      const response = await fetch(`/api/websites/${siteId}/cron-jobs`, { cache: "no-store" });
      const payload = (await response.json()) as { jobs?: CronJob[]; error?: string };
      if (!response.ok) {
        throw new Error(payload.error || "Failed to load cron jobs.");
      }
      setCronJobsBySite((prev) => ({ ...prev, [siteId]: payload.jobs ?? [] }));
    } catch (error) {
      setCronErrorBySite((prev) => ({
        ...prev,
        [siteId]: error instanceof Error ? error.message : "Failed to load cron jobs.",
      }));
    } finally {
      setCronLoadingBySite((prev) => ({ ...prev, [siteId]: false }));
    }
  }

  async function loadGscSites() {
    setGscLoading(true);
    setGscError(null);
    logStep("Fetching GSC properties...");
    try {
      const response = await fetch("/api/gsc/sites", { cache: "no-store" });
      const data = (await response.json()) as GscSitesResponse;

      if (!response.ok) {
        throw new Error(data.error || "Failed to load GSC properties.");
      }

      setGscConnected(Boolean(data.connected));
      setGscSites(data.sites || []);
      setGscSelection(new Set());
      logStep(`Loaded ${data.sites?.length ?? 0} properties from Google Search Console.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load GSC properties.";
      setGscError(message);
      setGscConnected(false);
      setGscSites([]);
      logStep(`Failed to fetch properties: ${message}`);
    } finally {
      setGscLoading(false);
    }
  }

  async function importSelectedGscSites() {
    if (gscSelection.size === 0) {
      setGscError("Select at least one property to import.");
      return;
    }

    setGscImporting(true);
    setGscError(null);
    setGscStatusMessage(null);
    logStep(`Import started for ${gscSelection.size} selected propert${gscSelection.size === 1 ? "y" : "ies"}.`);

    try {
      const response = await fetch("/api/gsc/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedSiteUrls: Array.from(gscSelection) }),
      });

      const payload = (await response.json()) as {
        message?: string;
        error?: string;
        importedCount?: number;
        skippedCount?: number;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Import failed.");
      }

      const message = payload.message || "Import complete.";
      setGscStatusMessage(message);
      logStep(
        `Import completed: ${payload.importedCount ?? 0} added, ${payload.skippedCount ?? 0} skipped.`,
        "success"
      );


    } catch (error) {
      const message = error instanceof Error ? error.message : "Import failed.";
      setGscError(message);
      logStep(`Import failed: ${message}`, "failed");
    } finally {
      setGscImporting(false);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gscStatus = params.get("gsc");
    const gscMessage = params.get("gsc_message");
    const targetUrl = params.get("url");

    async function handleGscCallback() {
      if (gscStatus === "connected") {
        setGscStatusMessage("Google connected. Selecting property...");
        logStep("Google OAuth completed successfully.");
        setGscPanelExpanded(true);
        
        try {
          // Fetch sites
          setGscLoading(true);
          const response = await fetch("/api/gsc/sites", { cache: "no-store" });
          const data = (await response.json()) as GscSitesResponse;
          
          if (!response.ok) throw new Error(data.error || "Failed to load GSC sites");
          
          setGscConnected(true);
          setGscSites(data.sites || []);
          logStep(`Loaded ${data.sites?.length ?? 0} properties.`);

          // If we have a target URL, try to auto-import it
          if (targetUrl) {
            const normalizedTarget = new URL(targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`).origin;
            const match = data.sites.find(s => 
              s.propertyUrl === targetUrl || 
              s.normalizedUrl === normalizedTarget ||
              s.propertyUrl === `sc-domain:${new URL(normalizedTarget).hostname}`
            );

            if (match && !match.alreadyImported) {
              logStep(`Auto-selecting ${match.propertyUrl} for import...`);
              setGscSelection(new Set([match.propertyUrl]));
              
              // We need to wait for state to potentially update or just use the value directly
              setGscImporting(true);
              const importRes = await fetch("/api/gsc/import", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ selectedSiteUrls: [match.propertyUrl] }),
              });
              
              const importData = await importRes.json();
              if (importRes.ok) {

              } else {
                throw new Error(importData.error || "Auto-import failed");
              }
            } else if (match?.alreadyImported) {
              setGscStatusMessage(`Property ${targetUrl} is already imported.`);
              toast.info("Site already exists in your list.");
            } else {
              setGscStatusMessage(`Google connected. Could not find an exact match for ${targetUrl}. Please select it manually.`);
            }
          }
        } catch (e: any) {
          setGscError(e.message);
          logStep(`GSC Callback Error: ${e.message}`);
        } finally {
          setGscLoading(false);
          setGscImporting(false);
        }
      }
    }

    if (gscStatus === "connected") {
      router.push(`/sites/import?gsc=connected${targetUrl ? `&url=${encodeURIComponent(targetUrl)}` : ""}`);
    }

    if (gscStatus === "error") {
      const message = gscMessage || "Google OAuth failed. Please try again.";
      setGscError(message);
      logStep(`Google OAuth error: ${message}`);
    }

    if (gscStatus || gscMessage) {
      // We only clear params if we're NOT doing a redirect in the callback handler
      if (gscStatus !== "connected" || !targetUrl) {
        params.delete("gsc");
        params.delete("gsc_message");
        const nextQuery = params.toString();
        const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}`;
        window.history.replaceState({}, "", nextUrl);
      }
    }
  }, []);

  return (
    <div className="space-y-8 pb-10 max-w-5xl">
      <div className="flex flex-col gap-10">
        <PageHeader
          title="Websites"
          description="Manage your sites and track their indexing status."
          action={
            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-100 dark:bg-white/5 px-4 py-2 rounded-full border border-zinc-200 dark:border-white/10">
              {initialSites.length} / {websiteLimit} sites used
            </div>
          }
        />

        <div className="space-y-4">
          {searchParams.get("url") && (
            <Alert className="rounded-[32px] p-6 border-none shadow-2xl bg-zinc-950 text-white dark:bg-zinc-900 overflow-hidden relative mb-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                 <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-rose-500 flex items-center justify-center shrink-0">
                      <Plus className="h-6 w-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <AlertTitle className="text-lg font-bold tracking-tight">New Property Discovery</AlertTitle>
                      <AlertDescription className="text-zinc-400 font-medium truncate">
                        Ready to import <span className="text-white italic">{searchParams.get("url")}</span>?
                      </AlertDescription>
                    </div>
                 </div>
                 <Button 
                  onClick={() => window.location.href = `/api/gsc/oauth/start?returnTo=/sites/import&url=${encodeURIComponent(searchParams.get("url")!)}`}
                  className="bg-rose-500 text-white hover:bg-rose-600 rounded-full px-8 font-black uppercase tracking-widest h-12 shadow-xl shrink-0"
                 >
                   <Globe className="mr-2 h-4 w-4" /> Import Now
                 </Button>
              </div>
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                 <Sparkles className="h-24 w-24 text-white" />
              </div>
            </Alert>
          )}

          {gscError && gscError.toLowerCase().includes("token") && (
            <Alert variant="destructive" className="rounded-[32px] p-6 border-none shadow-2xl bg-rose-500 text-white dark:bg-rose-600">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                    <AlertCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <AlertTitle className="text-lg font-bold">Authentication Required</AlertTitle>
                    <AlertDescription className="text-white/80 font-medium">
                      Your Google Search Console session has expired. Re-authenticate to resume syncing.
                    </AlertDescription>
                  </div>
                </div>
                <Button 
                  onClick={() => window.location.href = "/api/gsc/oauth/start?returnTo=/sites/import"}
                  className="bg-white text-rose-500 hover:bg-zinc-100 rounded-full px-8 font-black uppercase tracking-widest h-12 shadow-xl"
                >
                  <RefreshCw className="mr-2 h-4 w-4" /> Reconnect Google
                </Button>
              </div>
            </Alert>
          )}

          {createState.status === "error" && (
            <Alert variant="destructive" className="rounded-2xl border-none shadow-sm">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="font-medium">{createState.message}</AlertDescription>
            </Alert>
          )}
        </div>

        <section className="space-y-6 py-6">
          <div className="flex flex-col items-center justify-center text-center space-y-3 max-w-2xl mx-auto">
             <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Connect Google Console</h2>
             <p className="text-zinc-500 text-sm">Import your websites directly from Google Search Console to start indexing.</p>
          </div>

          <div className="flex justify-center max-w-lg mx-auto">
            <Button
              variant="outline"
              onClick={() => {
                logStep("Connecting to Google...");
                window.location.href = "/api/gsc/oauth/start?returnTo=/sites/import";
              }}
              className="w-full group relative h-24 rounded-3xl border-2 border-dashed border-zinc-200 hover:border-rose-500/50 hover:bg-rose-500/[0.02] transition-all duration-300"
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-base font-bold text-zinc-950 dark:text-white">Connect Google Console</span>
                <p className="text-xs text-zinc-400">Import your sites at once</p>
              </div>
            </Button>
          </div>
        </section>


        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-100 dark:border-white/5 pb-4 gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Your Websites</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => router.push("/sites/import")}
                className="rounded-full bg-zinc-100 dark:bg-white/5 text-[10px] font-bold uppercase tracking-widest px-3 hover:bg-rose-500 hover:text-white transition-all"
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Site
              </Button>
            </div>
            <div className="relative w-full md:w-72 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-rose-500 transition-colors" />
              <Input
                value={siteSearchQuery}
                onChange={(event) => setSiteSearchQuery(event.target.value)}
                placeholder="Search your sites..."
                className="pl-10 h-10 bg-zinc-50 border-none rounded-xl focus-visible:ring-rose-500/20 dark:bg-white/5 transition-all"
              />
            </div>
          </div>
          
          <div className="grid gap-4">
            {initialSites.length === 0 ? (
              <div className="py-20 text-center rounded-[32px] bg-zinc-50/50 border-2 border-dashed border-zinc-200 dark:bg-white/[0.02] dark:border-white/5">
                <Globe className="mx-auto h-10 w-10 text-zinc-200" />
                <p className="mt-4 text-sm font-light text-zinc-500 italic">Whisper your first domain to the algorithm.</p>
              </div>
            ) : (
              filteredSites.map((site) => (
                <Card key={site.id} className="group relative overflow-hidden rounded-[32px] border-zinc-200 bg-white transition-all hover:shadow-xl hover:shadow-black/5 dark:bg-zinc-900/40 dark:border-white/5 dark:shadow-none">
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="h-12 w-12 rounded-2xl bg-zinc-50 flex items-center justify-center shrink-0 dark:bg-white/5">
                          <Globe className="h-5 w-5 text-zinc-400 group-hover:text-rose-500 transition-colors" />
                        </div>
                        <div className="min-w-0 space-y-1">
                          <h4 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 truncate tracking-tight">{site.url}</h4>
                          <div className="flex items-center gap-3 text-xs text-zinc-400 font-light">
                            <span className="flex items-center gap-1.5">
                              {site.gscConnected ? <div className="h-1 w-1 rounded-full bg-pink-500" /> : <div className="h-1 w-1 rounded-full bg-zinc-300" />}
                              GSC Sync
                            </span>
                            <span className="flex items-center gap-1.5">
                              {site.indexNowKey ? <div className="h-1 w-1 rounded-full bg-pink-500" /> : <div className="h-1 w-1 rounded-full bg-zinc-300" />}
                              Keys Ready
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button asChild variant="outline" className="h-11 rounded-full px-6 border-zinc-200 hover:border-rose-500/50 hover:bg-rose-500/5 dark:border-white/10 font-bold text-xs uppercase tracking-widest">
                          <Link href={`/sites/url?siteId=${site.id}`}>
                            Manage URLs
                          </Link>
                        </Button>
                        <Button variant="secondary" size="icon" className="h-11 w-11 rounded-full" onClick={() => setMoreActionsSiteId(moreActionsSiteId === site.id ? null : site.id)}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Collapsible open={moreActionsSiteId === site.id}>
                    <CollapsibleContent className="border-t border-zinc-50 bg-zinc-50/30 p-4 dark:border-white/5 dark:bg-black/20">
                      <div className="flex flex-wrap gap-2 justify-end">
                        <Button variant="ghost" size="sm" className="text-xs font-bold text-zinc-500 uppercase tracking-widest rounded-full px-4 hover:bg-rose-500/5 hover:text-rose-500" onClick={() => setCronSiteId(cronSiteId === site.id ? null : site.id)}>
                          Automation
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs font-bold text-zinc-500 uppercase tracking-widest rounded-full px-4 hover:bg-rose-500/5 hover:text-rose-500" onClick={() => setEditingSiteId(editingSiteId === site.id ? null : site.id)}>
                          Settings
                        </Button>
                        <form action={deleteAction}>
                          <input type="hidden" name="websiteId" value={site.id} />
                          <Button type="submit" variant="ghost" size="sm" className="text-xs font-bold text-rose-500 uppercase tracking-widest rounded-full px-4 hover:bg-rose-500 hover:text-white">
                            Delete
                          </Button>
                        </form>
                      </div>

                      <Collapsible open={editingSiteId === site.id}>
                        <div className="mt-4 p-6 bg-white rounded-3xl dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-white/10">
                          {/* edit form simplified... */}
                          <form action={updateKeysAction} className="space-y-6">
                            <input type="hidden" name="websiteId" value={site.id} />
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="space-y-1.5">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Sitemap</Label>
                                <Input name="sitemapUrl" defaultValue={site.sitemapUrl || ""} className="rounded-xl h-10 border-zinc-100 dark:bg-white/5" />
                              </div>
                              <div className="space-y-1.5">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">IndexNow Key</Label>
                                <Input name="indexNowKey" defaultValue={site.indexNowKey || ""} className="rounded-xl h-10 border-zinc-100 dark:bg-white/5" />
                              </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 mt-4">
                              <div className="space-y-1.5">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Bing API Key</Label>
                                <Input name="bingApiKey" defaultValue={site.bingApiKey || ""} className="rounded-xl h-10 border-zinc-100 dark:bg-white/5" />
                              </div>
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Yandex Token</Label>
                                  <Badge className="h-4 px-1 text-[8px] bg-rose-500/10 text-rose-500 border-none uppercase font-black">Beta</Badge>
                                </div>
                                <Input name="yandexToken" defaultValue={site.yandexToken || ""} className="rounded-xl h-10 border-zinc-100 dark:bg-white/5" placeholder="Yandex OAuth Token..." />
                              </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 mt-4">
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Baidu Token</Label>
                                  <Badge className="h-4 px-1 text-[8px] bg-rose-500/10 text-rose-500 border-none uppercase font-black">Beta</Badge>
                                </div>
                                <Input name="baiduToken" defaultValue={site.baiduToken || ""} className="rounded-xl h-10 border-zinc-100 dark:bg-white/5" placeholder="Baidu Link Submit Token..." />
                              </div>
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Naver Token</Label>
                                  <Badge className="h-4 px-1 text-[8px] bg-rose-500/10 text-rose-500 border-none uppercase font-black">Beta</Badge>
                                </div>
                                <Input name="naverToken" defaultValue={site.naverToken || ""} className="rounded-xl h-10 border-zinc-100 dark:bg-white/5" placeholder="Naver AccessToken..." />
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <Button type="submit" className="rounded-full px-6 text-xs font-bold uppercase tracking-widest h-10">Save</Button>
                            </div>
                          </form>
                        </div>
                      </Collapsible>

                      <Collapsible open={cronSiteId === site.id}>
                        <div className="mt-4 rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm border border-zinc-100 dark:border-white/10">
                          <CronJobManager
                            siteId={site.id}
                            siteUrl={site.url}
                            initialJobs={cronJobsBySite[site.id] || []}
                            isLoading={cronLoadingBySite[site.id]}
                            error={cronErrorBySite[site.id]}
                            onRefresh={() => void loadCronJobs(site.id)}
                          />
                        </div>
                      </Collapsible>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
