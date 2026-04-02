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
  Settings2, 
  Zap, 
  AlertCircle,
  Loader2,
  CheckCircle2,
  XCircle,
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
    <Card className="border-border/40 bg-card/30 backdrop-blur-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <div className="space-y-1">
          <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" /> Auto-Submit Schedule
          </CardTitle>
          <CardDescription className="text-xs font-medium">
            Setup recurring submissions to IndexNow, Bing, or Google.
          </CardDescription>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2 font-bold shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4" /> Add Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black tracking-tighter">New Schedule</DialogTitle>
              <DialogDescription className="font-medium">
                Automate indexing for <span className="text-primary">{siteUrl}</span>
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="frequency" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Frequency</Label>
                <Select value={frequency} onValueChange={(v: any) => setFrequency(v)}>
                  <SelectTrigger className="bg-muted/30 border-border/40 h-11">
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
                <Label htmlFor="engine" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Search Engine</Label>
                <Select value={engine} onValueChange={(v: any) => setEngine(v)}>
                  <SelectTrigger className="bg-muted/30 border-border/40 h-11">
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
                <Label htmlFor="source" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Submission Source</Label>
                <Select value={sourceMode} onValueChange={(v: any) => setSourceMode(v)}>
                  <SelectTrigger className="bg-muted/30 border-border/40 h-11">
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
              <Button onClick={() => setOpenDialog(false)} variant="ghost" className="font-bold">Cancel</Button>
              <Button onClick={handleCreateCronJob} disabled={loading} className="gap-2 font-black px-8">
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
          <div className="p-12 text-center border-2 border-dashed border-border/40 rounded-3xl bg-muted/10 space-y-4">
            <div className="h-16 w-16 rounded-full bg-muted/20 flex items-center justify-center mx-auto">
              <Clock className="h-8 w-8 text-muted-foreground opacity-30" />
            </div>
            <div className="space-y-1">
              <p className="font-black tracking-tight">No active schedules</p>
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
                  "flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-border/40 bg-background/40 transition-all hover:bg-background/60 group",
                  !cron.enabled && "opacity-60"
                )}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="font-black uppercase text-[10px] bg-primary/5 text-primary border-primary/20">
                      {cron.frequency}
                    </Badge>
                    <Badge variant="outline" className={cn(
                      "font-black uppercase text-[10px] border-none px-2",
                      cron.engine === "indexnow" ? "bg-emerald-500/10 text-emerald-600" :
                      cron.engine === "bing" ? "bg-blue-500/10 text-blue-600" :
                      "bg-amber-500/10 text-amber-600"
                    )}>
                      {cron.engine}
                    </Badge>
                    <Badge variant="secondary" className="font-black uppercase text-[10px] bg-muted/50 border-none">
                      {cron.sourceMode}
                    </Badge>
                    <div className="flex items-center gap-1.5 ml-2">
                      <Activity className={cn("h-3 w-3", cron.enabled ? "text-emerald-500" : "text-muted-foreground")} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {cron.enabled ? "Active" : "Paused"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground opacity-70">
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
                    className="h-9 w-9 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
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
