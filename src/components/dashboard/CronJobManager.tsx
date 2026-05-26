"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Trash2,
  Play,
  Loader2,
  Clock,
  Pause,
} from "lucide-react";
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

const engineLabels: Record<string, string> = {
  indexnow: "IndexNow",
  bing: "Bing",
  google: "Google",
};

const frequencyLabels: Record<string, string> = {
  hourly: "Hourly",
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
};

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
  const [sitemapUrlInput, setSitemapUrlInput] = useState(
    siteUrl.endsWith("/") ? `${siteUrl}sitemap.xml` : `${siteUrl}/sitemap.xml`
  );
  const [urlListInput, setUrlListInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [running, setRunning] = useState<string | null>(null);

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

      if (sourceMode === "inventory" && urlListInput.trim()) {
        const urls = urlListInput
          .split("\n")
          .map((url) => url.trim())
          .filter((url) => url.length > 0);

        if (urls.length > 0) {
          await fetch(`/api/websites/${siteId}/urls`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ urls }),
          });
        }
      }

      const response = await fetch(`/api/websites/${siteId}/cron-jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frequency, engine, sourceMode }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create job");

      setOpenDialog(false);
      setUrlListInput("");
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
      toast.success(enabled ? "Paused" : "Resumed");
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  async function handleDeleteCronJob(cronJobId: string) {
    setDeleting(cronJobId);
    try {
      const response = await fetch(`/api/websites/${siteId}/cron-jobs/${cronJobId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      onRefresh();
      toast.success("Deleted");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeleting(null);
    }
  }

  async function handleRunNow(cronJobId: string) {
    setRunning(cronJobId);
    try {
      const response = await fetch(`/api/websites/${siteId}/cron-jobs/${cronJobId}/run`, {
        method: "POST",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to run");
      onRefresh();
      toast.success("Job started");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setRunning(null);
    }
  }

  const formatTime = (iso: string | null) => {
    if (!iso) return "--";
    const date = new Date(iso);
    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">Schedules</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Automatic indexing for {new URL(siteUrl).hostname}
          </p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5 h-8 px-3 text-xs">
              <Plus className="h-3.5 w-3.5" />
              New Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[420px]">
            <DialogHeader>
              <DialogTitle className="text-base">Create Schedule</DialogTitle>
              <DialogDescription className="text-xs">
                Set up automatic indexing for your site.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Frequency</Label>
                <select
                  value={frequency}
                  onChange={(e: any) => setFrequency(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Search Engine</Label>
                <select
                  value={engine}
                  onChange={(e: any) => setEngine(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="indexnow">IndexNow (Fast)</option>
                  <option value="bing">Bing</option>
                  <option value="google">Google Sitemap</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">URL Source</Label>
                <select
                  value={sourceMode}
                  onChange={(e: any) => setSourceMode(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="sitemap">From Sitemap</option>
                  <option value="inventory">From URL List</option>
                </select>
              </div>

              {sourceMode === "sitemap" && (
                <div className="space-y-1.5">
                  <Label className="text-xs">Sitemap URL</Label>
                  <Input
                    placeholder="https://example.com/sitemap.xml"
                    value={sitemapUrlInput}
                    onChange={(e: any) => setSitemapUrlInput(e.target.value)}
                    className="h-9 text-sm"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    We will check this sitemap for new URLs.
                  </p>
                </div>
              )}

              {sourceMode === "inventory" && (
                <div className="space-y-1.5">
                  <Label className="text-xs">URLs to Submit</Label>
                  <textarea
                    placeholder={"https://example.com/page1\nhttps://example.com/page2"}
                    value={urlListInput}
                    onChange={(e: any) => setUrlListInput(e.target.value)}
                    rows={4}
                    className="w-full rounded-md border border-input bg-background p-3 text-sm resize-none"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    One URL per line. These will be submitted for indexing.
                  </p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                onClick={handleCreateCronJob}
                disabled={loading}
                className="w-full h-9 text-sm gap-1.5"
              >
                {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Create Schedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_100px_100px_140px_140px_80px] gap-3 px-4 py-2 bg-muted/50 border-b border-border text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
          <span>Engine</span>
          <span>Frequency</span>
          <span>Source</span>
          <span>Next Run</span>
          <span>Last Run</span>
          <span className="text-right">Actions</span>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="py-16 flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : initialJobs.length === 0 ? (
          /* Empty State */
          <div className="py-16 text-center">
            <Clock className="mx-auto h-8 w-8 text-muted-foreground/30 mb-2" />
            <p className="text-sm font-medium text-foreground">No schedules</p>
            <p className="text-xs text-muted-foreground mt-1">
              Create a schedule to automatically submit URLs for indexing.
            </p>
          </div>
        ) : (
          /* Rows */
          initialJobs.map((cron) => (
            <div
              key={cron.id}
              className="grid grid-cols-[1fr_100px_100px_140px_140px_80px] gap-3 px-4 py-2.5 border-b border-border last:border-b-0 items-center hover:bg-muted/30"
            >
              {/* Engine + Status */}
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`h-2 w-2 rounded-full shrink-0 ${
                    cron.enabled ? "bg-emerald-500" : "bg-muted-foreground/30"
                  }`}
                />
                <span className="text-sm font-medium text-foreground truncate">
                  {engineLabels[cron.engine] || cron.engine}
                </span>
              </div>

              {/* Frequency */}
              <span className="text-sm text-muted-foreground">
                {frequencyLabels[cron.frequency] || cron.frequency}
              </span>

              {/* Source */}
              <span className="text-sm text-muted-foreground">
                {cron.sourceMode === "sitemap" ? "Sitemap" : "URL List"}
              </span>

              {/* Next Run */}
              <span className="text-sm text-foreground tabular-nums">
                {formatTime(cron.nextRunAt)}
              </span>

              {/* Last Run */}
              <span className="text-sm text-muted-foreground tabular-nums">
                {formatTime(cron.lastRunAt)}
              </span>

              {/* Actions */}
              <div className="flex items-center justify-end gap-0.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleRunNow(cron.id)}
                  disabled={running === cron.id}
                  title="Run now"
                >
                  {running === cron.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Play className="h-3.5 w-3.5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleToggleCronJob(cron.id, cron.enabled)}
                  title={cron.enabled ? "Pause" : "Resume"}
                >
                  {cron.enabled ? (
                    <Pause className="h-3.5 w-3.5" />
                  ) : (
                    <Play className="h-3.5 w-3.5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => handleDeleteCronJob(cron.id)}
                  disabled={deleting === cron.id}
                  title="Delete"
                >
                  {deleting === cron.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
