"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface CronJob {
  id: string;
  websiteId: string;
  enabled: boolean;
  frequency: "hourly" | "daily" | "weekly" | "monthly";
  engine: "indexnow" | "bing" | "google";
  sourceMode: "sitemap" | "inventory";
  lastRunAt: string | null;
  nextRunAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CronJobManagerProps {
  siteId: string;
  siteUrl: string;
  initialJobs: CronJob[];
  isLoading?: boolean;
  onRefresh: () => void;
}

export default function CronJobManager({
  siteId,
  siteUrl,
  initialJobs,
  isLoading,
  onRefresh,
}: CronJobManagerProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [frequency, setFrequency] = useState<"hourly" | "daily" | "weekly" | "monthly">("daily");
  const [engine, setEngine] = useState<"indexnow" | "bing" | "google">("indexnow");
  const [sourceMode, setSourceMode] = useState<"sitemap" | "inventory">("sitemap");
  const [sitemapUrlInput, setSitemapUrlInput] = useState(siteUrl.endsWith("/") ? `${siteUrl}sitemap.xml` : `${siteUrl}/sitemap.xml`);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleCreateCronJob() {
    setLoading(true);
    try {
      if (sourceMode === "sitemap" && sitemapUrlInput) {
        await fetch(`/api/websites/${siteId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sitemapUrl: sitemapUrlInput }),
        });
      }

      const response = await fetch(`/api/websites/${siteId}/cron-jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frequency, engine, sourceMode }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create job");

      setOpenDialog(false);
      onRefresh();
      toast.success("Schedule created");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleCronJob(cronJobId: string, enabled: boolean) {
    try {
      const response = await fetch(`/api/websites/${siteId}/cron-jobs/${cronJobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !enabled }),
      });
      if (!response.ok) throw new Error("Failed to update");
      onRefresh();
      toast.success(enabled ? "Schedule paused" : "Schedule resumed");
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function handleDeleteCronJob(cronJobId: string) {
    setDeleting(cronJobId);
    try {
      const response = await fetch(`/api/websites/${siteId}/cron-jobs/${cronJobId}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to delete");
      onRefresh();
      toast.success("Schedule deleted");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeleting(null);
    }
  }

  async function handleRunNow(cronJobId: string) {
    const toastId = toast.loading("Running job...");
    try {
      const response = await fetch(`/api/websites/${siteId}/cron-jobs/${cronJobId}/run`, {
        method: "POST"
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to run");

      onRefresh();
      toast.success("Job started", { id: toastId });
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    }
  }

  const formatTime = (iso: string | null) => {
    if (!iso) return "Not set";
    const date = new Date(iso);
    return date.toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-4">
        <div className="space-y-1">
          <h3 className="text-xl font-bold tracking-tight">Schedules</h3>
          <p className="text-xs text-muted-foreground">Automatic indexing for {new URL(siteUrl).hostname}</p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="rounded-full bg-zinc-950 dark:bg-white dark:text-zinc-950 px-6 h-10 font-bold gap-2">
              <Plus className="h-4 w-4" /> New Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px] rounded-3xl border-none bg-white dark:bg-zinc-900 shadow-2xl p-8">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-center">Create Schedule</DialogTitle>
              <DialogDescription className="text-center text-sm">
                Set up automatic indexing for your site.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Frequency</Label>
                <select
                  value={frequency}
                  onChange={(e: any) => setFrequency(e.target.value)}
                  className="w-full h-12 rounded-xl border border-input bg-muted/20 px-4 text-sm"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Search Engine</Label>
                <select
                  value={engine}
                  onChange={(e: any) => setEngine(e.target.value)}
                  className="w-full h-12 rounded-xl border border-input bg-muted/20 px-4 text-sm"
                >
                  <option value="indexnow">IndexNow (Fast)</option>
                  <option value="bing">Bing</option>
                  <option value="google">Google Sitemap</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">URL Source</Label>
                <select
                  value={sourceMode}
                  onChange={(e: any) => setSourceMode(e.target.value)}
                  className="w-full h-12 rounded-xl border border-input bg-muted/20 px-4 text-sm"
                >
                  <option value="sitemap">From Sitemap</option>
                  <option value="inventory">From URL List</option>
                </select>
              </div>

              {sourceMode === "sitemap" && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                  <Label className="text-xs font-semibold">Sitemap URL</Label>
                  <Input
                    placeholder="https://example.com/sitemap.xml"
                    value={sitemapUrlInput}
                    onChange={(e: any) => setSitemapUrlInput(e.target.value)}
                    className="rounded-xl border-border/50 bg-muted/20 h-12"
                  />
                  <p className="text-xs text-muted-foreground">We'll check this sitemap for new URLs.</p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                onClick={handleCreateCronJob}
                disabled={loading}
                className="w-full h-12 rounded-xl font-bold"
              >
                {loading ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                Create Schedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Loading...</p>
          </div>
        ) : initialJobs.length === 0 ? (
          <Card className="p-12 text-center border-dashed bg-muted/30">
            <RefreshCw className="mx-auto h-10 w-10 text-muted-foreground/20 mb-4" />
            <p className="font-bold text-sm">No schedules yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Create a schedule to automatically submit URLs for indexing.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2">
            {initialJobs.map((cron) => (
              <Card
                key={cron.id}
                className={cn(
                  "overflow-hidden rounded-2xl border bg-white/50 dark:bg-zinc-900/30 transition-all",
                  !cron.enabled && "opacity-60"
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-4 flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center border",
                          cron.enabled ? "bg-primary/5 border-primary/10 text-primary" : "bg-muted border-border/50 text-muted-foreground"
                        )}>
                          <RefreshCw className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm uppercase">{cron.engine}</h4>
                          <p className="text-xs text-muted-foreground">{cron.frequency}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="text-muted-foreground font-medium">Source</p>
                          <p className="font-semibold">{cron.sourceMode === 'sitemap' ? 'Sitemap' : 'URL List'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground font-medium">Next Run</p>
                          <p className="font-semibold text-primary">{formatTime(cron.nextRunAt)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="rounded-full border-primary/10 bg-primary/5 text-xs">
                          {cron.enabled ? 'Active' : 'Paused'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">Last: {formatTime(cron.lastRunAt)}</span>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRunNow(cron.id)}
                          className="h-7 px-3 text-xs font-semibold ml-auto"
                        >
                          Run Now
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <Switch
                        checked={cron.enabled}
                        onCheckedChange={() => handleToggleCronJob(cron.id, cron.enabled)}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteCronJob(cron.id)}
                        disabled={deleting === cron.id}
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-red-500"
                      >
                        {deleting === cron.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="px-4">
        <Card className="bg-primary/5 border-primary/10 p-6">
          <div className="flex items-center gap-4">
            <CheckCircle2 className="h-8 w-8 text-primary shrink-0" />
            <div>
              <h4 className="font-bold">Automatic Indexing</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Schedules automatically find new URLs from your sitemaps and submit them for indexing.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}