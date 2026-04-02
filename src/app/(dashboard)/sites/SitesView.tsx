"use client";
import { useActionState, useEffect, useMemo, useState } from "react";
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
} from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/dashboard/PageHeader";
import CronJobManager, { type CronJob } from "@/components/dashboard/CronJobManager";
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
  const [gscLoading, setGscLoading] = useState(false);
  const [gscImporting, setGscImporting] = useState(false);
  const [gscConnected, setGscConnected] = useState(false);
  const [gscSites, setGscSites] = useState<GscProperty[]>([]);
  const [gscSelection, setGscSelection] = useState<Set<string>>(new Set());
  const [gscError, setGscError] = useState<string | null>(null);
  const [gscStatusMessage, setGscStatusMessage] = useState<string | null>(null);
  const [processLogs, setProcessLogs] = useState<string[]>([]);
  const [editingSiteId, setEditingSiteId] = useState<string | null>(null);
  const [moreActionsSiteId, setMoreActionsSiteId] = useState<string | null>(null);
  const [cronSiteId, setCronSiteId] = useState<string | null>(null);
  const [cronJobsBySite, setCronJobsBySite] = useState<Record<string, CronJob[]>>({});
  const [cronLoadingBySite, setCronLoadingBySite] = useState<Record<string, boolean>>({});
  const [cronErrorBySite, setCronErrorBySite] = useState<Record<string, string | null>>({});
  const [addWebsiteExpanded, setAddWebsiteExpanded] = useState(initialSites.length === 0);
  const [gscPanelExpanded, setGscPanelExpanded] = useState(false);
  const [siteSearchQuery, setSiteSearchQuery] = useState("");

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

  function logStep(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    setProcessLogs((prev) => [`[${timestamp}] ${message}`, ...prev].slice(0, 40));
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
        `Import completed: ${payload.importedCount ?? 0} added, ${payload.skippedCount ?? 0} skipped.`
      );

      await loadGscSites();
      window.location.reload();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Import failed.";
      setGscError(message);
      logStep(`Import failed: ${message}`);
    } finally {
      setGscImporting(false);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gscStatus = params.get("gsc");
    const gscMessage = params.get("gsc_message");

    if (gscStatus === "connected") {
      setGscStatusMessage("Google connected. Select the properties you want to import.");
      logStep("Google OAuth completed successfully.");
      setGscPanelExpanded(true);
      void loadGscSites();
    }

    if (gscStatus === "error") {
      const message = gscMessage || "Google OAuth failed. Please try again.";
      setGscError(message);
      logStep(`Google OAuth error: ${message}`);
    }

    if (gscStatus || gscMessage) {
      params.delete("gsc");
      params.delete("gsc_message");
      const nextQuery = params.toString();
      const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}`;
      window.history.replaceState({}, "", nextUrl);
    }
  }, []);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Websites"
          description="Manage websites and run indexing workflows."
          action={
            <div className="text-sm font-semibold text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full border border-border/50">
              {planName} plan: {initialSites.length} / {websiteLimit} sites
            </div>
          }
        />

        <div className="space-y-4">
          {createState.status !== "idle" && (
            <Alert variant={createState.status === "error" ? "destructive" : "default"}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="capitalize">{createState.status}</AlertTitle>
              <AlertDescription>{createState.message}</AlertDescription>
            </Alert>
          )}
          {syncState.status !== "idle" && (
            <Alert variant={syncState.status === "error" ? "destructive" : "default"}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="capitalize">{syncState.status}</AlertTitle>
              <AlertDescription>{syncState.message}</AlertDescription>
            </Alert>
          )}
          {deleteState.status !== "idle" && (
            <Alert variant={deleteState.status === "error" ? "destructive" : "default"}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="capitalize">{deleteState.status}</AlertTitle>
              <AlertDescription>{deleteState.message}</AlertDescription>
            </Alert>
          )}
          {refreshState.status !== "idle" && (
            <Alert variant={refreshState.status === "error" ? "destructive" : "default"}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="capitalize">{refreshState.status}</AlertTitle>
              <AlertDescription>{refreshState.message}</AlertDescription>
            </Alert>
          )}
          {updateKeysState.status !== "idle" && (
            <Alert variant={updateKeysState.status === "error" ? "destructive" : "default"}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="capitalize">{updateKeysState.status}</AlertTitle>
              <AlertDescription>{updateKeysState.message}</AlertDescription>
            </Alert>
          )}
          {gscError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>GSC Error</AlertTitle>
              <AlertDescription>{gscError}</AlertDescription>
            </Alert>
          )}
          {gscStatusMessage && (
            <Alert className="border-emerald-500/50 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{gscStatusMessage}</AlertDescription>
            </Alert>
          )}
        </div>

        <Card className="overflow-hidden border-border/50 shadow-sm transition-all hover:shadow-md">
          <Accordion type="single" collapsible value={(addWebsiteExpanded ? "add" : undefined) as any} onValueChange={(val: any) => setAddWebsiteExpanded(val === "add")}>
            <AccordionItem value="add" className="border-none">
              <AccordionTrigger className="px-6 py-4 hover:no-underline [&[data-state=open]>div>svg]:rotate-180">
                <div className="flex w-full items-center justify-between text-left">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold tracking-tight">Add Website</h3>
                    <p className="text-sm font-medium text-muted-foreground">
                      Add a domain, sitemap, and optional indexing credentials.
                    </p>
                  </div>
                  <div className={cn(
                    "mr-4 text-xs font-black uppercase tracking-widest",
                    slotsLeft === 0 ? "text-destructive" : "text-muted-foreground/60"
                  )}>
                    {slotsLeft} slot(s) left
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 pt-2">
                <form action={createAction} className="space-y-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        logStep("Opening Google OAuth consent screen...");
                        window.location.href = "/api/gsc/oauth/start?returnTo=/sites";
                      }}
                      className="h-10 font-bold tracking-tight"
                    >
                      <Globe className="mr-2 h-4 w-4 text-primary" />
                      Connect Google Search Console
                    </Button>
                    {gscConnected && (
                      <Button
                        variant="ghost"
                        onClick={() => void loadGscSites()}
                        disabled={gscLoading}
                        className="h-10 font-bold tracking-tight text-muted-foreground hover:text-primary"
                      >
                        {gscLoading ? <Spinner className="mr-2 h-4 w-4" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                        Refresh GSC List
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="url" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Website URL</Label>
                      <Input
                        id="url"
                        name="url"
                        type="url"
                        placeholder="https://example.com"
                        required
                        className="h-11 bg-muted/30 focus-visible:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sitemapUrl" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sitemap URL</Label>
                      <Input
                        id="sitemapUrl"
                        name="sitemapUrl"
                        type="url"
                        placeholder="https://example.com/sitemap.xml"
                        className="h-11 bg-muted/30 focus-visible:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="indexNowKey" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">IndexNow key (optional)</Label>
                      <Input
                        id="indexNowKey"
                        name="indexNowKey"
                        placeholder="e.g. 52627..."
                        className="h-11 bg-muted/30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bingApiKey" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Bing API key (optional)</Label>
                      <Input
                        id="bingApiKey"
                        name="bingApiKey"
                        placeholder="e.g. key_..."
                        className="h-11 bg-muted/30"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="indexNowKeyLocationUrl" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">IndexNow key text URL (optional)</Label>
                    <Input
                      id="indexNowKeyLocationUrl"
                      name="indexNowKeyLocationUrl"
                      type="url"
                      placeholder="https://example.com/your-key.txt"
                      className="h-11 bg-muted/30"
                    />
                    <p className="text-[10px] font-medium text-muted-foreground/70">
                      Used for IndexNow keyLocation validation during auto submission.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={createPending}
                    className="h-11 px-8 font-bold tracking-tight shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {createPending ? <Spinner className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                    Add Website
                  </Button>
                </form>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        {(gscConnected || gscLoading || gscSites.length > 0 || processLogs.length > 0) && (
          <Card className="overflow-hidden border-border/50 shadow-sm">
            <Accordion type="single" collapsible value={(gscPanelExpanded ? "gsc" : undefined) as any} onValueChange={(val: any) => setGscPanelExpanded(val === "gsc")}>
              <AccordionItem value="gsc" className="border-none">
                <AccordionTrigger className="px-6 py-4 hover:no-underline [&[data-state=open]>div>svg]:rotate-180">
                  <div className="flex w-full items-center justify-between text-left">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold tracking-tight">Google Search Console Properties</h3>
                      <p className="text-sm font-medium text-muted-foreground">
                        Select properties to import. URL-prefix and domain properties are both supported.
                      </p>
                    </div>
                    <div className="mr-4 text-xs font-bold text-muted-foreground/60">
                      {selectableSites.length} importable
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6 pt-2">
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="outline"
                        onClick={() => void loadGscSites()}
                        disabled={gscLoading || gscImporting}
                        className="h-9 font-bold tracking-tight"
                      >
                        {gscLoading ? <Spinner className="mr-2 h-4 w-4" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                        Reload List
                      </Button>
                      <Button
                        onClick={() => void importSelectedGscSites()}
                        disabled={gscImporting || gscSelection.size === 0}
                        className="h-9 font-bold tracking-tight"
                      >
                        {gscImporting ? <Spinner className="mr-2 h-4 w-4" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                        {gscImporting ? "Importing…" : `Add Selected (${gscSelection.size})`}
                      </Button>
                    </div>

                    {gscLoading && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
                        <Spinner className="h-4 w-4" />
                        Fetching properties from GSC…
                      </div>
                    )}

                    {!gscLoading && gscSites.length > 0 && (
                      <div className="grid gap-3">
                        {gscSites.map((site) => {
                          const disabled = !site.supported || site.alreadyImported;
                          const checked = gscSelection.has(site.propertyUrl);
                          const helper = site.alreadyImported
                            ? "Already imported"
                            : site.supported
                            ? site.permissionLevel
                            : "Property format unsupported";

                          return (
                            <div
                              key={site.propertyUrl}
                              className={cn(
                                "flex items-center justify-between rounded-xl border p-4 transition-colors",
                                disabled ? "bg-muted/30 opacity-60" : "hover:border-primary/30 hover:bg-primary/5"
                              )}
                            >
                              <div className="flex items-start gap-3">
                                <Checkbox
                                  id={`gsc-${site.propertyUrl}`}
                                  checked={checked}
                                  disabled={disabled}
                                  onCheckedChange={(checked) => {
                                    setGscSelection((prev) => {
                                      const next = new Set(prev);
                                      if (checked) {
                                        next.add(site.propertyUrl);
                                      } else {
                                        next.delete(site.propertyUrl);
                                      }
                                      return next;
                                    });
                                  }}
                                  className="mt-1"
                                />
                                <div className="grid gap-1">
                                  <label
                                    htmlFor={`gsc-${site.propertyUrl}`}
                                    className="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 break-all"
                                  >
                                    {site.propertyUrl}
                                  </label>
                                  {site.normalizedUrl && (
                                    <p className="text-xs text-muted-foreground break-all">
                                      Will add as: {site.normalizedUrl}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <Badge
                                variant={site.alreadyImported ? "secondary" : site.supported ? "default" : "outline"}
                                className="ml-4 shrink-0 font-bold uppercase tracking-wider text-[10px]"
                              >
                                {helper}
                              </Badge>
                            </div>
                          );
                        })}
                        {selectableSites.length === 0 && (
                          <Alert variant="default" className="bg-muted/50 border-none">
                            <AlertCircle className="h-4 w-4 text-primary" />
                            <AlertDescription className="font-medium">No importable new properties were found.</AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}

                    {processLogs.length > 0 && (
                      <div className="rounded-xl border border-dashed p-4 bg-muted/20">
                        <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          Import Process Logs
                        </h4>
                        <div className="space-y-1.5 font-mono text-[11px] leading-relaxed text-muted-foreground">
                          {processLogs.map((entry, i) => (
                            <div key={i} className="flex gap-2">
                              <span className="opacity-30">[{i + 1}]</span>
                              {entry}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="text-sm font-medium text-muted-foreground">
            <span className="font-bold text-foreground">{initialSites.length}</span> total • <span className="font-bold text-foreground">{gscConnectedCount}</span> connected to GSC • <span className="font-bold text-foreground">{credentialsCompleteCount}</span> ready for submission
          </p>

          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              value={siteSearchQuery}
              onChange={(event) => setSiteSearchQuery(event.target.value)}
              placeholder="Search websites..."
              className="pl-10 h-10 bg-muted/30 border-muted-foreground/20 focus-visible:ring-primary/20"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {initialSites.length === 0 ? (
            <Card className="border-dashed py-16 bg-muted/10">
              <CardContent className="flex flex-col items-center justify-center text-center">
                <div className="h-16 w-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                  <Globe className="h-8 w-8 text-primary/30" />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2">No websites yet</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">
                  Add your first website to start syncing sitemap URLs and tracking submissions.
                </p>
              </CardContent>
            </Card>
          ) : filteredSites.length === 0 ? (
            <Card className="border-dashed py-12 bg-muted/10">
              <CardContent className="flex flex-col items-center justify-center text-center">
                <h3 className="text-lg font-bold tracking-tight mb-1">No matching websites</h3>
                <p className="text-muted-foreground">Try a different search term.</p>
              </CardContent>
            </Card>
          ) : (
            filteredSites.map((site) => (
              <Card key={site.id} className="group border-border/50 shadow-sm transition-all hover:shadow-md hover:border-primary/20 overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-bold tracking-tight break-all">
                            {site.url}
                          </h4>
                          {site.gscConnected && (
                            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none font-bold text-[10px] uppercase h-5 px-1.5">
                              GSC
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium truncate">
                          <Globe className="h-3.5 w-3.5 shrink-0" />
                          <span>Sitemap:</span>
                          <span className="text-primary/80 truncate">{site.sitemapUrl || "Not configured"}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] font-bold text-muted-foreground/60 shrink-0 uppercase tracking-wider">
                        <div className="flex items-center gap-1.5">
                          <div className={cn("h-1.5 w-1.5 rounded-full", site.indexNowKey && site.bingApiKey ? "bg-emerald-500" : "bg-amber-500")} />
                          {site.indexNowKey && site.bingApiKey ? "Keys Ready" : "Keys Missing"}
                        </div>
                        <Separator orientation="vertical" className="h-3" />
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          Synced {site.lastSyncAt ? new Date(site.lastSyncAt).toLocaleDateString() : "Never"}
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-primary/5 mb-6" />

                    <div className="flex flex-wrap items-center gap-2">
                      <form action={syncAction} className="w-full sm:w-auto">
                        <input type="hidden" name="websiteId" value={site.id} />
                        <Button 
                          type="submit" 
                          variant="secondary"
                          disabled={syncPending} 
                          className="w-full sm:w-auto h-9 font-bold px-4 bg-primary/10 text-primary hover:bg-primary/20 border-none"
                        >
                          {syncPending ? <Spinner className="mr-2 h-4 w-4" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                          Sync Sitemap
                        </Button>
                      </form>

                      <Button
                        asChild
                        variant="outline"
                        className="w-full sm:w-auto h-9 font-bold px-4 border-primary/20 hover:bg-primary/5 hover:text-primary"
                      >
                        <Link href={`/sites/url?siteId=${site.id}`}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          URLs & Submit
                        </Link>
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => {
                          if (cronSiteId === site.id) {
                            setCronSiteId(null);
                            return;
                          }
                          setCronSiteId(site.id);
                          void loadCronJobs(site.id);
                        }}
                        className={cn(
                          "w-full sm:w-auto h-9 font-bold px-4 transition-all",
                          cronSiteId === site.id ? "bg-primary text-primary-foreground border-primary" : "border-primary/20 hover:bg-primary/5 hover:text-primary"
                        )}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {cronSiteId === site.id ? "Hide Auto Submit" : "Auto Submit"}
                      </Button>

                      <Button
                        variant="ghost"
                        onClick={() => setMoreActionsSiteId((prev) => (prev === site.id ? null : site.id))}
                        className={cn(
                          "w-full sm:w-auto h-9 font-bold text-muted-foreground flex-1 sm:flex-initial",
                          moreActionsSiteId === site.id && "bg-muted"
                        )}
                      >
                        {moreActionsSiteId === site.id ? <X className="mr-2 h-4 w-4" /> : <MoreVertical className="mr-2 h-4 w-4" />}
                        {moreActionsSiteId === site.id ? "Hide Actions" : "More"}
                      </Button>
                    </div>
                  </div>

                  <Collapsible open={moreActionsSiteId === site.id}>
                    <CollapsibleContent className="border-t bg-muted/30">
                      <div className="p-4 flex flex-wrap gap-2">
                        {site.gscConnected && (
                          <form action={refreshAction} className="w-full sm:w-auto">
                            <input type="hidden" name="websiteId" value={site.id} />
                            <Button 
                              type="submit" 
                              variant="outline" 
                              disabled={refreshPending} 
                              className="w-full sm:w-auto h-9 font-bold text-xs bg-background"
                            >
                              {refreshPending ? <Spinner className="mr-2 h-3.5 w-3.5" /> : <RefreshCw className="mr-2 h-3.5 w-3.5" />}
                              Refresh GSC
                            </Button>
                          </form>
                        )}

                        <Button
                          asChild
                          variant="outline"
                          className="w-full sm:w-auto h-9 font-bold text-xs bg-background"
                        >
                          <Link href={`/sites/${site.id}/audit`}>
                            <BarChart3 className="mr-2 h-3.5 w-3.5 text-blue-500" />
                            View Audit
                          </Link>
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() => setEditingSiteId((prev) => (prev === site.id ? null : site.id))}
                          className={cn(
                            "w-full sm:w-auto h-9 font-bold text-xs bg-background",
                            editingSiteId === site.id && "ring-2 ring-primary ring-inset"
                          )}
                        >
                          <Edit className="mr-2 h-3.5 w-3.5 text-amber-500" />
                          {editingSiteId === site.id ? "Close Edit" : "Edit Indexing"}
                        </Button>

                        <div className="flex-1 min-w-[200px]" />

                        <div className="flex gap-2 w-full sm:w-auto items-center">
                          <form action={deleteAction}>
                            <input type="hidden" name="websiteId" value={site.id} />
                            <Button
                              type="submit"
                              variant="ghost"
                              disabled={deletePending}
                              className="w-full sm:w-auto h-9 font-bold text-xs text-destructive hover:bg-destructive/10"
                            >
                              {deletePending ? <Spinner className="mr-2 h-3.5 w-3.5" /> : <Trash2 className="mr-2 h-3.5 w-3.5" />}
                              Delete Site
                            </Button>
                          </form>
                        </div>
                      </div>

                      <Collapsible open={editingSiteId === site.id}>
                        <CollapsibleContent className="border-t bg-card p-6">
                          <form action={updateKeysAction} className="space-y-6 max-w-2xl">
                            <input type="hidden" name="websiteId" value={site.id} />
                            <div className="grid gap-6 md:grid-cols-2">
                              <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sitemap URL</Label>
                                <Input
                                  name="sitemapUrl"
                                  type="url"
                                  defaultValue={site.sitemapUrl || ""}
                                  className="h-10 bg-muted/20"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">IndexNow Key</Label>
                                <Input
                                  name="indexNowKey"
                                  defaultValue={site.indexNowKey || ""}
                                  className="h-10 bg-muted/20"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Bing API Key</Label>
                                <Input
                                  name="bingApiKey"
                                  defaultValue={site.bingApiKey || ""}
                                  className="h-10 bg-muted/20"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Key Location URL</Label>
                                <Input
                                  name="indexNowKeyLocationUrl"
                                  type="url"
                                  defaultValue={getIndexNowKeyLocationUrl(site)}
                                  className="h-10 bg-muted/20"
                                />
                              </div>
                            </div>
                            <Button 
                              type="submit" 
                              disabled={updateKeysPending}
                              className="h-10 px-6 font-bold tracking-tight"
                            >
                              {updateKeysPending ? <Spinner className="mr-2 h-4 w-4" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                              Save Changes
                            </Button>
                          </form>
                        </CollapsibleContent>
                      </Collapsible>
                    </CollapsibleContent>
                  </Collapsible>

                  <Collapsible open={cronSiteId === site.id}>
                    <CollapsibleContent className="border-t border-primary/10 bg-primary/5 p-6">
                      <CronJobManager
                        siteId={site.id}
                        siteUrl={site.url}
                        initialJobs={cronJobsBySite[site.id] || []}
                        isLoading={cronLoadingBySite[site.id]}
                        error={cronErrorBySite[site.id]}
                        onRefresh={() => void loadCronJobs(site.id)}
                      />
                    </CollapsibleContent>
                  </Collapsible>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
