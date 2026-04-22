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
    <div className="space-y-6 md:space-y-8 p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 tracking-tight">Active Schedules</h3>
          <p className="text-xs text-zinc-500 font-light">Perpetual indexing for your digital footprint.</p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white px-6 font-bold uppercase tracking-widest text-[10px] h-10">
              <Plus className="mr-2 h-3.5 w-3.5" /> Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px] rounded-[32px] border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">New Automation</DialogTitle>
              <DialogDescription className="text-xs text-zinc-500">
                Setup automated indexing for {siteUrl}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-5 py-5">
              <div className="space-y-2 px-1">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Frequency</Label>
                <Select value={frequency} onValueChange={(v: any) => setFrequency(v)} options={[
                  { label: "Hourly", value: "hourly" },
                  { label: "Daily", value: "daily" },
                  { label: "Weekly", value: "weekly" },
                  { label: "Monthly", value: "monthly" },
                ]} />
              </div>
              <div className="space-y-2 px-1">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Service</Label>
                <Select value={engine} onValueChange={(v: any) => setEngine(v)} options={[
                  { label: "IndexNow", value: "indexnow" },
                  { label: "Bing", value: "bing" },
                  { label: "Google", value: "google" },
                ]} />
              </div>
              <div className="space-y-2 px-1">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Pages Source</Label>
                <Select value={sourceMode} onValueChange={(v: any) => setSourceMode(v)} options={[
                  { label: "Sitemap", value: "sitemap" },
                  { label: "Found pages", value: "inventory" },
                ]} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateCronJob} disabled={loading} className="w-full h-12 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 font-bold uppercase tracking-widest text-xs">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-6 w-6 animate-spin text-rose-500" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Loading...</p>
          </div>
        ) : initialJobs.length === 0 ? (
          <div className="py-12 text-center rounded-[24px] bg-zinc-50/50 dark:bg-white/[0.02] border border-zinc-100 dark:border-white/5">
            <Clock className="mx-auto h-6 w-6 text-zinc-200" />
            <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-8 leading-relaxed">No automations found for this site.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {initialJobs.map((cron) => (
              <div
                key={cron.id}
                className={cn(
                  "flex items-center justify-between p-5 rounded-[24px] bg-zinc-50/50 dark:bg-white/[0.02] border border-zinc-100 dark:border-white/5 transition-opacity",
                  !cron.enabled && "opacity-50"
                )}
              >
                <div className="flex flex-col gap-2 min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-zinc-100">{cron.frequency}</span>
                    <div className="h-1 w-1 rounded-full bg-zinc-200" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-rose-500">{cron.engine}</span>
                    <div className="h-1 w-1 rounded-full bg-zinc-200" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{cron.sourceMode}</span>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-light text-zinc-400 italic">
                    <span>Next: {formatNextRun(cron.nextRunAt)}</span>
                    <div className="h-3 w-px bg-zinc-100 dark:bg-white/5" />
                    <span>Last: {formatLastRun(cron.lastRunAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 ml-4">
                  <Switch
                    checked={cron.enabled}
                    onCheckedChange={() => handleToggleCronJob(cron.id, cron.enabled)}
                    className="data-[state=checked]:bg-pink-500"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDeleteCronJob(cron.id)}
                    disabled={deleting === cron.id}
                    className="h-8 w-8 text-zinc-300 hover:text-rose-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
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
