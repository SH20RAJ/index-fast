"use client";

import { useActionState, useState, useEffect } from "react";
import type { ActionState } from "@/app/(dashboard)/action-state";
import { 
  Zap, 
  Clock, 
  Settings, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  Search, 
  Globe, 
  Loader2, 
  AlertCircle, 
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { saveCronJobAction, deleteCronJobAction } from "@/app/(dashboard)/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Site {
  id: string;
  name: string;
  url: string;
  sitemapUrl: string | null;
}

interface CronJob {
  id: string;
  websiteId: string;
  enabled: boolean;
  frequency: string;
  engine: "indexnow" | "bing" | "google" | "pingomatic" | "pingler" | "yandex" | "baidu" | "naver";
  sourceMode: string;
  urls: string | null;
  nextRunAt: Date | null;
  lastRunAt: Date | null;
  websiteUrl: string;
  websiteName: string;
}

interface CronJobsViewProps {
  sites: Site[];
  initialCronJobs: CronJob[];
  isPro: boolean;
}

export default function CronJobsView({ sites, initialCronJobs, isPro }: CronJobsViewProps) {
  const [jobs, setJobs] = useState<CronJob[]>(initialCronJobs);
  const [isAdding, setIsAdding] = useState(false);
  
  const [selectedSiteId, setSelectedSiteId] = useState(sites[0]?.id || "");
  const [engine, setEngine] = useState<string>("indexnow");
  const [frequency, setFrequency] = useState("daily");
  const [sourceMode, setSourceMode] = useState("sitemap");
  const [urls, setUrls] = useState("");

  const [saveState, saveAction, isSaving] = useActionState(saveCronJobAction, { status: "idle", message: "" } as ActionState);
  const [delState, delAction, isDeleting] = useActionState(deleteCronJobAction, { status: "idle", message: "" } as ActionState);

  const selectedSite = sites.find((s) => s.id === selectedSiteId);

  useEffect(() => {
    if (saveState.status === "success") {
      toast.success(saveState.message);
      setIsAdding(false);
      setUrls("");
      // Reload page state or update list
      window.location.reload();
    } else if (saveState.status === "error") {
      toast.error(saveState.message);
    }
  }, [saveState]);

  useEffect(() => {
    if (delState.status === "success") {
      toast.success(delState.message);
      window.location.reload();
    } else if (delState.status === "error") {
      toast.error(delState.message);
    }
  }, [delState]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSiteId) {
      toast.error("Please select a website.");
      return;
    }

    if (sourceMode === "inventory" && !isPro) {
      toast.error("Auto-detecting new URLs is only available for Pro users.");
      return;
    }

    if (sourceMode === "urls" && !urls.trim()) {
      toast.error("Please enter at least one URL.");
      return;
    }

    const formData = new FormData();
    formData.append("websiteId", selectedSiteId);
    formData.append("engine", engine);
    formData.append("frequency", frequency);
    formData.append("sourceMode", sourceMode);
    formData.append("urls", urls);
    formData.append("enabled", "true");

    await saveAction(formData);
  };

  const handleDelete = async (jobId: string, websiteId: string) => {
    if (!confirm("Are you sure you want to remove this scheduler task?")) {
      return;
    }
    const formData = new FormData();
    formData.append("jobId", jobId);
    formData.append("websiteId", websiteId);
    await delAction(formData);
  };

  const getEngineName = (engine: string) => {
    if (engine === "indexnow") return "IndexNow";
    if (engine === "bing") return "Bing Webmaster API";
    if (engine === "google") return "Google Search Console";
    if (engine === "pingomatic") return "Ping-o-Matic";
    if (engine === "naver") return "Naver Search";
    return engine;
  };

  const getSourceLabel = (mode: string) => {
    if (mode === "inventory") return "Auto-detect New Pages";
    if (mode === "sitemap") return "Check Sitemap Pages";
    if (mode === "urls") return "Defined URLs List";
    return mode;
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
            Automation Engine
          </span>
        </div>
        <h1 className="text-3xl font-serif font-bold tracking-tight">Automation Scheduler</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure background cron jobs to periodically submit URLs to search engines.
        </p>
      </div>

      {sites.length === 0 ? (
        <Card className="rounded-[2.5rem] border-dashed border-2 bg-muted/5 p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center">
              <Globe className="h-8 w-8 text-muted-foreground/30" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold tracking-tight">No websites configured</h3>
              <p className="text-sm text-muted-foreground">You must add a website before scheduling cron tasks.</p>
            </div>
            <Button asChild className="rounded-full font-bold mt-2">
              <a href="/sites/new">Setup First Website</a>
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight">Active Scheduled Tasks</h2>
            {!isAdding && (
              <Button onClick={() => setIsAdding(true)} className="rounded-full font-bold gap-2">
                <Plus className="h-4 w-4" /> Create Cron Job
              </Button>
            )}
          </div>

          {/* Form */}
          {isAdding && (
            <Card className="rounded-[2rem] border-primary/20 bg-primary/[0.01] shadow-md animate-in fade-in slide-in-from-top-4">
              <CardHeader>
                <CardTitle className="text-lg">Configure Scheduler Task</CardTitle>
                <CardDescription>Configure an automated search engine indexing rule.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    {/* Website Selector */}
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
                        Select Website
                      </Label>
                      <Select value={selectedSiteId} onValueChange={setSelectedSiteId}>
                        <SelectTrigger className="h-12 rounded-xl border-border/50 bg-background">
                          <SelectValue placeholder="Choose a website" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border/50">
                          {sites.map((site) => (
                            <SelectItem key={site.id} value={site.id}>
                              {site.url.replace(/^https?:\/\//, "")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Engine Selector */}
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
                        Select Indexing Engine
                      </Label>
                      <Select value={engine} onValueChange={setEngine}>
                        <SelectTrigger className="h-12 rounded-xl border-border/50 bg-background">
                          <SelectValue placeholder="Choose engine" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border/50">
                          <SelectItem value="indexnow">IndexNow (Bing/Yandex/Seznam)</SelectItem>
                          <SelectItem value="bing">Bing Webmaster API</SelectItem>
                          <SelectItem value="google">Google (Sitemap Ping)</SelectItem>
                          <SelectItem value="pingomatic">Ping-o-Matic & Pingler</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Frequency Selector */}
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
                        Frequency (How Often?)
                      </Label>
                      <Select value={frequency} onValueChange={setFrequency}>
                        <SelectTrigger className="h-12 rounded-xl border-border/50 bg-background">
                          <SelectValue placeholder="Choose frequency" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border/50">
                          <SelectItem value="hourly">Every Hour</SelectItem>
                          <SelectItem value="daily">Every Day</SelectItem>
                          <SelectItem value="weekly">Every Week</SelectItem>
                          <SelectItem value="monthly">Every Month</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Source Mode Selector */}
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
                        Pages Source Mode
                      </Label>
                      <Select value={sourceMode} onValueChange={setSourceMode}>
                        <SelectTrigger className="h-12 rounded-xl border-border/50 bg-background">
                          <SelectValue placeholder="Choose pages source" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border/50">
                          <SelectItem value="sitemap">Check Sitemap Pages</SelectItem>
                          <SelectItem value="inventory">
                            Auto-detect New URLs {!isPro && "(Pro Only)"}
                          </SelectItem>
                          <SelectItem value="urls">Defined URLs List</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Defined URLs Textarea */}
                  {sourceMode === "urls" && (
                    <div className="space-y-2 animate-in fade-in duration-200">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">
                        Predefined URLs to Index (one URL per line)
                      </Label>
                      <textarea
                        value={urls}
                        onChange={(e) => setUrls(e.target.value)}
                        placeholder="https://example.com/page-1&#10;https://example.com/page-2"
                        className="w-full min-h-[140px] rounded-xl border border-border/50 bg-background p-4 text-sm focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:outline-none resize-none"
                      />
                    </div>
                  )}

                  {/* Pro User Badge Warning */}
                  {sourceMode === "inventory" && !isPro && (
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-amber-700">Premium Upgrade Required</p>
                        <p className="text-[11px] text-amber-700/80 mt-0.5">
                          Auto-detecting new URLs requires an active Pro plan subscription. Please upgrade to use this mode.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <Button 
                      type="submit" 
                      disabled={isSaving || (sourceMode === "inventory" && !isPro)} 
                      className="rounded-xl font-bold px-8"
                    >
                      {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Clock className="h-4 w-4 mr-2" />}
                      Save Scheduler Task
                    </Button>
                    <Button variant="ghost" onClick={() => setIsAdding(false)} className="rounded-xl font-bold px-8">
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Job List */}
          {jobs.length === 0 ? (
            <Card className="rounded-[2.5rem] border-dashed border-2 bg-muted/5 p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-muted/50 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-muted-foreground/30" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold tracking-tight">No active scheduler tasks</h3>
                  <p className="text-sm text-muted-foreground">Setup automation to keep search engine indexes fresh.</p>
                </div>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4">
              {jobs.map((job) => (
                <Card key={job.id} className="rounded-2xl border-border/50 bg-card/60 transition-all hover:bg-card/90">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center shadow-md">
                          {job.engine === "indexnow" ? <Zap className="h-5 w-5" /> : 
                           job.engine === "bing" ? <Globe className="h-5 w-5" /> : 
                           job.engine === "google" ? <Globe className="h-5 w-5 text-primary" /> : 
                           <Clock className="h-5 w-5" />}
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-sm tracking-tight">
                              {job.websiteUrl.replace(/^https?:\/\//, "")}
                            </span>
                            <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
                            <Badge variant="outline" className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                              {getEngineName(job.engine)}
                            </Badge>
                            {job.sourceMode === "inventory" && (
                              <Badge className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border-none font-bold uppercase tracking-wider gap-1">
                                <ShieldCheck className="h-3 w-3" /> Pro Auto-detect
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <span>Runs {job.frequency}</span>
                            <span>•</span>
                            <span>{getSourceLabel(job.sourceMode)}</span>
                            {job.urls && (
                              <>
                                <span>•</span>
                                <span className="font-semibold text-primary/70">
                                  {job.urls.split("\n").filter(Boolean).length} URL(s)
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 ml-14 sm:ml-0 self-end sm:self-center">
                        <div className="text-right text-xs">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">Next scheduled run</p>
                          <p className="font-medium text-foreground/80 mt-0.5">
                            {job.nextRunAt 
                              ? new Date(job.nextRunAt).toLocaleDateString() + " " + new Date(job.nextRunAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) 
                              : "Pending scheduler"}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-10 w-10 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/5 transition-all"
                          onClick={() => handleDelete(job.id, job.websiteId)}
                          disabled={isDeleting}
                        >
                          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
