"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Clock, 
  Calendar, 
  Zap, 
  AlertCircle,
  Loader2,
  Activity
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
  error?: string | null;
  onRefresh: () => void;
}

export default function CronJobManager({
  siteId,
  siteUrl,
  initialJobs,
  isLoading,
  error: loadError,
  onRefresh,
}: CronJobManagerProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [frequency, setFrequency] = useState<"hourly" | "daily" | "weekly" | "monthly">("daily");
  const [engine, setEngine] = useState<"indexnow" | "bing" | "google">("indexnow");
  const [sourceMode, setSourceMode] = useState<"sitemap" | "inventory">("sitemap");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleCreateCronJob() {
    setLoading(true);

    try {
      const response = await fetch(`/api/websites/${siteId}/cron-jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frequency, engine, sourceMode }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to create cron job");
      }

      setOpenDialog(false);
      onRefresh();
      toast.success("Schedule created successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create cron job");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleCronJob(cronJobId: string, enabled: boolean) {
    try {
      const response = await fetch(
        `/api/websites/${siteId}/cron-jobs/${cronJobId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ enabled: !enabled }),
        }
      );

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to update cron job");
      }

      onRefresh();
      toast.success(enabled ? "Schedule deactivated" : "Schedule activated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update cron job");
    }
  }

  async function handleDeleteCronJob(cronJobId: string) {
    setDeleting(cronJobId);

    try {
      const response = await fetch(
        `/api/websites/${siteId}/cron-jobs/${cronJobId}`,
        { method: "DELETE" }
      );

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete cron job");
      }

      onRefresh();
      toast.success("Schedule deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete cron job");
    } finally {
      setDeleting(null);
    }
  }

  const formatNextRun = (nextRunAt: string | null) => {
    if (!nextRunAt) return "Not scheduled";
    const date = new Date(nextRunAt);
    const now = new Date();
    const diff = date.getTime() - now.getTime();

    if (diff < 0) return "Overdue";
    if (diff < 60000) return "In < 1 min";
    if (diff < 3600000) return `In ${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `In ${Math.floor(diff / 3600000)}h`;
    return date.toLocaleDateString();
  };

  const formatLastRun = (lastRunAt: string | null) => {
    if (!lastRunAt) return "Never";
    const date = new Date(lastRunAt);
    return date.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <Calendar className="h-5 w-5 text-muted-foreground" /> Auto-Submit Schedule
          </CardTitle>
          <CardDescription className="text-xs">
            Setup recurring submissions to IndexNow, Bing, or Google.
          </CardDescription>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>New Schedule</DialogTitle>
              <DialogDescription>
                Automate indexing for <span className="text-primary">{siteUrl}</span>
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="frequency" className="ml-1 text-xs text-muted-foreground">Frequency</Label>
                <Select value={frequency} onValueChange={(v: any) => setFrequency(v)}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="engine" className="ml-1 text-xs text-muted-foreground">Search Engine</Label>
                <Select value={engine} onValueChange={(v: any) => setEngine(v)}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select engine" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="indexnow">IndexNow (Multi-engine)</SelectItem>
                    <SelectItem value="bing">Bing Webmaster</SelectItem>
                    <SelectItem value="google">Google Search Console</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="source" className="ml-1 text-xs text-muted-foreground">Submission Source</Label>
                <Select value={sourceMode} onValueChange={(v: any) => setSourceMode(v)}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sitemap">Sitemap URLs</SelectItem>
                    <SelectItem value="inventory">Detected Inventory</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="pt-2">
              <Button onClick={() => setOpenDialog(false)} variant="ghost">Cancel</Button>
              <Button onClick={handleCreateCronJob} disabled={loading} className="gap-2 px-8">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Create Schedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin opacity-20" />
            <p className="text-xs font-medium">Loading schedules...</p>
          </div>
        ) : loadError ? (
          <div className="py-12 flex flex-col items-center justify-center gap-4 text-destructive/60">
            <AlertCircle className="h-8 w-8 opacity-20" />
            <p className="text-xs font-medium">{loadError}</p>
          </div>
        ) : initialJobs.length === 0 ? (
          <div className="space-y-4 rounded-xl border border-dashed border-border bg-muted/20 p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted/30">
              <Clock className="h-8 w-8 text-muted-foreground opacity-30" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold tracking-tight">No active schedules</p>
              <p className="text-xs text-muted-foreground max-w-[240px] mx-auto">
                Create your first automated task to keep your site perpetually indexed.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            {initialJobs.map((cron) => (
              <div
                key={cron.id}
                className={cn(
                  "group flex flex-col justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center",
                  !cron.enabled && "opacity-60"
                )}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                      {cron.frequency}
                    </Badge>
                    <Badge variant="outline" className={cn(
                      "text-[10px] uppercase tracking-wide",
                      cron.engine === "indexnow" ? "bg-emerald-500/15 text-emerald-500" :
                      cron.engine === "bing" ? "bg-blue-500/15 text-blue-500" :
                      "bg-amber-500/15 text-amber-500"
                    )}>
                      {cron.engine}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">
                      {cron.sourceMode}
                    </Badge>
                    <div className="flex items-center gap-1.5 ml-2">
                      <Activity className={cn("h-3 w-3", cron.enabled ? "text-emerald-500" : "text-muted-foreground")} />
                      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        {cron.enabled ? "Active" : "Paused"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><History className="h-3 w-3" /> Last: {formatLastRun(cron.lastRunAt)}</span>
                    <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> Next: {formatNextRun(cron.nextRunAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={cron.enabled}
                      onCheckedChange={() => handleToggleCronJob(cron.id, cron.enabled)}
                      className="data-[state=checked]:bg-emerald-500"
                    />
                  </div>
                  <div className="h-8 w-px bg-border/40 mx-1" />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDeleteCronJob(cron.id)}
                    disabled={deleting === cron.id}
                    className="h-9 w-9 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    {deleting === cron.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function History(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}
