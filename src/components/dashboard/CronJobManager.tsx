"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select } from "@/components/ui/select";
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
  Clock, 
  Zap, 
  Loader2,
  Calendar,
  Layers,
  Search,
  ExternalLink,
  CheckCircle2,
  RefreshCw
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
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create job");
      
      setOpenDialog(false);
      onRefresh();
      toast.success("Automation pipeline activated");
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
      if (!response.ok) throw new Error("Failed to update status");
      onRefresh();
      toast.success(enabled ? "Pipeline paused" : "Pipeline resumed");
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
      if (!response.ok) throw new Error("Deletion failed");
      onRefresh();
      toast.success("Pipeline dismantled");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeleting(null);
    }
  }

  const formatTime = (iso: string | null) => {
    if (!iso) return "Not Scheduled";
    const date = new Date(iso);
    return date.toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-4">
        <div className="space-y-1">
          <h3 className="text-xl font-serif font-bold tracking-tight">Active Pipelines</h3>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Automation Queue for {new URL(siteUrl).hostname}</p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="rounded-full bg-zinc-950 dark:bg-white dark:text-zinc-950 px-8 h-12 font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary/10 transition-transform active:scale-95">
              <Plus className="mr-2 h-4 w-4 stroke-[3px]" /> Deploy Pipeline
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px] rounded-[3rem] border-none bg-white dark:bg-zinc-900 shadow-2xl p-0 overflow-hidden">
            <div className="p-10 space-y-8">
              <DialogHeader>
                <DialogTitle className="text-3xl font-serif font-bold text-center">Protocol Config</DialogTitle>
                <DialogDescription className="text-center text-xs opacity-60">Establish a recurring indexing cycle for this property.</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 pl-1">Frequency Pulse</Label>
                  <Select value={frequency} onValueChange={(v: any) => setFrequency(v)} options={[
                    { label: "Hourly Cycle", value: "hourly" },
                    { label: "Daily Baseline", value: "daily" },
                    { label: "Weekly Batch", value: "weekly" },
                    { label: "Monthly Sweep", value: "monthly" },
                  ]} />
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 pl-1">Engine Protocol</Label>
                  <Select value={engine} onValueChange={(v: any) => setEngine(v)} options={[
                    { label: "IndexNow (Fast-track)", value: "indexnow" },
                    { label: "Bing Webmaster API", value: "bing" },
                    { label: "Google Sitemap Ping", value: "google" },
                  ]} />
                </div>

                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 pl-1">Intelligence Source</Label>
                  <Select value={sourceMode} onValueChange={(v: any) => setSourceMode(v)} options={[
                    { label: "Automatic Sitemap Discovery", value: "sitemap" },
                    { label: "URL Inventory Database", value: "inventory" },
                  ]} />
                </div>
              </div>

              <DialogFooter>
                <Button 
                  onClick={handleCreateCronJob} 
                  disabled={loading} 
                  className="w-full h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-primary/30"
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4 fill-current" />}
                  Activate Protocol
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-6 animate-pulse">
            <div className="h-16 w-16 rounded-3xl bg-primary/5 flex items-center justify-center border border-primary/10">
                <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30">Accessing Vault...</p>
          </div>
        ) : initialJobs.length === 0 ? (
          <div className="py-24 text-center rounded-[3rem] bg-zinc-50/50 dark:bg-white/[0.02] border border-dashed border-border/50 group hover:border-primary/20 transition-colors duration-500">
            <Layers className="mx-auto h-12 w-12 text-muted-foreground/10 group-hover:text-primary/20 transition-colors duration-500" />
            <div className="mt-6 space-y-2 px-8">
                <p className="text-sm font-bold tracking-tight">No active pipelines detected</p>
                <p className="text-xs text-muted-foreground/60 max-w-[280px] mx-auto font-medium">Deploy your first indexing protocol to start automated discovery cycles.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2">
            {initialJobs.map((cron) => (
              <Card
                key={cron.id}
                className={cn(
                  "group overflow-hidden rounded-[2.5rem] border border-border/40 bg-white/50 dark:bg-zinc-900/30 backdrop-blur-sm transition-all duration-500 hover:shadow-xl hover:shadow-primary/5",
                  !cron.enabled && "grayscale opacity-60"
                )}
              >
                <CardContent className="p-8">
                  <div className="flex items-start justify-between gap-6">
                    <div className="space-y-6 flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                         <div className={cn(
                             "h-10 w-10 rounded-2xl flex items-center justify-center border transition-all duration-500",
                             cron.enabled ? "bg-primary/5 border-primary/10 text-primary" : "bg-muted border-border/50 text-muted-foreground"
                         )}>
                            {cron.engine === 'google' ? <Search className="h-5 w-5" /> : <RefreshCw className="h-5 w-5" />}
                         </div>
                         <div className="min-w-0">
                             <h4 className="font-bold text-sm truncate uppercase tracking-tight">{cron.engine} Pipeline</h4>
                             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">{cron.frequency} Pulse</p>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Source Intelligence</p>
                            <p className="text-xs font-bold truncate">{cron.sourceMode === 'sitemap' ? 'Sitemap Discovery' : 'URL Inventory'}</p>
                         </div>
                         <div className="space-y-1">
                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Next Sequence</p>
                            <p className="text-xs font-bold text-primary truncate">{formatTime(cron.nextRunAt)}</p>
                         </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <Badge variant="outline" className="rounded-full border-primary/10 bg-primary/[0.02] text-[9px] font-black uppercase tracking-widest px-3 py-1 text-primary/80">
                           {cron.enabled ? 'Live' : 'Paused'}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground/40 font-medium">Last: {formatTime(cron.lastRunAt)}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                      <div className="bg-muted/30 dark:bg-white/5 p-2 rounded-2xl flex flex-col items-center gap-3">
                        <Switch
                            checked={cron.enabled}
                            onCheckedChange={() => handleToggleCronJob(cron.id, cron.enabled)}
                            className="data-[state=checked]:bg-primary scale-90"
                        />
                        <div className="h-px w-6 bg-border/50" />
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDeleteCronJob(cron.id)}
                            disabled={deleting === cron.id}
                            className="h-8 w-8 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        >
                            {deleting === cron.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </div>
                      
                      <Button asChild variant="ghost" size="icon" className="h-10 w-10 rounded-2xl text-muted-foreground hover:bg-primary/5 hover:text-primary transition-all duration-500">
                         <Link href={`/submissions?websiteId=${cron.websiteId}`}>
                            <ExternalLink className="h-4 w-4" />
                         </Link>
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
          <div className="p-8 rounded-[3rem] bg-primary/5 border border-primary/10 flex flex-col md:flex-row items-center gap-8 group">
            <div className="h-20 w-20 rounded-[2.5rem] bg-white dark:bg-zinc-900 flex items-center justify-center shadow-2xl shadow-primary/20 shrink-0 group-hover:rotate-[360deg] transition-transform duration-1000 ease-in-out">
                <CheckCircle2 className="h-8 w-8 text-primary stroke-[2.5px]" />
            </div>
            <div className="space-y-2 text-center md:text-left flex-1">
                <h4 className="text-xl font-serif font-bold tracking-tight">Real-time Intelligence Sync</h4>
                <p className="text-sm text-muted-foreground/70 max-w-lg font-medium leading-relaxed">Our pipelines automatically detect new URLs from your sitemaps and push them to indexing buffers instantly, maintaining a 24/7 visibility loop.</p>
            </div>
          </div>
      </div>
    </div>
  );
}
